import { calculateHaversineMeters } from "./geoUtils.js";

/**
 * Computes great-circle distance between two coordinates in meters via Haversine formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  return calculateHaversineMeters(lat1, lon1, lat2, lon2);
}

