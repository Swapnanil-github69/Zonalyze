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
  const sanitizedHistory: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

  if (Array.isArray(history)) {
    for (const item of history) {
      if (!item) continue;
      const role: "user" | "model" = item.role === "model" || item.role === "assistant" ? "model" : "user";
      if (Array.isArray(item.parts) && item.parts.length > 0) {
        const validParts = item.parts.filter((p) => p && typeof p.text === "string" && p.text.trim());
        if (validParts.length > 0) {
          sanitizedHistory.push({ role, parts: validParts });
          continue;
        }
      }
      if (typeof item.text === "string" && item.text.trim()) {
        sanitizedHistory.push({ role, parts: [{ text: item.text }] });
      }
    }
  }

  // Sliding-window history management: only pass last 6 conversation turns
  let trimmedHistory = sanitizedHistory.slice(-6);
  if (trimmedHistory.length > 0 && trimmedHistory[0].role === "model") {
    trimmedHistory = trimmedHistory.slice(1);
  }

  const systemInstruction = `
You are Zonalyze's local urban intelligence assistant.
Audited Location Context:
- Locality: ${auditContext?.address?.displayName || "Target Area"} (${auditContext?.address?.suburb || ""}, ${auditContext?.address?.city || ""})
- Coordinates: [Lat: ${auditContext?.coordinates?.[1] ?? "N/A"}, Lon: ${auditContext?.coordinates?.[0] ?? "N/A"}]
- Nearest Metro: ${auditContext?.facilities?.metro?.name || "N/A"} (${auditContext?.facilities?.metro?.distanceMeters || "N/A"}m)
- Nearest Hospital: ${auditContext?.facilities?.hospital?.name || "N/A"} (${auditContext?.facilities?.hospital?.distanceMeters || "N/A"}m)
- AQI: ${auditContext?.environment?.aqi ?? "N/A"} | Noise: ${auditContext?.noise?.bracket || "N/A"}

Guidelines:
1. Direct answer in sentence 1.
2. Contextual Geographic Reasoning: When the user asks about landmarks, stadiums, tourist places, restaurants, or spots not explicitly listed in the telemetry (e.g. Eden Gardens, Victoria Memorial, Princep Ghat, Eco Park), use your innate geographic knowledge relative to the current coordinates [${auditContext?.coordinates?.[1] ?? "N/A"}, ${auditContext?.coordinates?.[0] ?? "N/A"}] to estimate realistic straight-line/travel distances and routing times.
3. NEVER dump raw telemetry or repeat sensor metrics unprompted. Only mention AQI, noise, or facilities if the user explicitly asks about them or if directly relevant to their specific question.
4. Maintain a natural, helpful, witty, and conversational tone across multiple turns.
`;

  const models = ["gemini-2.5-flash-lite", "gemini-3.5-flash-lite", "gemini-2.5-flash"];
  let replyText = "";
  let lastError: any = null;

  for (const model of models) {
    try {
      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
        history: trimmedHistory,
      });

      const result = await chat.sendMessage({ message });
      replyText = result.text ?? "";
      if (replyText) break;
    } catch (err: any) {
      lastError = err;
      console.warn(`Chat model ${model} failed, attempting next candidate...`, err?.message);
    }
  }

  if (replyText) {
    res.status(200).json({ success: true, reply: replyText });
  } else {
    console.error("All chat models exhausted or failed:", lastError);
    res.status(200).json({
      success: false,
      reply: `I've hit the temporary free-tier query limiter. Regarding ${auditContext?.address?.suburb || "this area"}, try using the map pins to measure walking routes.`,
    });
  }
}
