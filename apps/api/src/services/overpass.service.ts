import axios from "axios";
import { OverpassResponse, OverpassElement } from "../types/index.js";

/**
 * Contributor 1: Backend Lead
 * Executes a single batch Overpass QL query covering a 3000m radius around (lat, lon).
 */
export class OverpassService {
  public static async queryInfrastructure(
    lat: number,
    lon: number
  ): Promise<OverpassElement[]> {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:3000, ${lat}, ${lon});
        way["amenity"="hospital"](around:3000, ${lat}, ${lon});
        node["amenity"="pharmacy"](around:3000, ${lat}, ${lon});
        node["railway"~"station|halt"](around:3000, ${lat}, ${lon});
        way["railway"~"rail|subway|light_rail"](around:3000, ${lat}, ${lon});
        way["highway"~"motorway|trunk|primary"](around:3000, ${lat}, ${lon});
        node["leisure"="park"](around:3000, ${lat}, ${lon});
        way["leisure"="park"](around:3000, ${lat}, ${lon});
      );
      out center 120;
    `;

    try {
      const response = await axios.post<OverpassResponse>(
        "https://overpass-api.de/api/interpreter",
        `data=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          timeout: 25000,
        }
      );

      return response.data?.elements || [];
    } catch (error) {
      console.warn("⚠️ Overpass API batch query failed or timed out:", (error as Error).message);
      return [];
    }
  }
}
