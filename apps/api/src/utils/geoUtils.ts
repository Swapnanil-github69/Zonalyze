/**
 * Computes the great-circle distance between two geographic coordinates in meters
 * using the spherical Haversine formula.
 *
 * @param lat1 - Latitude of coordinate 1 in decimal degrees
 * @param lon1 - Longitude of coordinate 1 in decimal degrees
 * @param lat2 - Latitude of coordinate 2 in decimal degrees
 * @param lon2 - Longitude of coordinate 2 in decimal degrees
 * @returns Distance in meters rounded to the nearest integer
 */
export function calculateHaversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Handle identical coordinates safely without floating point noise
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

  const EARTH_RADIUS_METERS = 6371000;

  const toRadians = (deg: number): number => (deg * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  // Clamp a between 0 and 1 to prevent NaN from floating-point inaccuracies
  const clampedA = Math.min(Math.max(a, 0), 1);
  const c = 2 * Math.atan2(Math.sqrt(clampedA), Math.sqrt(1 - clampedA));

  return Math.round(EARTH_RADIUS_METERS * c);
}
