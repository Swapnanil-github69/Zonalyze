import React from "react";
import { ArrowRight, Compass, ShieldCheck, Activity } from "lucide-react";

interface InvestigationPreviewSectionProps {
  onLaunchInvestigation?: () => void;
}

export const InvestigationPreviewSection: React.FC<InvestigationPreviewSectionProps> = ({
  onLaunchInvestigation,
}) => {
  return (
    <section id="preview" className="relative w-full py-20 sm:py-28 bg-[#0B1316] border-b border-[#1F353B]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 space-y-12 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#34d399] bg-[#0f2e29] px-3.5 py-1.5 rounded-full border border-[#10b981]/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
            <Compass className="w-3.5 h-3.5 text-[#34d399]" />
            <span>INTERFACE PREVIEW</span>
          </div>

          <h2
            style={{ lineHeight: 1.15, letterSpacing: "-0.025em" }}
            className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white"
          >
            How evidence appears in the field.
          </h2>

          <p className="text-base text-[#94a3b8] font-sans leading-relaxed">
            When you select a location, ZONALYZE opens a structured investigation record. Direct sensor observations, mapped infrastructure points, and AI interpretations are displayed in distinct, transparent layers.
          </p>
        </div>

        {/* Liquid Glass Editorial Preview Card */}
        <div className="relative">
          {/* Animated Liquid Caustic Backlight Blob */}
          <div className="absolute -inset-6 bg-gradient-to-tr from-[#132226]/60 via-emerald-500/10 to-[#38bdf8]/10 blur-3xl rounded-[36px] liquid-caustic-blob pointer-events-none" />

          <div className="relative rounded-[28px] liquid-glass-card overflow-hidden border border-[#1f353b] bg-[#132226]/80 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
            {/* Top Specular Edge Line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />
            
            {/* Card Top Utility Bar */}
            <div className="px-6 py-4 bg-[#0e1a1d]/90 backdrop-blur-2xl border-b border-[#1f353b] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="px-2 py-0.5 rounded-md bg-[#0f2e29] border border-[#10b981]/40 text-[#34d399] font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                  <span>⚡</span>
                  <span>Cached (150m)</span>
                </span>
                <span className="text-xs text-[#94a3b8] font-mono border border-[#1f353b] px-2.5 py-0.5 rounded-md bg-[#132226]/60">
                  Oct 5, 2026, 06:39 PM
                </span>
                <span className="font-sans text-xs text-white font-semibold hidden md:inline truncate max-w-sm">
                  Bangur, South Dumdum, Kolkata Metropolitan Area...
                </span>
              </div>

              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#10242b] border border-[#06b6d4]/40 text-xs font-mono text-[#38bdf8] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <span>22.60995° N, 88.41794° E</span>
              </div>
            </div>

            {/* Split Preview Grid: Map + Objective Livability Index & Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#1f353b]">
              
              {/* Left Column: Interactive Map Crop */}
              <div className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between space-y-6 bg-[#0e1a1d]/40">
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#94a3b8] flex items-center justify-between">
                    <span>GEOSPATIAL CATCHMENT</span>
                    <span className="text-[#38bdf8]">RADIUS 3,000M</span>
                  </div>

                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#1f353b] bg-[#0e1a1d] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                    <img
                      src="/zonalyze_liquid_glass_crop.jpg"
                      alt="Real interactive map view with dropped pin at Bangur, Lake Town, Kolkata"
                      className="w-full h-full object-cover object-center filter contrast-[1.04]"
                    />
                    
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#0b1316]/90 backdrop-blur-md border border-[#1f353b] text-[11px] font-mono text-white shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                      POINT OF INQUIRY: 22.60995° N, 88.41794° E
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e1a1d] border border-[#1f353b] flex items-center justify-between text-xs text-[#94a3b8] font-mono">
                  <span>DATUM: WGS 84</span>
                  <span className="text-[#38bdf8]">EPSG:4326 DUAL-PRECISION</span>
                </div>
              </div>

              {/* Right Column: Telemetry & Objective Livability Index */}
              <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-6 bg-[#132226]/50">
                
                <div className="space-y-5">
                  {/* Card 1: Objective Livability Index */}
                  <div className="p-5 rounded-2xl bg-[#0e1a1d] border border-[#1f353b] space-y-4 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-bold text-white tracking-wider uppercase font-mono">
                        <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                        <span>OBJECTIVE LIVABILITY INDEX</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#0f2e29] border border-[#10b981]/40 text-[#34d399] font-mono text-[10px] font-bold">
                        Moderate
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                      {/* Circular Gauge */}
                      <div className="sm:col-span-4 flex flex-col items-center justify-center p-2">
                        <div className="relative w-24 h-24 rounded-full border-4 border-[#1f353b] flex flex-col items-center justify-center shadow-[inset_0_0_12px_rgba(16,185,129,0.2)]">
                          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-[#10b981]"
                              strokeDasharray="70, 100"
                              strokeWidth="3.6"
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <span className="text-2xl font-extrabold text-white leading-none">7.0</span>
                          <span className="text-[10px] text-[#94a3b8] font-sans mt-0.5">out of 10</span>
                        </div>
                      </div>

                      {/* 4 Score Progress Bars */}
                      <div className="sm:col-span-8 space-y-2 text-xs font-sans">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[#cbd5e1]">
                            <span>Air Quality</span>
                            <span className="font-mono text-[11px] text-[#38bdf8]">0.4 / 2.5</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#16272b] rounded-full overflow-hidden">
                            <div className="h-full bg-[#38bdf8] rounded-full w-[16%]" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[#cbd5e1]">
                            <span>Acoustic Buffer</span>
                            <span className="font-mono text-[11px] text-[#818cf8]">2.5 / 2.5</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#16272b] rounded-full overflow-hidden">
                            <div className="h-full bg-[#818cf8] rounded-full w-full" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[#cbd5e1]">
                            <span>Transit Access</span>
                            <span className="font-mono text-[11px] text-[#34d399]">2.5 / 2.5</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#16272b] rounded-full overflow-hidden">
                            <div className="h-full bg-[#34d399] rounded-full w-full" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[#cbd5e1]">
                            <span>Essential Proximity</span>
                            <span className="font-mono text-[11px] text-[#f59e0b]">1.6 / 2.5</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#16272b] rounded-full overflow-hidden">
                            <div className="h-full bg-[#f59e0b] rounded-full w-[64%]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] font-mono text-[#94a3b8] border-t border-[#1f353b]">
                      ⓘ Grounded multi-factor heuristic synthesized from verified open telemetry.
                    </div>
                  </div>

                  {/* Card 2: Atmospheric & Environmental Telemetry */}
                  <div className="p-5 rounded-2xl bg-[#0e1a1d] border border-[#1f353b] space-y-4 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-bold text-white tracking-wider uppercase font-mono">
                        <Activity className="w-4 h-4 text-[#38bdf8]" />
                        <span>ATMOSPHERIC & ENVIRONMENTAL TELEMETRY</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#3b1822] border border-[#ef4444]/40 text-[#f87171] font-mono text-[10px] font-bold">
                        AQI 83 • Very Poor (&gt;80)
                      </span>
                    </div>

                    {/* 4 Sensor Cards Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-[#132226] border border-[#1f353b] space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#94a3b8]">PM2.5</span>
                          <span className="text-[#38bdf8] font-mono text-[10px]">Fine Particulates</span>
                        </div>
                        <div className="text-xl font-bold text-white font-mono">
                          97.6 <span className="text-xs font-normal text-[#94a3b8]">µg/m³</span>
                        </div>
                        <div className="text-[10px] text-[#34d399] font-mono">
                          WHO 24h: 15 µg/m³ (Normal)
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#132226] border border-[#1f353b] space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#94a3b8]">PM10 Inhalable</span>
                          <span className="text-[#38bdf8] font-mono text-[10px]">Coarse Dust</span>
                        </div>
                        <div className="text-xl font-bold text-white font-mono">
                          111.8 <span className="text-xs font-normal text-[#94a3b8]">µg/m³</span>
                        </div>
                        <div className="text-[10px] text-[#94a3b8] font-mono">
                          WHO 24h Guideline: 45 µg/m³
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#132226] border border-[#1f353b] space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#94a3b8]">Current Temp</span>
                          <span className="text-[#34d399] font-mono text-[10px]">Live</span>
                        </div>
                        <div className="text-xl font-bold text-white font-mono">
                          28.1°C
                        </div>
                        <div className="text-[10px] text-[#94a3b8] font-mono">
                          Surface 2m sensor
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#132226] border border-[#1f353b] space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#94a3b8]">7-Day Avg Temp</span>
                          <span className="text-[#94a3b8] font-mono text-[10px]">Baseline</span>
                        </div>
                        <div className="text-xl font-bold text-white font-mono">
                          28.5°C
                        </div>
                        <div className="text-[10px] text-[#94a3b8] font-mono">
                          Weekly seasonal mean
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action inside preview */}
                <div className="pt-4 border-t border-[#1f353b] flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[#94a3b8] font-sans">
                    Explore real location intelligence with direct coordinates.
                  </span>

                  <button
                    onClick={onLaunchInvestigation}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-bold text-[#071317] bg-gradient-to-r from-[#10b981] to-[#06b6d4] hover:from-[#34d399] hover:to-[#22d3ee] shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans"
                  >
                    <span>Open Investigation Workspace</span>
                    <ArrowRight className="w-4 h-4 text-[#071317]" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
