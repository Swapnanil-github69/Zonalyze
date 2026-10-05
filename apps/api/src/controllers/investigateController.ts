import { Request, Response } from "express";
import { findNearbyInvestigation } from "../services/cacheService.js";
import { fetchAddress } from "../services/nominatimService.js";
import { fetchAtmosphere } from "../services/openMeteoService.js";
import { fetchOSMData } from "../services/overpassService.js";
import { computeLivabilityScore } from "../services/scoringService.js";
import { generateAIDebrief } from "../services/geminiService.js";
import { Investigation } from "../models/Investigation.js";

function getFacilityDistance(facility: { distanceMeters: number } | null): number | null {
  return facility?.distanceMeters ?? null;
}

export async function investigateLocation(req: Request, res: Response): Promise<void> {
  try {
    const { latitude, longitude } = req.body ?? {};
    if (
      typeof latitude !== "number" ||
      !Number.isFinite(latitude) ||
      typeof longitude !== "number" ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      res.status(400).json({
        success: false,
        message: "Valid numeric latitude and longitude are required.",
      });
      return;
    }

    const cached = await findNearbyInvestigation(latitude, longitude);
    if (cached) {
      res.status(200).json({ success: true, cached: true, data: cached });
      return;
    }

    const [address, environment, osmData] = await Promise.all([
      fetchAddress(latitude, longitude),
      fetchAtmosphere(latitude, longitude),
      fetchOSMData(latitude, longitude),
    ]);
    const livabilityScore = computeLivabilityScore({
      environment,
      facilities: osmData.facilities,
      noise: osmData.noise,
    });
    const aiDebrief = await generateAIDebrief({
      address,
      environment,
      noise: osmData.noise,
      facilities: osmData.facilities,
      livabilityScore,
    });

    const report = await Investigation.create({
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      address: address.displayName,
      environment: {
        pm2_5: environment.pm2_5,
        pm10: environment.pm10,
        aqi: environment.aqi,
        historical_pm25: environment.historicalPm25,
        currentTemp: environment.currentTemp,
        avgTempLastWeek: environment.avgTempLastWeek,
        historicalTemp: environment.historicalTemp,
      },
      facilities: osmData.facilities,
      noise: osmData.noise,
      infrastructure: {
        hospitals: osmData.facilities.hospital ? 1 : 0,
        pharmacies: 0,
        railway_stations: osmData.facilities.railway ? 1 : 0,
        metro_stations: osmData.facilities.metro ? 1 : 0,
        parks: osmData.facilities.park ? 1 : 0,
        nearest_hospital_dist_m: getFacilityDistance(osmData.facilities.hospital),
        nearest_hospital_name: osmData.facilities.hospital?.name ?? null,
        nearby_hospitals: osmData.facilities.hospital
          ? [
              {
                name: osmData.facilities.hospital.name,
                distance: osmData.facilities.hospital.distanceMeters,
                type: "healthcare",
              },
            ]
          : [],
        nearest_railway_dist_m: getFacilityDistance(osmData.facilities.railway),
        nearest_railway_name: osmData.facilities.railway?.name ?? null,
        nearest_metro_dist_m: getFacilityDistance(osmData.facilities.metro),
        nearest_metro_name: osmData.facilities.metro?.name ?? null,
        nearest_arterial_dist_m:
          osmData.noise.nearestSource === "Primary highway"
            ? osmData.noise.distanceMeters
            : null,
      },
      noiseProfile: {
        estimated_bracket: osmData.noise.bracket,
        nearest_source_type:
          osmData.noise.nearestSource === "Railway"
            ? "railway"
            : osmData.noise.nearestSource === "Primary highway"
              ? "arterial_road"
              : "none",
        distance_meters: osmData.noise.distanceMeters,
        confidence: osmData.noise.confidence,
      },
      aiDebrief,
      aiReport: {
        summary: aiDebrief.summary,
        empirical_observations: aiDebrief.observations,
        site_inspection_targets: aiDebrief.inspectionTargets,
      },
      livabilityScore,
    });

    res.status(201).json({ success: true, cached: false, data: report });
  } catch (error) {
    console.error("Investigation pipeline failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to complete the location investigation.",
    });
  }
}

export async function getRecentInvestigations(req: Request, res: Response): Promise<void> {
  try {
    const requestedLimit = Number.parseInt(String(req.query.limit ?? ""), 10);
    const limit =
      Number.isSafeInteger(requestedLimit) && requestedLimit > 0
        ? requestedLimit
        : 6;
    const reports = await Investigation.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("address livabilityScore environment.aqi location createdAt");

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Recent investigations query failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve recent investigations.",
    });
  }
}

export async function getInvestigationById(req: Request, res: Response): Promise<void> {
  try {
    const report = await Investigation.findById(req.params.id);
    if (!report) {
      res.status(404).json({ success: false, message: "Investigation not found" });
      return;
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error("Investigation lookup failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve the investigation.",
    });
  }
}
