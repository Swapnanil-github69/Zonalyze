import React, { useState } from "react";
import { Zap, Radio, MapPin, X, Clock, Copy, Check } from "lucide-react";
import { InvestigationResult } from "../../types/investigation";

interface DossierHeaderProps {
  investigation: InvestigationResult;
  onClose: () => void;
}

export const DossierHeader: React.FC<DossierHeaderProps> = ({ investigation, onClose }) => {
  const [lon, lat] = investigation.location.coordinates;
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(investigation.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 border-b border-slate-700/60 flex items-start justify-between bg-slate-900/80 sticky top-0 backdrop-blur-md z-20">
      <div className="space-y-2 flex-1 pr-3">
        {/* Badges row */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          {investigation.cached ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
              <Zap className="w-3.5 h-3.5 mr-1 text-emerald-400 fill-emerald-400 animate-pulse" />
              ⚡ Cached (150m)
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10">
              <Radio className="w-3.5 h-3.5 mr-1 text-cyan-400 animate-pulse" />
              📡 Live Audit
            </span>
          )}

          <span className="text-[11px] font-mono text-slate-400 flex items-center bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-700/50">
            <Clock className="w-3 h-3 mr-1 text-slate-400" />
            {formattedDate}
          </span>
        </div>

        {/* Reverse-geocoded Location Address */}
        <h2 className="text-base font-bold text-white leading-snug line-clamp-2">
          {investigation.address || "Reverse-Geocoded Coordinate Target"}
        </h2>

        {/* Coordinates with Copy feature */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-xs text-slate-300 font-mono space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              {lat.toFixed(5)}° N, {lon.toFixed(5)}° E
            </span>
          </div>

          <button
            onClick={handleCopyCoords}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Copy coordinates to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
        aria-label="Close dossier"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
