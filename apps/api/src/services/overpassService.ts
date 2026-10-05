import axios from "axios";
import { calculateHaversineMeters } from "../utils/geoUtils.js";

type Facility = {
  name: string;
  distanceMeters: number;
};

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
    hotels: Array<Facility & { stars?: number | null; hotelType?: string }>;
  };
  noise: {
    bracket: "Low / Ambient" | "Moderate" | "Elevated";
    nearestSource: string;
    distanceMeters: number | null;
    confidence: string;
  };
}

interface OverpassElement {
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements?: OverpassElement[];
}

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";

function createFallbackResult(confidence: string): OSMResult {
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

function getFacility(tags: Record<string, string>, distanceMeters: number, fallbackName: string): Facility {
  return {
    name: tags.name?.trim() || fallbackName,
    distanceMeters,
  };
}

function updateNearest(
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
  nwr["amenity"="hospital"](around:3000, ${lat},${lon});
  nwr["railway"="station"](around:4000, ${lat},${lon});
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
          Accept: "application/json",
        },
        timeout: 8000,
      }
    );
    elements = response.data?.elements ?? [];
  } catch (error) {
    console.error("Overpass facility and noise query failed:", error);
    return createFallbackResult("Unavailable (Overpass request failed)");
  }

  const result = createFallbackResult(
    "Low (no railway or primary highway detected within query range)"
  );
  const hotels: OSMResult["facilities"]["hotels"] = [];
  let railwayDistance: number | null = null;
  let highwayDistance: number | null = null;

  for (const element of elements) {
    const latitude = element.lat ?? element.center?.lat;
    const longitude = element.lon ?? element.center?.lon;
    if (typeof latitude !== "number" || !Number.isFinite(latitude)) continue;
    if (typeof longitude !== "number" || !Number.isFinite(longitude)) continue;

    const tags = element.tags ?? {};
    const distanceMeters = calculateHaversineMeters(lat, lon, latitude, longitude);

    if (tags.railway === "station") {
      const station = getFacility(tags, distanceMeters, "Railway station");
      if (tags.station === "subway" || tags.subway === "yes") {
        result.facilities.metro = updateNearest(result.facilities.metro, station);
      } else {
        result.facilities.railway = updateNearest(result.facilities.railway, station);
      }
    }

    if (tags.highway === "bus_stop" || tags.amenity === "bus_station") {
      result.facilities.busStop = updateNearest(
        result.facilities.busStop,
        getFacility(tags, distanceMeters, "Bus stop")
      );
    }
    if (tags.amenity === "taxi") {
      result.facilities.autoStand = updateNearest(
        result.facilities.autoStand,
        getFacility(tags, distanceMeters, "Taxi stand")
      );
    }
    if (tags.amenity === "hospital") {
      result.facilities.hospital = updateNearest(
        result.facilities.hospital,
        getFacility(tags, distanceMeters, "Hospital")
      );
    }
    if (tags.shop && /^(convenience|supermarket|general)$/.test(tags.shop)) {
      result.facilities.store = updateNearest(
        result.facilities.store,
        getFacility(tags, distanceMeters, "Store")
      );
    }
    if (tags.leisure === "park") {
      result.facilities.park = updateNearest(
        result.facilities.park,
        getFacility(tags, distanceMeters, "Park")
      );
    }
    if (tags.tourism && /^(hotel|guest_house|hostel)$/.test(tags.tourism)) {
      const stars = tags.stars === undefined ? undefined : Number(tags.stars);
      hotels.push({
        ...getFacility(tags, distanceMeters, "Hotel"),
        ...(tags.stars !== undefined
          ? { stars: Number.isFinite(stars) ? stars : null }
          : {}),
        hotelType: tags.tourism,
      });
    }

    if (tags.railway === "rail") {
      railwayDistance =
        railwayDistance === null ? distanceMeters : Math.min(railwayDistance, distanceMeters);
    }
    if (/^(motorway|trunk|primary)$/.test(tags.highway ?? "")) {
      highwayDistance =
        highwayDistance === null ? distanceMeters : Math.min(highwayDistance, distanceMeters);
    }
  }

  result.facilities.hotels = hotels
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, 8);
  result.noise = estimateNoise(railwayDistance, highwayDistance);
  return result;
}
