import React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { AuditStage } from "../../types/investigation";

interface DossierSkeletonProps {
  stage?: AuditStage;
  lat?: number;
  lng?: number;
}

export const DossierSkeleton: React.FC<DossierSkeletonProps> = ({ stage, lat, lng }) => {
  const getStageMessage = () => {
    switch (stage) {
      case "checking_cache":
        return "Auditing MongoDB 2dsphere index for 150m cache...";
      case "ingesting_telemetry":
        return "Parallel telemetry ingestion (Open-Meteo, Overpass, Nominatim)...";
      case "computing_heuristics":
        return "Executing Haversine matrix & acoustic attenuation proxy...";
      case "synthesizing_ai":
        return "Gemma synthesizing forensic debrief & inspection targets...";
      default:
        return "Streaming geospatial telemetry pipeline...";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      {/* Top Banner Status */}
      <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0">
          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              Pipeline Active
            </span>
            {lat !== undefined && lng !== undefined && (
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-300 truncate mt-0.5">{getStageMessage()}</p>
        </div>
      </div>

      {/* 1. Header Shimmer Placeholder */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 space-y-2.5">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-24 rounded-full shimmer-card" />
          <div className="h-5 w-28 rounded-full shimmer-card" />
        </div>
        <div className="h-6 w-4/5 rounded-lg shimmer-card mt-1" />
        <div className="h-4 w-1/2 rounded-md shimmer-card" />
      </div>

      {/* 2. Livability Score Ring Shimmer */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 w-36 rounded-md shimmer-card" />
          <div className="h-4 w-20 rounded-full shimmer-card" />
        </div>
        <div className="flex items-center space-x-5 pt-1">
          <div className="w-[100px] h-[100px] rounded-full shimmer-card shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-3 w-full rounded shimmer-card" />
            <div className="h-3 w-5/6 rounded shimmer-card" />
            <div className="h-3 w-4/5 rounded shimmer-card" />
            <div className="h-3 w-3/4 rounded shimmer-card" />
          </div>
        </div>
      </div>

      {/* 3. Environment Telemetry Shimmer */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 w-44 rounded-md shimmer-card" />
          <div className="h-5 w-24 rounded-full shimmer-card" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 rounded-xl shimmer-card" />
          <div className="h-20 rounded-xl shimmer-card" />
          <div className="h-20 rounded-xl shimmer-card" />
          <div className="h-20 rounded-xl shimmer-card" />
        </div>
        <div className="h-24 rounded-xl shimmer-card" />
      </div>

      {/* 4. Noise Exposure Shimmer */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 w-40 rounded-md shimmer-card" />
          <div className="h-5 w-28 rounded-full shimmer-card" />
        </div>
        <div className="h-24 rounded-xl shimmer-card" />
      </div>

      {/* 5. Facilities Grid Shimmer */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 w-40 rounded-md shimmer-card" />
          <div className="h-4 w-24 rounded-full shimmer-card" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-16 rounded-xl shimmer-card" />
          <div className="h-16 rounded-xl shimmer-card" />
          <div className="h-16 rounded-xl shimmer-card" />
        </div>
        <div className="space-y-2 pt-1">
          <div className="h-12 rounded-xl shimmer-card" />
          <div className="h-12 rounded-xl shimmer-card" />
        </div>
      </div>

      {/* 6. AI Debrief Shimmer */}
      <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20 space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <div className="h-4 w-32 rounded-md shimmer-card" />
        </div>
        <div className="h-16 rounded-xl shimmer-card" />
        <div className="space-y-2">
          <div className="h-10 rounded-lg shimmer-card" />
          <div className="h-10 rounded-lg shimmer-card" />
          <div className="h-10 rounded-lg shimmer-card" />
        </div>
      </div>
    </div>
  );
};
