export type TravelMode = 'car' | 'bike' | 'bicycle' | 'walk';

export interface RouteResult {
  coordinates: [number, number][]; // [[lon, lat], ...]
  distanceMeters: number;
  durationSeconds: number;
  formattedDuration: string;
  formattedDistance: string;
  mode: TravelMode;
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.ceil((seconds % 3600) / 60);
  if (hrs > 0) {
    return `${hrs} hr ${mins} min`;
  }
  return `${mins} min`;
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
}

export async function fetchFacilityRoute(
  start: [number, number], // [lon, lat]
  end: [number, number],   // [lon, lat]
  mode: TravelMode = 'car'
): Promise<RouteResult | null> {
  try {
    // Map Zonalyze modes to OSRM profiles
    // OSRM demo server supports 'routed-car' (driving), 'routed-bike' (bicycle), 'routed-foot' (walking)
    let profile = 'car';
    if (mode === 'walk') profile = 'foot';
    else if (mode === 'bicycle') profile = 'bike';
    else if (mode === 'bike') profile = 'car'; // Motorcycle uses road network with slightly reduced traffic friction

    const url = `https://router.project-osrm.org/route/v1/${profile}/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM request failed: ${res.statusText}`);
    const data = await res.json();

    if (!data.routes || data.routes.length === 0) return null;

    const primaryRoute = data.routes[0];
    let durationSeconds = primaryRoute.duration;

    // Calculate accurate multi-modal duration
    if (mode === 'walk') {
      // Realistic pedestrian walking speed ~4.8 km/h (~1.33 m/s)
      durationSeconds = Math.max(durationSeconds, Math.round(primaryRoute.distance / 1.33));
    } else if (mode === 'bicycle') {
      // Realistic urban cycling speed ~15 km/h (~4.16 m/s)
      durationSeconds = Math.max(durationSeconds, Math.round(primaryRoute.distance / 4.16));
    } else if (mode === 'bike') {
      // For motorcycle, adjust driving duration down by ~15% for urban filtering
      durationSeconds = Math.round(durationSeconds * 0.85);
    }

    return {
      coordinates: primaryRoute.geometry.coordinates,
      distanceMeters: Math.round(primaryRoute.distance),
      durationSeconds: Math.round(durationSeconds),
      formattedDuration: formatDuration(durationSeconds),
      formattedDistance: formatDistance(primaryRoute.distance),
      mode,
    };
  } catch (err) {
    console.error("Routing error:", err);
    return null;
  }
}

// Backward-compatible aliases
export const fetchRoute = fetchFacilityRoute;

export async function fetchWalkingRoute(
  start: [number, number],
  end: [number, number]
): Promise<RouteResult | null> {
  return fetchFacilityRoute(start, end, 'walk');
}
