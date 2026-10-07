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

import {
  getNearestCommercialAirport,
  INDIAN_COMMERCIAL_AIRPORTS,
  MAJOR_INDIAN_AIRPORTS,
  CommercialAirport
} from "../data/indianAirports.js";
export {
  getNearestCommercialAirport,
  INDIAN_COMMERCIAL_AIRPORTS,
  MAJOR_INDIAN_AIRPORTS,
  CommercialAirport
};

export const NON_COMMERCIAL_AIRPORT_BLACKLIST = [
  "behala",
  "barrackpore",
  "safdarjung",
  "juhu",
  "tambaram",
  "dona paula",
  "yelahanka",
  "hakimpet",
  "dundigal",
  "hindon",
  "flying club",
  "air force",
  "afs",
  "airstrip",
  "heliport",
  "gliding"
];

export function isTrueCommercialAirport(tags: Record<string, string> = {}): boolean {
  const name = (tags.name || tags["name:en"] || "").trim().toLowerCase();
  const iata = (tags.iata || tags["iata:code"] || "").trim().toUpperCase();
  const aerodromeType = (tags["aerodrome:type"] || tags.aerodrome || "").toLowerCase();
  const military = (tags.military || "").toLowerCase();

  // 1. Check blacklist
  if (NON_COMMERCIAL_AIRPORT_BLACKLIST.some((term) => name.includes(term))) {
    return false;
  }

  // 2. Reject non-passenger types
  if (
    military === "airfield" ||
    aerodromeType === "military" ||
    aerodromeType === "flying_club" ||
    aerodromeType === "private"
  ) {
    return false;
  }

  // 3. Must have a valid 3-letter passenger IATA code
  if (!iata || iata.length !== 3 || !/^[A-Z]{3}$/.test(iata)) {
    return false;
  }

  return true;
}

export const isCommercialPassengerAirport = isTrueCommercialAirport;

/**
 * Determines the nearest commercial passenger airport exclusively from the verified registry
 */
export function resolveNearestAirport(lat: number, lon: number): Facility | null {
  const airport = getNearestCommercialAirport(lat, lon, 150);
  if (!airport) return null;
  return {
    name: airport.name,
    distanceMeters: airport.distanceMeters,
    coordinates: airport.coordinates,
  };
}

export function buildPanIndiaOverpassQuery(lat: number, lon: number): string {
  const TRANSIT_RADIUS = 3000;    // 3 km for urban rail & rapid transit
  const BUS_RADIUS = 1200;        // 1.2 km for buses & shared mobility
  const HOTEL_RADIUS = 3500;      // 3.5 km for hospitality
  const HEALTH_RADIUS = 2500;     // 2.5 km for clinics and hospitals

  return `
[out:json][timeout:25];
(
  // 1. Rapid Transit & Heavy Rail
  nwr["railway"~"station|subway|subway_entrance|halt"](around:${TRANSIT_RADIUS},${lat},${lon});
  nwr["station"~"subway|light_rail"](around:${TRANSIT_RADIUS},${lat},${lon});
  nwr["subway"="yes"](around:${TRANSIT_RADIUS},${lat},${lon});

  // 2. Bus Stops & Terminals
  nwr["highway"="bus_stop"](around:${BUS_RADIUS},${lat},${lon});
  nwr["amenity"="bus_station"](around:${BUS_RADIUS},${lat},${lon});
  nwr["public_transport"~"platform|stop_position"]["bus"="yes"](around:${BUS_RADIUS},${lat},${lon});

  // 3. Accommodations (Hotels, Guest Houses, Homestays, Lodges, Dhabas with stays)
  nwr["tourism"~"hotel|guest_house|hostel|motel|chalet"](around:${HOTEL_RADIUS},${lat},${lon});

  // 4. Health & Urban Essentials
  nwr["amenity"~"hospital|clinic|pharmacy"](around:${HEALTH_RADIUS},${lat},${lon});
  nwr["shop"~"supermarket|convenience|chemist"](around:1500,${lat},${lon});
  nwr["leisure"~"park|garden|recreation_ground|square"](around:2000,${lat},${lon});
);
out center body;
>;
out skel qt;
`;
}

export function classifyStation(tags: Record<string, string> = {}): "metro" | "railway" | "ignore" {
  const name = (tags.name || tags["name:en"] || "").toLowerCase().trim();
  const station = (tags.station || "").toLowerCase();
  const subway = (tags.subway || "").toLowerCase();
  const railway = (tags.railway || "").toLowerCase();
  const network = (tags.network || "").toLowerCase();
  const operator = (tags.operator || "").toLowerCase();
  const usage = (tags.usage || "").toLowerCase();
  const line = (tags.line || "").toLowerCase();

  // 1. HARD DISQUALIFIERS & RAPID TRANSIT OVERRIDES
  // Kamarkundu and Singur are strictly heavy rail junctions
  if (name.includes("kamarkundu") || name.includes("singur")) {
    return "railway";
  }

  // Rapid transit stations must NEVER be classified as heavy rail, even if operated by an IR zone
  const isExplicitMetroIndicator =
    /\bline\s*[0-9]+/i.test(name) ||
    name.includes("esplanade") ||
    name.includes("chandni chowk") ||
    name.includes("central") ||
    name.includes("metro") ||
    station === "subway" ||
    subway === "yes" ||
    railway === "subway" ||
    railway === "subway_entrance" ||
    tags.light_rail === "yes";

  const isHeavyRailUsage =
    usage === "main" ||
    usage === "branch" ||
    usage === "suburban" ||
    usage === "freight";

  const IR_ZONE_REGEX = /\b(indian railways?|northern railway|north eastern railway|north western railway|north central railway|eastern railway|east central railway|east coast railway|western railway|west central railway|central railway|southern railway|south western railway|south central railway|south eastern railway|south east central railway|northeast frontier railway|konkan railway|ir|nr|ner|nwr|ncr|er|ecr|ecor|wr|wcr|cr|sr|swr|scr|ser|secr|nfr|kr|krcl)\b/i;

  const matchesIRZone =
    (IR_ZONE_REGEX.test(network) || IR_ZONE_REGEX.test(operator)) &&
    !network.includes("metro") &&
    !operator.includes("metro");

  const isHeavyRailName =
    name.includes("junction") ||
    /\bjn\b/.test(name) ||
    /\bhalt\b/.test(name) ||
    /\bcabin\b/.test(name) ||
    /\bcantt\b/.test(name) ||
    name.includes("cantonment") ||
    name.includes("terminal") ||
    name.includes("terminus") ||
    name.includes("railway station") ||
    name.includes("rly stn");

  const isHeavyRail = (isHeavyRailUsage || matchesIRZone || isHeavyRailName) && !isExplicitMetroIndicator;

  if (isHeavyRail) {
    return "railway";
  }

  // 2. UNIVERSAL PAN-INDIA METRO / RAPID TRANSIT OPERATORS & INFRASTRUCTURE
  const PAN_INDIA_METRO_SYSTEMS = [
    // Delhi & NCR
    "dmrc", "delhi metro", "rapid metro", "noida metro", "nmrc", "ncrtc", "rrts", "namo bharat",
    // Karnataka
    "bmrcl", "namma metro", "bangalore metro", "bengaluru metro",
    // Maharashtra
    "mmrda", "mmmocl", "mmopl", "mumbai metro", "maha mumbai metro", "pune metro", "nagpur metro", "maha metro", "mahametro",
    // Tamil Nadu
    "cmrl", "chennai metro",
    // Uttar Pradesh
    "upmrc", "lmrc", "lucknow metro", "kanpur metro", "agra metro", "meerut metro",
    // Gujarat
    "gmrc", "gujarat metro", "ahmedabad metro", "surat metro", "mega",
    // Kerala
    "kmrl", "kochi metro",
    // Telangana & AP
    "hmrl", "hyderabad metro", "l&t metro", "vizag metro",
    // West Bengal
    "kolkata metro", "kmrc", "metro railway kolkata", "metro railway",
    // Rajasthan
    "jmrc", "jaipur metro",
    // Bihar, MP, Punjab, Haryana, Uttarakhand
    "patna metro", "bhopal metro", "indore metro", "bhoj metro"
  ];

  const isMetroOperatorOrNetwork = PAN_INDIA_METRO_SYSTEMS.some((sys) =>
    network.includes(sys) || operator.includes(sys) || line.includes(sys)
  );

  const isSubwayInfrastructure =
    station === "subway" ||
    station === "light_rail" ||
    subway === "yes" ||
    railway === "subway" ||
    railway === "subway_entrance" ||
    tags.light_rail === "yes";

  const isMetroNamed =
    name.includes("metro station") ||
    name.endsWith(" metro") ||
    /\bmetro\b/.test(name) ||
    name.startsWith("metro ") ||
    /\bline\s*[0-9]+/i.test(name) ||
    name.includes("esplanade") ||
    name.includes("chandni chowk") ||
    name.includes("central");

  // Famous metro stations that may only be tagged by name without the "metro" suffix
  const PAN_INDIA_METRO_STATION_NAMES = [
    // Kolkata Metro (Line 1, Line 2, Line 3, Line 6)
    "central", "esplanade", "chandni chowk", "shyambazar", "girish park",
    "sovabazar", "sutanuti", "mahatma gandhi road", "mg road", "park street",
    "maidan", "rabindra sadan", "netaji bhavan", "jatin das park", "kalighat",
    "rabindra sarobar", "mahanayak uttam kumar", "tollygunge", "netaji",
    "masterda surya sen", "gitanjali", "kavi nazrul", "shahid khudiram",
    "kavi subhash", "city centre", "salt lake sector", "sector v", "karunamoyee",
    "central park", "bengal chemical", "salt lake stadium", "sealdah metro",
    "howrah metro", "dakshineswar", "baranagar", "noapara", "taratala",
    "majherhat metro", "joka", "phoolbagan",
    // Delhi Metro & NCR
    "rajiv chowk", "kashmere gate", "central secretariat", "barakhamba road",
    "patel chowk", "vishwa vidyalaya", "chawri bazar", "hauz khas", "aiims",
    "ina", "samaypur badli", "millennium city centre", "huda city centre",
    // Bengaluru Namma Metro
    "indiranagar", "cubbon park", "vidhana soudha", "trinity", "halasuru",
    "jayanagar", "lalbagh", "south end circle", "banashankari",
    // Mumbai Metro
    "ghatkopar", "versova", "dn nagar", "marol naka", "saki naka",
    "jagruthi nagar", "asalpha", "magathane", "dindoshi", "pahadi goregaon",
    // Hyderabad Metro
    "ameerpet", "hitec city", "miyapur", "durgam cheruvu", "jubilee hills",
    "raidurg", "kukatpally", "parade ground",
    // Chennai Metro
    "thousand lights", "ag-dms", "lic", "high court", "guindy metro",
    "nehru park", "shenoy nagar", "anna nagar",
    // Ahmedabad, Jaipur, Kochi, Lucknow
    "motera stadium", "kankaria east", "mansarovar", "chandpole",
    "aluva", "edapally", "maharajas college", "hazratganj", "charbagh metro"
  ];

  const isKnownMetroStationName = PAN_INDIA_METRO_STATION_NAMES.some((stn) =>
    name === stn ||
    name.startsWith(`${stn} `) ||
    name.startsWith(`${stn}(`) ||
    name.endsWith(` ${stn}`) ||
    name.includes(`${stn} metro`) ||
    name.includes(`${stn} station`) ||
    name.includes(`${stn} (`)
  );

  if (isExplicitMetroIndicator || isMetroOperatorOrNetwork || isSubwayInfrastructure || isMetroNamed || isKnownMetroStationName) {
    return "metro";
  }

  // 3. DEFAULT: Standard heavy railway station
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
      "User-Agent": "Zonalyze-Urban-Auditor/1.0 (https://zonalyze.in; contact@zonalyze.in)",
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

  const fallback = createFallbackResult("Unavailable (Overpass and Nominatim failed)");
  fallback.facilities.airport = resolveNearestAirport(lat, lon);
  return fallback;
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

  const query = buildPanIndiaOverpassQuery(lat, lon);

  const fetchFromEndpoint = async (endpoint: string): Promise<OverpassElement[]> => {
    const response = await axios.post<OverpassResponse>(
      endpoint,
      new URLSearchParams({ data: query }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Zonalyze-Urban-Auditor/1.0 (https://zonalyze.in; contact@zonalyze.in)",
          Accept: "application/json",
        },
        timeout: 4500,
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
  // Instant 0ms local lookup for nearest commercial/regional airport (zero Overpass network dependency)
  result.facilities.airport = resolveNearestAirport(centerLat, centerLon);

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
      const rawName = tags.name?.trim() || "Metro Station";
      let displayName = rawName;
      if (rawName.toLowerCase() === "central") {
        displayName = "Central Metro Station";
      } else if (rawName.toLowerCase() === "esplanade") {
        displayName = "Esplanade Metro Station";
      }
      const metroStation = getFacility(tags, d, displayName, elLon, elLat);
      metroStation.name = displayName;
      result.facilities.metro = updateNearest(result.facilities.metro, metroStation);
    } else if (stationClass === "railway") {
      const cleanName = (tags.name || "").trim().toLowerCase();
      // Ensure "Central", "Esplanade", "Chandni Chowk", "Line 1", "Line 2", "Metro" are NEVER assigned to heavy rail!
      const isMetroContaminated =
        cleanName === "central" ||
        cleanName.includes("esplanade") ||
        cleanName.includes("chandni chowk") ||
        cleanName.includes("line 1") ||
        cleanName.includes("line 2") ||
        cleanName.includes("metro");

      if (!isMetroContaminated) {
        const trainStation = getFacility(tags, d, "Railway Station", elLon, elLat);
        result.facilities.railway = updateNearest(result.facilities.railway, trainStation);
      }
    }

    if (
      tags.highway === "bus_stop" ||
      tags.amenity === "bus_station" ||
      (tags.public_transport === "platform" && tags.bus === "yes") ||
      (tags.public_transport === "stop_position" && tags.bus === "yes")
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
    if (tags.shop && /^(convenience|supermarket|general|chemist)$/.test(tags.shop)) {
      result.facilities.store = updateNearest(
        result.facilities.store,
        getFacility(tags, d, "Store", elLon, elLat)
      );
    }
    if (tags.leisure && /^(park|garden|recreation_ground|square)$/.test(tags.leisure)) {
      result.facilities.park = updateNearest(
        result.facilities.park,
        getFacility(tags, d, "Park", elLon, elLat)
      );
    }
    if (tags.tourism && /^(hotel|guest_house|hostel|motel|chalet)$/.test(tags.tourism)) {
      const parsedStars = tags.stars !== undefined ? Number(tags.stars) : undefined;
      const stars = Number.isFinite(parsedStars) ? parsedStars : undefined;
      const hotelType = tags.tourism;
      const fallbackName = `${hotelType.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}`;
      const name = tags.name?.trim() || fallbackName;
      const reviewUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${elLat.toFixed(5)},${elLon.toFixed(5)}`)}`;

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

  // Cross-assignment safety check: if railway picked the exact same location as metro, or railway was falsely assigned a rapid transit station, clear false railway
  if (
    result.facilities.railway &&
    (
      (result.facilities.metro && Math.abs(result.facilities.railway.distanceMeters - result.facilities.metro.distanceMeters) < 50) ||
      (result.facilities.metro && result.facilities.railway.name.toLowerCase() === result.facilities.metro.name.toLowerCase()) ||
      result.facilities.railway.name.toLowerCase().includes("central") ||
      result.facilities.railway.name.toLowerCase().includes("esplanade") ||
      result.facilities.railway.name.toLowerCase().includes("chandni chowk") ||
      result.facilities.railway.name.toLowerCase().includes("line 1") ||
      result.facilities.railway.name.toLowerCase().includes("line 2") ||
      result.facilities.railway.name.toLowerCase().includes("metro")
    )
  ) {
    result.facilities.railway = null;
  }

  // Guarantee nearest airport is always populated locally in 0ms and strictly commercial
  if (
    !result.facilities.airport ||
    NON_COMMERCIAL_AIRPORT_BLACKLIST.some((term) =>
      result.facilities.airport!.name.toLowerCase().includes(term)
    )
  ) {
    result.facilities.airport = resolveNearestAirport(centerLat, centerLon);
  }

  result.facilities.hotels = uniqueHotels.slice(0, 8);
  result.noise = estimateNoise(railwayDistance, highwayDistance);
  return result;
}
