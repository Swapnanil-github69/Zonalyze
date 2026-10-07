export type TravelMode = 'car' | 'bike' | 'bicycle' | 'walk';

export interface RouteResult {
  coordinates: [number, number][]; // [[lon, lat], ...]
  distanceMeters: number;
  durationSeconds: number;
  formattedDuration: string;
  formattedDistance: string;
  mode: TravelMode;
  modeLabel: string;
  targetName?: string;
  targetCoordinates?: [number, number];
}

export function getModeLabel(mode: TravelMode): string {
  switch (mode) {
    case 'car':
      return 'Driving';
    case 'bike':
      return 'Motorcycle';
    case 'bicycle':
      return 'Cycling';
    case 'walk':
    default:
      return 'Walking';
  }
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

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function fetchFacilityRoute(
  start: [number, number], // [lon, lat]
  end: [number, number],   // [lon, lat]
  mode: TravelMode = 'walk',
  targetName?: string
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

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No OSRM routes found for the requested coordinate pair.");
    }

    const primaryRoute = data.routes[0];
    const rawCoords: [number, number][] = primaryRoute.geometry.coordinates || [];
    const coordinates: [number, number][] = rawCoords.map((pt) => [pt[0], pt[1]]);

    let totalDistanceMeters = Math.round(primaryRoute.distance);

    // Guarantee route polyline starts exactly at the origin pinpoint
    if (coordinates.length > 0) {
      const [firstLon, firstLat] = coordinates[0];
      const startBridge = haversineMeters(start[1], start[0], firstLat, firstLon);
      if (startBridge > 1.5) {
        coordinates.unshift([start[0], start[1]]);
        totalDistanceMeters += Math.round(startBridge);
      } else {
        coordinates[0] = [start[0], start[1]];
      }

      // Guarantee route polyline terminates seamlessly at the destination pin (bridging perimeter street to centroid)
      const [lastLon, lastLat] = coordinates[coordinates.length - 1];
      const endBridge = haversineMeters(lastLat, lastLon, end[1], end[0]);
      if (endBridge > 1.5) {
        coordinates.push([end[0], end[1]]);
        totalDistanceMeters += Math.round(endBridge);
      } else {
        coordinates[coordinates.length - 1] = [end[0], end[1]];
      }
    } else {
      coordinates.push([start[0], start[1]], [end[0], end[1]]);
    }

    let durationSeconds = primaryRoute.duration;

    // Calculate accurate multi-modal duration based on total path length
    if (mode === 'walk') {
      // Realistic pedestrian walking speed ~4.8 km/h (~1.33 m/s)
      durationSeconds = Math.max(durationSeconds, Math.round(totalDistanceMeters / 1.33));
    } else if (mode === 'bicycle') {
      // Realistic urban cycling speed ~15 km/h (~4.16 m/s)
      durationSeconds = Math.max(durationSeconds, Math.round(totalDistanceMeters / 4.16));
    } else if (mode === 'bike') {
      // For motorcycle, adjust driving duration down by ~15% for urban filtering
      durationSeconds = Math.round(durationSeconds * 0.85);
    }

    return {
      coordinates,
      distanceMeters: totalDistanceMeters,
      durationSeconds: Math.round(durationSeconds),
      formattedDuration: formatDuration(durationSeconds),
      formattedDistance: formatDistance(totalDistanceMeters),
      mode,
      modeLabel: getModeLabel(mode),
      targetName,
      targetCoordinates: end,
    };
  } catch (err) {
    console.warn("OSRM routing unavailable or offline, generating direct spatial transit line:", err);
    const directMeters = Math.round(haversineMeters(start[1], start[0], end[1], end[0]));
    let speedMs = 1.33; // walk ~4.8 km/h
    if (mode === 'bicycle') speedMs = 4.16;
    else if (mode === 'bike') speedMs = 8.33;
    else if (mode === 'car') speedMs = 7.5;
    const durationSeconds = Math.max(20, Math.round(directMeters / speedMs));

    return {
      coordinates: [
        [start[0], start[1]],
        [end[0], end[1]],
      ],
      distanceMeters: directMeters,
      durationSeconds,
      formattedDuration: formatDuration(durationSeconds),
      formattedDistance: formatDistance(directMeters),
      mode,
      modeLabel: getModeLabel(mode),
      targetName,
      targetCoordinates: end,
    };
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
