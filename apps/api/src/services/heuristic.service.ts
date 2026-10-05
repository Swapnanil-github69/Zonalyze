import { OverpassElement, InfrastructureMetrics, NoiseAnalysis } from "../types/index.js";
import { calculateHaversineMeters } from "../utils/geoUtils.js";
import { estimateNoiseProfile } from "../utils/noiseModel.js";

/**
 * Contributor 1: Backend Lead
 * Deterministic Heuristic Processing:
 * Computes exact Haversine distances to detected infrastructure elements and executes acoustic attenuation proxy.
 */
export class HeuristicService {
  public static processInfrastructure(
    originLat: number,
    originLon: number,
    elements: OverpassElement[]
  ): {
    infrastructure: InfrastructureMetrics;
    noiseProfile: NoiseAnalysis;
  } {
    let hospitals = 0;
    let pharmacies = 0;
    let railway_stations = 0;
    let metro_stations = 0;
    let parks = 0;

    const detectedHospitals: Array<{
      name: string;
      distance: number;
      type: string;
      coordinates?: [number, number];
    }> = [];
    let nearestHospitalDist: number | null = null;
    let nearestHospitalName: string | null = null;
    let nearestRailwayDist: number | null = null;
    let nearestRailwayName: string | null = null;
    let nearestMetroDist: number | null = null;
    let nearestMetroName: string | null = null;
    let nearestArterialDist: number | null = null;

    for (const el of elements) {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      if (!lat || !lon) continue;

      const dist = calculateHaversineMeters(originLat, originLon, lat, lon);
      const tags = el.tags || {};
      const facilityName = tags.name || tags["name:en"] || "";

      const isHealthcare =
        tags.amenity === "hospital" ||
        tags.amenity === "clinic" ||
        tags.amenity === "nursing_home" ||
        tags.healthcare === "hospital" ||
        tags.healthcare === "clinic" ||
        tags.healthcare === "centre" ||
        tags.healthcare === "nursing_home" ||
        tags.building === "hospital";

      if (isHealthcare) {
        const type = tags.amenity || tags.healthcare || "medical";
        const fallback =
          tags.amenity === "nursing_home"
            ? "Nursing Home"
            : tags.amenity === "clinic"
            ? "Clinic"
            : "Hospital";
        detectedHospitals.push({
          name: facilityName || fallback,
          distance: dist,
          type,
          coordinates: [lon, lat],
        });
      } else if (tags.amenity === "pharmacy") {
        pharmacies++;
      } else if (
        tags.station === "subway" ||
        tags.subway === "yes" ||
        tags.railway === "subway"
      ) {
        metro_stations++;
        if (nearestMetroDist === null || dist < nearestMetroDist) {
          nearestMetroDist = dist;
          nearestMetroName = facilityName || "Metro Station";
        }
      } else if (
        tags.railway === "station" ||
        tags.railway === "halt" ||
        tags.public_transport === "station"
      ) {
        railway_stations++;
        if (nearestRailwayDist === null || dist < nearestRailwayDist) {
          nearestRailwayDist = dist;
          nearestRailwayName = facilityName || "Railway Station";
        }
      } else if (tags.railway && ["rail", "subway", "light_rail"].includes(tags.railway)) {
        if (nearestRailwayDist === null || dist < nearestRailwayDist) {
          nearestRailwayDist = dist;
        }
      } else if (tags.highway && ["motorway", "trunk", "primary"].includes(tags.highway)) {
        if (nearestArterialDist === null || dist < nearestArterialDist) {
          nearestArterialDist = dist;
        }
      } else if (tags.leisure === "park") {
        parks++;
      }
    }

    // Sort detected healthcare facilities by proximity
    detectedHospitals.sort((a, b) => a.distance - b.distance);
    hospitals = detectedHospitals.length;
    if (detectedHospitals.length > 0) {
      nearestHospitalDist = detectedHospitals[0].distance;
      nearestHospitalName = detectedHospitals[0].name;
    }

    const noiseProfile = estimateNoiseProfile({
      railwayDistM: nearestRailwayDist,
      arterialDistM: nearestArterialDist,
    });

    return {
      infrastructure: {
        hospitals,
        pharmacies,
        railway_stations,
        metro_stations,
        parks,
        nearest_hospital_dist_m: nearestHospitalDist,
        nearest_hospital_name: nearestHospitalName,
        nearby_hospitals: detectedHospitals.slice(0, 8),
        nearest_railway_dist_m: nearestRailwayDist,
        nearest_railway_name: nearestRailwayName,
        nearest_metro_dist_m: nearestMetroDist,
        nearest_metro_name: nearestMetroName,
        nearest_arterial_dist_m: nearestArterialDist,
      },
      noiseProfile,
    };
  }
}
