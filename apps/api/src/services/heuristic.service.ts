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

    let nearestHospitalDist: number | null = null;
    let nearestRailwayDist: number | null = null;
    let nearestMetroDist: number | null = null;
    let nearestArterialDist: number | null = null;

    for (const el of elements) {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      if (!lat || !lon) continue;

      const dist = calculateHaversineMeters(originLat, originLon, lat, lon);
      const tags = el.tags || {};

      if (
        tags.amenity === "hospital" ||
        tags.healthcare === "hospital" ||
        tags.building === "hospital"
      ) {
        hospitals++;
        if (nearestHospitalDist === null || dist < nearestHospitalDist) {
          nearestHospitalDist = dist;
        }
      } else if (tags.amenity === "pharmacy") {
        pharmacies++;
      } else if (
        tags.station === "subway" ||
        tags.station === "light_rail" ||
        tags.subway === "yes" ||
        (tags.railway === "station" && (tags.subway === "yes" || tags.station === "subway"))
      ) {
        metro_stations++;
        railway_stations++;
        if (nearestMetroDist === null || dist < nearestMetroDist) {
          nearestMetroDist = dist;
        }
        if (nearestRailwayDist === null || dist < nearestRailwayDist) {
          nearestRailwayDist = dist;
        }
      } else if (
        tags.railway === "station" ||
        tags.railway === "halt" ||
        tags.public_transport === "station"
      ) {
        railway_stations++;
        if (nearestRailwayDist === null || dist < nearestRailwayDist) {
          nearestRailwayDist = dist;
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
        nearest_railway_dist_m: nearestRailwayDist,
        nearest_metro_dist_m: nearestMetroDist,
        nearest_arterial_dist_m: nearestArterialDist,
      },
      noiseProfile,
    };
  }
}
