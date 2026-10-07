/**
 * Gemma AI Integration Service
 * Provides resilient JSON sanitization and debrief utilities for Gemma models.
 */

// Active valid model candidates on Google AI Studio
export const CANDIDATE_MODELS = [
  "gemma-4-26b-a4b-it",
  "gemma-4-31b-it",
  "gemini-flash-latest",
  "gemini-3.8-flash",
  "gemini-pro-latest",
];

/**
 * Resilient JSON Sanitization:
 * Cleans markdown fences, extracts outermost JSON object/array,
 * handles trailing commas/tokens, and returns fallback on parse failure.
 */
export function cleanAndParseJSON<T>(rawText: string, fallback: T): T {
  try {
    if (!rawText || typeof rawText !== "string") {
      return fallback;
    }

    // 1. Strip markdown fences like ```json ... ``` or ``` ... ```
    let cleaned = rawText
      .replace(/```(?:json)?/gi, "")
      .replace(/```/g, "")
      .trim();

    // 2. Extract substring between the first { and the last }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    } else {
      // Also support array JSON if bracket is present
      const firstBracket = cleaned.indexOf("[");
      const lastBracket = cleaned.lastIndexOf("]");
      if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        cleaned = cleaned.substring(firstBracket, lastBracket + 1);
      }
    }

    // 3. Try standard JSON.parse first
    try {
      return JSON.parse(cleaned) as T;
    } catch {
      // 4. Sanitize common LLM syntax irregularities:
      // Remove trailing commas before closing braces/brackets
      const fixedCommas = cleaned
        .replace(/,\s*([}\]])/g, "$1")
        // Remove unescaped control characters
        .replace(/[\u0000-\u001F]+/g, (match) => {
          if (match === "\n" || match === "\r" || match === "\t") return match;
          return "";
        });

      return JSON.parse(fixedCommas) as T;
    }
  } catch (err: any) {
    console.warn("[GemmaService] JSON parse failed, returning fallback schema:", err?.message);
    return fallback;
  }
}

/**
 * Sanitizes Gemma chat responses by stripping prompt echoes, preamble headers,
 * and directives if the model reflected them back.
 */
export function sanitizeGemmaChatReply(rawReply: string, userQuestion?: string): string {
  let cleaned = (rawReply || "").trim();

  // 1. If Gemma echoes the prompt block up to "Answer:" or "Response:", slice from after that marker
  const answerMatch = cleaned.match(/(?:^|\n)(?:Answer|Response|Assistant):\s*/i);
  if (answerMatch && answerMatch.index !== undefined) {
    const afterAnswer = cleaned.substring(answerMatch.index + answerMatch[0].length).trim();
    if (afterAnswer.length > 0) {
      cleaned = afterAnswer;
    }
  }

  // 2. Strip echoed "User Question: ..." or "[QUESTION] ..."
  if (userQuestion) {
    const qLower = userQuestion.trim().toLowerCase();
    const lines = cleaned.split("\n");
    if (lines.length > 1 && lines[0].toLowerCase().includes(qLower)) {
      lines.shift();
      cleaned = lines.join("\n").trim();
    }
  }

  // 3. Strip any echoed system headers or instruction directives
  const lines = cleaned.split("\n");
  const filteredLines: string[] = [];
  let skippingEchoedPreamble = true;

  for (const line of lines) {
    const trimmed = line.trim();
    if (skippingEchoedPreamble) {
      const isEchoedHeader =
        trimmed.startsWith("[") ||
        trimmed.startsWith("Location:") ||
        trimmed.startsWith("Coordinates:") ||
        trimmed.startsWith("Nearest ") ||
        trimmed.startsWith("- Place:") ||
        trimmed.startsWith("- Coordinates:") ||
        trimmed.startsWith("- Nearest") ||
        trimmed.startsWith("Location Telemetry:") ||
        trimmed.startsWith("ROLE & INSTRUCTIONS") ||
        trimmed.startsWith("Directive:") ||
        trimmed.startsWith("- You are") ||
        trimmed.startsWith("- Answer the user") ||
        trimmed.startsWith("- Reason about") ||
        trimmed.startsWith("- Keep output") ||
        trimmed.startsWith("You are Zonalyze") ||
        trimmed.startsWith("IMPORTANT:") ||
        trimmed.startsWith("User Question:") ||
        trimmed.startsWith("Question:") ||
        trimmed.startsWith("Answer:") ||
        trimmed.startsWith("Response:");

      if (isEchoedHeader || trimmed.length === 0) {
        continue;
      } else {
        skippingEchoedPreamble = false;
      }
    }
    filteredLines.push(line);
  }

  if (filteredLines.length > 0) {
    cleaned = filteredLines.join("\n").trim();
  }

  // 4. Strip any dangling "Answer:" prefixes
  cleaned = cleaned.replace(/^(?:Answer|Response|Assistant):\s*/i, "").trim();

  return cleaned || rawReply.trim();
}

// Re-export common types and functions for seamless integration
export {
  GEMMA_MODEL_NAME,
  UrbanAuditPayload,
  generateGemmaDebrief,
} from "./gemini.service.js";

