import { GoogleGenAI, Type } from "@google/genai";
import { config } from "../config/env.js";
import { AiDebrief } from "../types/index.js";

/**
 * Contributor 1: Backend Lead
 * Google Gemini Forensic Debrief Synthesis:
 * Strictly inspects verified JSON telemetry and outputs structured forensic observations and site inspection targets.
 * NEVER hallucinates data or calculates subjective vanity scores.
 */
export class GeminiService {
  private static ai: GoogleGenAI | null = null;

  private static getClient(): GoogleGenAI | null {
    if (!this.ai && config.geminiApiKey) {
      this.ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    }
    return this.ai;
  }

  public static async generateDebrief(verifiedTelemetry: {
    address: string;
    coordinates: [number, number];
    environment: {
      pm2_5: number;
      pm10: number;
      aqi: number;
      historical_pm25: number[];
    };
    infrastructure: {
      hospitals: number;
      pharmacies: number;
      railway_stations: number;
      parks: number;
      nearest_hospital_dist_m: number | null;
    };
    noiseProfile: {
      estimated_bracket: string;
      nearest_source_type: string;
      distance_meters: number | null;
      confidence: string;
    };
  }): Promise<AiDebrief> {
    const client = this.getClient();

    if (!client) {
      console.warn("⚠️ GEMINI_API_KEY not configured. Generating deterministic fallback debrief.");
      return this.generateDeterministicFallback(verifiedTelemetry);
    }

    try {
      const systemInstruction = `
You are a licensed environmental and infrastructure risk forensic auditor. 
You inspect verified telemetry data for a coordinate. 
RULES:
1. NEVER invent facts, distances, or air quality indices.
2. NEVER generate subjective livability scores (e.g., "78/100").
3. Report only verifiable empirical observations based directly on the provided JSON data.
4. Formulate targeted, practical physical site-inspection targets for an investigator visiting the property (e.g. checking facade soundproofing, HVAC intake filtration, storm runoff drainage, sidewalk continuity).
5. Always output strictly valid JSON adhering to the specified schema.
`;

      const prompt = `
Please audit the following verified location telemetry data:
${JSON.stringify(verifiedTelemetry, null, 2)}
`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "Executive 1-2 sentence forensic summary of environmental and transit reality.",
              },
              empirical_observations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 to 4 direct, verifiable facts derived strictly from the telemetry.",
              },
              site_inspection_targets: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 to 4 actionable physical verification items for an investigator on site.",
              },
            },
            required: ["summary", "empirical_observations", "site_inspection_targets"],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text) as AiDebrief;
        return parsed;
      }

      return this.generateDeterministicFallback(verifiedTelemetry);
    } catch (error) {
      console.error("⚠️ Gemini synthesis failed, using deterministic debrief:", (error as Error).message);
      return this.generateDeterministicFallback(verifiedTelemetry);
    }
  }

  private static generateDeterministicFallback(telemetry: any): AiDebrief {
    const observations: string[] = [];
    const inspections: string[] = [];

    // Air quality analysis
    if (telemetry.environment.pm2_5 > 35) {
      observations.push(
        `PM2.5 particulate concentration is elevated at ${telemetry.environment.pm2_5} µg/m³ (European AQI: ${telemetry.environment.aqi}).`
      );
      inspections.push("Verify building air filtration specifications (MERV 13+ or HEPA) and window seals.");
    } else {
      observations.push(
        `PM2.5 particulate reading is within moderate baseline limits at ${telemetry.environment.pm2_5} µg/m³.`
      );
    }

    // Infrastructure analysis
    if (telemetry.infrastructure.nearest_hospital_dist_m !== null) {
      observations.push(
        `Nearest medical emergency facility detected at ${telemetry.infrastructure.nearest_hospital_dist_m}m.`
      );
    } else {
      observations.push("No emergency hospital facility identified within standard 3000m radius.");
      inspections.push("Identify primary emergency transit and ambulance corridors for medical access.");
    }

    // Noise analysis
    if (telemetry.noiseProfile.estimated_bracket === "Elevated") {
      observations.push(
        `Elevated acoustic proxy level identified from nearest ${telemetry.noiseProfile.nearest_source_type} at ${telemetry.noiseProfile.distance_meters}m.`
      );
      inspections.push("Test ambient interior noise levels during peak morning/evening traffic or transit hours.");
    } else {
      observations.push(`Acoustic noise environment evaluated as ${telemetry.noiseProfile.estimated_bracket}.`);
      inspections.push("Verify localized neighborhood noise sources such as HVAC units or secondary access lanes.");
    }

    return {
      summary: `Location audit for ${telemetry.address.split(",")[0] || "coordinate"} indicates ${telemetry.noiseProfile.estimated_bracket.toLowerCase()} acoustic exposure with current PM2.5 at ${telemetry.environment.pm2_5} µg/m³.`,
      empirical_observations: observations,
      site_inspection_targets: inspections,
    };
  }
}
