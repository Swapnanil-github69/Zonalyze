/**
 * Gemma AI Integration Service
 * Provides resilient JSON sanitization and debrief utilities for Gemma models.
 */

// Active valid model candidates on Google AI Studio
export const ACTIVE_MODELS = [
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

export const CANDIDATE_MODELS = ACTIVE_MODELS;

/**
 * Escapes literal raw control characters (newlines, carriage returns, tabs)
 * that occur inside unescaped JSON string literals.
 */
function escapeControlCharsInJsonStrings(jsonStr: string): string {
  let inString = false;
  let escaped = false;
  let result = "";

  for (let i = 0; i < jsonStr.length; i++) {
    const ch = jsonStr[i];

    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      result += ch;
      escaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }

    if (inString) {
      if (ch === "\n") {
        result += "\\n";
      } else if (ch === "\r") {
        result += "\\r";
      } else if (ch === "\t") {
        result += "\\t";
      } else {
        result += ch;
      }
    } else {
      result += ch;
    }
  }

  return result;
}

/**
 * Recovers key debrief fields via resilient regular expressions if JSON syntax is fundamentally broken.
 */
function extractDebriefFieldsRegex<T>(rawText: string, fallback: T): T {
  if (!rawText || typeof rawText !== "string" || !fallback || typeof fallback !== "object") {
    return fallback;
  }

  const result: any = Array.isArray(fallback) ? [...(fallback as any)] : { ...(fallback as any) };
  let recoveredAny = false;

  // 1. Recover summary
  const summaryMatch = rawText.match(/"summary"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (summaryMatch && summaryMatch[1]) {
    result.summary = summaryMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n").trim();
    recoveredAny = true;
  }

  // 2. Recover insights_in_brief
  const transitMatch = rawText.match(/"transit"\s*:\s*"((?:\\.|[^"\\])*)"/);
  const healthMatch = rawText.match(/"healthcare"\s*:\s*"((?:\\.|[^"\\])*)"/);
  const envMatch = rawText.match(/"environment"\s*:\s*"((?:\\.|[^"\\])*)"/);
  const acousticMatch = rawText.match(/"acoustic"\s*:\s*"((?:\\.|[^"\\])*)"/);

  if (transitMatch || healthMatch || envMatch || acousticMatch) {
    result.insights_in_brief = {
      transit: transitMatch?.[1]?.replace(/\\"/g, '"').trim() || result.insights_in_brief?.transit || "",
      healthcare: healthMatch?.[1]?.replace(/\\"/g, '"').trim() || result.insights_in_brief?.healthcare || "",
      environment: envMatch?.[1]?.replace(/\\"/g, '"').trim() || result.insights_in_brief?.environment || "",
      acoustic: acousticMatch?.[1]?.replace(/\\"/g, '"').trim() || result.insights_in_brief?.acoustic || "",
    };
    recoveredAny = true;
  }

  // 3. Recover empirical_observations array
  const obsBlockMatch = rawText.match(/"empirical_observations"\s*:\s*\[([\s\S]*?)(\]|$)/);
  if (obsBlockMatch && obsBlockMatch[1]) {
    const items = [...obsBlockMatch[1].matchAll(/"((?:\\.|[^"\\])*)"/g)].map((m) =>
      m[1].replace(/\\"/g, '"').replace(/\\n/g, "\n").trim()
    ).filter(Boolean);
    if (items.length > 0) {
      result.empirical_observations = items;
      recoveredAny = true;
    }
  }

  // 4. Recover site_inspection_targets array
  const targetsBlockMatch = rawText.match(/"site_inspection_targets"\s*:\s*\[([\s\S]*?)(\]|$)/);
  if (targetsBlockMatch && targetsBlockMatch[1]) {
    const items = [...targetsBlockMatch[1].matchAll(/"((?:\\.|[^"\\])*)"/g)].map((m) =>
      m[1].replace(/\\"/g, '"').replace(/\\n/g, "\n").trim()
    ).filter(Boolean);
    if (items.length > 0) {
      result.site_inspection_targets = items;
      recoveredAny = true;
    }
  }

  return recoveredAny ? (result as T) : fallback;
}

/**
 * Resilient JSON Sanitization:
 * Cleans markdown fences, extracts outermost JSON object/array,
 * repairs unescaped control chars, missing commas, and trailing commas,
 * and recovers fields via regular expressions before falling back.
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
      // 4. Multi-pass sanitize common LLM syntax irregularities:
      // Strip single-line comments // ...
      let repaired = cleaned.replace(/(^|[^:])\/\/[^\n]*/g, "$1");

      // Properly escape raw unescaped newlines/tabs inside string literals
      repaired = escapeControlCharsInJsonStrings(repaired);

      // Fix missing commas between properties on new lines:
      // e.g. "value"\n  "nextKey": -> "value",\n  "nextKey":
      repaired = repaired.replace(/("|\btrue\b|\bfalse\b|\bnull\b|\d+|\]|\})\s*\n\s*("[\w_-]+"\s*:)/g, "$1,\n$2");

      // Fix missing commas between array items on new lines:
      repaired = repaired.replace(/("|\btrue\b|\bfalse\b|\bnull\b|\d+|\]|\})\s*\n\s*(")/g, "$1,\n$2");

      // Remove trailing commas before closing braces/brackets
      repaired = repaired.replace(/,\s*([}\]])/g, "$1");

      try {
        return JSON.parse(repaired) as T;
      } catch {
        // 5. If JSON.parse still fails, recover actual AI content using regex field extraction
        const recovered = extractDebriefFieldsRegex(cleaned, fallback);
        return recovered;
      }
    }
  } catch (err: any) {
    console.warn("[GemmaService] JSON parse failed, extracting fields or using fallback:", err?.message);
    return extractDebriefFieldsRegex(rawText, fallback);
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

