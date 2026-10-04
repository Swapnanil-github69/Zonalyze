import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { InvestigationResult } from "../../types/investigation";
import { askLocationAi } from "../../api/client";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

interface AiChatWidgetProps {
  investigation: InvestigationResult;
}

const QUICK_PROMPTS = [
  "Is this location safe to walk at night?",
  "How far is Victoria Memorial or Airport?",
  "Are there good schools & daily markets nearby?",
  "How is public transit & metro connectivity?",
  "What are the pros and cons of living here?",
];

export const AiChatWidget: React.FC<AiChatWidgetProps> = ({ investigation }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [recognitionSupported, setRecognitionSupported] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize browser capabilities & initial greeting
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check TTS support
    if (!("speechSynthesis" in window)) {
      setSpeechSupported(false);
    }

    // Check Speech Recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript) {
            setInputText(transcript);
            // Optionally auto-send voice question
            handleSend(transcript, true);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn("SpeechRecognition setup failed:", err);
        setRecognitionSupported(false);
      }
    }

    // Reset messages when investigation changes
    const locationName = investigation.address || "this coordinate";

    setMessages([
      {
        id: "initial-welcome",
        role: "assistant",
        text: `Hello! I'm your Gemini AI Location Advisor for ${locationName}. You can ask me ANY question about this neighborhood — from safety, nearby schools, markets, and commute routes to live decibels, air quality, or distances to any landmark in the city.`,
        timestamp: new Date(),
      },
    ]);

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [investigation._id, investigation.address]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const speakText = (text: string, messageId: string) => {
    if (!speechSupported || typeof window === "undefined") return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(
      (v) =>
        (v.name.includes("Google") ||
          v.name.includes("Natural") ||
          v.name.includes("Samantha") ||
          v.name.includes("Daniel")) &&
        v.lang.startsWith("en")
    );
    if (voice) utterance.voice = voice;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingMessageId(messageId);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (speakingMessageId && typeof window !== "undefined") {
          window.speechSynthesis.cancel();
          setSpeakingMessageId(null);
        }
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Could not start recognition:", err);
        setIsListening(false);
      }
    }
  };

  const handleSend = async (overrideText?: string, wasSpoken: boolean = false) => {
    const textToSend = (overrideText ?? inputText).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const chatHistory = messages
        .filter((m) => m.id !== "initial-welcome")
        .map((m) => ({
          role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
          text: m.text,
        }));

      const reply = await askLocationAi(textToSend, investigation, chatHistory);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If user spoke or autoSpeak is on, read reply aloud
      if (wasSpoken || autoSpeak) {
        speakText(reply, assistantMsg.id);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        text: "I experienced a temporary network issue contacting the Gemini analysis service. Please try asking again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
    const locationName = investigation.address || "this location";
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        text: `Chat reset. Ask any question about ${locationName}.`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-slate-950/80 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Widget Header */}
      <div className="p-3.5 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border-b border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="text-xs font-bold text-white font-mono tracking-wide">
                Ask Gemini Location AI
              </h4>
              <span className="text-[9px] font-mono text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/30">
                Interactive
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Grounded chat & voice inquiry powered by live telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {speechSupported && (
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`p-1.5 rounded-lg border transition ${
                autoSpeak
                  ? "bg-indigo-600/30 border-indigo-400 text-indigo-300"
                  : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
              title={autoSpeak ? "Auto-voice readout enabled" : "Auto-voice readout disabled"}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={resetChat}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition"
            title={isExpanded ? "Collapse chat" : "Expand chat"}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3.5 space-y-3">
          {/* Quick prompt chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center">
              <Sparkles className="w-3 h-3 text-indigo-400 mr-1" />
              Quick Topics (or ask any question below)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="text-[11px] text-slate-300 hover:text-white bg-slate-900/90 hover:bg-indigo-900/40 border border-slate-800 hover:border-indigo-500/40 rounded-lg px-2.5 py-1 text-left transition disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="h-60 overflow-y-auto pr-1 space-y-2.5 rounded-xl bg-slate-900/50 p-2.5 border border-slate-800/60 custom-scrollbar">
            {messages.map((msg) => {
              const isAssistant = msg.role === "assistant";
              const isSpeaking = speakingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl p-2.5 text-xs leading-relaxed shadow-md ${
                      isAssistant
                        ? "bg-slate-900 border border-indigo-500/25 text-slate-200 rounded-tl-sm"
                        : "bg-indigo-600 text-white rounded-tr-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1 opacity-75 text-[10px]">
                      {isAssistant ? (
                        <>
                          <Bot className="w-3 h-3 text-indigo-400" />
                          <span className="font-mono font-semibold text-indigo-300">
                            Gemini Location Analyst
                          </span>
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 text-white" />
                          <span className="font-mono font-semibold">You</span>
                        </>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Speaker Readout button for Assistant */}
                    {isAssistant && speechSupported && (
                      <div className="mt-2 pt-1 border-t border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => speakText(msg.text, msg.id)}
                          className={`flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-md transition ${
                            isSpeaking
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                          }`}
                          title="Read this answer aloud"
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="w-3 h-3 text-indigo-400 animate-pulse" />
                              <span>Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>Speak</span>
                            </>
                          )}
                        </button>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center space-x-2 text-indigo-400 text-xs p-2 bg-slate-900/60 rounded-xl border border-indigo-500/20 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="font-mono">Synthesizing location telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Input Indicator */}
          {isListening && (
            <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between animate-pulse">
              <div className="flex items-center space-x-2 text-xs text-rose-300">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                <span className="font-mono font-medium">Listening to your voice... Speak now</span>
              </div>
              <button
                onClick={toggleListening}
                className="text-[10px] text-rose-300 font-mono underline hover:text-white"
              >
                Done
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening to your voice..."
                    : "Ask anything about this area (safety, schools, distance, commute, vibe)..."
                }
                disabled={isLoading}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50"
              />
            </div>

            {/* Microphone Button (Speech-to-Text) */}
            {recognitionSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition ${
                  isListening
                    ? "bg-rose-600 text-white border-rose-500 animate-pulse shadow-lg shadow-rose-600/40"
                    : "bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700"
                }`}
                title={isListening ? "Stop listening" : "Speak your question using microphone"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 fill-current" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white shadow-md shadow-indigo-600/30 transition hover:scale-105 active:scale-95 disabled:hover:scale-100"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
