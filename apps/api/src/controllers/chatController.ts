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
  railway?: { name: string; distanceMeters: number };
  airport?: { name: string; distanceMeters: number };
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
  try {
    const { message, history = [], auditContext } = req.body as ChatRequestBody;

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ success: false, error: "Message is required" });
      return;
    }

    const contextHeader = `
[SYSTEM CONTEXT & URBAN TELEMETRY]
Location: ${auditContext?.address?.displayName || "Target Area"}
Coordinates: [Lat: ${auditContext?.coordinates?.[1] ?? "N/A"}, Lon: ${auditContext?.coordinates?.[0] ?? "N/A"}]
Nearest Metro: ${auditContext?.facilities?.metro ? `${auditContext.facilities.metro.name} (${auditContext.facilities.metro.distanceMeters}m)` : "None within radius"}
Nearest Rail: ${auditContext?.facilities?.railway ? `${auditContext.facilities.railway.name} (${auditContext.facilities.railway.distanceMeters}m)` : "None within radius"}
Nearest Airport: ${auditContext?.facilities?.airport ? `${auditContext.facilities.airport.name} (${auditContext.facilities.airport.distanceMeters}m)` : "None within range"}
Nearest Hospital: ${auditContext?.facilities?.hospital ? `${auditContext.facilities.hospital.name} (${auditContext.facilities.hospital.distanceMeters}m)` : "N/A"}

ROLE & INSTRUCTIONS:
- You are Zonalyze's local intelligence copilot powered by Gemma.
- Answer the user's specific prompt directly in sentence 1.
- Reason about relative distances, direction, and travel time from the coordinates.
- Keep output concise, realistic, and formatted in clean Markdown.
`;

    // Construct conversation payload compatible with Gemma (no systemInstruction in config)
    const formattedHistory: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [
      {
        role: "user",
        parts: [{ text: `${contextHeader}\n\nUser Question: ${message.trim()}` }],
      },
    ];

    // If multi-turn history exists, prepend it safely
    if (Array.isArray(history) && history.length > 0) {
      const pastTurns = history.slice(-4).map((turn: any) => ({
        role: (turn.role === "assistant" || turn.role === "model" ? "model" : "user") as "user" | "model",
        parts: [{ text: turn.text || turn.content || (Array.isArray(turn.parts) ? turn.parts[0]?.text : "") || "" }],
      }));
      formattedHistory.unshift(...pastTurns);
    }

    const candidateModels = [
      "gemma-2-9b-it",
      "gemma-4-26b-a4b-it",
      "gemma-4-31b-it",
      "gemini-2.5-flash-lite",
    ];

    let replyText = "";
    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: formattedHistory,
          config: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        });

        const extracted =
          response.text ||
          response.candidates?.[0]?.content?.parts?.find((p: any) => !p.thought && p.text)?.text ||
          response.candidates?.[0]?.content?.parts?.slice(-1)[0]?.text;

        if (extracted && extracted.trim()) {
          replyText = extracted.trim();
          break;
        }
      } catch (err: any) {
        console.warn(`Gemma candidate ${model} unavailable (${err?.message}), attempting failover...`);
      }
    }

    const reply = replyText || "No response received from Gemma.";
    res.status(200).json({ success: true, reply });
  } catch (error: any) {
    console.error("Gemma Chat Error:", error);
    res.status(200).json({
      success: false,
      reply: "Gemma model is momentarily handling high traffic. You can explore transit and accommodation routes directly on the interactive map.",
    });
  }
}
