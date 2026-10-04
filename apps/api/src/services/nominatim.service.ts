import axios from "axios";
import { config } from "../config/env.js";
import { NominatimResponse } from "../types/index.js";

export interface ForwardGeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
}

/**
 * Contributor 1: Backend Lead
 * Reverse geocodes coordinates to human-readable address with custom User-Agent,
 * and forward geocodes landmark names to coordinates.
 */
export class NominatimService {
  public static async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const response = await axios.get<NominatimResponse>(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            lat,
            lon,
            format: "jsonv2",
          },
          headers: {
            "User-Agent": config.nominatimUserAgent,
            Accept: "application/json",
          },
          timeout: 5000,
        }
      );

      if (response.data && response.data.display_name) {
        return response.data.display_name;
      }

      return `Coordinate (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    } catch (error) {
      console.warn("⚠️ Nominatim reverse geocode failed, using fallback:", (error as Error).message);
      return `Coordinate (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
  }

  /**
   * Forward geocodes a place name / landmark query into coordinates.
   * Biases results towards the audited location and city context.
   */
  public static async forwardGeocode(
    query: string,
    nearLat?: number,
    nearLon?: number,
    cityHint?: string
  ): Promise<ForwardGeocodeResult | null> {
    try {
      const cleanQuery = query.trim();
      if (!cleanQuery) return null;

      // Helper to execute search request
      const executeSearch = async (searchTerm: string) => {
        const params: any = {
          q: searchTerm,
          format: "jsonv2",
          limit: 1,
        };

        if (nearLat !== undefined && nearLon !== undefined) {
          const delta = 1.0;
          params.viewbox = `${nearLon - delta},${nearLat + delta},${nearLon + delta},${nearLat - delta}`;
        }

        const response = await axios.get<any[]>(
          "https://nominatim.openstreetmap.org/search",
          {
            params,
            headers: {
              "User-Agent": config.nominatimUserAgent,
              Accept: "application/json",
            },
            timeout: 4500,
          }
        );

        if (response.data && response.data.length > 0) {
          const item = response.data[0];
          return {
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            displayName: item.display_name,
          };
        }
        return null;
      };

      // 1. If city hint exists and not already mentioned in query, try searching with city context
      if (cityHint && !cleanQuery.toLowerCase().includes(cityHint.toLowerCase())) {
        const contextualResult = await executeSearch(`${cleanQuery}, ${cityHint}`);
        if (contextualResult) return contextualResult;
      }

      // 2. Search raw query
      return await executeSearch(cleanQuery);
    } catch (error) {
      console.warn("⚠️ Nominatim forward geocode failed:", (error as Error).message);
      return null;
    }
  }
}
