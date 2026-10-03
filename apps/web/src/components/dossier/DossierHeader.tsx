import React from "react";
import { Zap, MapPin, X, Clock } from "lucide-react";
import { InvestigationResult } from "../../types/investigation";

interface DossierHeaderProps {
  investigation: InvestigationResult;
  onClose: () => void;
}

export const DossierHeader: React.FC<DossierHeaderProps> = ({ investigation, onClose }) => {
  const [lon, lat] = investigation.location.coordinates;
  const formattedDate = new Date(investigation.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="p-5 border-b border-slate-700/60 flex items-start justify-between bg-slate-900/60 sticky top-0 backdrop-blur-md z-20">
      <div className="space-y-1.5 flex-1 pr-4">
        {/* Badges row */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          {investigation.cached ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-3 h-3 mr-1" />
              150m Geospatial Cache Hit
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Fresh Live Audit
            </span>
          )}

          <span className="text-[11px] font-mono text-slate-400 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formattedDate}
          </span>
        </div>

        {/* Address */}
        <h2 className="text-base font-bold text-white leading-snug line-clamp-2">
          {investigation.address}
        </h2>

        {/* Coordinates */}
        <div className="flex items-center text-xs text-slate-400 font-mono space-x-1">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>{lat.toFixed(5)}° N, {lon.toFixed(5)}° E</span>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
