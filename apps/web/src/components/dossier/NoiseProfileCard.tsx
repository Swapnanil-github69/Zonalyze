import React from "react";
import { Volume2, VolumeX, AlertTriangle, ShieldCheck } from "lucide-react";
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
          bg: "bg-red-500/10 border-red-500/30 text-red-400",
          icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
        };
      case "Moderate":
        return {
          bg: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
          icon: <Volume2 className="w-4 h-4 text-yellow-400" />,
        };
      default:
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          icon: <VolumeX className="w-4 h-4 text-emerald-400" />,
        };
    }
  };

  const style = getBracketStyles(estimated_bracket);

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Acoustic & Noise Attenuation Proxy
          </h3>
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center space-x-1 ${style.bg}`}>
          {style.icon}
          <span className="ml-1">{estimated_bracket} Noise</span>
        </span>
      </div>

      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Primary Sound Contributor:</span>
          <span className="text-slate-200 font-semibold capitalize">
            {nearest_source_type.replace("_", " ")}
          </span>
        </div>

        {distance_meters !== null && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Proximity to Corridor:</span>
            <span className="font-mono text-slate-200">{distance_meters} meters</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800/80 flex items-start space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
          <span>{confidence}</span>
        </div>
      </div>
    </div>
  );
};
