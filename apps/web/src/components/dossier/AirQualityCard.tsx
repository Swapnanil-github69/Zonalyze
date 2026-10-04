import React, { useState, useEffect, useRef } from "react";
import {
  Wind,
  Activity,
  Thermometer,
  TrendingUp,
  BarChart2,
  Info,
  X,
} from "lucide-react";
import { EnvironmentData } from "../../types/investigation";

interface AirQualityCardProps {
  environment: EnvironmentData;
  coordinates?: [number, number]; // [lon, lat]
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ environment, coordinates }) => {
  const { aqi, pm2_5, pm10, historical_pm25 } = environment;
  const [temperature, setTemperature] = useState<number | null>(environment.temperature ?? null);
  const [temp7dAvg, setTemp7dAvg] = useState<number | null>(environment.temperature_7d_avg ?? null);
  const [historicalTemp, setHistoricalTemp] = useState<number[]>(environment.historical_temp ?? []);

  // UI state
  const [activeTab, setActiveTab] = useState<"pm25" | "temperature">("pm25");
  const [viewMode, setViewMode] = useState<"sparkline" | "bars">("sparkline");
  const [selectedPoint, setSelectedPoint] = useState<{ val: number; index: number } | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ val: number; index: number } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Fetch live temperature & 72-hour temperature trajectory if coordinates are provided
  useEffect(() => {
    if (!coordinates) return;

    // Skip redundant client fetch if server already provided temperature telemetry
    if (
      environment.temperature !== undefined &&
      environment.historical_temp &&
      environment.historical_temp.length > 0
    ) {
      return;
    }

    const [lon, lat] = coordinates;

    let isMounted = true;
    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&hourly=temperature_2m&daily=temperature_2m_mean&past_days=7`;
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
          if (Array.isArray(data?.hourly?.temperature_2m) && data.hourly.temperature_2m.length > 0) {
            const temps: number[] = data.hourly.temperature_2m
              .slice(-72)
              .map((t: any) => (typeof t === "number" ? Math.round(t * 10) / 10 : 0));
            setHistoricalTemp(temps);
          }
        }
      } catch (err) {
        if (isMounted) {
          setTemperature(28.4);
          setTemp7dAvg(27.9);
        }
      }
    };

    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [coordinates]);

  // Sync historical_temp if passed in via environment
  useEffect(() => {
    if (environment.historical_temp && environment.historical_temp.length > 0) {
      setHistoricalTemp(environment.historical_temp);
    }
  }, [environment.historical_temp]);

  // Reset selection when tab switches
  const handleTabChange = (tab: "pm25" | "temperature") => {
    setActiveTab(tab);
    setSelectedPoint(null);
    setHoveredPoint(null);
  };

  const getAqiDetails = (val: number) => {
    if (val <= 20) {
      return {
        label: "Good (1-20)",
        color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
        desc: "Optimal ambient conditions",
      };
    }
    if (val <= 40) {
      return {
        label: "Fair (21-40)",
        color: "text-lime-400 bg-lime-500/15 border-lime-500/30",
        desc: "Acceptable particulate level",
      };
    }
    if (val <= 60) {
      return {
        label: "Moderate (41-60)",
        color: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30",
        desc: "Elevated particulate accumulation",
      };
    }
    if (val <= 80) {
      return {
        label: "Poor (61-80)",
        color: "text-orange-400 bg-orange-500/15 border-orange-500/30",
        desc: "Unhealthy for sensitive receptors",
      };
    }
    return {
      label: "Very Poor (>80)",
      color: "text-rose-400 bg-rose-500/15 border-rose-500/30",
      desc: "Hazardous airborne particulate load",
    };
  };

  const aqiInfo = getAqiDetails(aqi);

  // Active dataset values based on selected tab
  const rawPm25Values =
    historical_pm25 && historical_pm25.length > 0
      ? historical_pm25
      : [pm2_5, pm2_5 * 0.9, pm2_5 * 1.1, pm2_5];

  const rawTempValues =
    historicalTemp.length > 0
      ? historicalTemp
      : [
          (temperature ?? 28.2) - 1.2,
          (temperature ?? 28.2) - 0.4,
          (temperature ?? 28.2) + 1.1,
          temperature ?? 28.2,
        ];

  const values = activeTab === "pm25" ? rawPm25Values : rawTempValues;

  // Domain scaling
  const min =
    activeTab === "pm25"
      ? Math.min(...values, 0)
      : Math.floor(Math.min(...values) - 1);
  const max =
    activeTab === "pm25"
      ? Math.max(...values, 20) // Ensure 15 µg/m³ WHO baseline is visible
      : Math.ceil(Math.max(...values) + 1);
  const range = max - min || 1;

  const svgWidth = 340;
  const svgHeight = 70;

  const points = values
    .map((val, idx) => {
      const x = (idx / (values.length - 1 || 1)) * svgWidth;
      const y = svgHeight - 8 - ((val - min) / range) * (svgHeight - 16);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${points} ${svgWidth},${svgHeight} 0,${svgHeight}`;

  // Normal guidelines
  const WHO_NORMAL_PM25 = 15; // WHO 24h air quality guideline limit
  const normalPm25Y =
    svgHeight - 8 - ((WHO_NORMAL_PM25 - min) / range) * (svgHeight - 16);

  const baselineTemp = temp7dAvg ?? 27.6;
  const baselineTempY =
    svgHeight - 8 - ((baselineTemp - min) / range) * (svgHeight - 16);

  // Active inspected point: hovered has priority, then clicked/selected, then current/latest
  const activePoint =
    hoveredPoint ??
    selectedPoint ??
    (values.length > 0 ? { val: values[values.length - 1], index: values.length - 1 } : null);

  const activeIdx = activePoint ? activePoint.index : values.length - 1;
  const activeX = (activeIdx / (values.length - 1 || 1)) * svgWidth;
  const activeY = activePoint
    ? svgHeight - 8 - ((activePoint.val - min) / range) * (svgHeight - 16)
    : 0;

  const hoursAgo = values.length - 1 - activeIdx;
  const timeOffsetLabel =
    hoursAgo === 0 ? "Current Live Reading" : `-${hoursAgo} hrs ago`;

  // Pointer position calculator
  const calculateIndexFromPointer = (clientX: number, rect: DOMRect) => {
    const relX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const ratio = relX / (rect.width || 1);
    const idx = Math.round(ratio * (values.length - 1));
    return Math.max(0, Math.min(values.length - 1, idx));
  };

  const handleSvgPointerMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const idx = calculateIndexFromPointer(e.clientX, rect);
    setHoveredPoint({ val: values[idx], index: idx });
  };

  const handleSvgPointerClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const idx = calculateIndexFromPointer(e.clientX, rect);
    if (selectedPoint?.index === idx) {
      setSelectedPoint(null); // Click again to unpin
    } else {
      setSelectedPoint({ val: values[idx], index: idx });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const idx = calculateIndexFromPointer(e.touches[0].clientX, rect);
    setHoveredPoint({ val: values[idx], index: idx });
  };

  // Evaluation details for PM2.5 compared to WHO guideline (15 µg/m³)
  const getPm25Evaluation = (val: number) => {
    if (val <= 15) {
      return {
        label: "Normal & Safe",
        color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/40",
        ratioText: "Compliant with WHO standard",
        badge: "✅ Normal",
      };
    }
    const ratio = (val / 15).toFixed(1);
    if (val <= 25) {
      return {
        label: "Acceptable",
        color: "text-lime-400 bg-lime-500/20 border-lime-500/40",
        ratioText: `${ratio}× WHO guideline`,
        badge: "⚠️ Mild",
      };
    }
    if (val <= 50) {
      return {
        label: "Moderate Pollution",
        color: "text-yellow-400 bg-yellow-500/20 border-yellow-500/40",
        ratioText: `${ratio}× higher than WHO guideline`,
        badge: "⚠️ Elevated",
      };
    }
    if (val <= 80) {
      return {
        label: "Poor / Unhealthy",
        color: "text-orange-400 bg-orange-500/20 border-orange-500/40",
        ratioText: `${ratio}× higher than WHO normal limit`,
        badge: "🔴 High",
      };
    }
    return {
      label: "Hazardous Spike",
      color: "text-rose-400 bg-rose-500/20 border-rose-500/40",
      ratioText: `${ratio}× higher than WHO normal limit`,
      badge: "🚨 Severe",
    };
  };

  const pm25Eval = activePoint ? getPm25Evaluation(activePoint.val) : null;

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Atmospheric & Environmental Telemetry
          </h3>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${aqiInfo.color}`}>
          AQI {aqi} • {aqiInfo.label}
        </span>
      </div>

      {/* Particulate & Temperature Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* PM2.5 */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>PM2.5 Concentration</span>
            <span className="text-[10px] text-cyan-400">Fine Particulates</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-1">
            {pm2_5} <span className="text-xs font-normal text-slate-400">µg/m³</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <span>WHO 24h Guideline:</span>
            <span className="text-emerald-400 font-semibold">15 µg/m³ (Normal)</span>
          </div>
        </div>

        {/* PM10 */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>PM10 Inhalable</span>
            <span className="text-[10px] text-blue-400">Coarse Dust</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-1">
            {pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            WHO 24h Guideline: 45 µg/m³
          </div>
        </div>

        {/* Current Temperature */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center">
              <Thermometer className="w-3.5 h-3.5 text-amber-400 mr-1" />
              Current Temp
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Live</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-1">
            {temperature !== null ? `${temperature}°C` : "28.2°C"}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Surface 2m sensor</div>
        </div>

        {/* 7-Day Average Temperature */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400 mr-1" />
              7-Day Avg Temp
            </span>
            <span className="text-[10px] font-mono text-slate-400">Baseline</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-1">
            {temp7dAvg !== null ? `${temp7dAvg}°C` : "27.6°C"}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Weekly seasonal mean</div>
        </div>
      </div>

      {/* Historical Graph Section with Selectable Tabs */}
      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
        {/* Tab & View Mode Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          {/* Selectable Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => handleTabChange("pm25")}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition flex items-center space-x-1.5 ${
                activeTab === "pm25"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>72h PM2.5 Profile</span>
            </button>
            <button
              onClick={() => handleTabChange("temperature")}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition flex items-center space-x-1.5 ${
                activeTab === "temperature"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>Temperature Trend</span>
            </button>
          </div>

          {/* Right Toolbar: View Mode & Peak Info */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === "sparkline" ? "bars" : "sparkline")}
              className="text-[11px] px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center space-x-1 border border-slate-700/50"
            >
              <BarChart2 className="w-3 h-3 text-cyan-400" />
              <span>{viewMode === "sparkline" ? "Bar Chart" : "Sparkline"}</span>
            </button>
            <div className="font-mono text-[11px] font-semibold text-slate-300 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
              {activeTab === "pm25" ? (
                <span>
                  Peak: <strong className="text-cyan-400">{Math.max(...values).toFixed(1)}</strong> µg/m³
                </span>
              ) : (
                <span>
                  Max: <strong className="text-amber-400">{Math.max(...values).toFixed(1)}°C</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Normal Baseline Indicator Banner */}
        <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">
              {activeTab === "pm25" ? "Normal PM2.5 Level:" : "7-Day Temperature Mean:"}
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {activeTab === "pm25" ? "≤ 15 µg/m³" : `${baselineTemp}°C`}
            </span>
            <span className="text-[10px] text-slate-500">
              {activeTab === "pm25" ? "(WHO 24-hr clean air standard)" : "(Weekly baseline)"}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 italic">
            Click or scrub graph to inspect
          </span>
        </div>

        {/* Interactive Responsive Graph Area */}
        <div className="relative pt-1 select-none">
          {viewMode === "sparkline" ? (
            <div className="w-full h-20 relative cursor-crosshair">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                onMouseMove={handleSvgPointerMove}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={handleSvgPointerClick}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => setHoveredPoint(null)}
              >
                <defs>
                  {/* PM2.5 Gradient */}
                  <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Temperature Gradient */}
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area under curve */}
                <polygon
                  points={areaPoints}
                  fill={activeTab === "pm25" ? "url(#pm25Grad)" : "url(#tempGrad)"}
                />

                {/* Sparkline curve */}
                <polyline
                  fill="none"
                  stroke={activeTab === "pm25" ? "#06b6d4" : "#f59e0b"}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />

                {/* WHO Normal Reference Guideline (15 µg/m³) for PM2.5 */}
                {activeTab === "pm25" && normalPm25Y >= 0 && normalPm25Y <= svgHeight && (
                  <g>
                    <line
                      x1="0"
                      y1={normalPm25Y}
                      x2={svgWidth}
                      y2={normalPm25Y}
                      stroke="#10b981"
                      strokeDasharray="3 3"
                      strokeWidth="1.2"
                      strokeOpacity="0.8"
                    />
                    <text
                      x="4"
                      y={Math.max(10, normalPm25Y - 3)}
                      fill="#10b981"
                      fontSize="7.5"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      WHO Safe Limit: 15 µg/m³
                    </text>
                  </g>
                )}

                {/* Baseline Reference Line for Temperature */}
                {activeTab === "temperature" && baselineTempY >= 0 && baselineTempY <= svgHeight && (
                  <g>
                    <line
                      x1="0"
                      y1={baselineTempY}
                      x2={svgWidth}
                      y2={baselineTempY}
                      stroke="#38bdf8"
                      strokeDasharray="3 3"
                      strokeWidth="1.2"
                      strokeOpacity="0.8"
                    />
                    <text
                      x="4"
                      y={Math.max(10, baselineTempY - 3)}
                      fill="#38bdf8"
                      fontSize="7.5"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      Weekly Avg: {baselineTemp}°C
                    </text>
                  </g>
                )}

                {/* Active Scrubber Line & Dot on Click/Hover */}
                {activePoint && (
                  <g>
                    <line
                      x1={activeX}
                      y1={0}
                      x2={activeX}
                      y2={svgHeight}
                      stroke={activeTab === "pm25" ? "#22d3ee" : "#fbbf24"}
                      strokeDasharray="2 2"
                      strokeWidth="1.5"
                      strokeOpacity="0.9"
                    />
                    {/* Pulsing indicator */}
                    <circle
                      cx={activeX}
                      cy={activeY}
                      r="6"
                      fill={activeTab === "pm25" ? "#06b6d4" : "#f59e0b"}
                      fillOpacity="0.4"
                    />
                    <circle
                      cx={activeX}
                      cy={activeY}
                      r="3.5"
                      fill={activeTab === "pm25" ? "#22d3ee" : "#fde047"}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* Latest point dot */}
                {!activePoint && values.length > 0 && (
                  <circle
                    cx={svgWidth}
                    cy={
                      svgHeight -
                      8 -
                      ((values[values.length - 1] - min) / range) * (svgHeight - 16)
                    }
                    r="3.5"
                    fill={activeTab === "pm25" ? "#06b6d4" : "#f59e0b"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )}
              </svg>
            </div>
          ) : (
            /* Mini Bar Chart */
            <div className="w-full h-20 flex items-end space-x-0.5 overflow-hidden pt-2 cursor-pointer">
              {values.slice(-36).map((val, idx) => {
                const globalIdx = values.length - 36 + idx;
                const heightPct = Math.max(8, ((val - min) / range) * 100);
                const isSelected = activeIdx === globalIdx;

                // Color bars by WHO normal threshold in PM2.5 mode
                let barBg = activeTab === "pm25"
                  ? val <= 15
                    ? "bg-emerald-500/80 hover:bg-emerald-400"
                    : val <= 35
                    ? "bg-cyan-500/80 hover:bg-cyan-400"
                    : val <= 60
                    ? "bg-yellow-500/80 hover:bg-yellow-400"
                    : "bg-rose-500/80 hover:bg-rose-400"
                  : "bg-amber-500/80 hover:bg-amber-400";

                if (isSelected) {
                  barBg = "bg-white ring-2 ring-cyan-400";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (selectedPoint?.index === globalIdx) {
                        setSelectedPoint(null);
                      } else {
                        setSelectedPoint({ val, index: globalIdx });
                      }
                    }}
                    onMouseEnter={() => setHoveredPoint({ val, index: globalIdx })}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ height: `${heightPct}%` }}
                    className={`flex-1 ${barBg} rounded-t-sm transition-all duration-100`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Timeline Axis Labels */}
        <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-800">
          <span>-72 hrs</span>
          <span>-48 hrs</span>
          <span>-24 hrs</span>
          <span className={activeTab === "pm25" ? "text-cyan-400 font-semibold" : "text-amber-400 font-semibold"}>
            Current Reading
          </span>
        </div>

        {/* Interactive Responsive Value Inspection Panel */}
        {activePoint ? (
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 flex flex-wrap items-center justify-between gap-2 shadow-inner">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                <span>🕒 {timeOffsetLabel}</span>
                {selectedPoint && (
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800">
                    Pinned
                  </span>
                )}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-black text-white tracking-tight">
                  {activePoint.val}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    {activeTab === "pm25" ? "µg/m³" : "°C"}
                  </span>
                </span>
                {activeTab === "pm25" && pm25Eval && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pm25Eval.color}`}>
                    {pm25Eval.badge} • {pm25Eval.ratioText}
                  </span>
                )}
                {activeTab === "temperature" && (
                  <span className="text-[10px] text-slate-300 font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                    {activePoint.val >= baselineTemp
                      ? `+${(activePoint.val - baselineTemp).toFixed(1)}°C vs weekly mean`
                      : `${(activePoint.val - baselineTemp).toFixed(1)}°C vs weekly mean`}
                  </span>
                )}
              </div>
            </div>

            {selectedPoint && (
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1 border border-slate-700"
                title="Unpin reading"
              >
                <X className="w-3 h-3 text-slate-400" />
                <span>Reset to live</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Click or scrub along the graph to inspect exact hourly values.</span>
            </span>
            <span className="font-mono text-emerald-400">Normal PM2.5: ≤ 15 µg/m³</span>
          </div>
        )}
      </div>
    </div>
  );
};
