import axios from "axios";
import { calculateHaversineMeters } from "../utils/geoUtils.js";

export type Facility = {
  name: string;
  distanceMeters: number;
  coordinates: [number, number]; // [lon, lat]
};

export interface HotelFacility extends Facility {
  stars?: number | null;
  hotelType?: string;
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

  const query = `[out:json][timeout:7];
(
  nwr["amenity"~"hospital|clinic|nursing_home"](around:3000, ${lat},${lon});
  nwr["healthcare"~"hospital|clinic|centre|nursing_home"](around:3000, ${lat},${lon});
  nwr["station"="subway"](around:4000, ${lat},${lon});
  nwr["railway"="subway"](around:4000, ${lat},${lon});
  nwr["subway"="yes"](around:4000, ${lat},${lon});
  nwr["railway"="station"]["station"!="subway"]["subway"!="yes"](around:4000, ${lat},${lon});
  nwr["highway"="bus_stop"](around:1200, ${lat},${lon});
  nwr["amenity"="bus_station"](around:2000, ${lat},${lon});
  nwr["amenity"="taxi"](around:1000, ${lat},${lon});
  nwr["shop"~"convenience|supermarket|general"](around:1000, ${lat},${lon});
  nwr["leisure"="park"](around:1500, ${lat},${lon});
  nwr["tourism"~"hotel|guest_house|hostel"](around:2500, ${lat},${lon});
  way["railway"="rail"](around:1500, ${lat},${lon});
  way["highway"~"motorway|trunk|primary"](around:1000, ${lat},${lon});
);
out center;`;

  let elements: OverpassElement[];
  try {
    const response = await axios.post<OverpassResponse>(
      OVERPASS_ENDPOINT,
      new URLSearchParams({ data: query }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Zonalyze-Location-Auditor/1.0 (contact: info@zonalyze.local)",
          Accept: "application/json",
        },
        timeout: 8000,
      }
    );
    elements = response.data?.elements ?? [];
    return parseElements(lat, lon, elements);
  } catch (error) {
    console.error("Overpass facility and noise query failed:", error);
    return createFallbackResult("Unavailable (Overpass request failed)");
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

  for (const element of elements) {
    const elLat = element.lat ?? element.center?.lat;
    const elLon = element.lon ?? element.center?.lon;
    if (typeof elLat !== "number" || !Number.isFinite(elLat)) continue;
    if (typeof elLon !== "number" || !Number.isFinite(elLon)) continue;

    const tags = element.tags ?? {};
    const d = calculateHaversineMeters(centerLat, centerLon, elLat, elLon);

    const isSubway =
      tags.station === "subway" ||
      tags.subway === "yes" ||
      tags.railway === "subway";

    if (isSubway) {
      const metroStation = getFacility(tags, d, "Metro Station", elLon, elLat);
      result.facilities.metro = updateNearest(result.facilities.metro, metroStation);
    } else if (tags.railway === "station") {
      const trainStation = getFacility(tags, d, "Railway Station", elLon, elLat);
      result.facilities.railway = updateNearest(result.facilities.railway, trainStation);
    }

    if (tags.highway === "bus_stop" || tags.amenity === "bus_station") {
      result.facilities.busStop = updateNearest(
        result.facilities.busStop,
        getFacility(tags, d, "Bus stop", elLon, elLat)
      );
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
    if (tags.tourism && /^(hotel|guest_house|hostel)$/.test(tags.tourism)) {
      const stars = tags.stars === undefined ? undefined : Number(tags.stars);
      hotels.push({
        ...getFacility(tags, d, "Hotel", elLon, elLat),
        ...(tags.stars !== undefined
          ? { stars: Number.isFinite(stars) ? stars : null }
          : {}),
        hotelType: tags.tourism,
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

  result.facilities.hotels = hotels
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, 8);
  result.noise = estimateNoise(railwayDistance, highwayDistance);
  return result;
}
