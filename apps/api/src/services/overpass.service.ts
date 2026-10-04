import axios from "axios";
import { config } from "../config/env.js";
import { OverpassResponse, OverpassElement } from "../types/index.js";

/**
 * Contributor 1: Backend Lead
 * Executes a single batch Overpass QL query covering a 3000m radius around (lat, lon).
 */
export class OverpassService {
  private static readonly ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];

  public static async queryInfrastructure(
    lat: number,
    lon: number
  ): Promise<OverpassElement[]> {
    // High-efficiency Overpass QL query:
    // - Scopes acoustic proxy corridors (highways & rail tracks) to 800m (acoustics attenuate to ambient past 400m)
    // - Captures hospitals, healthcare facilities, metro/subway stations, rail stations, pharmacies, and parks
    // - Avoids heavy relation recursion to guarantee sub-10s response and prevent 504 Gateway Timeouts
    const query = `
      [out:json][timeout:10];
      (
        node["amenity"="hospital"](around:3000, ${lat}, ${lon});
        way["amenity"="hospital"](around:3000, ${lat}, ${lon});
        node["healthcare"="hospital"](around:3000, ${lat}, ${lon});
        way["healthcare"="hospital"](around:3000, ${lat}, ${lon});
        node["building"="hospital"](around:3000, ${lat}, ${lon});
        way["building"="hospital"](around:3000, ${lat}, ${lon});
        node["amenity"="pharmacy"](around:1500, ${lat}, ${lon});
        node["railway"="station"](around:3000, ${lat}, ${lon});
        node["railway"="halt"](around:3000, ${lat}, ${lon});
        way["railway"="station"](around:3000, ${lat}, ${lon});
        node["station"="subway"](around:3000, ${lat}, ${lon});
        way["station"="subway"](around:3000, ${lat}, ${lon});
        node["station"="light_rail"](around:3000, ${lat}, ${lon});
        way["station"="light_rail"](around:3000, ${lat}, ${lon});
        way["railway"="rail"](around:800, ${lat}, ${lon});
        way["railway"="subway"](around:800, ${lat}, ${lon});
        way["highway"="motorway"](around:800, ${lat}, ${lon});
        way["highway"="trunk"](around:800, ${lat}, ${lon});
        way["highway"="primary"](around:800, ${lat}, ${lon});
        node["leisure"="park"](around:2000, ${lat}, ${lon});
        way["leisure"="park"](around:2000, ${lat}, ${lon});
      );
      out center 150;
    `;

    for (const endpoint of this.ENDPOINTS) {
      try {
        const response = await axios.post<OverpassResponse>(
          endpoint,
          `data=${encodeURIComponent(query)}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "User-Agent": config.nominatimUserAgent || "Zonalyze-Location-Auditor/1.0 (contact: info@zonalyze.local)",
              Accept: "application/json",
            },
            timeout: 10000,
          }
        );

        if (response.data && Array.isArray(response.data.elements) && response.data.elements.length > 0) {
          return response.data.elements;
        }
      } catch (error) {
        console.warn(`⚠️ Overpass endpoint (${endpoint}) failed:`, (error as Error).message);
      }
    }

    console.warn("⚠️ All Overpass API endpoints busy or failed, activating Nominatim search fallback...");
    return await this.fallbackWithNominatim(lat, lon);
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

      const [hospRes, stationRes, parkRes] = await Promise.allSettled([
        axios.get(`https://nominatim.openstreetmap.org/search?q=hospital&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 6000 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=station&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 6000 }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=park&format=json&limit=10&viewbox=${viewbox}&bounded=1`, { headers, timeout: 6000 }),
      ]);

      const elements: OverpassElement[] = [];

      if (hospRes.status === "fulfilled" && Array.isArray(hospRes.value.data)) {
        for (const item of hospRes.value.data) {
          elements.push({
            type: "node",
            id: Number(item.osm_id) || Math.floor(Math.random() * 100000),
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            tags: { amenity: "hospital", name: item.display_name?.split(",")[0] || "Hospital" },
          });
        }
      }

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
