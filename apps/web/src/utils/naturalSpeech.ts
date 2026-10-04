/**
 * Natural Neural Speech Engine for Zonalyze
 * Provides human-sounding, native pronunciation in English, Hindi (हिन्दी), and Bangla (বাংলা).
 */

export type SupportedSpeechLang = "en" | "hi" | "bn";

export function cleanTextForSpeech(raw: string): string {
  if (!raw) return "";

  return raw
    // Strip markdown formatting
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/#+\s*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*•]\s+/gm, "")
    .replace(/\|/g, " ")
    // Remove decorative emojis that may interrupt speech
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    // Collapse excess whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Splits text into natural sentence-length chunks (<= 130 characters)
 * Respects English/Latin punctuation (., ?, !), Hindi/Bangla dari (।), and newlines.
 */
export function chunkTextForSpeech(text: string, maxLen: number = 130): string[] {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return [];

  // Match sentences ending in ., ?, !, ।, ;, or newline
  const sentenceRegex = /[^.!?।;\n]+[.!?।;\n]*/g;
  const rawSentences = cleaned.match(sentenceRegex) || [cleaned];

  const chunks: string[] = [];

  for (const raw of rawSentences) {
    const s = raw.trim();
    if (!s) continue;

    if (s.length <= maxLen) {
      chunks.push(s);
    } else {
      // Split long sentence by commas or words
      const subParts = s.split(/([,，]\s*|\s+)/);
      let current = "";

      for (const part of subParts) {
        if ((current + part).length <= maxLen) {
          current += part;
        } else {
          if (current.trim()) chunks.push(current.trim());
          current = part.trim();
        }
      }
      if (current.trim()) chunks.push(current.trim());
    }
  }

  return chunks.filter((c) => c.length > 0);
}

export interface SpeechPlayCallbacks {
  onStart?: () => void;
  onChunkChange?: (index: number, total: number) => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

/**
 * NaturalAudioPlayer manages sequential playback with zero-latency preloading
 * and graceful fallback to browser speech synthesis.
 */
export class NaturalAudioPlayer {
  private currentAudio: HTMLAudioElement | null = null;
  private nextAudio: HTMLAudioElement | null = null;
  private chunks: string[] = [];
  private currentChunkIndex: number = 0;
  private lang: SupportedSpeechLang = "en";
  private isStopped: boolean = false;
  private isPausedState: boolean = false;
  private callbacks: SpeechPlayCallbacks = {};
  public currentMessageId: string | null = null;

  public isPlaying(): boolean {
    return !this.isStopped && !this.isPausedState && !!this.currentAudio;
  }

  public isPaused(): boolean {
    return this.isPausedState;
  }

  public getCurrentChunkIndex(): number {
    return this.currentChunkIndex;
  }

  private getAudioUrl(chunk: string, lang: SupportedSpeechLang): string {
    const safeChunk = chunk.slice(0, 150);
    // Primary: Zonalyze Backend TTS Proxy
    return `/api/investigate/tts?text=${encodeURIComponent(safeChunk)}&lang=${lang}`;
  }

  private getDirectFallbackUrl(chunk: string, lang: SupportedSpeechLang): string {
    const safeChunk = chunk.slice(0, 150);
    // Secondary: Direct Google Neural TTS stream
    return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      safeChunk
    )}&tl=${lang}&client=tw-ob`;
  }

  public play(
    text: string,
    lang: SupportedSpeechLang,
    messageId: string,
    callbacks: SpeechPlayCallbacks = {}
  ): void {
    this.stop();

    this.lang = lang;
    this.currentMessageId = messageId;
    this.callbacks = callbacks;
    this.isStopped = false;
    this.isPausedState = false;

    this.chunks = chunkTextForSpeech(text);
    this.currentChunkIndex = 0;

    if (this.chunks.length === 0) {
      callbacks.onEnd?.();
      return;
    }

    callbacks.onStart?.();
    this.playChunk(0);
  }

  private playChunk(index: number): void {
    if (this.isStopped || index >= this.chunks.length) {
      this.currentMessageId = null;
      this.callbacks.onEnd?.();
      return;
    }

    this.currentChunkIndex = index;
    this.callbacks.onChunkChange?.(index, this.chunks.length);

    const chunk = this.chunks[index];
    const primaryUrl = this.getAudioUrl(chunk, this.lang);

    // Reuse preloaded audio if already initialized for this index
    const audio = this.nextAudio || new Audio(primaryUrl);
    this.nextAudio = null;
    this.currentAudio = audio;

    let hasFallbackTriggered = false;

    // Preload next chunk audio ahead of time for seamless transition
    if (index + 1 < this.chunks.length && !this.isStopped) {
      const nextChunk = this.chunks[index + 1];
      const nextUrl = this.getAudioUrl(nextChunk, this.lang);
      this.nextAudio = new Audio(nextUrl);
      this.nextAudio.preload = "auto";
    }

    audio.onended = () => {
      if (this.isStopped) return;
      this.playChunk(index + 1);
    };

    audio.onerror = () => {
      if (this.isStopped) return;

      if (!hasFallbackTriggered) {
        hasFallbackTriggered = true;
        // Try direct fallback
        const directAudio = new Audio(this.getDirectFallbackUrl(chunk, this.lang));
        this.currentAudio = directAudio;

        directAudio.onended = () => {
          if (this.isStopped) return;
          this.playChunk(index + 1);
        };

        directAudio.onerror = () => {
          // If network audio completely fails, fallback to SpeechSynthesis for remaining chunks
          this.fallbackToSpeechSynthesis(index);
        };

        directAudio.play().catch(() => {
          this.fallbackToSpeechSynthesis(index);
        });
        return;
      }

      this.fallbackToSpeechSynthesis(index);
    };

    audio.play().catch((err) => {
      console.warn("Audio autoplay blocked or failed, trying direct fallback:", err);
      if (!hasFallbackTriggered) {
        hasFallbackTriggered = true;
        const directAudio = new Audio(this.getDirectFallbackUrl(chunk, this.lang));
        this.currentAudio = directAudio;

        directAudio.onended = () => {
          if (this.isStopped) return;
          this.playChunk(index + 1);
        };

        directAudio.play().catch(() => {
          this.fallbackToSpeechSynthesis(index);
        });
      } else {
        this.fallbackToSpeechSynthesis(index);
      }
    });
  }

  private fallbackToSpeechSynthesis(fromIndex: number): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || this.isStopped) {
      this.currentMessageId = null;
      this.callbacks.onEnd?.();
      return;
    }

    const remainingText = this.chunks.slice(fromIndex).join(" ");
    const utterance = new SpeechSynthesisUtterance(remainingText);

    const langMap: Record<SupportedSpeechLang, string> = {
      en: "en-US",
      hi: "hi-IN",
      bn: "bn-IN",
    };
    utterance.lang = langMap[this.lang] || "en-US";

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith(this.lang)) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      this.currentMessageId = null;
      this.callbacks.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis fallback error:", e);
      this.currentMessageId = null;
      this.callbacks.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public pause(): void {
    if (this.currentAudio && !this.isPausedState) {
      this.currentAudio.pause();
      this.isPausedState = true;
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      this.isPausedState = true;
    }
  }

  public resume(): void {
    if (this.currentAudio && this.isPausedState) {
      this.currentAudio.play().catch(console.warn);
      this.isPausedState = false;
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      this.isPausedState = false;
    }
  }

  public stop(): void {
    this.isStopped = true;
    this.isPausedState = false;
    this.currentMessageId = null;

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = "";
      this.currentAudio = null;
    }

    if (this.nextAudio) {
      this.nextAudio.src = "";
      this.nextAudio = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

// Global singleton instance for shared audio playback across the application
export const naturalVoicePlayer = new NaturalAudioPlayer();
