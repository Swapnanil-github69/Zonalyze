import { GoogleGenAI, Type } from "@google/genai";
import { config } from "../config/env.js";
import { AiDebrief } from "../types/index.js";
import { calculateHaversineMeters } from "../utils/geoUtils.js";
import { NominatimService } from "./nominatim.service.js";

const apiKey = process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY || "";
const gemmaAi = new GoogleGenAI({ apiKey });

export const GEMMA_MODEL_NAME = process.env.GEMMA_MODEL || "gemma-4-26b-a4b-it";

export interface UrbanAuditPayload {
  address?: { displayName?: string; suburb?: string; city?: string; state?: string };
  coordinates?: [number, number];
  facilities?: {
    metro?: { name: string; distanceMeters: number } | null;
    railway?: { name: string; distanceMeters: number } | null;
    busStop?: { name: string; distanceMeters: number } | null;
    airport?: { name: string; distanceMeters: number } | null;
    hospital?: { name: string; distanceMeters: number } | null;
  };
}

/**
 * Generates an automated forensic urban intelligence debrief using Gemma 4.
 */
export async function generateGemmaDebrief(context: UrbanAuditPayload): Promise<string> {
  const metroText = context.facilities?.metro
    ? `${context.facilities.metro.name} (${context.facilities.metro.distanceMeters}m)`
    : "None within 3 km envelope";
  const railText = context.facilities?.railway
    ? `${context.facilities.railway.name} (${context.facilities.railway.distanceMeters}m)`
    : "None within 3 km envelope";
  const busText = context.facilities?.busStop
    ? `${context.facilities.busStop.name} (${context.facilities.busStop.distanceMeters}m)`
    : "None detected nearby";
  const airportText = context.facilities?.airport
    ? `${context.facilities.airport.name} (${context.facilities.airport.distanceMeters}m)`
    : "None within 100 km";

  const prompt = `
[SYSTEM DIRECTIVE: URBAN INTELLIGENCE AGENT (GEMMA 4)]
You are the Zonalyze Urban Intelligence Engine powered exclusively by Gemma 4.
Analyze the following audited location telemetry:

- Locality: ${context.address?.displayName || "Target Area"}
- Coordinates: [Lat: ${context.coordinates?.[1]}, Lon: ${context.coordinates?.[0]}]
- Rapid Transit (Metro): ${metroText}
- Heavy Rail (Indian Railways): ${railText}
- Nearest Bus Stop: ${busText}
- Nearest Commercial Airport: ${airportText}

INSTRUCTIONS:
1. Provide a sharp, 3-paragraph urban mobility & livability debrief.
2. In paragraph 1, directly assess the immediate transit accessibility (Metro vs Rail vs Bus).
3. In paragraph 2, evaluate regional connectivity, freight/highway proximity, and airport access.
4. In paragraph 3, highlight any mobility bottlenecks or urban advantages.
5. Format in clean Markdown without conversational greetings.
`;

  try {
    const response = await gemmaAi.models.generateContent({
      model: GEMMA_MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.6,
        maxOutputTokens: 700,
      },
    });

    const replyText =
      response.text ||
      response.candidates?.[0]?.content?.parts?.find((p: any) => !p.thought && p.text)?.text ||
      response.candidates?.[0]?.content?.parts?.slice(-1)[0]?.text;

    return replyText || response.text || "Urban audit completed. Telemetry mapped successfully.";
  } catch (error: any) {
    console.error("[GemmaService] Debrief generation error:", error);
    return "Automated Gemma 4 debrief temporarily unavailable. Proximity telemetry remains fully active.";
  }
}

const CANDIDATE_MODELS = [
  "gemma-2-9b-it",
  "gemma-4-26b-a4b-it",
  "gemini-2.5-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-flash-latest",
];

/**
 * Contributor 1: Backend Lead
 * Google Gemini Forensic Debrief Synthesis & Intelligent Location Assistant:
 * Uses multi-model failover to guarantee high availability across rate limits.
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
      temperature?: number;
      temperature_7d_avg?: number;
    };
    infrastructure: {
      hospitals: number;
      pharmacies: number;
      railway_stations: number;
      metro_stations?: number;
      parks: number;
      nearest_hospital_dist_m: number | null;
      nearest_railway_dist_m?: number | null;
      nearest_metro_dist_m?: number | null;
      nearest_arterial_dist_m?: number | null;
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
      return this.generateDeterministicFallback(verifiedTelemetry);
    }

    const prompt = `
You are the Zonalyze Civic & Environmental Risk AI Forensic Engine.
Analyze the following VERIFIED telemetry data for an urban location audit:

LOCATION AUDITED:
Address: ${verifiedTelemetry.address}
Coordinates: [${verifiedTelemetry.coordinates.join(", ")}]

VERIFIED TELEMETRY INPUT:
${JSON.stringify(verifiedTelemetry, null, 2)}

INSTRUCTIONS:
1. "summary": Provide a factual executive summary (maximum 2-3 sentences) synthesizing the ambient live telemetry.
2. "insights_in_brief": Generate four concise 1-sentence takeaways for:
   - "transit": Rapid transit/railway station proximity and multi-modal mobility.
   - "healthcare": Hospital accessibility and nearest emergency facility distance.
   - "environment": European AQI status and PM2.5/PM10 concentration level.
   - "acoustic": Decibel exposure bracket and nearest noise source/arterial corridor.
3. "empirical_observations": Generate 3 to 4 rigorous, verifiable statements strictly based on the telemetry numbers.
4. "site_inspection_targets": Generate 3 to 4 physical, actionable checklist targets for a prospective buyer/tenant/investigator inspecting this site in person.
5. STRICT CONSTRAINTS:
   - Ground observations in the provided metrics.
`;

    for (const model of CANDIDATE_MODELS) {
      try {
        const isGemma = model.startsWith("gemma-");
        const config: any = isGemma
          ? {
              temperature: 0.3,
              maxOutputTokens: 1000,
            }
          : {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  summary: {
                    type: Type.STRING,
                    description: "Executive 2-3 sentence forensic synthesis of the location's livability metrics.",
                  },
                  insights_in_brief: {
                    type: Type.OBJECT,
                    properties: {
                      transit: {
                        type: Type.STRING,
                        description: "Concise 1-sentence insight on rapid transit/rail proximity.",
                      },
                      healthcare: {
                        type: Type.STRING,
                        description: "Concise 1-sentence insight on hospital count and emergency access distance.",
                      },
                      environment: {
                        type: Type.STRING,
                        description: "Concise 1-sentence insight on air quality index and PM2.5 exposure.",
                      },
                      acoustic: {
                        type: Type.STRING,
                        description: "Concise 1-sentence insight on noise bracket, highway/road proximity, and sound profile.",
                      },
                    },
                    required: ["transit", "healthcare", "environment", "acoustic"],
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
                required: ["summary", "insights_in_brief", "empirical_observations", "site_inspection_targets"],
              },
            };

        const response = await client.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config,
        });

        const rawText =
          response.text ||
          response.candidates?.[0]?.content?.parts?.find((p: any) => !p.thought && p.text)?.text ||
          response.candidates?.[0]?.content?.parts?.slice(-1)[0]?.text;

        if (rawText) {
          let cleanText = rawText.trim();
          if (cleanText.includes("```json")) {
            cleanText = cleanText.split("```json")[1].split("```")[0].trim();
          } else if (cleanText.includes("```")) {
            cleanText = cleanText.split("```")[1].split("```")[0].trim();
          } else {
            const firstBrace = cleanText.indexOf("{");
            const lastBrace = cleanText.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              cleanText = cleanText.substring(firstBrace, lastBrace + 1);
            }
          }
          const parsed = JSON.parse(cleanText) as AiDebrief;
          if (parsed && parsed.summary && parsed.empirical_observations) {
            return parsed;
          }
        }
      } catch (error: any) {
        console.warn(`⚠️ Model ${model} debrief failed (${error.status || error.message?.substring(0, 60)}), evaluating failover...`);
        // If quota exceeded or forbidden, trying other models with the same API key will fail; break immediately
        if (
          error.status === 429 ||
          error.status === 403 ||
          error.message?.includes("429") ||
          error.message?.includes("quota") ||
          error.message?.includes("ResourceExhausted")
        ) {
          console.warn("⚡ [GEMINI FAST-FAIL] Quota/rate-limit reached, switching instantly to deterministic synthesis engine.");
          break;
        }
      }
    }

    return this.generateDeterministicFallback(verifiedTelemetry);
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

    // Transit analysis
    const metroDist = telemetry.infrastructure.nearest_metro_dist_m;
    const railDist = telemetry.infrastructure.nearest_railway_dist_m;
    const metroCount = telemetry.infrastructure.metro_stations ?? 0;
    if (metroDist !== null && metroDist !== undefined) {
      observations.push(
        `Direct rapid transit access detected with nearest metro station at ${metroDist}m (${metroCount} stations within operational radius).`
      );
      inspections.push("Audit pedestrian sidewalk continuity and crosswalk safety along route to the nearest metro station.");
    } else if (railDist !== null && railDist !== undefined) {
      observations.push(`Rail transit node identified at ${railDist}m distance.`);
      inspections.push("Inspect pedestrian connectivity to nearest rail platform.");
    } else {
      observations.push("No passenger rail or metro station identified within immediate 800m corridor.");
    }

    // Infrastructure analysis
    if (telemetry.infrastructure.nearest_hospital_dist_m !== null) {
      observations.push(
        `Nearest medical emergency facility detected at ${telemetry.infrastructure.nearest_hospital_dist_m}m with ${telemetry.infrastructure.hospitals} hospitals in the surrounding district.`
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
      inspections.push("Conduct on-site acoustic measurement during peak evening traffic hours.");
    } else {
      observations.push(`Acoustic environment categorized as ${telemetry.noiseProfile.estimated_bracket}.`);
    }

    const transitBrief = metroDist
      ? `Metro station located at ${metroDist}m (${metroCount} stations accessible).`
      : railDist
      ? `Passenger rail platform accessible at ${railDist}m.`
      : "Multi-modal transit options located outside immediate walking radius.";

    const healthcareBrief = telemetry.infrastructure.nearest_hospital_dist_m
      ? `Emergency facility located ${telemetry.infrastructure.nearest_hospital_dist_m}m away (${telemetry.infrastructure.hospitals} hospitals in zone).`
      : "Emergency medical infrastructure outside immediate radius.";

    const envBrief = `AQI ${telemetry.environment.aqi} (PM2.5: ${telemetry.environment.pm2_5} µg/m³).`;

    const noiseBrief = `${telemetry.noiseProfile.estimated_bracket} exposure${
      telemetry.noiseProfile.distance_meters ? ` (${telemetry.noiseProfile.distance_meters}m from ${telemetry.noiseProfile.nearest_source_type})` : ""
    }.`;

    return {
      summary: `Location audit for ${telemetry.address.split(",")[0] || "coordinate"} reveals ${telemetry.noiseProfile.estimated_bracket.toLowerCase()} acoustic exposure with current PM2.5 at ${telemetry.environment.pm2_5} µg/m³. Nearest healthcare facility is situated at ${telemetry.infrastructure.nearest_hospital_dist_m ?? "N/A"}m with rapid transit access ${metroDist ? `at ${metroDist}m` : "nearby"}.`,
      insights_in_brief: {
        transit: transitBrief,
        healthcare: healthcareBrief,
        environment: envBrief,
        acoustic: noiseBrief,
      },
      empirical_observations: observations,
      site_inspection_targets: inspections,
    };
  }

  /**
   * Conversational Assistant: Answers user questions about the audited location.
   * Leverages multi-model failover to guarantee answers across rate limits.
   */
  public static async answerLocationQuery({
    question,
    investigation,
    chatHistory = [],
    preferredLanguage = "Auto",
  }: {
    question: string;
    investigation: any;
    chatHistory?: Array<{ role: "user" | "model"; text: string }>;
    preferredLanguage?: string;
  }): Promise<string> {
    const address = investigation.address || "Target location";
    const coords = investigation.location?.coordinates || [];
    const env = investigation.environment || {};
    const infra = investigation.infrastructure || {};
    const noise = investigation.noiseProfile || {};
    const summary = investigation.aiReport?.summary || "";

    // 1. Detect if the user is asking for distance to a destination or landmark
    const landmarkMatch = question.match(
      /(?:distance(?:\s+is(?:\s+the\s+distance)?)?(?:\s+from\s+(?:here|this\s+location))?\s+to\s+|how\s+far\s+(?:is|to)\s+(?:the\s+)?|how\s+close\s+is\s+(?:the\s+)?|distance\s+between\s+(?:here|this\s+location)\s+and\s+|distance\s+to\s+|how\s+much\s+distance\s+to\s+|what\s+is\s+the\s+distance\s+to\s+|distance\s+from\s+here\s+to\s+|nearest\s+|where\s+is\s+(?:the\s+)?)([^?.,!]+)/i
    );

    let supplementalGeoDistance = "";
    let distInfo: { meters: number; km: string; drivingKm: string; name: string } | null = null;
    const targetPlace = landmarkMatch?.[1]
      ?.replace(/\b(?:from\s+here|from\s+this\s+location|from\s+now)\b/gi, "")
      .trim();

    // Check if targetPlace is a generic inquiry for the nearest hospital/clinic
    const isGenericHospitalQuery =
      targetPlace &&
      /^(?:the\s+)?(?:nearest\s+)?(?:hospital|clinic|nursing\s*home|doctor|medical\s*facility|medical\s*center)$/i.test(
        targetPlace.trim()
      );

    if (isGenericHospitalQuery && infra.nearest_hospital_name) {
      const distM = infra.nearest_hospital_dist_m ?? 50;
      const distKm = (distM / 1000).toFixed(2);
      const drivingKm = ((distM * 1.3) / 1000).toFixed(1);
      distInfo = {
        meters: distM,
        km: distKm,
        drivingKm,
        name: infra.nearest_hospital_name,
      };
      supplementalGeoDistance = `
SUPPLEMENTAL EXACT GEODETIC TELEMETRY:
- Queried Destination: "${infra.nearest_hospital_name}" (Nearest Verified Healthcare Node)
- Distance from Location: ${distM} meters (~${distKm} km)
- Estimated Walking Time: ~${Math.max(1, Math.round(distM / 75))} minutes
`;
    } else if (targetPlace && coords.length === 2) {
      // Extract city hint from address (e.g. "Park Street, Kolkata, West Bengal, India" -> "Kolkata")
      const addressTokens = address.split(",").map((s: string) => s.trim()).filter(Boolean);
      const cityHint = addressTokens.length >= 3 ? addressTokens[1] : (addressTokens[0] || "");

      const originLon = coords[0];
      const originLat = coords[1];
      try {
        const geoResult = await NominatimService.forwardGeocode(targetPlace, originLat, originLon, cityHint);
        if (geoResult) {
          const distMeters = calculateHaversineMeters(originLat, originLon, geoResult.lat, geoResult.lon);
          const isFar = distMeters > 150000;
          const userSpecifiedFar = targetPlace.includes(",") || (cityHint && targetPlace.toLowerCase().includes(cityHint.toLowerCase()));

          if (!isFar || userSpecifiedFar) {
            const distKm = (distMeters / 1000).toFixed(2);
            const drivingKm = ((distMeters * 1.3) / 1000).toFixed(1);
            distInfo = {
              meters: distMeters,
              km: distKm,
              drivingKm,
              name: geoResult.displayName,
            };
            supplementalGeoDistance = `
SUPPLEMENTAL EXACT GEODETIC TELEMETRY:
- Queried Destination: "${targetPlace}" (${geoResult.displayName})
- Destination Coordinates: [Latitude: ${geoResult.lat}, Longitude: ${geoResult.lon}]
- Great-Circle Straight-Line Distance: ${distKm} km (${distMeters.toLocaleString()} meters)
- Estimated Driving / Commute Road Distance: ~${drivingKm} km
`;
          }
        }
      } catch (geoErr) {
        console.warn("Could not geocode landmark query:", geoErr);
      }
    }

    const client = this.getClient();

    if (!client) {
      return this.generateLocalChatFallback(question, investigation, targetPlace, distInfo);
    }

    const originLat = coords[1] ?? "N/A";
    const originLon = coords[0] ?? "N/A";

    const nearbyHospSummary =
      Array.isArray(infra.nearby_hospitals) && infra.nearby_hospitals.length > 0
        ? infra.nearby_hospitals
            .slice(0, 5)
            .map((h: any) => `${h.name} (${h.distance}m, ${h.type || "healthcare"})`)
            .join("; ")
        : "";

    const systemInstruction = `
You are Zonalyze's Advanced Location & Civic Intelligence Advisor.
You are conversing with an investigator, prospective homebuyer, tenant, or citizen auditing this location:
Address: ${address}
Coordinates: [Latitude: ${originLat}, Longitude: ${originLon}]

VERIFIED SENSOR & SATELLITE TELEMETRY (Immediate perimeter envelope):
- Atmospheric Health: AQI ${env.aqi ?? "N/A"}, PM2.5: ${env.pm2_5 ?? "N/A"} µg/m³, PM10: ${env.pm10 ?? "N/A"} µg/m³.
- Healthcare Facilities: ${infra.hospitals ?? 0} healthcare facilities/hospitals in immediate cluster.
  * Nearest Facility: "${infra.nearest_hospital_name || 'Nearest Local Medical Facility'}" located ${infra.nearest_hospital_dist_m ?? "outside immediate 3000m radius"}m from audited coordinates.
${nearbyHospSummary ? `  * Top Detected Healthcare Options in Sector: ${nearbyHospSummary}` : ""}
- Multi-Modal Transit: ${infra.metro_stations ?? 0} metro stations (Nearest metro: "${infra.nearest_metro_name || 'Metro'}" at ${infra.nearest_metro_dist_m ?? "outside immediate 3000m radius"}m), ${infra.railway_stations ?? 0} rail platforms (Nearest rail: "${infra.nearest_railway_name || 'Station'}" at ${infra.nearest_railway_dist_m ?? "outside immediate radius"}m).
- Parks & Greenery: ${infra.parks ?? 0} parks in radial envelope.
- Acoustic Decibel Proxy: ${noise.estimated_bracket ?? "Ambient"} bracket (${noise.distance_meters ? `${noise.distance_meters}m from ${noise.nearest_source_type}` : "no primary arterial highway corridor within 500m"}). Confidence: ${noise.confidence ?? "Verified"}.
- Executive Debrief Summary: ${summary}
${supplementalGeoDistance}

USER QUERY FREEDOM & CAPABILITIES:
The user is completely free to ask ANY question regarding this location, neighborhood, city, or property:
1. DISTANCE & COMMUTE: Distances to ANY commercial store, restaurant, brand outlet (e.g. KFC, McDonald's, Starbucks, grocery), landmark, monument, airport, railway terminal, business district, or point of interest. If supplemental geodetic telemetry is provided above, quote that exact distance. Otherwise, use your pre-trained geographic knowledge of this city/district and the coordinates [Latitude: ${originLat}, Longitude: ${originLon}] to estimate distance, nearest branch/outlet location, and commute or delivery time.
2. SAFETY & COMMUNITY: Walkability at night, neighborhood security, traffic density, and street environment.
3. CONVENIENCE & AMENITIES: Schools, colleges, supermarkets, grocery markets, healthcare access, and dining options.
4. CIVIC & CLIMATE RESILIENCE: Air quality, noise exposure, monsoon drainage/waterlogging tendencies, and infrastructure quality.
5. ADVICE & DECISIONS: Objective pros and cons for living, renting, or investing here, plus practical physical inspection tips.

RULES:
- Answer the user's question directly, clearly, and helpfully (2 to 4 concise sentences).
- CRITICAL HEALTHCARE GROUNDING RULE: When the user asks for the nearest hospital, clinic, or medical facility (e.g. "where is the nearest hospital", "nearest hospital", "which hospital is closest"), you MUST explicitly name the nearest facility detected in telemetry ("${infra.nearest_hospital_name || 'nearest medical center'}") and quote its exact distance (${infra.nearest_hospital_dist_m ? `${infra.nearest_hospital_dist_m}m` : 'nearby'}). You may also cite other detected facilities in the cluster if relevant. NEVER guess or invent random hospitals that are farther away.
- CRITICAL NEARBY FACILITIES & AMENITIES GROUNDING RULE: When the user asks about nearby facilities, amenities, or services in general (e.g. "any nearby facilities", "what facilities are nearby", "nearby amenities", "what is near here"):
  You MUST give a clear breakdown of the REAL facilities detected in telemetry:
  1. Healthcare: Explicitly name "${infra.nearest_hospital_name || 'Nearest Local Medical Facility'}" and quote its exact distance (${infra.nearest_hospital_dist_m ? `${infra.nearest_hospital_dist_m}m` : 'nearby'}), plus any other detected hospitals in the cluster.
  2. Rapid Transit & Rail: Explicitly name "${infra.nearest_metro_name || 'Nearest Metro Station'}" (${infra.nearest_metro_dist_m ? `${infra.nearest_metro_dist_m}m` : 'nearby'}) and "${infra.nearest_railway_name || 'Nearest Railway Station'}" (${infra.nearest_railway_dist_m ? `${infra.nearest_railway_dist_m}m` : 'nearby'}).
  3. Greenery & Parks: Mention the ${infra.parks ?? 0} parks in the radial envelope.
  NEVER quote generic placeholder numbers like 640m or omit facility names!
- Integrate verified telemetry for air quality, acoustics, and immediate transit distances.
- Integrate your broad geographic, civic, and urban knowledge of this specific city, district, and neighborhood for open-ended queries.
- NEVER claim that you can only answer pre-set questions or that an inquiry is forbidden because it is outside the telemetry. Be a versatile, friendly, and expert location intelligence agent.

LANGUAGE & MULTILINGUAL OUTPUT:
- Preferred Target Language: "${preferredLanguage}"
- If Target Language is "Hindi" (or question is written in Hindi / Devanagari script): Output your entire response in authentic, fluent Hindi (हिन्दी).
- If Target Language is "Bengali" (or question is written in Bengali script): Output your entire response in authentic, fluent Bengali (বাংলা).
- If Target Language is "Spanish": Output your entire response in authentic, fluent Spanish (Español).
- If Target Language is "French": Output your entire response in authentic, fluent French (Français).
- If Target Language is "German": Output your entire response in authentic, fluent German (Deutsch).
- If Target Language is "Auto" or "English": Respond in the language used in the question (defaulting to English).
`;

    const contents = [
      ...chatHistory.slice(-6).map((msg) => ({
        role: msg.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: msg.text }],
      })),
      {
        role: "user" as const,
        parts: [{ text: question }],
      },
    ];

    // Try candidate models in order of priority to ensure active quota and uptime
    for (const model of CANDIDATE_MODELS) {
      try {
        const isGemma = model.startsWith("gemma-");
        const modelContents = isGemma
          ? [
              {
                role: "user" as const,
                parts: [{ text: `${systemInstruction}\n\nUser Question: ${question}` }],
              },
            ]
          : contents;
        const modelConfig: any = isGemma
          ? { temperature: 0.7, maxOutputTokens: 600 }
          : { systemInstruction };

        const response = await client.models.generateContent({
          model,
          contents: modelContents,
          config: modelConfig,
        });

        const text =
          response.text?.trim() ||
          response.candidates?.[0]?.content?.parts?.find((p: any) => !p.thought && p.text)?.text?.trim() ||
          response.candidates?.[0]?.content?.parts?.slice(-1)[0]?.text?.trim();

        if (text) {
          return text;
        }
      } catch (error: any) {
        console.warn(`⚠️ Model ${model} chat failed (${error.status || error.message?.substring(0, 60)}), trying next candidate...`);
      }
    }

    return this.generateLocalChatFallback(question, investigation, targetPlace, distInfo);
  }

  public static generateLocalChatFallback(
    question: string,
    investigation: any,
    targetPlace?: string,
    distInfo?: { meters: number; km: string; drivingKm: string; name: string } | null
  ): string {
    const q = question.toLowerCase();
    const infra = investigation.infrastructure || {};
    const env = investigation.environment || {};
    const noise = investigation.noiseProfile || {};
    const address = investigation.address || "this location";
    const locName = address.split(",")[0] || "this location";

    // 1. Geocoded distance fallback
    if (distInfo && targetPlace) {
      return `${targetPlace} (${distInfo.name.split(",")[0]}) is located approximately ${distInfo.km} km (${distInfo.meters.toLocaleString()} meters, straight-line distance) from ${locName}. Driving or transit distance is estimated around ${distInfo.drivingKm} km.`;
    }

    // 2. Dedicated handler for general "nearby facilities", "amenities", "what is nearby"
    if (
      q.includes("facilit") ||
      q.includes("amenit") ||
      (q.includes("nearby") && !q.includes("hospital") && !q.includes("metro")) ||
      q.includes("what is near") ||
      q.includes("what's near")
    ) {
      const hosp = infra.nearest_hospital_name
        ? `**${infra.nearest_hospital_name}** (${infra.nearest_hospital_dist_m ?? "nearby"}m away)`
        : `${infra.nearest_hospital_dist_m ?? "nearby"}m away`;
      const metro = infra.nearest_metro_name
        ? `**${infra.nearest_metro_name}** (${infra.nearest_metro_dist_m ?? "nearby"}m away)`
        : (infra.nearest_metro_dist_m ? `${infra.nearest_metro_dist_m}m away` : null);
      const rail = infra.nearest_railway_name
        ? `**${infra.nearest_railway_name}** (${infra.nearest_railway_dist_m ?? "nearby"}m away)`
        : (infra.nearest_railway_dist_m ? `${infra.nearest_railway_dist_m}m away` : null);

      let transitStr = "";
      if (metro) transitStr = ` For rapid transit, ${metro} is your closest access point.`;
      else if (rail) transitStr = ` For rail commute, ${rail} is your closest access point.`;

      const otherHosp =
        Array.isArray(infra.nearby_hospitals) && infra.nearby_hospitals.length > 1
          ? ` Other nearby medical centers include ${infra.nearby_hospitals
              .slice(1, 3)
              .map((h: any) => `${h.name} (~${h.distance}m)`)
              .join(", ")}.`
          : "";

      return `Key nearby facilities for ${locName} include verified healthcare via ${hosp} (${infra.hospitals ?? 1} healthcare centers in sector).${otherHosp}${transitStr} The surrounding quadrant also features ${infra.parks ?? 0} parks, local grocery markets, and pharmacies within walking reach.`;
    }

    // 3. Healthcare (BEFORE generic distance)
    if (q.includes("hospital") || q.includes("health") || q.includes("medical") || q.includes("doctor") || q.includes("emergency") || q.includes("clinic") || q.includes("nursing home")) {
      const hospName = infra.nearest_hospital_name ? `**${infra.nearest_hospital_name}**` : "a primary medical facility";
      const hospDist = infra.nearest_hospital_dist_m ? `${infra.nearest_hospital_dist_m}m` : "outside immediate 3000m radius";
      const otherHosp =
        Array.isArray(infra.nearby_hospitals) && infra.nearby_hospitals.length > 1
          ? ` Other nearby facilities include ${infra.nearby_hospitals
              .slice(1, 4)
              .map((h: any) => `${h.name} (~${h.distance}m)`)
              .join(", ")}.`
          : "";
      return `The nearest medical facility is ${hospName}, situated approximately ${hospDist} from this location (${infra.hospitals || 1} healthcare facilities detected in the surrounding cluster).${otherHosp}`;
    }

    // 4. Public Transit (BEFORE generic distance)
    if (q.includes("metro") || q.includes("train") || q.includes("transit") || q.includes("commute") || q.includes("rail") || q.includes("station") || q.includes("bus")) {
      const metroName = infra.nearest_metro_name ? `**${infra.nearest_metro_name}**` : "the nearest metro station";
      const metroDist = infra.nearest_metro_dist_m ? `${infra.nearest_metro_dist_m}m` : (infra.nearest_railway_dist_m ? `${infra.nearest_railway_dist_m}m (rail)` : "beyond walking distance");
      return `Public transit connectivity features ${metroName} at ${metroDist}, with ${infra.metro_stations || infra.railway_stations || 0} active stations serving this quadrant.`;
    }

    // 5. Generic Distance, proximity & landmark questions
    if (q.includes("distance") || q.includes("how far") || q.includes("how close") || q.includes("nearest") || q.includes("where is")) {
      return `For destinations relative to ${locName}, commercial and retail outlets (including ${targetPlace || "requested facilities"}) are typically clustered within neighborhood commercial hubs and main access roads approximately 500m to 2.5 km away, with local transit and delivery services actively covering this sector.`;
    }

    // 6. Safety & Security
    if (q.includes("safe") || q.includes("crime") || q.includes("night") || q.includes("security") || q.includes("women")) {
      return `${locName} features an urban residential profile with active transit and road connectivity. Street lighting along primary corridors and proximity to civic amenities generally support pedestrian movement, though verifying perimeter illumination and evening activity during an on-site visit is recommended.`;
    }

    // 7. Schools & Education
    if (q.includes("school") || q.includes("college") || q.includes("education") || q.includes("university") || q.includes("kid")) {
      return `${locName} is situated within an established urban district offering access to primary and secondary educational institutions within the municipal zone. Direct commute routes connect to renowned regional schools and higher education campuses across the sector.`;
    }

    // 8. Shopping, Groceries & Daily Needs
    if (q.includes("shop") || q.includes("store") || q.includes("market") || q.includes("grocery") || q.includes("mall") || q.includes("supermarket")) {
      return `Daily essentials, local markets, and grocery convenience stores are typically clustered within neighborhood commercial corridors surrounding ${locName}, with major retail hubs and shopping centers accessible via adjacent arterial routes.`;
    }

    // 9. Water, Flooding & Monsoon
    if (q.includes("flood") || q.includes("water") || q.includes("drainage") || q.includes("rain") || q.includes("monsoon") || q.includes("waterlog")) {
      return `Civic drainage infrastructure in ${locName} serves regular surface runoff. During extreme monsoon downpours, low-lying street junctions may experience temporary water accumulation, so inspecting street grading and stormwater drains on-site is advised.`;
    }

    // 10. Real Estate, Renting & Investment Advice
    if (q.includes("buy") || q.includes("rent") || q.includes("invest") || q.includes("worth") || q.includes("pros") || q.includes("cons") || q.includes("recommend")) {
      const transitDist = infra.nearest_metro_dist_m ? `${infra.nearest_metro_dist_m}m` : (infra.nearest_railway_dist_m ? `${infra.nearest_railway_dist_m}m` : "nearby");
      return `From an urban audit perspective, ${locName} benefits from rapid transit access (${transitDist}) and ${infra.hospitals ?? 0} healthcare facilities in its operational cluster. Key factors to weigh are the current European AQI (${env.aqi ?? "N/A"}) and ${noise.estimated_bracket || "Moderate"} acoustic exposure.`;
    }

    // 11. Acoustic Noise
    if (q.includes("noise") || q.includes("quiet") || q.includes("sound") || q.includes("traffic") || q.includes("loud")) {
      const dist = noise.distance_meters ? ` approximately ${noise.distance_meters}m away` : "";
      return `Acoustic exposure is rated as ${noise.estimated_bracket || "Ambient"}${noise.nearest_source_type ? ` with nearest ${noise.nearest_source_type}${dist}` : ""}. Facade soundproofing is recommended if facing major thoroughfares.`;
    }

    // 12. Air Quality & Pollution
    if (q.includes("air") || q.includes("pollution") || q.includes("aqi") || q.includes("smell") || q.includes("breath")) {
      return `The current European AQI is recorded at ${env.aqi ?? "N/A"} with PM2.5 particulate loading at ${env.pm2_5 ?? "N/A"} µg/m³. Indoor HEPA filtration is advised during peak rush hours.`;
    }

    // 13. General Comprehensive Overview
    const hospDesc = infra.nearest_hospital_name
      ? `nearest medical facility is **${infra.nearest_hospital_name}** (${infra.nearest_hospital_dist_m ?? "nearby"}m)`
      : `nearest emergency medical center at ${infra.nearest_hospital_dist_m ?? "N/A"}m`;
    const transitDesc = infra.nearest_metro_name
      ? `nearest rapid transit at **${infra.nearest_metro_name}** (${infra.nearest_metro_dist_m ?? "nearby"}m)`
      : `nearest transit at ${infra.nearest_metro_dist_m ?? infra.nearest_railway_dist_m ?? "N/A"}m`;

    return `Telemetry audit for ${locName} records an AQI of ${env.aqi ?? "N/A"}, ${hospDesc}, ${transitDesc}, and an overall ${noise.estimated_bracket || "Moderate"} acoustic exposure bracket. Feel free to ask about safety, schools, commute, or nearby destinations.`;
  }
}
