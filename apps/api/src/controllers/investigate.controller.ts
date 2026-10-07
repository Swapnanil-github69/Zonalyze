import { Request, Response } from "express";
import axios from "axios";
import { Investigation } from "../models/Investigation.js";
import { CacheService, isInvestigationCorrupted } from "../services/cache.service.js";
import { NominatimService } from "../services/nominatim.service.js";
import { fetchAtmosphere } from "../services/openMeteoService.js";
import { OverpassService } from "../services/overpass.service.js";
import { parseElements, NON_COMMERCIAL_AIRPORT_BLACKLIST } from "../services/overpassService.js";
import { HeuristicService } from "../services/heuristic.service.js";
import { GeminiService } from "../services/gemini.service.js";
import { handleAuditChat } from "./chatController.js";

/**
 * Contributor 1: Backend Lead
 * Investigation Controller: Orchestrates cache check, parallel ingestion, deterministic heuristics,
 * Gemini debrief synthesis, and persistence.
 */
export class InvestigateController {
  public static async investigateCoordinate(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude } = req.body;

      // 1. Input Validation
      if (
        typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        res.status(400).json({
          error: "Invalid coordinates. Latitude must be in [-90, 90] and Longitude in [-180, 180].",
        });
        return;
      }

      console.log(`🔍 [AUDIT START] Investigating: (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`);

      const forceRefresh =
        req.query.refresh === "true" ||
        req.body?.refresh === true ||
        req.body?.refresh === "true";

      // 2. Geospatial Cache Check (<=150m, within past 7 days)
      const cached = await CacheService.findNearbyInvestigation(latitude, longitude, forceRefresh);
      if (cached) {
        const airportName = (cached.facilities?.airport?.name || "").toLowerCase();
        const isCorrupted =
          isInvestigationCorrupted(cached) ||
          NON_COMMERCIAL_AIRPORT_BLACKLIST.some((term) => airportName.includes(term));

        if (isCorrupted || forceRefresh) {
          console.log("[api] Purging corrupted/stale cache entry for coordinate:", cached._id);
          await Investigation.deleteOne({ _id: cached._id });
          CacheService.invalidateMemoryCache(cached._id);
          // Proceed to perform a fresh live audit instead of returning cached!
        } else {
          console.log(`⚡ [CACHE HIT] Found previous investigation within 150m: ${cached._id}`);
          const responseData = {
            ...cached.toObject(),
            cached: true,
          };
          res.status(200).json(responseData);
          return;
        }
      }

      console.log(`🌐 [CACHE MISS] Ingesting telemetry from external APIs in parallel...`);

      // 3. Parallel Ingestion (Nominatim, Open-Meteo, Overpass)
      const [address, atmosphere, overpassElements] = await Promise.all([
        NominatimService.reverseGeocode(latitude, longitude),
        fetchAtmosphere(latitude, longitude),
        OverpassService.queryInfrastructure(latitude, longitude),
      ]);

      // Map AtmosphereData fields to the shape EnvironmentData expects
      const airQuality = {
        aqi: atmosphere.aqi,
        aqiStatus: atmosphere.aqiStatus,
        pm2_5: atmosphere.pm2_5,
        pm10: atmosphere.pm10,
        historical_pm25: atmosphere.historicalPm25,
        temperature: atmosphere.currentTemp,
        temperature_7d_avg: atmosphere.avgTempLastWeek,
        historical_temp: atmosphere.historicalTemp,
      };

      // 4. Deterministic Heuristics (Haversine distances + Acoustic noise proxy)
      const { infrastructure, noiseProfile } = HeuristicService.processInfrastructure(
        latitude,
        longitude,
        overpassElements
      );
      const osmData = parseElements(latitude, longitude, overpassElements);

      // 5. Gemma 4 Forensic Synthesis
      const aiReport = await GeminiService.generateDebrief({
        address,
        coordinates: [longitude, latitude],
        environment: airQuality,
        infrastructure: {
          ...infrastructure,
          metro_stations: infrastructure.metro_stations ?? 0,
          nearest_metro_dist_m: infrastructure.nearest_metro_dist_m ?? null,
        },
        noiseProfile,
      });

      // 6. Persistence to MongoDB Atlas
      let savedDoc: any = null;
      if (address && !address.startsWith("Point (")) {
        savedDoc = await CacheService.saveInvestigation({
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          address,
          environment: airQuality,
          infrastructure: {
            hospitals: infrastructure.hospitals,
            pharmacies: infrastructure.pharmacies,
            railway_stations: infrastructure.railway_stations,
            metro_stations: infrastructure.metro_stations ?? 0,
            parks: infrastructure.parks,
            nearest_hospital_dist_m: infrastructure.nearest_hospital_dist_m,
            nearest_hospital_name: infrastructure.nearest_hospital_name ?? null,
            nearby_hospitals: infrastructure.nearby_hospitals ?? [],
            nearest_railway_dist_m: infrastructure.nearest_railway_dist_m,
            nearest_railway_name: infrastructure.nearest_railway_name ?? null,
            nearest_metro_dist_m: infrastructure.nearest_metro_dist_m ?? null,
            nearest_metro_name: infrastructure.nearest_metro_name ?? null,
            nearest_arterial_dist_m: infrastructure.nearest_arterial_dist_m,
          },
          facilities: osmData.facilities,
          noiseProfile,
          aiReport,
        });
        console.log(`⚡ [FAST PROXIMITY GRID READY <400ms] Cached: ${savedDoc._id}`);
      }

      // Return immediate response to UI under 400ms
      res.status(200).json(
        savedDoc
          ? { ...savedDoc.toObject(), cached: false }
          : {
              location: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              address,
              environment: airQuality,
              infrastructure: {
                ...infrastructure,
                metro_stations: infrastructure.metro_stations ?? 0,
                nearest_metro_dist_m: infrastructure.nearest_metro_dist_m ?? null,
              },
              facilities: osmData.facilities,
              noiseProfile,
              aiReport,
              createdAt: new Date().toISOString(),
              _id: "live-audit",
              cached: false,
            }
      );

      // 7. Asynchronous Background Debrief Hydration (unawaited, fallback only)
      if (savedDoc && (!savedDoc.aiReport || !savedDoc.aiReport.summary)) {
        setImmediate(async () => {
          try {
            const richDebrief = await GeminiService.generateDebrief({
              address,
              coordinates: [longitude, latitude],
              environment: airQuality,
              infrastructure,
              noiseProfile,
            });
            if (richDebrief && richDebrief.summary) {
              await Investigation.findByIdAndUpdate(savedDoc._id, { $set: { aiReport: richDebrief } });
              CacheService.invalidateMemoryCache(savedDoc._id);
            }
          } catch (bgErr: any) {
            console.warn("[Background Debrief] Async hydration skipped:", bgErr?.message);
          }
        });
      }
    } catch (error) {
      console.error("❌ Investigation pipeline error:", error);
      res.status(500).json({
        error: "Internal server error occurred while conducting investigation.",
        details: (error as Error).message,
      });
    }
  }

  /**
   * Conversational Endpoint: Handles Q&A via official Gemma 4 dynamic copilot
   */
  public static async chatAboutLocation(req: Request, res: Response): Promise<void> {
    await handleAuditChat(req, res);
  }

  /**
   * Asynchronous Debrief Hydration Endpoint
   */
  public static async hydrateDebrief(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id || req.body?.id;
      if (!id) {
        res.status(400).json({ error: "Investigation ID is required" });
        return;
      }
      const doc = await Investigation.findById(id);
      if (!doc) {
        res.status(404).json({ error: "Investigation not found" });
        return;
      }
      const richDebrief = await GeminiService.generateDebrief({
        address: doc.address,
        coordinates: doc.location?.coordinates || [0, 0],
        environment: doc.environment,
        infrastructure: doc.infrastructure,
        noiseProfile: doc.noiseProfile,
      });
      await Investigation.findByIdAndUpdate(id, { $set: { aiReport: richDebrief } });
      res.status(200).json({ success: true, aiReport: richDebrief });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to hydrate debrief", details: err?.message });
    }
  }

  /**
   * High-Fidelity Neural Text-to-Speech Endpoint
   * Returns human-sounding audio stream for English, Hindi, and Bangla
   */
  public static async textToSpeech(req: Request, res: Response): Promise<void> {
    try {
      const text = typeof req.query.text === "string" ? req.query.text.trim() : "";
      const rawLang = typeof req.query.lang === "string" ? req.query.lang.toLowerCase() : "en";

      if (!text) {
        res.status(400).json({ error: "Text query parameter is required." });
        return;
      }

      // Map language code: "hi" (Hindi), "bn" (Bangla), "en" (English)
      let langCode = "en";
      if (rawLang.startsWith("hi")) {
        langCode = "hi";
      } else if (rawLang.startsWith("bn")) {
        langCode = "bn";
      } else {
        langCode = "en";
      }

      // Keep chunk under max single TTS query limit (~150 chars)
      const safeText = text.slice(0, 150);

      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        safeText
      )}&tl=${langCode}&client=tw-ob`;

      const audioResponse = await axios.get(ttsUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://translate.google.com/",
        },
        responseType: "arraybuffer",
        timeout: 7000,
      });

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=86400, immutable");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(Buffer.from(audioResponse.data));
    } catch (error: any) {
      console.warn("⚠️ TTS generation error:", error.message);
      res.status(502).json({ error: "TTS generation unavailable" });
    }
  }
}
