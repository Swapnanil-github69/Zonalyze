import axios from "axios";
import { OpenMeteoAirQualityData } from "../types/index.js";

/**
 * Contributor 1: Backend Lead
 * Fetches real-time European AQI, PM2.5, PM10, and 72-hour historical trend from Open-Meteo Air Quality API.
 */
export class OpenMeteoService {
  public static async fetchAirQuality(
    lat: number,
    lon: number
  ): Promise<OpenMeteoAirQualityData> {
    try {
      const response = await axios.get("https://air-quality-api.open-meteo.com/v1/air-quality", {
        params: {
          latitude: lat,
          longitude: lon,
          current: "european_aqi,pm10,pm2_5",
          hourly: "pm2_5",
          past_days: 3,
        },
        timeout: 6000,
      });

      const current = response.data?.current || {};
      const hourly = response.data?.hourly?.pm2_5 || [];

      // Extract the last 72 readings (or whatever available)
      const historical_pm25: number[] = Array.isArray(hourly)
        ? hourly.slice(-72).map((val: number | null) => (val !== null ? Math.round(val * 10) / 10 : 0))
        : [];

      return {
        aqi: current.european_aqi ?? 0,
        pm2_5: current.pm2_5 ? Math.round(current.pm2_5 * 10) / 10 : 0,
        pm10: current.pm10 ? Math.round(current.pm10 * 10) / 10 : 0,
        historical_pm25,
      };
    } catch (error) {
      console.warn("⚠️ Open-Meteo Air Quality fetch failed, returning default baseline:", (error as Error).message);
      return {
        aqi: 0,
        pm2_5: 0,
        pm10: 0,
        historical_pm25: [],
      };
    }
  }
}
