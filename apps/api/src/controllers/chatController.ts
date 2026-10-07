import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

import { CANDIDATE_MODELS } from "../services/gemmaService.js";
import { GeminiService } from "../services/gemini.service.js";

dotenv.config();

const apiKey = process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

// Use active valid model candidates with graceful candidate failover
const GEMMA_MODEL = process.env.GEMMA_MODEL || "gemma-4-26b-a4b-it";
const FALLBACK_MODELS = [
  GEMMA_MODEL,
  ...CANDIDATE_MODELS.filter((m) => m !== GEMMA_MODEL),
];

export const handleAuditChat = async (req: Request, res: Response) => {
  try {
    const message = req.body?.message || req.body?.question;
    const history = req.body?.history || req.body?.chatHistory || [];
    const auditContext = req.body?.auditContext || req.body?.investigation;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "Valid message string is required." });
    }

    // Extract telemetry facts cleanly
    const locationName =
      auditContext?.address?.displayName ||
      (typeof auditContext?.address === "string" ? auditContext.address : "Selected Location");
    const coords = auditContext?.coordinates
      ? `Lat ${auditContext.coordinates[1]}, Lon ${auditContext.coordinates[0]}`
      : auditContext?.location?.coordinates
      ? `Lat ${auditContext.location.coordinates[1]}, Lon ${auditContext.location.coordinates[0]}`
      : "Not specified";
    const metro = auditContext?.facilities?.metro?.name
      ? `${auditContext.facilities.metro.name} (${auditContext.facilities.metro.distanceMeters || auditContext.facilities.metro.distance_m}m away)`
      : auditContext?.infrastructure?.nearest_metro_name
      ? `${auditContext.infrastructure.nearest_metro_name} (${auditContext.infrastructure.nearest_metro_dist_m}m away)`
      : "No direct metro station detected within immediate radius";
    const rail = auditContext?.facilities?.railway?.name
      ? `${auditContext.facilities.railway.name} (${auditContext.facilities.railway.distanceMeters || auditContext.facilities.railway.distance_m}m away)`
      : auditContext?.infrastructure?.nearest_railway_name
      ? `${auditContext.infrastructure.nearest_railway_name} (${auditContext.infrastructure.nearest_railway_dist_m}m away)`
      : "No major railway platform nearby";
    const hospital = auditContext?.facilities?.hospital?.name
      ? `${auditContext.facilities.hospital.name} (${auditContext.facilities.hospital.distanceMeters || auditContext.facilities.hospital.distance_m}m away)`
      : auditContext?.infrastructure?.nearest_hospital_name
      ? `${auditContext.infrastructure.nearest_hospital_name} (${auditContext.infrastructure.nearest_hospital_dist_m}m away)`
      : "No primary hospital within 1.5 km";
    const airport = auditContext?.facilities?.airport?.name
      ? `${auditContext.facilities.airport.name} (${auditContext.facilities.airport.distanceMeters || auditContext.facilities.airport.distance_m}m away)`
      : auditContext?.infrastructure?.nearest_airport_name
      ? `${auditContext.infrastructure.nearest_airport_name} (${auditContext.infrastructure.nearest_airport_dist_m}m away)`
      : "Commercial airport beyond local reach";
    const store = auditContext?.facilities?.store?.name
      ? `${auditContext.facilities.store.name} (${auditContext.facilities.store.distanceMeters || auditContext.facilities.store.distance_m}m away)`
      : "Local convenience store within neighborhood radius";

    const systemPrompt = `You are the Zonalyze Urban Intelligence Copilot powered by Gemma 4.
You are having an interactive conversation with a user investigating an area.

GROUND TRUTH TELEMETRY:
- Audited Locality: ${locationName}
- Coordinates: ${coords}
- Transit: ${metro}; Heavy Rail: ${rail}
- Health & Emergency: ${hospital}; Airport: ${airport}
- Retail & Daily Essentials: ${store}

GUIDELINES:
1. Speak naturally, insightfully, and conversationally like an experienced urban analyst.
2. Directly answer the user's specific inquiry in the first sentence.
3. If asked about shops, grocery, markets, convenience stores, or daily needs, cite the detected retail node (${store}).
4. NEVER recite these rules, never say "As an AI", and never output system keys or bullet lists unless specifically requested by the user.
5. If asked about places (schools, markets, food, safety), combine the telemetry data with your broader knowledge of the city and locality.`;

    // Build multi-turn conversational contents
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    // Append prior conversational history if provided
    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-6)) {
        const text = turn.text || turn.content || turn.message;
        if (!text) continue;
        const role = turn.role === "assistant" || turn.role === "model" ? "model" : "user";
        contents.push({ role, parts: [{ text: String(text) }] });
      }
    }

    // Append the active user query bundled with situational system telemetry context
    contents.push({
      role: "user",
      parts: [
        {
          text: `${systemPrompt}\n\nUser Question: ${message}\nAnswer directly:`,
        },
      ],
    });

    let replyText = "";
    for (const modelCandidate of FALLBACK_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelCandidate,
          contents,
          config: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        });

        let extracted = response.text?.trim();
        if (!extracted && response.candidates?.[0]?.content?.parts) {
          const parts = response.candidates[0].content.parts;
          const nonThought = parts.find((p: any) => !p.thought && p.text?.trim());
          extracted = nonThought?.text?.trim() || parts[parts.length - 1]?.text?.trim();
        }

        if (extracted) {
          replyText = extracted;
          break;
        }
      } catch (candErr: any) {
        console.warn(
          `[ChatController] Candidate ${modelCandidate} failed (${candErr?.message}), trying next...`
        );
      }
    }

    if (!replyText) {
      console.warn("[ChatController] Online model candidates exhausted, generating grounded local telemetry reply...");
      replyText = GeminiService.generateLocalChatFallback(message, auditContext || {});
    }

    // Strip accidental prompt echoes if model mirrors introductory directives
    replyText = replyText
      .replace(
        /^(\*?\s*(Role|Target Audience|Telemetry Data|System Directive|Ground Truth Telemetry|Audited Locality).*?\n)+/gim,
        ""
      )
      .replace(/^(?:Answer|Response|Assistant):\s*/i, "")
      .trim();

    return res.status(200).json({
      success: true,
      reply: replyText,
    });
  } catch (err: any) {
    console.error("[ChatController] Gemma dynamic generation failed:", err?.message || err);
    // Even on unexpected exceptions, fallback gracefully to grounded telemetry answer
    const auditContext = req.body?.auditContext || req.body?.investigation || {};
    const message = req.body?.message || req.body?.question || "Overview";
    const fallbackAnswer = GeminiService.generateLocalChatFallback(message, auditContext);

    return res.status(200).json({
      success: true,
      reply: fallbackAnswer,
    });
  }
};
