import React from "react";
import { Radar, Loader2, Database, CloudRain, Cpu, Sparkles } from "lucide-react";
import { AuditStage } from "../../types/investigation";

interface RadarScannerProps {
  stage: AuditStage;
  lat: number;
  lng: number;
}

/**
 * Contributor 4: Frontend UI & Viz
 * Telemetry Radar Scanner: Shows live stage progress while external telemetry is being ingested.
 */
export const RadarScanner: React.FC<RadarScannerProps> = ({ stage, lat, lng }) => {
  const getStageInfo = () => {
    switch (stage) {
      case "checking_cache":
        return {
          icon: <Database className="w-5 h-5 text-emerald-400 animate-pulse" />,
          title: "Auditing Geospatial Cache",
          desc: "Scanning MongoDB 2dsphere index for prior investigation within 150m...",
        };
      case "ingesting_telemetry":
        return {
          icon: <CloudRain className="w-5 h-5 text-cyan-400 animate-bounce" />,
          title: "Parallel Telemetry Ingestion",
          desc: "Streaming real-time readings from Open-Meteo, Overpass & Nominatim...",
        };
      case "computing_heuristics":
        return {
          icon: <Cpu className="w-5 h-5 text-blue-400 animate-spin" />,
          title: "Deterministic Heuristics Engine",
          desc: "Calculating Haversine distances & acoustic noise attenuation model...",
        };
      case "synthesizing_ai":
        return {
          icon: <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />,
          title: "Forensic Synthesis (Gemini)",
          desc: "Generating empirical observations and site inspection targets...",
        };
      default:
        return {
          icon: <Radar className="w-5 h-5 text-blue-400 animate-spin" />,
          title: "Initializing Investigation",
          desc: "Preparing audit coordinate...",
        };
    }
  };

  const info = getStageInfo();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md">
      <div className="glass-panel-elevated p-4 rounded-2xl shadow-2xl border border-blue-500/30 flex items-center space-x-4">
        {/* Animated Radar Pulse */}
        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 shrink-0">
          <span className="absolute w-8 h-8 rounded-full bg-blue-500/20 animate-ping" />
          {info.icon}
        </div>

        {/* Text telemetry */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-semibold text-white truncate">{info.title}</h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">{info.desc}</p>
        </div>

        <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
      </div>
    </div>
  );
};
