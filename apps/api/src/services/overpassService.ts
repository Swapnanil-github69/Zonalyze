import axios from "axios";
import { calculateHaversineMeters } from "../utils/geoUtils.js";

export type Facility = {
  name: string;
  distanceMeters: number;
  coordinates: [number, number]; // [lon, lat]
  routesCount?: number;
};

export interface HotelFacility extends Facility {
  type: string; // 'hotel' | 'guest_house' | 'hostel' | 'motel'
  stars?: number;
  reviewUrl: string;
}

export interface OSMResult {
  facilities: {
    metro: Facility | null;
    railway: Facility | null;
    busStop: Facility | null;
    autoStand: Facility | null;
    hospital: Facility | null;
    store: Facility | null;
    park: Facility | null;
    airport: Facility | null;
    hotels: HotelFacility[];
  };
  noise: {
    bracket: "Low / Ambient" | "Moderate" | "Elevated";
    nearestSource: string;
    distanceMeters: number | null;
    confidence: string;
  };
}

export interface OverpassElement {
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export interface OverpassResponse {
  elements?: OverpassElement[];
}

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";

export function createFallbackResult(confidence: string): OSMResult {
  return {
    facilities: {
      metro: null,
      railway: null,
      busStop: null,
      autoStand: null,
      hospital: null,
      store: null,
      park: null,
      airport: null,
      hotels: [],
    },
    noise: {
      bracket: "Low / Ambient",
      nearestSource: "None detected",
      distanceMeters: null,
      confidence,
    },
  };
}

export function classifyStation(tags: Record<string, string> = {}): "metro" | "railway" | "ignore" {
  const name = (tags.name || "").toLowerCase();
  const station = (tags.station || "").toLowerCase();
  const subway = (tags.subway || "").toLowerCase();
  const railway = (tags.railway || "").toLowerCase();
  const network = (tags.network || "").toLowerCase();
  const operator = (tags.operator || "").toLowerCase();
  const usage = (tags.usage || "").toLowerCase();

  // 1. HARD DISQUALIFIERS: Regardless of elevation, viaducts, bridges, or layers,
  // these attributes belong exclusively to Indian Railways / heavy rail.
  const isHeavyRail =
    usage === "main" ||
    usage === "branch" ||
    network.includes("eastern railway") ||
    network.includes("south eastern railway") ||
    network.includes("indian railway") ||
    network.includes("suburban") ||
    network === "ir" ||
    operator.includes("eastern railway") ||
    operator.includes("south eastern railway") ||
    operator.includes("indian railway") ||
    operator === "ir" ||
    name.includes("kamarkundu") ||
    name.includes("singur") ||
    name.includes("junction") ||
    name.includes("jn") ||
    name.includes("halt");

  if (isHeavyRail) {
    return "railway";
  }

  // 2. EXPLICIT METRO / RAPID TRANSIT TAGS
  // Do NOT rely on "bridge", "viaduct", or "layer" to identify a metro!
  const isSubwayInfrastructure =
    station === "subway" ||
    subway === "yes" ||
    railway === "subway" ||
    railway === "subway_entrance" ||
    tags.light_rail === "yes";

  const isMetroOperator =
    network === "kolkata metro" ||
    network.includes("metro rail") ||
    network === "kmrc" ||
    operator.includes("kolkata metro") ||
    operator.includes("kmrc");

  const isMetroNamed =
    name.includes("metro station") ||
    name.endsWith(" metro");

  const knownMetroStops = [
    "sovabazar",
    "sutanuti",
    "phoolbagan",
    "esplanade",
    "chandni chowk",
    "central park",
    "karunamoyee",
    "city centre",
    "bengal chemical",
    "salt lake stadium",
    "kalighat",
    "park street",
    "rabindra sarobar",
    "dakshineswar",
    "baranagar",
    "noapara",
  ];
  const isKnownMetro = knownMetroStops.some((km) => name.includes(km));

  if (isSubwayInfrastructure || isMetroOperator || isMetroNamed || isKnownMetro) {
    return "metro";
  }

  // 3. DEFAULT: Any other railway station is standard heavy rail
  if (railway === "station" || railway === "halt" || tags.public_transport === "station") {
    return "railway";
  }

  return "ignore";
}

export function isMetroStation(tags: Record<string, string> = {}): boolean {
  return classifyStation(tags) === "metro";
}

export function getFacility(
  tags: Record<string, string>,
  distanceMeters: number,
  fallbackName: string,
  lon: number,
  lat: number
): Facility {
  return {
    name: tags.name?.trim() || fallbackName,
    distanceMeters,
    coordinates: [lon, lat], // strictly [lon, lat]
  };
}

export function updateNearest(
  current: Facility | null,
  candidate: Facility
): Facility {
  return current === null || candidate.distanceMeters < current.distanceMeters
    ? candidate
    : current;
}

function estimateNoise(
  railwayDistance: number | null,
  highwayDistance: number | null
): OSMResult["noise"] {
  if (railwayDistance === null && highwayDistance === null) {
    return {
      bracket: "Low / Ambient",
      nearestSource: "None detected",
      distanceMeters: null,
      confidence: "Low (no railway or primary highway detected within query range)",
    };
  }

  const railwayLevel =
    railwayDistance === null
      ? Number.NEGATIVE_INFINITY
      : 85 - 20 * Math.log10(Math.max(railwayDistance, 10) / 25);
  const highwayLevel =
    highwayDistance === null
      ? Number.NEGATIVE_INFINITY
      : 75 - 20 * Math.log10(Math.max(highwayDistance, 10) / 10);
  const estimatedLevel = Math.max(railwayLevel, highwayLevel);
  const bracket =
    estimatedLevel > 65
      ? "Elevated"
      : estimatedLevel > 50
        ? "Moderate"
        : "Low / Ambient";

  const railwayIsNearest =
    railwayDistance !== null &&
    (highwayDistance === null || railwayDistance <= highwayDistance);

  return {
    bracket,
    nearestSource: railwayIsNearest ? "Railway" : "Primary highway",
    distanceMeters: railwayIsNearest ? railwayDistance : highwayDistance,
    confidence: "High (Overpass geometry detected within query range)",
  };
}

/**
 * Retrieves and parses nearby OSM facilities and estimates noise from primary
 * highways and railway lines around the supplied coordinate.
 */
const TRANSIT_RADIUS = 2500; // 2.5 km for rail and metro
const BUS_RADIUS = 1000;     // 1.0 km for bus stops
const HOTEL_RADIUS = 3000;   // 3 km to ensure accommodations are found in all sectors

const OVERPASS_ENDPOINTS = [
  "https://lz4.overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

// In-memory cache for fast repeated or nearby requests
const osmMemoryCache = new Map<string, { timestamp: number; data: OSMResult }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function getCacheKey(lat: number, lon: number): string {
  // Quantize coordinates to ~110m bucket
  return `${lat.toFixed(3)},${lon.toFixed(3)}`;
}

async function fallbackWithNominatimFacilities(
  lat: number,
  lon: number
): Promise<OSMResult> {
  try {
    const delta = 0.027; // ~3km
    const viewbox = `${(lon - delta).toFixed(4)},${(lat + delta).toFixed(4)},${(lon + delta).toFixed(4)},${(lat - delta).toFixed(4)}`;
    const headers = {
      "User-Agent": "Zonalyze-Location-Auditor/1.0 (contact: info@zonalyze.local)",
    };

    const [hospRes, stationRes, busRes, hotelRes, guestHouseRes, parkRes] = await Promise.allSettled([
      axios.get(`https://nominatim.openstreetmap.org/search?q=hospital+clinic&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 4000 }),
      axios.get(`https://nominatim.openstreetmap.org/search?q=station&format=json&limit=15&viewbox=${viewbox}&bounded=1`, { headers, timeout: 4000 }),
      axios.get(`https://nominatim.openstreetmap.org/search?q=bus+stop&format=json&limit=8&viewbox=${viewbox}&bounded=1`, { headers, timeout: 4000 }),
      axios.get(`https://nominatim.openstreetmap.org/search?q=hotel&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 4000 }),
      axios.get(`https://nominatim.openstreetmap.org/search?q=guest+house&format=json&limit=5&viewbox=${viewbox}&bounded=1`, { headers, timeout: 4000 }),
      axios.get(`https://nominatim.openstreetmap.org/search?q=park&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 4000 }),
    ]);

    const elements: OverpassElement[] = [];

    if (hospRes.status === "fulfilled" && Array.isArray(hospRes.value.data)) {
      for (const item of hospRes.value.data) {
        elements.push({
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          tags: {
            amenity: "hospital",
            name: item.name || item.display_name?.split(",")[0] || "Hospital",
          },
        });
      }
    }

    if (stationRes.status === "fulfilled" && Array.isArray(stationRes.value.data)) {
      for (const item of stationRes.value.data) {
        const name = (item.name || item.display_name?.split(",")[0] || "").trim();
        const fakeTags: Record<string, string> = { railway: "station", name };
        const classification = classifyStation(fakeTags);
        elements.push({
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          tags: {
            railway: "station",
            ...(classification === "metro" ? { station: "subway", subway: "yes" } : {}),
            name: name || "Station",
          },
        });
      }
    }

    if (busRes.status === "fulfilled" && Array.isArray(busRes.value.data)) {
      for (const item of busRes.value.data) {
        const name = (item.name || item.display_name?.split(",")[0] || "Bus Stop").trim();
        elements.push({
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          tags: {
            highway: "bus_stop",
            name: name || "Bus Stop",
          },
        });
      }
    }

    const addAccommodations = (data: any[], defaultType: string) => {
      if (!Array.isArray(data)) return;
      for (const item of data) {
        const name = (item.name || item.display_name?.split(",")[0] || "Hotel").trim();
        elements.push({
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          tags: {
            tourism: defaultType,
            name: name || "Hotel",
          },
        });
      }
    };

    if (hotelRes.status === "fulfilled") addAccommodations(hotelRes.value.data, "hotel");
    if (guestHouseRes.status === "fulfilled") addAccommodations(guestHouseRes.value.data, "guest_house");

    if (parkRes.status === "fulfilled" && Array.isArray(parkRes.value.data)) {
      for (const item of parkRes.value.data) {
        elements.push({
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          tags: {
            leisure: "park",
            name: item.name || item.display_name?.split(",")[0] || "Park",
          },
        });
      }
    }

    if (elements.length > 0) {
      return parseElements(lat, lon, elements);
    }
  } catch (err: any) {
    console.warn("Nominatim fallback for facilities encountered error:", err.message);
  }

  return createFallbackResult("Unavailable (Overpass and Nominatim failed)");
}

/**
 * Retrieves and parses nearby OSM facilities and estimates noise from primary
 * highways and railway lines around the supplied coordinate.
 */
export async function fetchOSMData(lat: number, lon: number): Promise<OSMResult> {
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    throw new RangeError("Latitude and longitude must be valid geographic coordinates.");
  }

  // Check in-memory cache
  const cacheKey = getCacheKey(lat, lon);
  const cached = osmMemoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const query = `[out:json][timeout:10];
(
  // Metro Stations & Entrances
  nwr["station"="subway"](around:${TRANSIT_RADIUS},${lat},${lon});
  nwr["railway"="subway_entrance"](around:${TRANSIT_RADIUS},${lat},${lon});
  nwr["subway"="yes"](around:${TRANSIT_RADIUS},${lat},${lon});
  nwr["railway"="subway"](around:${TRANSIT_RADIUS},${lat},${lon});
  nwr["network"~"Kolkata Metro|KMRC|Metro Rail",i](around:${TRANSIT_RADIUS},${lat},${lon});

  // Heavy Railway (Indian Railways)
  nwr["railway"="station"](around:${TRANSIT_RADIUS},${lat},${lon});
  nwr["railway"="halt"](around:${TRANSIT_RADIUS},${lat},${lon});

  // Bus Stops & Platforms
  nwr["highway"="bus_stop"](around:${BUS_RADIUS},${lat},${lon});
  nwr["public_transport"="platform"]["bus"="yes"](around:${BUS_RADIUS},${lat},${lon});

  // Accommodations (Hotels, Guest Houses, Hostels, Motels)
  nwr["tourism"~"hotel|guest_house|hostel|motel"](around:${HOTEL_RADIUS},${lat},${lon});

  // Health & Essentials
  nwr["amenity"~"hospital|clinic|pharmacy"](around:2000,${lat},${lon});
  nwr["healthcare"~"hospital|clinic|centre"](around:2000,${lat},${lon});
  nwr["amenity"="bus_station"](around:2000,${lat},${lon});
  nwr["amenity"="taxi"](around:1000,${lat},${lon});
  nwr["leisure"="park"](around:1500,${lat},${lon});
  way["railway"="rail"](around:1500,${lat},${lon});
  way["highway"~"motorway|trunk|primary"](around:1000,${lat},${lon});
);
out center body qt;`;

  const fetchFromEndpoint = async (endpoint: string): Promise<OverpassElement[]> => {
    const response = await axios.post<OverpassResponse>(
      endpoint,
      new URLSearchParams({ data: query }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Zonalyze-Location-Auditor/1.0 (contact: info@zonalyze.local)",
          Accept: "application/json",
        },
        timeout: 3800,
      }
    );
    if (response.data && Array.isArray(response.data.elements) && response.data.elements.length > 0) {
      return response.data.elements;
    }
    throw new Error("No elements in response");
  };

  // Hedged execution: try Overpass mirrors first; if slow (>2200ms), start Nominatim fallback speculatively
  let fallbackTimer: NodeJS.Timeout | null = null;
  const overpassPromise = Promise.any(OVERPASS_ENDPOINTS.map((ep) => fetchFromEndpoint(ep)))
    .then((elements) => {
      const parsed = parseElements(lat, lon, elements);
      osmMemoryCache.set(cacheKey, { timestamp: Date.now(), data: parsed });
      return parsed;
    });

  const hedgedFallbackPromise = new Promise<OSMResult>((resolve) => {
    fallbackTimer = setTimeout(async () => {
      try {
        const fallbackRes = await fallbackWithNominatimFacilities(lat, lon);
        osmMemoryCache.set(cacheKey, { timestamp: Date.now(), data: fallbackRes });
        resolve(fallbackRes);
      } catch {
        // let overpass continue
      }
    }, 2200);
  });

  try {
    const result = await Promise.race([
      overpassPromise.then((res) => {
        if (fallbackTimer) clearTimeout(fallbackTimer);
        return res;
      }),
      hedgedFallbackPromise,
    ]);
    return result;
  } catch (error) {
    if (fallbackTimer) clearTimeout(fallbackTimer);
    console.warn("Overpass mirrors busy or timed out, executing fast Nominatim fallback...");
    const fallbackRes = await fallbackWithNominatimFacilities(lat, lon);
    osmMemoryCache.set(cacheKey, { timestamp: Date.now(), data: fallbackRes });
    return fallbackRes;
  }
}

/**
 * Parses raw Overpass elements into structured facilities with exact coordinates [lon, lat]
 * and estimates noise exposure.
 */
export function parseElements(
  centerLat: number,
  centerLon: number,
  elements: OverpassElement[]
): OSMResult {
  const result = createFallbackResult(
    "Low (no railway or primary highway detected within query range)"
  );
  const hotels: OSMResult["facilities"]["hotels"] = [];
  let railwayDistance: number | null = null;
  let highwayDistance: number | null = null;
  let busStopsCount = 0;
  let maxBusRoutes = 0;

  for (const element of elements) {
    const elLat = element.lat ?? element.center?.lat;
    const elLon = element.lon ?? element.center?.lon;
    if (typeof elLat !== "number" || !Number.isFinite(elLat)) continue;
    if (typeof elLon !== "number" || !Number.isFinite(elLon)) continue;

    const tags = element.tags ?? {};
    const d = calculateHaversineMeters(centerLat, centerLon, elLat, elLon);

    const stationClass = classifyStation(tags);

    if (stationClass === "metro") {
      const metroStation = getFacility(tags, d, "Metro Station", elLon, elLat);
      result.facilities.metro = updateNearest(result.facilities.metro, metroStation);
    } else if (stationClass === "railway") {
      const trainStation = getFacility(tags, d, "Railway Station", elLon, elLat);
      result.facilities.railway = updateNearest(result.facilities.railway, trainStation);
    }

    if (
      tags.highway === "bus_stop" ||
      tags.amenity === "bus_station" ||
      (tags.public_transport === "platform" && tags.bus === "yes")
    ) {
      busStopsCount++;
      let routes = 1;
      const routeStr = tags.route_ref || tags.routes || tags.lines;
      if (routeStr) {
        const parts = routeStr.split(/[,;/]+/).map((s) => s.trim()).filter(Boolean);
        if (parts.length > 0) routes = parts.length;
      }
      maxBusRoutes = Math.max(maxBusRoutes, routes);

      const candidateBus: Facility = {
        name: tags.name?.trim() || "Bus Stop",
        distanceMeters: d,
        coordinates: [elLon, elLat],
        routesCount: routes,
      };

      result.facilities.busStop = updateNearest(result.facilities.busStop, candidateBus);
    }
    if (tags.amenity === "taxi") {
      result.facilities.autoStand = updateNearest(
        result.facilities.autoStand,
        getFacility(tags, d, "Taxi stand", elLon, elLat)
      );
    }
    if (
      tags.amenity === "hospital" ||
      tags.amenity === "clinic" ||
      tags.amenity === "nursing_home" ||
      tags.healthcare === "hospital" ||
      tags.healthcare === "clinic" ||
      tags.healthcare === "centre" ||
      tags.healthcare === "nursing_home"
    ) {
      result.facilities.hospital = updateNearest(
        result.facilities.hospital,
        getFacility(tags, d, "Hospital / Clinic", elLon, elLat)
      );
    }
    if (tags.shop && /^(convenience|supermarket|general)$/.test(tags.shop)) {
      result.facilities.store = updateNearest(
        result.facilities.store,
        getFacility(tags, d, "Store", elLon, elLat)
      );
    }
    if (tags.leisure === "park") {
      result.facilities.park = updateNearest(
        result.facilities.park,
        getFacility(tags, d, "Park", elLon, elLat)
      );
    }
    if (tags.aeroway === "aerodrome" || tags.amenity === "airport") {
      result.facilities.airport = updateNearest(
        result.facilities.airport,
        getFacility(tags, d, "Airport", elLon, elLat)
      );
    }
    if (tags.tourism && /^(hotel|guest_house|hostel|motel)$/.test(tags.tourism)) {
      const parsedStars = tags.stars !== undefined ? Number(tags.stars) : undefined;
      const stars = Number.isFinite(parsedStars) ? parsedStars : undefined;
      const hotelType = tags.tourism;
      const fallbackName = `${hotelType.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}`;
      const name = tags.name?.trim() || fallbackName;
      const reviewUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${elLat},${elLon}`)}`;

      hotels.push({
        name,
        distanceMeters: d,
        coordinates: [elLon, elLat],
        type: hotelType,
        ...(stars !== undefined ? { stars } : {}),
        reviewUrl,
      });
    }

    if (tags.railway === "rail") {
      railwayDistance =
        railwayDistance === null ? d : Math.min(railwayDistance, d);
    }
    if (/^(motorway|trunk|primary)$/.test(tags.highway ?? "")) {
      highwayDistance =
        highwayDistance === null ? d : Math.min(highwayDistance, d);
    }
  }

  // Deduplicate by name to prevent multiple nodes/ways for the same property
  const uniqueHotels: HotelFacility[] = [];
  const seenHotelKeys = new Set<string>();

  for (const h of hotels.sort((a, b) => a.distanceMeters - b.distanceMeters)) {
    const key = h.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!seenHotelKeys.has(key)) {
      seenHotelKeys.add(key);
      uniqueHotels.push(h);
    }
  }

  if (result.facilities.busStop) {
    result.facilities.busStop.routesCount = Math.max(
      result.facilities.busStop.routesCount || 1,
      maxBusRoutes,
      busStopsCount
    );
  }

  // Cross-assignment safety check: if railway picked the exact same location as metro, clear false railway
  if (
    result.facilities.railway &&
    result.facilities.metro &&
    Math.abs(result.facilities.railway.distanceMeters - result.facilities.metro.distanceMeters) < 20 &&
    result.facilities.railway.name.toLowerCase() === result.facilities.metro.name.toLowerCase()
  ) {
    result.facilities.railway = null;
  }

  result.facilities.hotels = uniqueHotels.slice(0, 8);
  result.noise = estimateNoise(railwayDistance, highwayDistance);
  return result;
}
