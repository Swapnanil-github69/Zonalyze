import axios from "axios";
import { config } from "../config/env.js";
import { NominatimResponse } from "../types/index.js";

/**
 * Contributor 1: Backend Lead
 * Reverse geocodes coordinates to human-readable address with custom User-Agent.
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
}
