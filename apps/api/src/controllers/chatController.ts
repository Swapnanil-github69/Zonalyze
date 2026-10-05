import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AuditAddress {
  displayName?: string;
  suburb?: string;
  city?: string;
}

export interface AuditEnvironment {
  aqi?: number;
  aqiStatus?: string;
  pm2_5?: number;
  currentTemp?: number;
}

export interface AuditFacilities {
  metro?: { name: string; distanceMeters: number };
  hospital?: { name: string; distanceMeters: number };
  busStop?: any;
}

export interface AuditNoise {
  bracket?: string;
  nearestSource?: string;
}

export interface AuditContext {
  address?: AuditAddress;
  coordinates?: [number, number]; // [longitude, latitude]
  livabilityScore?: number;
  environment?: AuditEnvironment;
  facilities?: AuditFacilities;
  noise?: AuditNoise;
}

export interface ChatHistoryItem {
  role: "user" | "model" | string;
  parts?: Array<{ text: string }>;
  text?: string; // backwards compatibility
}

export interface ChatRequestBody {
  message: string;
  auditContext?: AuditContext;
  history?: ChatHistoryItem[];
}

export async function handleAuditChat(req: Request, res: Response): Promise<void> {
  const { message, auditContext, history } = req.body as ChatRequestBody;

  if (!message || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ success: false, error: "Prompt message is required." });
    return;
  }

  // Ensure backwards-compatibility: if client sends { role: string, text: string }, normalize it to { role, parts: [{ text }] }
  const normalizedHistory: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

  if (Array.isArray(history)) {
    for (const item of history) {
      if (!item) continue;
      const role: "user" | "model" = item.role === "model" || item.role === "assistant" ? "model" : "user";
      if (Array.isArray(item.parts) && item.parts.length > 0) {
        const validParts = item.parts.filter((p) => p && typeof p.text === "string");
        if (validParts.length > 0) {
          normalizedHistory.push({ role, parts: validParts });
          continue;
        }
      }
      if (typeof item.text === "string" && item.text.trim()) {
        normalizedHistory.push({ role, parts: [{ text: item.text }] });
      }
    }
  }

  const systemInstructionText = `You are an authentic, adaptive AI urban assistant with a touch of wit, serving as Zonalyze's local intelligence guide.

CURRENT AUDIT LOCATION:
- Display Name: ${auditContext?.address?.displayName || "Unknown locality"}
- Suburb / City: ${auditContext?.address?.suburb || ""}, ${auditContext?.address?.city || ""}
- Coordinates: Lat ${auditContext?.coordinates?.[1] ?? "N/A"}, Lon ${auditContext?.coordinates?.[0] ?? "N/A"}
- Livability Score: ${auditContext?.livabilityScore ?? "N/A"}/10
- Sensor Telemetry: AQI ${auditContext?.environment?.aqi ?? "N/A"} (${auditContext?.environment?.aqiStatus ?? "N/A"}), PM2.5 ${auditContext?.environment?.pm2_5 ?? "N/A"} µg/m³, Temp ${auditContext?.environment?.currentTemp ?? "N/A"}°C
- Acoustic Profile: ${auditContext?.noise?.bracket ?? "N/A"}
- Nearest Transit: ${auditContext?.facilities?.metro?.name ?? "None recorded"} (${auditContext?.facilities?.metro?.distanceMeters ?? "N/A"}m)
- Nearest Healthcare: ${auditContext?.facilities?.hospital?.name ?? "None recorded"} (${auditContext?.facilities?.hospital?.distanceMeters ?? "N/A"}m)

BEHAVIORAL GUIDELINES:
1. Direct Structural Opening: Address the user's explicit question directly in sentence 1. Never start with robotic fluff, filler acknowledgments, or preambles like "Sure!", "Certainly!", or "Here is the information:".
2. Authentic Peer Tone: Sound like an insightful local peer, balancing candor with practical guidance.
3. Landmark & Off-Sensor Queries: If the user asks about a landmark, stadium, school, monument, or destination not explicitly in the sensor telemetry table, use Google Search and your regional geographic knowledge relative to the audited coordinates to provide concrete distances, compass directions, and realistic travel options.
4. Grounding First: Never re-dump the whole telemetry summary unless the user explicitly asks for it.
5. Format: Output clean, readable Markdown.`;

  try {
    let result;
    try {
      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemInstructionText,
          tools: [{ googleSearch: {} }], // Enable live Google Search grounding
        },
        history: normalizedHistory,
      });

      result = await chat.sendMessage({ message });
    } catch (primaryAttemptErr: any) {
      // If gemini-2.5-flash is retired/404, try active gemini-3.5-flash with search tool
      if (primaryAttemptErr?.status === 404 || primaryAttemptErr?.message?.includes("404")) {
        const chatAlt = ai.chats.create({
          model: "gemini-3.5-flash",
          config: {
            systemInstruction: systemInstructionText,
            tools: [{ googleSearch: {} }],
          },
          history: normalizedHistory,
        });
        result = await chatAlt.sendMessage({ message });
      } else {
        throw primaryAttemptErr;
      }
    }

    res.status(200).json({ success: true, reply: result.text });
  } catch (primaryError: any) {
    console.warn("⚠️ Primary Gemini chat call with search failed, attempting fallback:", primaryError?.message || primaryError);

    try {
      let fallbackResult;
      try {
        const fallbackChat = ai.chats.create({
          model: "gemini-2.5-flash",
          config: { systemInstruction: systemInstructionText },
          history: normalizedHistory,
        });

        fallbackResult = await fallbackChat.sendMessage({ message });
      } catch (fallbackAttemptErr: any) {
        if (fallbackAttemptErr?.status === 404 || fallbackAttemptErr?.message?.includes("404")) {
          const fallbackChatAlt = ai.chats.create({
            model: "gemini-3.5-flash",
            config: { systemInstruction: systemInstructionText },
            history: normalizedHistory,
          });
          fallbackResult = await fallbackChatAlt.sendMessage({ message });
        } else {
          throw fallbackAttemptErr;
        }
      }

      res.status(200).json({ success: true, reply: fallbackResult.text });
    } catch (fallbackError: any) {
      console.error("❌ Both Gemini chat attempts failed:", fallbackError?.message || fallbackError);

      res.status(200).json({
        success: false,
        reply:
          "I'm having trouble retrieving live search data right now. Based on your location around " +
          (auditContext?.address?.suburb || "this area") +
          ", please verify transit directions on the interactive map.",
      });
    }
  }
}
