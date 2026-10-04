import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, Square } from "lucide-react";
import { AiReportData } from "../../types/investigation";

interface AudioDebriefPlayerProps {
  aiReport: AiReportData;
  locationName: string;
}

export const AudioDebriefPlayer: React.FC<AudioDebriefPlayerProps> = ({
  aiReport,
  locationName,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop audio whenever location changes
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [locationName]);

  const assembleSpeechText = (): string => {
    const parts: string[] = [];
    parts.push(`Zonalyze forensic debrief for ${locationName}.`);

    if (aiReport.insights_in_brief) {
      const { transit, healthcare, environment, acoustic } = aiReport.insights_in_brief;
      if (transit) parts.push(`Transit insights: ${transit}`);
      if (healthcare) parts.push(`Healthcare readiness: ${healthcare}`);
      if (environment) parts.push(`Atmospheric health: ${environment}`);
      if (acoustic) parts.push(`Acoustic environment: ${acoustic}`);
    }

    if (aiReport.summary) {
      parts.push(`Executive overview: ${aiReport.summary}`);
    }

    return parts.join(" ");
  };

  const handlePlay = () => {
    if (!isSupported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const text = assembleSpeechText();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Pick a natural-sounding English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        (v.name.includes("Natural") ||
          v.name.includes("Google") ||
          v.name.includes("Samantha") ||
          v.name.includes("Daniel") ||
          v.name.includes("Premium")) &&
        v.lang.startsWith("en")
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!isSupported || !isPlaying) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const toggleRate = () => {
    const nextRate = playbackRate === 1.0 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1.0;
    setPlaybackRate(nextRate);
    if (isPlaying && utteranceRef.current) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-blue-950/70 border border-indigo-500/40 shadow-lg flex items-center justify-between space-x-3 backdrop-blur-md">
      {/* Left: Icon & Title */}
      <div className="flex items-center space-x-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-white font-mono tracking-wide truncate">
              Voice Audio Debrief
            </span>
            <span className="text-[9px] font-mono text-indigo-300 bg-indigo-500/20 px-1.5 py-0.2 rounded border border-indigo-500/30">
              AI Voice
            </span>
          </div>
          <div className="text-[10px] text-slate-400 truncate flex items-center space-x-1">
            {isPlaying ? (
              <span className="text-emerald-400 font-medium flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1 inline-block" />
                Reading Overview aloud...
              </span>
            ) : isPaused ? (
              <span className="text-amber-400">Audio playback paused</span>
            ) : (
              <span>Listen to location audit insights</span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Waveform Bars (Active when playing) */}
      {isPlaying && (
        <div className="hidden sm:flex items-center space-x-1 h-5 px-2">
          <div className="w-1 bg-cyan-400 rounded-full animate-bounce h-3" style={{ animationDelay: "0ms" }} />
          <div className="w-1 bg-blue-400 rounded-full animate-bounce h-5" style={{ animationDelay: "150ms" }} />
          <div className="w-1 bg-indigo-400 rounded-full animate-bounce h-4" style={{ animationDelay: "300ms" }} />
          <div className="w-1 bg-purple-400 rounded-full animate-bounce h-5" style={{ animationDelay: "100ms" }} />
          <div className="w-1 bg-emerald-400 rounded-full animate-bounce h-2" style={{ animationDelay: "250ms" }} />
        </div>
      )}

      {/* Right: Controls */}
      <div className="flex items-center space-x-1.5 shrink-0">
        <button
          onClick={toggleRate}
          className="text-[10px] font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700 transition"
          title="Change playback speed"
        >
          {playbackRate}x
        </button>

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
