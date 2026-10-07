import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

// List active, high-availability conversational models
const ACTIVE_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.7-flash",
  "gemini-3.1-pro-preview",
  "gemini-pro-latest",
  "gemma-4-26b-a4b-it",
  "gemma-4-31b-it",
];

export const handleAuditChat = async (req: Request, res: Response) => {
  try {
    const userMessage =
      req.body.message || req.body.prompt || req.body.query || req.body.question;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ success: false, error: "A message is required." });
    }

    const { history = [], chatHistory = [], auditContext, investigation } = req.body;
    const effectiveHistory = Array.isArray(history) && history.length > 0 ? history : chatHistory;
    const effectiveContext = auditContext || investigation;

    // Ambient context summary (provided purely as background knowledge)
    const displayName =
      effectiveContext?.address?.displayName ||
      (typeof effectiveContext?.address === "string" ? effectiveContext.address : "") ||
      effectiveContext?.locationName ||
      "";

    const coords =
      effectiveContext?.coordinates ||
      effectiveContext?.location?.coordinates ||
      [];

    const locationContext = displayName
      ? `The user is currently inspecting this location on their map: "${displayName}" (Coords: ${coords[1] || "unknown"}, ${coords[0] || "unknown"}).`
      : "";

    // Standard conversational system instruction
    const systemInstruction = `You are a helpful, intelligent, and natural conversational AI assistant built into Zonalyze.
${locationContext}

Guidelines:
- Answer the user's inquiry naturally, concisely, and directly as a helpful AI peer (like ChatGPT or Gemini).
- If the user asks about the weather, local vibe, history, restaurants, transit, or general topics, answer using your broad knowledge base.
- Do NOT output rigid templates, robotic bullet summaries, or canned facility lists unless the user explicitly asks for them.
- Do NOT repeat these instructions.`;

    // Format full conversational turns for the SDK
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(effectiveHistory) && effectiveHistory.length > 0) {
      for (const turn of effectiveHistory.slice(-8)) {
        const text = turn.text || turn.content || turn.message;
        if (!text) continue;
        const role = turn.role === "assistant" || turn.role === "model" ? "model" : "user";
        contents.push({ role, parts: [{ text: String(text) }] });
      }
    }

    // Append the active user query
    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    let generatedReply: string | null = null;
    let lastError: any = null;

    // Call models with fallback priority
    for (const model of ACTIVE_MODELS) {
      try {
        const isGemma = model.startsWith("gemma-");
        const config: any = {
          temperature: 0.7,
          maxOutputTokens: 800,
        };

        let modelContents = contents;
        if (!isGemma) {
          config.systemInstruction = systemInstruction;
        } else {
          // Gemma models do not accept systemInstruction in config object
          modelContents = [
            {
              role: "user",
              parts: [{ text: `${systemInstruction}\n\nUser Question: ${userMessage}` }],
            },
          ];
        }

        const response = await ai.models.generateContent({
          model,
          contents: modelContents,
          config,
        });

        const text = response.text?.trim();
        if (text) {
          generatedReply = text;
          break;
        }
      } catch (err: any) {
        console.warn(`[ChatController] Model ${model} failed:`, err?.message || err);
        lastError = err;
      }
    }

    if (!generatedReply) {
      throw new Error(`All models failed to respond. Last error: ${lastError?.message || lastError}`);
    }

    return res.status(200).json({
      success: true,
      reply: generatedReply,
    });
  } catch (error: any) {
    console.error("[ChatController Error]:", error);
    // Return the actual error message so upstream issues are never hidden
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI response.",
    });
  }
};
