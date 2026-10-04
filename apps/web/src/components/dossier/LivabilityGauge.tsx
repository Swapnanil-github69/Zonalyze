import React from "react";
import { ShieldCheck, Info } from "lucide-react";
import { LivabilityScoreData } from "../../types/investigation";

interface LivabilityGaugeProps {
  livability: LivabilityScoreData;
}

export const LivabilityGauge: React.FC<LivabilityGaugeProps> = ({ livability }) => {
  const { score, category, breakdown } = livability;

  // Percentage for ring (0 to 100%)
  const percentage = Math.min(100, Math.max(0, (score / 10) * 100));

  // Circular gauge constants
  const size = 114;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="ios-dark-glass-card p-5 space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#2dd4bf]" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">
            Objective Livability Index
          </h3>
        </div>
        <span className="text-xs font-medium px-3 py-0.5 rounded-full bg-[#152e32] text-[#2dd4bf] border border-[#2dd4bf]/30">
          {category || "Moderate"}
        </span>
      </div>

      <div className="flex items-center space-x-5 pt-1">
        {/* Left Circular Progress Donut */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="-rotate-90">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#2dd4bf"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Score Text (Clean Crisp White Bold) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white tracking-tight font-sans">
              {score.toFixed(1)}
            </span>
            <span className="text-[9px] text-slate-400 font-mono tracking-widest mt-0.5">
              OUT OF 10
            </span>
          </div>
        </div>

        {/* Right Category Breakdown Progress Bars */}
        <div className="flex-1 space-y-2.5 text-xs font-sans">
          {/* Air Quality */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1 font-sans">
              <span>Air Quality</span>
              <span className="font-mono text-slate-300 font-semibold">{breakdown.airQuality}/2.5</span>
            </div>
            <div className="h-2 w-full ios-glass-track rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2dd4bf] to-[#06b6d4] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(45,212,191,0.6)]"
                style={{ width: `${(breakdown.airQuality / 2.5) * 100}%` }}
              />
            </div>
          </div>

          {/* Acoustic Buffer */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1 font-sans">
              <span>Acoustic Buffer</span>
              <span className="font-mono text-slate-300 font-semibold">{breakdown.acousticBuffer}/2.5</span>
            </div>
            <div className="h-2 w-full ios-glass-track rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#38bdf8] to-[#0284c7] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                style={{ width: `${(breakdown.acousticBuffer / 2.5) * 100}%` }}
              />
            </div>
          </div>

          {/* Transit Access */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1 font-sans">
              <span>Transit Access</span>
              <span className="font-mono text-slate-300 font-semibold">{breakdown.transitAccess}/2.5</span>
            </div>
            <div className="h-2 w-full ios-glass-track rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#34d399] to-[#059669] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                style={{ width: `${(breakdown.transitAccess / 2.5) * 100}%` }}
              />
            </div>
          </div>

          {/* Essential Proximity */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1 font-sans">
              <span>Essential Proximity</span>
              <span className="font-mono text-slate-300 font-semibold">{breakdown.essentialProximity}/2.5</span>
            </div>
            <div className="h-2 w-full ios-glass-track rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#60a5fa] to-[#2563eb] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                style={{ width: `${(breakdown.essentialProximity / 2.5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center text-[11px] text-slate-400 font-sans">
        <Info className="w-3.5 h-3.5 text-[#2dd4bf] mr-1.5 shrink-0" />
        <span>Grounded multi-factor heuristic synthesized from verified open telemetry.</span>
      </div>
    </div>
  );
};
