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
  const size = 110;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Colors based on score
  const getColorScheme = (val: number) => {
    if (val >= 7.0) {
      return {
        stroke: "#10b981", // green-500
        text: "text-emerald-400",
        badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        label: "Favorable / Optimal",
      };
    }
    if (val >= 4.5) {
      return {
        stroke: "#f59e0b", // amber-500
        text: "text-amber-400",
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        label: "Moderate Friction",
      };
    }
    return {
      stroke: "#ef4444", // red-500
      text: "text-rose-400",
      badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      label: "Elevated Risk",
    };
  };

  const scheme = getColorScheme(score);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Objective Livability Index
          </h3>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${scheme.badge}`}>
          {category}
        </span>
      </div>

      <div className="flex items-center space-x-5 pt-1">
        {/* Circular Progress Gauge */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="-rotate-90">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(51, 65, 85, 0.4)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={scheme.stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black tracking-tight ${scheme.text}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono -mt-0.5">out of 10</span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
              <span>Air Quality</span>
              <span className="font-mono text-slate-400">{breakdown.airQuality}/2.5</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${(breakdown.airQuality / 2.5) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
              <span>Acoustic Buffer</span>
              <span className="font-mono text-slate-400">{breakdown.acousticBuffer}/2.5</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400 rounded-full transition-all duration-700"
                style={{ width: `${(breakdown.acousticBuffer / 2.5) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
              <span>Transit Access</span>
              <span className="font-mono text-slate-400">{breakdown.transitAccess}/2.5</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${(breakdown.transitAccess / 2.5) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
              <span>Essential Proximity</span>
              <span className="font-mono text-slate-400">{breakdown.essentialProximity}/2.5</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${(breakdown.essentialProximity / 2.5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 flex items-center text-[10px] text-slate-400">
        <Info className="w-3 h-3 text-slate-400 mr-1.5 shrink-0" />
        <span>Grounded multi-factor heuristic synthesized from verified open telemetry.</span>
      </div>
    </div>
  );
};
