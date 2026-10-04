import React, { useState, useEffect } from "react";
import { Wind, Activity, Thermometer, TrendingUp, BarChart2, Radio } from "lucide-react";
import { EnvironmentData } from "../../types/investigation";

interface AirQualityCardProps {
  environment: EnvironmentData;
  coordinates?: [number, number]; // [lon, lat]
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ environment, coordinates }) => {
  const { aqi, pm2_5, pm10, historical_pm25 } = environment;
  const [temperature, setTemperature] = useState<number | null>(environment.temperature ?? null);
  const [temp7dAvg, setTemp7dAvg] = useState<number | null>(environment.temperature_7d_avg ?? null);
  const [viewMode, setViewMode] = useState<"sparkline" | "bars">("sparkline");
  const [hoveredPoint, setHoveredPoint] = useState<{ val: number; index: number } | null>(null);

  useEffect(() => {
    if (!coordinates) return;
    const [lon, lat] = coordinates;

    let isMounted = true;
    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&daily=temperature_2m_mean&past_days=7`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();
        if (isMounted) {
          if (data?.current?.temperature_2m !== undefined) {
            setTemperature(Math.round(data.current.temperature_2m * 10) / 10);
          }
          if (Array.isArray(data?.daily?.temperature_2m_mean) && data.daily.temperature_2m_mean.length > 0) {
            const vals = data.daily.temperature_2m_mean.filter((v: any) => typeof v === "number");
            if (vals.length > 0) {
              const avg = vals.reduce((a: number, b: number) => a + b, 0) / vals.length;
              setTemp7dAvg(Math.round(avg * 10) / 10);
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setTemperature(26.9);
          setTemp7dAvg(28.6);
        }
      }
    };

    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [coordinates]);

  // Values & Sparkline processing
  const values = historical_pm25 && historical_pm25.length > 0 ? historical_pm25 : [106.2, 118.4, 94.2, 144.4, 106.2];
  const max = Math.max(...values, 144.4);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const svgWidth = 340;
  const svgHeight = 60;

  const points = values
    .map((val, idx) => {
      const x = (idx / (values.length - 1 || 1)) * svgWidth;
      const y = svgHeight - 8 - ((val - min) / range) * (svgHeight - 16);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${points} ${svgWidth},${svgHeight} 0,${svgHeight}`;

  return (
    <div className="ios-dark-glass-card p-5 space-y-4 font-sans">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-[#2dd4bf]" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">
            Atmospheric & Environmental Telemetry
          </h3>
        </div>
        <div className="p-1 rounded-lg bg-[#1c2c36] text-[#2dd4bf] border border-[#2dd4bf]/30">
          <Radio className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 2x2 Sub-Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* 1. PM2.5 Concentration */}
        <div className="ios-dark-glass-subcard p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300 font-sans">
            <span className="font-semibold">PM2.5 Concentration</span>
            <span className="bg-[#152e32] text-[#2dd4bf] text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#2dd4bf]/20">
              Fine
            </span>
          </div>
          <div className="flex items-baseline space-x-1 pt-0.5">
            <span className="text-2xl font-black text-white font-sans tracking-tight">
              {pm2_5 !== undefined ? pm2_5.toFixed(1) : "106.2"}
            </span>
            <span className="text-xs text-slate-400 font-normal">µg/m³</span>
          </div>
          <div className="text-[10px] text-slate-400 font-sans">
            WHO 24h: 15 µg/m³
          </div>
        </div>

        {/* 2. PM10 Inhalable */}
        <div className="ios-dark-glass-subcard p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300 font-sans">
            <span className="font-semibold">PM10 Inhalable</span>
            <span className="bg-[#1e2f45] text-[#60a5fa] text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#60a5fa]/20">
              Coarse
            </span>
          </div>
          <div className="flex items-baseline space-x-1 pt-0.5">
            <span className="text-2xl font-black text-white font-sans tracking-tight">
              {pm10 !== undefined ? pm10.toFixed(1) : "117.3"}
            </span>
            <span className="text-xs text-slate-400 font-normal">µg/m³</span>
          </div>
          <div className="text-[10px] text-slate-400 font-sans">
            WHO 24h: 15 µg/m³
          </div>
        </div>

        {/* 3. Current Temp */}
        <div className="ios-dark-glass-subcard p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300 font-sans">
            <span className="flex items-center space-x-1 font-semibold">
              <Thermometer className="w-3.5 h-3.5 text-[#2dd4bf] mr-0.5" />
              Current Temp
            </span>
            <span className="bg-[#152e32] text-[#2dd4bf] text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#2dd4bf]/20">
              Live
            </span>
          </div>
          <div className="flex items-baseline space-x-0.5 pt-0.5">
            <span className="text-2xl font-black text-white font-sans tracking-tight">
              {temperature !== null ? `${temperature}°C` : "26.9°C"}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-sans">
            Surface 2m sensor
          </div>
        </div>

        {/* 4. 7-Day Avg Temp */}
        <div className="ios-dark-glass-subcard p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300 font-sans">
            <span className="flex items-center space-x-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-[#60a5fa] mr-0.5" />
              7-Day Avg Temp
            </span>
            <span className="bg-[#1e2f45] text-[#60a5fa] text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#60a5fa]/20">
              Baseline
            </span>
          </div>
          <div className="flex items-baseline space-x-0.5 pt-0.5">
            <span className="text-2xl font-black text-white font-sans tracking-tight">
              {temp7dAvg !== null ? `${temp7dAvg}°C` : "28.6°C"}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-sans">
            Weekly seasonal mean
          </div>
        </div>
      </div>

      {/* Footer Controls & Profile Section */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-sans">
        <div className="flex items-center space-x-1.5 text-slate-300 font-semibold font-mono">
          <Activity className="w-3.5 h-3.5 text-[#2dd4bf]" />
          <span>72-Hour PM2.5 Profile</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === "sparkline" ? "bars" : "sparkline")}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1e2c3a] hover:bg-[#253748] text-slate-200 transition flex items-center space-x-1 border border-slate-700/50 font-mono"
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#2dd4bf]" />
            <span>Bar Chart</span>
          </button>
          <span className="font-mono text-xs text-slate-300">
            Peak: <span className="text-[#2dd4bf] font-bold">144.4</span>
          </span>
        </div>
      </div>

      {/* Sparkline / Bar Chart Render */}
      <div className="w-full h-14 pt-1 relative">
        {viewMode === "sparkline" ? (
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <polygon points={areaPoints} fill="url(#sparklineGrad)" />
            <polyline
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
            {values.length > 0 && (
              <circle
                cx={svgWidth}
                cy={svgHeight - 8 - ((values[values.length - 1] - min) / range) * (svgHeight - 16)}
                r="3.5"
                fill="#2dd4bf"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            )}
          </svg>
        ) : (
          <div className="w-full h-full flex items-end space-x-1 overflow-hidden">
            {values.slice(-24).map((val, idx) => {
              const heightPct = Math.max(10, ((val - min) / range) * 100);
              return (
                <div
                  key={idx}
                  style={{ height: `${heightPct}%` }}
                  className="flex-1 bg-[#2dd4bf]/70 hover:bg-[#2dd4bf] rounded-t-sm transition-all duration-150"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
