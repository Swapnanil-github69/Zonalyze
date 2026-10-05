export interface RouteResult {
  coordinates: [number, number][]; // LineString coordinate array [[lon, lat], ...]
  distanceMeters: number;
  durationSeconds: number;
}

export async function fetchWalkingRoute(
  start: [number, number], // [lon, lat]
  end: [number, number]    // [lon, lat]
): Promise<RouteResult | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/foot/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Routing request failed");
    const data = await res.json();

    if (!data.routes || data.routes.length === 0) return null;

    const route = data.routes[0];
    return {
      coordinates: route.geometry.coordinates,
      distanceMeters: Math.round(route.distance),
      durationSeconds: Math.round(route.duration),
    };
  } catch (err) {
    console.error("OSRM Route Error:", err);
    return null;
  }
}
