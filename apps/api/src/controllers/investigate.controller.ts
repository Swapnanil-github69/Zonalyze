import { Request, Response } from "express";
import { CacheService } from "../services/cache.service.js";
import { NominatimService } from "../services/nominatim.service.js";
import { OpenMeteoService } from "../services/openMeteo.service.js";
import { OverpassService } from "../services/overpass.service.js";
import { HeuristicService } from "../services/heuristic.service.js";
import { GeminiService } from "../services/gemini.service.js";

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

      // 2. Geospatial Cache Check (<=150m, within past 7 days)
      const cached = await CacheService.findNearbyInvestigation(latitude, longitude);
      if (cached) {
        console.log(`⚡ [CACHE HIT] Found previous investigation within 150m: ${cached._id}`);
        const responseData = {
          ...cached.toObject(),
          cached: true,
        };
        res.status(200).json(responseData);
        return;
      }

      console.log(`🌐 [CACHE MISS] Ingesting telemetry from external APIs in parallel...`);

      // 3. Parallel Ingestion (Nominatim, Open-Meteo, Overpass)
      const [address, airQuality, overpassElements] = await Promise.all([
        NominatimService.reverseGeocode(latitude, longitude),
        OpenMeteoService.fetchAirQuality(latitude, longitude),
        OverpassService.queryInfrastructure(latitude, longitude),
      ]);

      // 4. Deterministic Heuristics (Haversine distances + Acoustic noise proxy)
      const { infrastructure, noiseProfile } = HeuristicService.processInfrastructure(
        latitude,
        longitude,
        overpassElements
      );

      // 5. Google Gemini Forensic Synthesis
      const aiReport = await GeminiService.generateDebrief({
        address,
        coordinates: [longitude, latitude],
        environment: airQuality,
        infrastructure,
        noiseProfile,
      });

      // 6. Persistence to MongoDB Atlas (only cache if external ingestion was successful)
      let savedDoc: any = null;
      if (overpassElements.length > 0) {
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
            nearest_railway_dist_m: infrastructure.nearest_railway_dist_m,
            nearest_metro_dist_m: infrastructure.nearest_metro_dist_m ?? null,
            nearest_arterial_dist_m: infrastructure.nearest_arterial_dist_m,
          },
          noiseProfile,
          aiReport,
        });
        console.log(`✅ [AUDIT COMPLETE] Saved investigation to cache: ${savedDoc._id}`);
      } else {
        console.warn(`⚠️ [AUDIT WARNING] Zero elements detected; skipping cache persistence to avoid poisoning.`);
      }

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
              noiseProfile,
              aiReport,
              createdAt: new Date().toISOString(),
              _id: "live-audit",
              cached: false,
            }
      );
    } catch (error) {
      console.error("❌ Investigation pipeline error:", error);
      res.status(500).json({
        error: "Internal server error occurred while conducting investigation.",
        details: (error as Error).message,
      });
    }
  }
}
