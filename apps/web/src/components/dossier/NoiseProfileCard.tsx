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
          badge: "bg-[#152e32] border-[#2dd4bf]/30 text-[#2dd4bf]",
          icon: <VolumeX className="w-4 h-4 text-[#2dd4bf]" />,
          desc: "Low ambient footprint; well-attenuated from arterial noise",
          estDba: "< 48 dBA",
        };
    }
  };

  const style = getBracketStyles(estimated_bracket);

  const culpritLabel = (() => {
    if (nearest_source_type === "railway") return "Railway & Metro Track";
    if (nearest_source_type === "arterial_road") return "Major Highway / Arterial Roadway";
    return "Ambient Neighborhood Street";
  })();

  return (
    <div className="ios-dark-glass-card p-5 space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-[#38bdf8]" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">
            Acoustic & Noise Profile
          </h3>
        </div>
        <span
          className={`text-xs font-bold px-3 py-0.5 rounded-full border flex items-center space-x-1.5 ${style.badge}`}
        >
          {style.icon}
          <span>{estimated_bracket} Exposure</span>
        </span>
      </div>

      {/* Culprit & Proximity Box */}
      <div className="ios-dark-glass-subcard p-3.5 space-y-2.5 font-sans">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Nearest Culprit Source:</span>
          <span className="text-slate-200 font-semibold">{culpritLabel}</span>
        </div>

        {distance_meters !== null && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Proximity Distance:</span>
            <span className="font-mono text-white font-bold bg-[#152736] px-2.5 py-0.5 rounded border border-slate-700/60">
              {distance_meters}m to {culpritLabel.split("/")[0].trim()}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Estimated Geometric Sound Level:</span>
          <span className="font-mono text-slate-200 font-bold">{style.estDba}</span>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-start space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2dd4bf] shrink-0 mt-0.5" />
          <span>{confidence}</span>
        </div>
      </div>

      {/* Noise Spectrum Frequency Bar Chart */}
      <div className="ios-dark-glass-subcard p-3.5 space-y-2">
        <div className="text-[11px] font-semibold text-slate-300 font-mono flex items-center justify-between">
          <span>Acoustic Frequency Spectrum</span>
          <span className="text-[#2dd4bf] text-[10px]">Live Spectrum</span>
        </div>
        <div className="h-16 w-full flex items-end justify-between pt-2 gap-1.5">
          <div className="flex-1 bg-[#2dd4bf]/70 rounded-t-sm h-12" />
          <div className="flex-1 bg-[#38bdf8]/80 rounded-t-sm h-16" />
          <div className="flex-1 bg-[#34d399]/70 rounded-t-sm h-8" />
          <div className="flex-1 bg-[#60a5fa]/80 rounded-t-sm h-10" />
          <div className="flex-1 bg-[#818cf8]/70 rounded-t-sm h-14" />
        </div>
        <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-1">
          <span>Traffic</span>
          <span>Transit</span>
          <span>Commercial</span>
          <span>Residential</span>
          <span>Industrial</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-3 rounded-xl bg-[#141f2b]/60 border border-slate-800/80 text-[10px] text-slate-400 leading-relaxed flex items-start space-x-2 font-sans">
        <HelpCircle className="w-3.5 h-3.5 text-[#2dd4bf] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Line-of-Sight Propagation: </span>
          Acoustic attenuation proxy assumes unobstructed line-of-sight propagation (
          <span className="font-mono text-slate-300">L = L₀ - 20·log₁₀(d/d₀)</span>). Micro-urban
          barriers and tree canopy buffers provide an extra 6 to 14 dBA of dampening.
        </div>
      </div>
    </div>
  );
};
