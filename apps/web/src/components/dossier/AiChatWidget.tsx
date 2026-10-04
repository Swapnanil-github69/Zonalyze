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
  Languages,
} from "lucide-react";
import { InvestigationResult } from "../../types/investigation";
import { askLocationAi } from "../../api/client";
import { naturalVoicePlayer, SupportedSpeechLang } from "../../utils/naturalSpeech";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

interface AiChatWidgetProps {
  investigation: InvestigationResult;
}

export interface LanguageOption {
  code: string;
  name: string;
  label: string;
  nativeName: string;
  speechLang: SupportedSpeechLang;
  welcome: string;
  prompts: string[];
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "en-US",
    name: "English",
    label: "English",
    nativeName: "EN",
    speechLang: "en",
    welcome:
      "Ask me anything about this neighborhood — from safety, nearby schools, markets, and commute routes to live decibels, air quality, or distances to any landmark in the city.",
    prompts: [
      "Is this location safe to walk at night?",
      "How far is Victoria Memorial or Airport?",
      "Are there good schools & daily markets nearby?",
      "How is public transit & metro connectivity?",
      "What are the pros and cons of living here?",
    ],
  },
  {
    code: "hi-IN",
    name: "Hindi",
    label: "हिन्दी",
    nativeName: "हिन्दी",
    speechLang: "hi",
    welcome:
      "इस इलाके के बारे में कुछ भी पूछें — सुरक्षा, स्कूल, आवागमन, शोर, वायु गुणवत्ता, या शहर के किसी भी स्थल या दुकान की दूरी।",
    prompts: [
      "क्या यह इलाका रात में चलने के लिए सुरक्षित है?",
      "नजदीकी मेट्रो या रेलवे स्टेशन कितनी दूर है?",
      "क्या आसपास अच्छे स्कूल और बाजार मौजूद हैं?",
      "यहां रहने के क्या फायदे और नुकसान हैं?",
      "नजदीकी अस्पताल कितनी दूरी पर है?",
    ],
  },
  {
    code: "bn-IN",
    name: "Bangla",
    label: "বাংলা",
    nativeName: "বাংলা",
    speechLang: "bn",
    welcome:
      "এই এলাকা সম্পর্কে যেকোনো প্রশ্ন করুন — নিরাপত্তা, স্কুল, যাতায়াত, বায়ুর মান, শব্দ বা যেকোনো দোকান বা দর্শনীয় স্থানের দূরত্ব।",
    prompts: [
      "এই এলাকা কি রাতে হাঁটার জন্য নিরাপদ?",
      "নিকটবর্তী মেট্রো বা রেল স্টেশন কত দূরে?",
      "কাছাকাছি ভালো স্কুল ও বাজার আছে কি?",
      "এখানে বসবাসের সুবিধা ও অসুবিধা কী কী?",
      "নিকটবর্তী হাসপাতাল কত দূর?",
    ],
  },
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
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

  const conversationRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition for active language
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("speechSynthesis" in window)) {
      setSpeechSupported(false);
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionSupported(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = selectedLang.code;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript) {
            setInputText(transcript);
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
  }, [selectedLang.code]);

  // Reset messages when investigation or language changes
  useEffect(() => {
    const locationName = investigation.address || "this coordinate";

    setMessages([
      {
        id: `welcome-${selectedLang.code}`,
        role: "assistant",
        text: `[${selectedLang.label}] ${locationName}: ${selectedLang.welcome}`,
        timestamp: new Date(),
      },
    ]);

    return () => {
      naturalVoicePlayer.stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [investigation._id, investigation.address, selectedLang.code]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      naturalVoicePlayer.stop();
    };
  }, []);

  // Keep message scrolling inside the conversation instead of moving the dossier.
  useEffect(() => {
    const conversation = conversationRef.current;
    conversation?.scrollTo({ top: conversation.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const speakText = (text: string, messageId: string) => {
    if (speakingMessageId === messageId) {
      naturalVoicePlayer.stop();
      setSpeakingMessageId(null);
      return;
    }

    naturalVoicePlayer.stop();
    setSpeakingMessageId(messageId);

    naturalVoicePlayer.play(text, selectedLang.speechLang, messageId, {
      onStart: () => setSpeakingMessageId(messageId),
      onEnd: () => setSpeakingMessageId(null),
      onError: (err) => {
        console.warn("Natural audio playback error:", err);
        setSpeakingMessageId(null);
      },
    });
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        naturalVoicePlayer.stop();
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
        setSpeakingMessageId(null);

        recognitionRef.current.lang = selectedLang.code;
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
        .filter((m) => !m.id.startsWith("welcome-"))
        .map((m) => ({
          role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
          text: m.text,
        }));

      const reply = await askLocationAi(
        textToSend,
        investigation,
        chatHistory,
        selectedLang.name
      );

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
        text: "I analyzed the telemetry for this area, but encountered a temporary connection glitch. Please feel free to ask again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    naturalVoicePlayer.stop();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);

    const locationName = investigation.address || "this location";
    setMessages([
      {
        id: `welcome-${selectedLang.code}-${Date.now()}`,
        role: "assistant",
        text: `[${selectedLang.label}] ${locationName}: ${selectedLang.welcome}`,
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
                Multilingual
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Speak or ask in any language • Audio voice readout
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 relative">
          {/* Language Selector Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/60 border border-indigo-500/40 text-[10px] font-mono font-semibold text-indigo-300 hover:text-white transition shadow"
              title="Change language / भाषा बदलें"
            >
              <Languages className="w-3 h-3 text-indigo-400" />
              <span>{selectedLang.label}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-8 z-50 w-44 rounded-xl bg-slate-900 border border-indigo-500/40 shadow-2xl p-1.5 space-y-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[9px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Select Language / भाषा / ভাষা
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      naturalVoicePlayer.stop();
                      setSpeakingMessageId(null);
                      setSelectedLang(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                      selectedLang.code === lang.code
                        ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{lang.label}</span>
                      <span className="text-[10px] opacity-75">{lang.name}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 font-mono">
                      {lang.nativeName}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
          {/* Quick prompt chips (localized to active language) */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center">
              <Sparkles className="w-3 h-3 text-indigo-400 mr-1" />
              Quick Questions ({selectedLang.label})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedLang.prompts.map((prompt, idx) => (
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
          <div
            ref={conversationRef}
            className="h-60 overflow-y-auto pr-1 space-y-2.5 rounded-xl bg-slate-900/50 p-2.5 border border-slate-800/60 custom-scrollbar"
          >
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
                            Gemini Location Analyst ({selectedLang.label})
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

                    {/* Natural Voice Readout button for Assistant */}
                    {isAssistant && (
                      <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={() => speakText(msg.text, msg.id)}
                          className={`flex items-center space-x-1.5 text-[10px] px-2.5 py-1 rounded-lg transition font-medium ${
                            isSpeaking
                              ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-sm shadow-indigo-500/20"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/60"
                          }`}
                          title={`Listen in natural ${selectedLang.label} voice`}
                        >
                          {isSpeaking ? (
                            <>
                              <div className="flex items-center space-x-0.5 mr-0.5">
                                <span className="w-0.5 h-2 bg-indigo-400 animate-pulse rounded-full" />
                                <span className="w-0.5 h-3.5 bg-cyan-400 animate-bounce rounded-full" />
                                <span className="w-0.5 h-2.5 bg-purple-400 animate-pulse rounded-full" />
                              </div>
                              <VolumeX className="w-3 h-3 text-rose-400" />
                              <span>Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 text-indigo-400" />
                              <span>Speak ({selectedLang.label})</span>
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
                <span className="font-mono">Analyzing location & synthesizing response...</span>
              </div>
            )}
          </div>

          {/* Voice Input Indicator */}
          {isListening && (
            <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between animate-pulse">
              <div className="flex items-center space-x-2 text-xs text-rose-300">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                <span className="font-mono font-medium">
                  Listening ({selectedLang.label})... Speak now
                </span>
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
                    ? `Listening in ${selectedLang.label}...`
                    : selectedLang.code === "hi-IN"
                    ? "सुरक्षा, स्कूल, मेट्रो, दूरी या किसी भी चीज़ के बारे में पूछें..."
                    : selectedLang.code === "bn-IN"
                    ? "নিরাপত্তা, মেট্রো, হাসপাতাল বা যেকোনো দূরত্ব সম্পর্কে জিজ্ঞেস করুন..."
                    : "Ask anything about this area (safety, schools, distance, commute, vibe)..."
                }
                disabled={isLoading}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50"
              />
            </div>

            {/* Microphone Button (Speech-to-Text in selected language) */}
            {recognitionSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition ${
                  isListening
                    ? "bg-rose-600 text-white border-rose-500 animate-pulse shadow-lg shadow-rose-600/40"
                    : "bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700"
                }`}
                title={
                  isListening
                    ? "Stop listening"
                    : `Speak your question in ${selectedLang.label} using microphone`
                }
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
