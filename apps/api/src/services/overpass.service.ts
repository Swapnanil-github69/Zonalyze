import axios from "axios";
import { config } from "../config/env.js";
import { OverpassResponse, OverpassElement } from "../types/index.js";
import { isMetroStation, buildPanIndiaOverpassQuery } from "./overpassService.js";

/**
 * Contributor 1: Backend Lead
 * Executes a single batch Overpass QL query covering transit, hospitality, and civic infrastructure.
 */
export class OverpassService {
  private static readonly ENDPOINTS = [
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
  ];

  private static readonly memoryCache = new Map<string, { timestamp: number; elements: OverpassElement[] }>();
  private static readonly CACHE_TTL_MS = 15 * 60 * 1000; // 15 mins

  public static async queryInfrastructure(
    lat: number,
    lon: number
  ): Promise<OverpassElement[]> {
    const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
    const cached = this.memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.elements;
    }

    const query = buildPanIndiaOverpassQuery(lat, lon);

    // Race fast mirrors concurrently with an aggressive 3500ms network timeout
    const fetchFromEndpoint = async (endpoint: string): Promise<OverpassElement[]> => {
      const response = await axios.post<OverpassResponse>(
        endpoint,
        `data=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent":
              config.nominatimUserAgent ||
              "Zonalyze-Urban-Auditor/1.0 (https://zonalyze.in; contact@zonalyze.in)",
            Accept: "application/json",
          },
          timeout: 3500,
        }
      );

      if (response.data && Array.isArray(response.data.elements) && response.data.elements.length > 0) {
        return response.data.elements;
      }
      throw new Error("No elements in response");
    };

    // Speculative race: if Overpass mirrors do not resolve within 300ms, start fast fallback
    const overpassPromise = Promise.any(this.ENDPOINTS.map((ep) => fetchFromEndpoint(ep)))
      .then((elements) => {
        this.memoryCache.set(cacheKey, { timestamp: Date.now(), elements });
        return elements;
      });

    const fallbackPromise = new Promise<OverpassElement[]>((resolve) => {
      setTimeout(async () => {
        try {
          const fallbackElements = await this.fallbackWithNominatim(lat, lon);
          this.memoryCache.set(cacheKey, { timestamp: Date.now(), elements: fallbackElements });
          resolve(fallbackElements);
        } catch {
          // let overpass continue
        }
      }, 300);
    });

    try {
      return await Promise.race([overpassPromise, fallbackPromise]);
    } catch {
      console.warn("⚠️ Overpass mirrors busy/timed out, activating fast Nominatim fallback...");
      const fallbackElements = await this.fallbackWithNominatim(lat, lon);
      this.memoryCache.set(cacheKey, { timestamp: Date.now(), elements: fallbackElements });
      return fallbackElements;
    }
  }

  /**
   * Resilient fallback using Nominatim search to detect hospitals, stations, bus stops, hotels, and parks
   * if public Overpass servers are rate-limited or experiencing high latency.
   */
  private static async fallbackWithNominatim(
    lat: number,
    lon: number
  ): Promise<OverpassElement[]> {
    try {
      const delta = 0.027; // ~3km bounding box
      const viewbox = `${(lon - delta).toFixed(4)},${(lat + delta).toFixed(4)},${(lon + delta).toFixed(4)},${(lat - delta).toFixed(4)}`;
      const headers = {
        "User-Agent":
          config.nominatimUserAgent ||
          "Zonalyze-Urban-Auditor/1.0 (https://zonalyze.in; contact@zonalyze.in)",
      };

      const [hospRes, clinicRes, stationRes, busRes, hotelRes, guestHouseRes, parkRes, shopRes] = await Promise.allSettled([
        axios.get(`https://nominatim.openstreetmap.org/search?q=hospital&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3500 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=clinic&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3500 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=station&format=json&limit=15&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3500 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=bus+stop&format=json&limit=8&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3500 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=hotel&format=json&limit=12&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3500 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=guest+house&format=json&limit=6&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3500 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=park&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3500 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=supermarket+store+grocery&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3500 }),
      ]);

      const elements: OverpassElement[] = [];
      const seenOsmIds = new Set<number>();

      const addHealthcare = (data: any[], defaultAmenity: string) => {
        if (!Array.isArray(data)) return;
        for (const item of data) {
          const osmId = Number(item.osm_id) || Math.floor(Math.random() * 100000);
          if (seenOsmIds.has(osmId)) continue;
          seenOsmIds.add(osmId);

          elements.push({
            type: "node",
            id: osmId,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            tags: {
              amenity: item.type === "clinic" ? "clinic" : item.type === "nursing_home" ? "nursing_home" : defaultAmenity,
              healthcare: item.type || defaultAmenity,
              name: item.name || item.display_name?.split(",")[0] || "Medical Facility",
            },
          });
        }
      };

      if (hospRes.status === "fulfilled") addHealthcare(hospRes.value.data, "hospital");
      if (clinicRes.status === "fulfilled") addHealthcare(clinicRes.value.data, "clinic");

      if (stationRes.status === "fulfilled" && Array.isArray(stationRes.value.data)) {
        for (const item of stationRes.value.data) {
          const stationName = (item.name || item.display_name?.split(",")[0] || "").trim();
          const fakeTags: Record<string, string> = { railway: "station", name: stationName };
          const isMetro = isMetroStation(fakeTags);
          elements.push({
            type: "node",
            id: Number(item.osm_id) || Math.floor(Math.random() * 100000),
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            tags: {
              railway: "station",
              ...(isMetro ? { station: "subway", subway: "yes" } : {}),
              name: stationName || "Station",
            },
          });
        }
      }

      if (busRes.status === "fulfilled" && Array.isArray(busRes.value.data)) {
        for (const item of busRes.value.data) {
          const busName = (item.name || item.display_name?.split(",")[0] || "Bus Stop").trim();
          const osmId = Number(item.osm_id) || Math.floor(Math.random() * 100000);
          if (seenOsmIds.has(osmId)) continue;
          seenOsmIds.add(osmId);

          elements.push({
            type: "node",
            id: osmId,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            tags: {
              highway: "bus_stop",
              name: busName || "Bus Stop",
            },
          });
        }
      }

      const addHotels = (data: any[], type: string) => {
        if (!Array.isArray(data)) return;
        for (const item of data) {
          const hotelName = (item.name || item.display_name?.split(",")[0] || "Hotel").trim();
          const osmId = Number(item.osm_id) || Math.floor(Math.random() * 100000);
          if (seenOsmIds.has(osmId)) continue;
          seenOsmIds.add(osmId);

          elements.push({
            type: "node",
            id: osmId,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            tags: {
              tourism: type,
              name: hotelName || "Hotel",
            },
          });
        }
      };

      if (hotelRes.status === "fulfilled") addHotels(hotelRes.value.data, "hotel");
      if (guestHouseRes.status === "fulfilled") addHotels(guestHouseRes.value.data, "guest_house");

      if (parkRes.status === "fulfilled" && Array.isArray(parkRes.value.data)) {
        for (const item of parkRes.value.data) {
          elements.push({
            type: "node",
            id: Number(item.osm_id) || Math.floor(Math.random() * 100000),
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            tags: { leisure: "park", name: item.display_name?.split(",")[0] || "Park" },
          });
        }
      }

      if (shopRes.status === "fulfilled" && Array.isArray(shopRes.value.data)) {
        for (const item of shopRes.value.data) {
          const rawName = (item.name || item.display_name?.split(",")[0] || "").trim();
          const osmId = Number(item.osm_id) || Math.floor(Math.random() * 100000);
          if (seenOsmIds.has(osmId)) continue;
          seenOsmIds.add(osmId);

          elements.push({
            type: "node",
            id: osmId,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            tags: {
              shop: "supermarket",
              name: rawName || "Local Grocery & Store",
            },
          });
        }
      }

      console.log(`✅ [NOMINATIM FALLBACK] Successfully detected ${elements.length} infrastructure facilities.`);
      return elements;
    } catch (err: any) {
      console.warn("⚠️ Nominatim fallback failed:", err.message);
      return [];
    }
  }
}
