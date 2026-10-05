import axios from "axios";
import { config } from "../config/env.js";
import { OverpassResponse, OverpassElement } from "../types/index.js";

/**
 * Contributor 1: Backend Lead
 * Executes a single batch Overpass QL query covering a 3000m radius around (lat, lon).
 */
export class OverpassService {
  private static readonly ENDPOINTS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass-api.de/api/interpreter",
  ];

  public static async queryInfrastructure(
    lat: number,
    lon: number
  ): Promise<OverpassElement[]> {
    const query = `
      [out:json][timeout:5];
      (
        node["amenity"~"hospital|clinic|nursing_home"](around:3000, ${lat}, ${lon});
        way["amenity"~"hospital|clinic|nursing_home"](around:3000, ${lat}, ${lon});
        node["healthcare"~"hospital|clinic|centre|nursing_home"](around:3000, ${lat}, ${lon});
        way["healthcare"~"hospital|clinic|centre|nursing_home"](around:3000, ${lat}, ${lon});
        node["amenity"="pharmacy"](around:1500, ${lat}, ${lon});
        node["railway"="station"](around:3000, ${lat}, ${lon});
        way["railway"="station"](around:3000, ${lat}, ${lon});
        node["station"="subway"](around:3000, ${lat}, ${lon});
        way["railway"="rail"](around:800, ${lat}, ${lon});
        way["highway"="motorway"](around:800, ${lat}, ${lon});
        way["highway"="trunk"](around:800, ${lat}, ${lon});
        way["highway"="primary"](around:800, ${lat}, ${lon});
        node["leisure"="park"](around:2000, ${lat}, ${lon});
        way["leisure"="park"](around:2000, ${lat}, ${lon});
      );
      out center 150;
    `;

    // Race fast mirrors concurrently with a 3500ms timeout
    const fetchFromEndpoint = async (endpoint: string): Promise<OverpassElement[]> => {
      const response = await axios.post<OverpassResponse>(
        endpoint,
        `data=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": config.nominatimUserAgent || "Zonalyze-Location-Auditor/1.0 (contact: info@zonalyze.local)",
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

    try {
      // Whichever mirror responds first wins
      const elements = await Promise.any(this.ENDPOINTS.map((ep) => fetchFromEndpoint(ep)));
      return elements;
    } catch {
      console.warn("⚠️ Overpass mirrors busy/timed out within 3.5s, activating fast Nominatim fallback...");
      return await this.fallbackWithNominatim(lat, lon);
    }
  }

  /**
   * Resilient fallback using Nominatim search to detect hospitals, stations, and parks
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
          "Zonalyze-Location-Auditor/1.0 (contact: info@zonalyze.local)",
      };

      const [hospRes, clinicRes, nursingRes, stationRes, parkRes] = await Promise.allSettled([
        axios.get(`https://nominatim.openstreetmap.org/search?q=hospital&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3000 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=clinic&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3000 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=nursing+home&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3000 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=station&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3000 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=park&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 3000 }),
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
      if (nursingRes.status === "fulfilled") addHealthcare(nursingRes.value.data, "nursing_home");

      if (stationRes.status === "fulfilled" && Array.isArray(stationRes.value.data)) {
        for (const item of stationRes.value.data) {
          const name = (item.display_name || "").toLowerCase();
          const isMetro = name.includes("metro") || name.includes("subway") || name.includes("line");
          elements.push({
            type: "node",
            id: Number(item.osm_id) || Math.floor(Math.random() * 100000),
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            tags: {
              railway: "station",
              ...(isMetro ? { station: "subway", subway: "yes" } : {}),
              name: item.display_name?.split(",")[0] || "Station",
            },
          });
        }
      }

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

      console.log(`✅ [NOMINATIM FALLBACK] Successfully detected ${elements.length} infrastructure facilities.`);
      return elements;
    } catch (err: any) {
      console.warn("⚠️ Nominatim fallback failed:", err.message);
      return [];
    }
  }
}
