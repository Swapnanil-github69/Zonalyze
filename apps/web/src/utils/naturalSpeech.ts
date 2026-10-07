/**
 * Natural Neural Speech Engine for Zonalyze
 * Provides human-sounding, native pronunciation in English, Hindi (हिन्दी), and Bangla (বাংলা).
 */

export type SupportedSpeechLang = "en" | "hi" | "bn";

/**
 * Strips prepended language tags like [English], [Bangla], [Hindi], [Bengali], (English), etc.
 */
export function sanitizeChatText(text: string): string {
  if (!text) return "";
  return text
    .replace(/^\*{0,2}\[(English|Bangla|Bengali|Hindi)\]\*{0,2}:?\s*/i, "")
    .replace(/^\*{0,2}\((English|Bangla|Bengali|Hindi)\)\*{0,2}:?\s*/i, "")
    .replace(/^\[(English|Bangla|Bengali|Hindi)\]:?\s*/i, "")
    .replace(/^\((English|Bangla|Bengali|Hindi)\):?\s*/i, "")
    .trim();
}

// Cached voices list from Web Speech API
let cachedVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Discovers and prioritizes the most natural, human-sounding voice available in the client browser.
 * Prioritizes neural, natural, Google, and online voices over legacy robotic synthesizers.
 */
export function getBestConversationalVoice(
  lang: SupportedSpeechLang
): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  let voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    voices = cachedVoices;
  }
  if (!voices || voices.length === 0) return null;

  const langTag = lang.toLowerCase();

  // Find all voices matching the target language
  const matchingVoices = voices.filter((v) => {
    const vLang = v.lang.toLowerCase();
    if (langTag === "hi") return vLang.startsWith("hi");
    if (langTag === "bn") return vLang.startsWith("bn") || vLang.includes("bengali");
    return vLang.startsWith("en");
  });

  const pool = matchingVoices.length > 0 ? matchingVoices : voices;

  // Priority order for natural human conversational timbre:
  // 1. Natural / Neural / Online voices (Edge & Windows Natural voices like 'Aria', 'Guy', 'Swara', 'Bashkar')
  const naturalVoice = pool.find((v) =>
    /natural|neural|online|multilingual/i.test(v.name)
  );
  if (naturalVoice) return naturalVoice;

  // 2. Google voices (Google US English, Google हिन्दी, Google বাংলা)
  const googleVoice = pool.find((v) => /google/i.test(v.name));
  if (googleVoice) return googleVoice;

  // 3. Apple Siri or Enhanced voices
  const enhancedVoice = pool.find((v) => /enhanced|premium|siri/i.test(v.name));
  if (enhancedVoice) return enhancedVoice;

  // 4. Remote / cloud-backed voices
  const remoteVoice = pool.find((v) => !v.localService);
  if (remoteVoice) return remoteVoice;

  // 5. Targeted regional locale voices
  const localeVoice = pool.find((v) => {
    if (langTag === "en") return v.lang === "en-IN" || v.lang === "en-US" || v.lang === "en-GB";
    if (langTag === "hi") return v.lang === "hi-IN";
    if (langTag === "bn") return v.lang === "bn-IN" || v.lang === "bn-BD";
    return true;
  });
  if (localeVoice) return localeVoice;

  return pool[0] || null;
}

/**
 * Tunes Web Speech utterance parameters for human, conversational delivery.
 */
export function configureConversationalUtterance(
  utterance: SpeechSynthesisUtterance,
  lang: SupportedSpeechLang
): void {
  const langMap: Record<SupportedSpeechLang, string> = {
    en: "en-US",
    hi: "hi-IN",
    bn: "bn-IN",
  };
  utterance.lang = langMap[lang] || "en-US";

  const voice = getBestConversationalVoice(lang);
  if (voice) {
    utterance.voice = voice;
  }

  // Conversational pacing:
  // Rate: 0.98 prevents rushed, synthetic pacing and ensures clarity for Indian names and distances
  // Pitch: 1.02 gives warm, pleasant vocal inflection without robotic monotone
  utterance.rate = 0.98;
  utterance.pitch = 1.02;
  utterance.volume = 1.0;
}

export function cleanTextForSpeech(raw: string): string {
  if (!raw) return "";

  // Strip prepended language tags first
  const sanitized = sanitizeChatText(raw);

  return sanitized
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

    const remainingChunks = this.chunks.slice(fromIndex);
    if (remainingChunks.length === 0) {
      this.currentMessageId = null;
      this.callbacks.onEnd?.();
      return;
    }

    // Cancel any previous utterances
    window.speechSynthesis.cancel();

    const speakChunk = (idx: number) => {
      if (this.isStopped || idx >= remainingChunks.length) {
        this.currentMessageId = null;
        this.callbacks.onEnd?.();
        return;
      }

      this.currentChunkIndex = fromIndex + idx;
      this.callbacks.onChunkChange?.(this.currentChunkIndex, this.chunks.length);

      const chunkText = remainingChunks[idx];
      const utterance = new SpeechSynthesisUtterance(chunkText);
      configureConversationalUtterance(utterance, this.lang);

      utterance.onend = () => {
        if (this.isStopped) return;
        // Natural micro-pause (80ms) between sentences mimics human breath cadence
        setTimeout(() => speakChunk(idx + 1), 80);
      };

      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis error:", e);
        if (this.isStopped) return;
        setTimeout(() => speakChunk(idx + 1), 60);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakChunk(0);
  }

  /**
   * Directly synthesizes speech using the client browser's Web Speech API with
   * natural voice selection and conversational cadence.
   */
  public speakWithWebSpeech(
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
    this.fallbackToSpeechSynthesis(0);
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
