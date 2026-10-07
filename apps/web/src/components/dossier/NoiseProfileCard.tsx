import React from "react";
import { Volume2, VolumeX, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { NoiseProfileData } from "../../types/investigation";

interface NoiseProfileCardProps {
  noiseProfile: NoiseProfileData;
}

export const NoiseProfileCard: React.FC<NoiseProfileCardProps> = ({ noiseProfile }) => {
  const { estimated_bracket, nearest_source_type, distance_meters, confidence } = noiseProfile;

  const getBracketStyles = (bracket: string) => {
    switch (bracket) {
      case "Elevated":
        return {
          badge: "bg-rose-500/15 border-rose-500/30 text-rose-300",
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
          desc: "High acoustic impact from proximate transit corridor",
          estDba: "~68 - 76 dBA",
        };
      case "Moderate":
        return {
          badge: "bg-amber-500/15 border-amber-500/30 text-amber-300",
          icon: <Volume2 className="w-4 h-4 text-amber-400" />,
          desc: "Intermediate urban background with intermittent corridor surges",
          estDba: "~52 - 64 dBA",
        };
      default:
        return {
          badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
          icon: <VolumeX className="w-4 h-4 text-emerald-400" />,
          desc: "Low ambient footprint; well-attenuated from arterial noise",
          estDba: "< 48 dBA",
        };
    }
  };

  const style = getBracketStyles(estimated_bracket);

  // Format culprit description
  const culpritLabel = (() => {
    if (nearest_source_type === "railway") return "Railway & Metro Track";
    if (nearest_source_type === "arterial_road") return "Major Highway / Arterial Roadway";
    return "Ambient Neighborhood Street";
  })();

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-[15px] font-semibold text-slate-200 tracking-[-0.01em]" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
            Acoustic & Noise Exposure Profile
          </h3>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center space-x-1.5 ${style.badge}`}
        >
          {style.icon}
          <span>{estimated_bracket} Exposure</span>
        </span>
      </div>

      {/* Culprit & Proximity Box */}
      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Nearest Culprit Source:</span>
          <span className="text-slate-200 font-semibold">{culpritLabel}</span>
        </div>

        {distance_meters !== null && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Distance to Nearest Culprit:</span>
            <span className="font-mono text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {distance_meters}m to {culpritLabel.split("/")[0].trim()}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Estimated Geometric Sound Level:</span>
          <span className="font-mono text-slate-200">{style.estDba}</span>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-start space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
          <span>{confidence}</span>
        </div>
      </div>

      {/* Line-of-sight disclaimer text */}
      <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[10px] text-slate-400 leading-relaxed flex items-start space-x-2">
        <HelpCircle className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Line-of-Sight Disclaimer: </span>
          Acoustic attenuation proxy assumes unobstructed line-of-sight propagation (
          <span className="font-mono text-slate-300">L = L₀ - 20·log₁₀(d/d₀)</span>). Micro-urban
          surface barriers, tree canopy buffers, architectural shielding, and double-glazed facades
          typically provide an additional 6 to 14 dBA of dampening.
        </div>
      </div>
    </div>
  );
};
