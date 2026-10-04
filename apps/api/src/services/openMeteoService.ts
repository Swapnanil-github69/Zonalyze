import axios from "axios";

export interface AtmosphereData {
  aqi: number;
  aqiStatus: "Good" | "Fair" | "Moderate" | "Poor" | "Very Poor";
  pm2_5: number;
  pm10: number;
  currentTemp: number;
  avgTempLastWeek: number;
  historicalPm25: number[];
  historicalTemp?: number[];
}

function getAqiStatus(aqi: number): AtmosphereData["aqiStatus"] {
  if (aqi <= 20) return "Good";
  if (aqi <= 40) return "Fair";
  if (aqi <= 60) return "Moderate";
  if (aqi <= 80) return "Poor";
  return "Very Poor";
}

/**
 * Fetches live atmospheric and weather data from Open-Meteo's open endpoints.
 *
 * @param lat Latitude of the target coordinate
 * @param lon Longitude of the target coordinate
 * @returns Parsed AtmosphereData with AQI status, current temperatures, and historical trends.
 */
export async function fetchAtmosphere(lat: number, lon: number): Promise<AtmosphereData> {
  const fallback: AtmosphereData = {
    aqi: 50,
    aqiStatus: "Moderate",
    pm2_5: 35,
    pm10: 60,
    currentTemp: 28,
    avgTempLastWeek: 27,
    historicalPm25: [],
  };

  try {
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,pm10&hourly=pm2_5&past_days=3`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&hourly=temperature_2m&daily=temperature_2m_mean&past_days=7`;

    const [airQualityRes, weatherRes] = await Promise.all([
      axios.get(airQualityUrl, { timeout: 6000 }),
      axios.get(weatherUrl, { timeout: 6000 }),
    ]);

    const airData = airQualityRes.data || {};
    const weatherData = weatherRes.data || {};

    const aqi =
      typeof airData.current?.european_aqi === "number"
        ? airData.current.european_aqi
        : fallback.aqi;
    const aqiStatus = getAqiStatus(aqi);

    const pm2_5 =
      typeof airData.current?.pm2_5 === "number"
        ? Math.round(airData.current.pm2_5 * 10) / 10
        : fallback.pm2_5;

    const pm10 =
      typeof airData.current?.pm10 === "number"
        ? Math.round(airData.current.pm10 * 10) / 10
        : fallback.pm10;

    const currentTemp =
      typeof weatherData.current?.temperature_2m === "number"
        ? Math.round(weatherData.current.temperature_2m * 10) / 10
        : fallback.currentTemp;

    // Slice hourly.pm2_5 to the latest 72 elements
    const hourlyRaw = airData.hourly?.pm2_5;
    const historicalPm25: number[] = Array.isArray(hourlyRaw)
      ? hourlyRaw
          .slice(-72)
          .map((val: number | null) =>
            typeof val === "number" && !isNaN(val) ? Math.round(val * 10) / 10 : 0
          )
      : fallback.historicalPm25;

    // Compute avgTempLastWeek as arithmetic mean of daily.temperature_2m_mean rounded to 1 decimal place
    const dailyMeans = weatherData.daily?.temperature_2m_mean;
    let avgTempLastWeek = fallback.avgTempLastWeek;
    if (Array.isArray(dailyMeans)) {
      const validTemps: number[] = dailyMeans.filter(
        (val): val is number => typeof val === "number" && !isNaN(val)
      );
      if (validTemps.length > 0) {
        const sum = validTemps.reduce((acc, curr) => acc + curr, 0);
        avgTempLastWeek = Math.round((sum / validTemps.length) * 10) / 10;
      }
    }

    // Slice hourly.temperature_2m to the latest 72 elements
    const hourlyTempRaw = weatherData.hourly?.temperature_2m;
    const historicalTemp: number[] = Array.isArray(hourlyTempRaw)
      ? hourlyTempRaw
          .slice(-72)
          .map((val: number | null) =>
            typeof val === "number" && !isNaN(val) ? Math.round(val * 10) / 10 : 0
          )
      : [];

    return {
      aqi,
      aqiStatus,
      pm2_5,
      pm10,
      currentTemp,
      avgTempLastWeek,
      historicalPm25,
      historicalTemp,
    };
  } catch (error) {
    console.error("Open-Meteo atmospheric data fetch failed:", error);
    return fallback;
  }
}
