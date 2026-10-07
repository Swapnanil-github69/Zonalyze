import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

import { cleanAndParseJSON } from "./gemmaService.js";

export {
  cleanAndParseJSON,
  GEMMA_MODEL_NAME,
  UrbanAuditPayload,
  generateGemmaDebrief,
} from "./gemmaService.js";

export interface AIDebriefResult {
  summary: string;
  observations: string[];
  inspectionTargets: string[];
}

type TelemetryRecord = Record<string, unknown>;

function asRecord(value: unknown): TelemetryRecord {
  return typeof value === "object" && value !== null
    ? (value as TelemetryRecord)
    : {};
}

function firstDefined(...values: unknown[]): unknown {
  return values.find((value) => value !== undefined && value !== null);
}

function displayValue(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();
  return "Not provided";
}

function distanceValue(...values: unknown[]): string {
  const value = firstDefined(...values);
  const distance =
    typeof value === "object" && value !== null
      ? firstDefined(asRecord(value).distanceMeters, asRecord(value).distance_meters)
      : value;
  return typeof distance === "number" && Number.isFinite(distance) && distance >= 0
    ? `${distance} m`
    : "Not provided";
}

function getMetrics(payload: {
  address: any;
  environment: any;
  noise: any;
  facilities: any;
  livabilityScore: number;
}): Record<string, string> {
  const address = payload.address;
  const addressRecord = asRecord(address);
  const environment = asRecord(payload.environment);
  const noise = asRecord(payload.noise);
  const facilities = asRecord(payload.facilities);
  const infrastructure = asRecord(facilities.infrastructure);

  return {
    displayName: displayValue(
      typeof address === "string"
        ? address
        : firstDefined(
            addressRecord.displayName,
            addressRecord.display_name,
            addressRecord.name,
            addressRecord.address
          )
    ),
    livabilityScore: displayValue(payload.livabilityScore),
    pm25: displayValue(firstDefined(environment.pm2_5, environment.pm25)),
    currentTemperature: displayValue(
      firstDefined(
        environment.currentTemp,
        environment.current_temperature,
        environment.temperature
      )
    ),
    noiseBracket: displayValue(firstDefined(noise.bracket, noise.estimated_bracket)),
    nearestNoiseSource: displayValue(
      firstDefined(noise.nearestSource, noise.nearest_source_type)
    ),
    metroDistance: distanceValue(
      facilities.metro,
      facilities.nearest_metro_dist_m,
      infrastructure.nearest_metro_dist_m
    ),
    busStopDistance: distanceValue(
      facilities.busStop,
      facilities.bus_stop,
      facilities.nearest_bus_stop_dist_m,
      infrastructure.nearest_bus_stop_dist_m
    ),
    autoStandDistance: distanceValue(
      facilities.autoStand,
      facilities.auto_stand,
      facilities.nearest_auto_stand_dist_m,
      infrastructure.nearest_auto_stand_dist_m
    ),
    railwayDistance: distanceValue(
      facilities.railway,
      facilities.nearest_railway_dist_m,
      infrastructure.nearest_railway_dist_m
    ),
    airportDistance: distanceValue(
      facilities.airport,
      facilities.nearest_airport_dist_m,
      infrastructure.nearest_airport_dist_m
    ),
    hospitalDistance: distanceValue(
      facilities.hospital,
      facilities.nearest_hospital_dist_m,
      infrastructure.nearest_hospital_dist_m
    ),
  };
}

function createFallback(metrics: Record<string, string>): AIDebriefResult {
  const transit =
    `Metro ${metrics.metroDistance}; bus stop ${metrics.busStopDistance}; auto stand ${metrics.autoStandDistance}.`;
  const hospital = `Nearest hospital distance: ${metrics.hospitalDistance}.`;

  return {
    summary: `The supplied telemetry reports a livability score of ${metrics.livabilityScore}/10 for ${metrics.displayName}. PM2.5 is ${metrics.pm25} µg/m³, current temperature is ${metrics.currentTemperature} °C, and the recorded noise bracket is ${metrics.noiseBracket} (${metrics.nearestNoiseSource}); transit and hospital distances are ${transit} ${hospital}`,
    observations: [
      `Display name: ${metrics.displayName}; livability score: ${metrics.livabilityScore}/10.`,
      `PM2.5: ${metrics.pm25} µg/m³; current temperature: ${metrics.currentTemperature} °C.`,
      `Noise bracket: ${metrics.noiseBracket}; nearest noise source: ${metrics.nearestNoiseSource}.`,
      `${transit} ${hospital}`,
    ],
    inspectionTargets: [
      "Check window and wall sound insulation from inside the property.",
      "Observe traffic volume and audible noise at both peak and off-peak times.",
      "Inspect the access route and property for signs of waterlogging after rainfall.",
    ],
  };
}

function parseDebrief(text: string | undefined): AIDebriefResult | null {
  if (!text) return null;
  try {
    const parsed = cleanAndParseJSON<unknown>(text, null);
    if (!parsed) return null;

    const result = asRecord(parsed);
    if (
      typeof result.summary === "string" &&
      Array.isArray(result.observations) &&
      result.observations.length >= 3 &&
      result.observations.every((item) => typeof item === "string") &&
      Array.isArray(result.inspectionTargets) &&
      result.inspectionTargets.length >= 3 &&
      result.inspectionTargets.every((item) => typeof item === "string")
    ) {
      return {
        summary: result.summary,
        observations: result.observations.slice(0, 4),
        inspectionTargets: result.inspectionTargets.slice(0, 3),
      };
    }
  } catch {
    return null;
  }
  return null;
}

export async function generateAIDebrief(payload: {
  address: any;
  environment: any;
  noise: any;
  facilities: any;
  livabilityScore: number;
}): Promise<AIDebriefResult> {
  const metrics = getMetrics(payload);
  const fallback = createFallback(metrics);
  const prompt = `Act as a certified urban livability inspector writing an evidence-based site report.

Use only the exact telemetry payload below. Do not hallucinate, infer, estimate, or speculate about amenities, conditions, or statistics not explicitly present. "Not provided" means the metric is unavailable and must not be treated as a measured value.

TELEMETRY:
${JSON.stringify(metrics, null, 2)}

Return JSON only, matching this exact schema:
{
  "summary": "2 concise sentences balancing connectivity against environmental risks",
  "observations": ["3 to 4 direct, factual bullet points highlighting key empirical findings"],
  "inspectionTargets": ["3 concrete, physical checks for a buyer/renter to verify in person (e.g. sound insulation, waterlogging, peak traffic)"]
}

Use the display name, livability score, PM2.5, current temperature, noise bracket and nearest noise source, transit distances, and hospital distance as provided. Do not add fields. Inspection targets must be framed only as checks to perform, never as claims about conditions already present.`;

  const models = [
    process.env.GEMMA_MODEL || "gemma-4-26b-a4b-it",
    "gemma-4-31b-it",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
  ];

  for (const model of models) {
    try {
      const isGemma = model.startsWith("gemma-");
      const config: any = isGemma
        ? {
            temperature: 0.3,
            maxOutputTokens: 2048,
          }
        : {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                observations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                inspectionTargets: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["summary", "observations", "inspectionTargets"],
            },
          };

      const generatePromise = ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config,
      });

      // Cap AI debrief to 4 seconds max so user is never blocked
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000));
      const response = await Promise.race([generatePromise, timeoutPromise]);
      if (!response) {
        console.warn(`Model ${model} debrief timed out after 4s, proceeding to fallback...`);
        break;
      }

      const extractedText =
        response.text ||
        response.candidates?.[0]?.content?.parts?.find((p: any) => !p.thought && p.text)?.text ||
        response.candidates?.[0]?.content?.parts?.slice(-1)[0]?.text;

      const parsed = parseDebrief(extractedText);
      if (parsed) return parsed;
    } catch (error: any) {
      console.warn(`Model ${model} debrief failed: ${error?.message || error}, trying next candidate...`);
    }
  }

  return fallback;
}
