import React from "react";
import { Wind, Activity } from "lucide-react";
import { EnvironmentData } from "../../types/investigation.js";

interface AirQualityCardProps {
  environment: EnvironmentData;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ environment }) => {
  const { aqi, pm2_5, pm10, historical_pm25 } = environment;

  const getAqiColor = (val: number) => {
    if (val <= 20) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (val <= 40) return "text-lime-400 bg-lime-500/10 border-lime-500/30";
    if (val <= 60) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
    if (val <= 80) return "text-orange-400 bg-orange-500/10 border-orange-500/30";
    return "text-red-400 bg-red-500/10 border-red-500/30";
  };

  // Sparkline calculations
  const values = historical_pm25 && historical_pm25.length > 0 ? historical_pm25 : [pm2_5];
  const max = Math.max(...values, 10);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values
    .map((val, idx) => {
      const x = (idx / (values.length - 1 || 1)) * 260;
      const y = 50 - ((val - min) / range) * 40;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Atmospheric & Particulate Telemetry
          </h3>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getAqiColor(
            aqi
          )}`}
        >
          AQI {aqi} (European Std)
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">PM2.5 Concentration</div>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {pm2_5} <span className="text-xs font-normal text-slate-400">µg/m³</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">PM10 Coarse Particulates</div>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span>
          </div>
        </div>
      </div>

      {/* 72-Hour Historical PM2.5 Sparkline */}
      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center">
            <Activity className="w-3 h-3 text-cyan-400 mr-1" />
            72-Hour PM2.5 Exposure Trend
          </span>
          <span className="font-mono">Peak: {max.toFixed(1)} µg/m³</span>
        </div>

        <div className="w-full h-14 overflow-hidden pt-1">
          <svg viewBox="0 0 260 55" className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
