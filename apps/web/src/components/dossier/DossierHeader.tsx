import React, { useState } from "react";
import { Radio, MapPin, X, Clock, Copy, Check, RadioReceiver } from "lucide-react";
import { InvestigationResult } from "../../types/investigation";

interface DossierHeaderProps {
  investigation: InvestigationResult;
  onClose: () => void;
}

export const DossierHeader: React.FC<DossierHeaderProps> = ({ investigation, onClose }) => {
  const [lon, lat] = investigation.location.coordinates;
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(investigation.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${lat.toFixed(5)}° N, ${lon.toFixed(5)}° E`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ios-dark-glass-header p-5 sticky top-0 z-20 space-y-3">
      {/* Top Controls Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          {/* Live Telemetry Pill */}
          <div className="flex items-center space-x-1.5 bg-[#182a35] text-[#2dd4bf] text-xs font-semibold px-3 py-1 rounded-full border border-[#2dd4bf]/30 shadow-sm">
            <RadioReceiver className="w-3.5 h-3.5 text-[#2dd4bf] animate-pulse" />
            <span>Live Telemetry</span>
          </div>

          {/* Date Clock Pill */}
          <div className="flex items-center space-x-1.5 bg-[#1a2736] text-slate-300 text-xs font-mono px-3 py-1 rounded-full border border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-800/80 text-slate-400 hover:text-white transition shrink-0"
          aria-label="Close dossier"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Address Title */}
      <h2 className="text-base sm:text-lg font-bold text-white leading-snug font-sans tracking-tight">
        {investigation.address || "AE Block, Sector I, Bidhannagar, Kolkata Metropolitan Area, Rajarhat, North 24 Parganas"}
      </h2>

      {/* Coordinates & Copy Pill */}
      <div className="flex items-center space-x-2">
        <div className="inline-flex items-center space-x-1.5 bg-[#182736] px-3 py-1 rounded-xl border border-slate-700/60 text-xs font-mono text-slate-200">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {lat.toFixed(5)}° N, {lon.toFixed(5)}° E
          </span>
        </div>

        <button
          onClick={handleCopyCoords}
          className="p-1.5 rounded-lg bg-[#182736] border border-slate-700/60 text-slate-400 hover:text-white transition"
          title="Copy coordinates"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
