import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, Square } from "lucide-react";
import { AiReportData } from "../../types/investigation";
import { naturalVoicePlayer, SupportedSpeechLang } from "../../utils/naturalSpeech";

interface AudioDebriefPlayerProps {
  aiReport: AiReportData;
  locationName: string;
}

const DEBRIEF_LANGUAGES: { code: SupportedSpeechLang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "हिन्दी", name: "Hindi" },
  { code: "bn", label: "বাংলা", name: "Bangla" },
];

export const AudioDebriefPlayer: React.FC<AudioDebriefPlayerProps> = ({
  aiReport,
  locationName,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<SupportedSpeechLang>("en");

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      naturalVoicePlayer.stop();
    };
  }, []);

  // Stop audio whenever location changes
  useEffect(() => {
    naturalVoicePlayer.stop();
    setIsPlaying(false);
    setIsPaused(false);
  }, [locationName]);

  const assembleSpeechText = (lang: SupportedSpeechLang): string => {
    const parts: string[] = [];

    if (lang === "hi") {
      parts.push(`${locationName} के लिए ज़ोनलाइज़ फोरेंसिक रिपोर्ट।`);
      if (aiReport.insights_in_brief) {
        const { transit, healthcare, environment, acoustic } = aiReport.insights_in_brief;
        if (transit) parts.push(`यातायात: ${transit}।`);
        if (healthcare) parts.push(`स्वास्थ्य सुविधाएं: ${healthcare}।`);
        if (environment) parts.push(`पर्यावरण एवं वायु: ${environment}।`);
        if (acoustic) parts.push(`ध्वनि स्तर: ${acoustic}।`);
      }
      if (aiReport.summary) {
        parts.push(`सारांश: ${aiReport.summary}।`);
      }
    } else if (lang === "bn") {
      parts.push(`${locationName} এর জন্য জোনলাইজ ফরেনসিক রিপোর্ট।`);
      if (aiReport.insights_in_brief) {
        const { transit, healthcare, environment, acoustic } = aiReport.insights_in_brief;
        if (transit) parts.push(`যাতায়াত ব্যবস্থা: ${transit}।`);
        if (healthcare) parts.push(`স্বাস্থ্যসেবা: ${healthcare}।`);
        if (environment) parts.push(`বায়ু ও পরিবেশ: ${environment}।`);
        if (acoustic) parts.push(`শব্দ মাত্রা: ${acoustic}।`);
      }
      if (aiReport.summary) {
        parts.push(`সংক্ষিপ্ত বিবরণ: ${aiReport.summary}।`);
      }
    } else {
      parts.push(`Zonalyze forensic debrief for ${locationName}.`);
      if (aiReport.insights_in_brief) {
        const { transit, healthcare, environment, acoustic } = aiReport.insights_in_brief;
        if (transit) parts.push(`Transit insights: ${transit}.`);
        if (healthcare) parts.push(`Healthcare readiness: ${healthcare}.`);
        if (environment) parts.push(`Atmospheric health: ${environment}.`);
        if (acoustic) parts.push(`Acoustic environment: ${acoustic}.`);
      }
      if (aiReport.summary) {
        parts.push(`Executive overview: ${aiReport.summary}.`);
      }
    }

    return parts.join(" ");
  };

  const handlePlay = () => {
    if (isPaused) {
      naturalVoicePlayer.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    naturalVoicePlayer.stop();

    const text = assembleSpeechText(selectedLang);
    naturalVoicePlayer.play(text, selectedLang, "debrief-audio", {
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      onError: (err) => {
        console.warn("Debrief audio error:", err);
        setIsPlaying(false);
        setIsPaused(false);
      },
    });

    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    naturalVoicePlayer.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    naturalVoicePlayer.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const changeLanguage = (lang: SupportedSpeechLang) => {
    if (lang === selectedLang) return;
    const wasActive = isPlaying;
    handleStop();
    setSelectedLang(lang);
    if (wasActive) {
      setTimeout(() => {
        const text = assembleSpeechText(lang);
        naturalVoicePlayer.play(text, lang, "debrief-audio", {
          onStart: () => setIsPlaying(true),
          onEnd: () => {
            setIsPlaying(false);
            setIsPaused(false);
          },
          onError: () => {
            setIsPlaying(false);
            setIsPaused(false);
          },
        });
        setIsPlaying(true);
      }, 150);
    }
  };

  return (
    <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-blue-950/70 border border-indigo-500/40 shadow-lg flex items-center justify-between space-x-3 backdrop-blur-md">
      {/* Left: Icon & Title */}
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
          {isPlaying ? (
            <Volume2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-200 tracking-[-0.01em] truncate" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
              Voice Audit
            </span>
            <span className="text-[9px] font-mono text-cyan-300 bg-cyan-500/20 px-1.5 py-0.2 rounded border border-cyan-500/30 shrink-0 hidden xs:inline-block">
              Natural Voice
            </span>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {isPlaying ? (
              <span className="text-emerald-400 font-medium flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1 inline-block" />
                Reading in{" "}
                {selectedLang === "hi"
                  ? "हिन्दी"
                  : selectedLang === "bn"
                    ? "বাংলা"
                    : "English"}
                ...
              </span>
            ) : isPaused ? (
              <span className="text-amber-400">Audio paused</span>
            ) : (
              <span>Listen in native voice</span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Waveform Bars (Active when playing) */}
      {isPlaying && (
        <div className="hidden sm:flex items-center space-x-1 h-5 px-2">
          <div
            className="w-1 bg-cyan-400 rounded-full animate-bounce h-3"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-1 bg-blue-400 rounded-full animate-bounce h-5"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-1 bg-indigo-400 rounded-full animate-bounce h-4"
            style={{ animationDelay: "300ms" }}
          />
          <div
            className="w-1 bg-purple-400 rounded-full animate-bounce h-5"
            style={{ animationDelay: "100ms" }}
          />
          <div
            className="w-1 bg-emerald-400 rounded-full animate-bounce h-2"
            style={{ animationDelay: "250ms" }}
          />
        </div>
      )}

      {/* Right: Language switch & Controls */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* 3-Language Toggle: EN | HI | BN */}
        <div className="flex items-center bg-slate-900/80 p-0.5 rounded-xl border border-slate-800">
          {DEBRIEF_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium transition ${selectedLang === lang.code
                ? "bg-indigo-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-slate-200"
                }`}
              title={`Switch audio to ${lang.name}`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95 transition"
            title="Play Audio Debrief"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">{isPaused ? "Resume" : "Listen"}</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition"
            title="Pause audio"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            onClick={handleStop}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Stop audio"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
};
