import React, { useState } from "react";
import { Search, ArrowRight, MapPin } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface InvestigationPreviewSectionProps {
  onLaunchInvestigation?: () => void;
}

export const InvestigationPreviewSection: React.FC<InvestigationPreviewSectionProps> = ({
  onLaunchInvestigation,
}) => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.12 });
  const [activeTab, setActiveTab] = useState<"env" | "infra">("env");
  const [searchVal, setSearchVal] = useState<string>("Aspen, Colorado");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLaunchInvestigation) onLaunchInvestigation();
  };

  return (
    <section
      ref={ref}
      id="workspace"
      className="relative w-full py-28 lg:py-36 bg-[#0B1719] text-[#F1F0E9] overflow-hidden border-b border-[rgba(190,210,202,0.13)] scroll-mt-20"
    >
      {/* Seamless Top Gradient Blend */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#102124]/70 to-transparent pointer-events-none" />

      {/* Background Radial Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-1/3 right-1/4 -translate-y-1/2 w-[850px] h-[600px] bg-[#142629]/65 rounded-full blur-[190px] transition-all duration-1000 ${
            isVisible ? "opacity-100 scale-100" : "opacity-40 scale-95"
          }`}
        />
        <div
          className={`absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-[#192E31]/40 rounded-full blur-[160px] transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 scale-100" : "opacity-30 scale-95"
          }`}
        />
        <div className="absolute inset-0 topographic-grid opacity-30" />
      </div>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading, description, and "Try It Now" link (4 cols) */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <h2
              className={`font-serif text-[44px] sm:text-[56px] lg:text-[66px] font-normal text-[#F1F0E9] leading-[1.02] tracking-[-1.5px] reveal-init ${
                isVisible ? "revealed" : ""
              }`}
            >
              Your Window Into <br />
              Any <em className="italic font-normal text-[#D1C6A5]">Location.</em>
            </h2>

            <p
              style={{ transitionDelay: "140ms" }}
              className={`font-sans text-sm sm:text-base text-[#B8C5C2] leading-relaxed font-normal max-w-sm reveal-init ${
                isVisible ? "revealed" : ""
              }`}
            >
              Use the interactive map, explore real-time environmental data, and inspect verified spatial intelligence — all in one unified workspace.
            </p>

            <div
              style={{ transitionDelay: "240ms" }}
              className={`pt-2 reveal-init ${isVisible ? "revealed" : ""}`}
            >
              <button
                onClick={onLaunchInvestigation}
                className="inline-flex items-center space-x-2 text-sm font-medium text-[#B6C6A3] hover:text-[#DCE7CD] transition-colors duration-200 cursor-pointer group"
              >
                <span>Try It Now</span>
                <ArrowRight className="w-4 h-4 text-[#B6C6A3] group-hover:text-[#DCE7CD] group-hover:translate-x-1.5 transition-all duration-200" />
              </button>
            </div>
          </div>

          {/* Right Column: Multi-panel Workspace Container with Scale-In Reveal (8 cols) */}
          <div
            style={{ transitionDelay: "180ms" }}
            className={`lg:col-span-8 rounded-3xl border border-[rgba(190,210,202,0.13)] bg-[#142629] backdrop-blur-2xl shadow-[0_24px_64px_rgba(11,23,25,0.85)] overflow-hidden text-left reveal-scale-init ${
              isVisible ? "revealed" : ""
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Sub-Panel: Map with Search Bar & Centered Target Pin (6 cols) */}
              <div className="md:col-span-6 p-4 sm:p-5 border-b md:border-b-0 md:border-r border-[rgba(190,210,202,0.12)] flex flex-col justify-between relative min-h-[380px] bg-[#0B1719]">
                {/* Search Bar at Top */}
                <form onSubmit={handleSubmit} className="relative z-10 flex items-center space-x-1.5 p-1 rounded-xl bg-[#142629]/95 border border-[rgba(190,210,202,0.16)] shadow-md">
                  <Search className="w-3.5 h-3.5 text-[#829492] ml-2 shrink-0" />
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search a location..."
                    className="w-full bg-transparent px-2 py-1 text-[11px] font-mono text-[#F1F0E9] placeholder:text-[#829492] focus:outline-none"
                  />
                  <span className="hidden sm:inline text-[9px] font-mono text-[#829492] px-1.5 py-0.5 rounded bg-white/[0.04]">
                    39.19, -106.81
                  </span>
                  <button
                    type="button"
                    onClick={onLaunchInvestigation}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono text-[#0B1719] bg-[#B6C6A3] hover:bg-[#DCE7CD] transition-colors font-semibold shrink-0 cursor-pointer shadow-[0_2px_8px_rgba(182,198,163,0.2)]"
                  >
                    Investigate
                  </button>
                </form>

                {/* Dark Carto/Satellite Map Background Simulation */}
                <div className="absolute inset-0 topographic-grid opacity-30 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1719] via-transparent to-transparent pointer-events-none" />

                {/* Central Location Pin & Pulse Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full border border-[#B6C6A3]/25 flex items-center justify-center animate-ping" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-[#B6C6A3]/40 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#B6C6A3] shadow-[0_0_12px_#B6C6A3]" />
                  </div>
                  <div className="absolute -top-7 px-2 py-0.5 rounded bg-[#142629] border border-[rgba(190,210,202,0.18)] text-[9px] font-mono text-[#F1F0E9] shadow-md flex items-center space-x-1">
                    <MapPin className="w-2.5 h-2.5 text-[#B6C6A3]" />
                    <span>ASPEN BASIN</span>
                  </div>
                </div>

                <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] font-mono text-[#829492]">
                  <span>MAPLIBRE GL VECTOR</span>
                  <span className="text-[#B6C6A3] font-medium">LIVE RADIUS 3,000M</span>
                </div>
              </div>

              {/* Middle Sub-Panel: Environmental & Infrastructure Telemetry (3 cols) */}
              <div className="md:col-span-3 p-4 sm:p-5 border-b md:border-b-0 md:border-r border-[rgba(190,210,202,0.12)] space-y-4 bg-[#102124]">
                {/* Tabs at Top */}
                <div className="flex items-center space-x-2 text-[10px] font-mono border-b border-[rgba(190,210,202,0.10)] pb-2 overflow-x-auto scrollbar-none">
                  {[
                    { id: "env", label: "Environment" },
                    { id: "infra", label: "Infrastructure" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`pb-1 transition-colors cursor-pointer shrink-0 ${
                        activeTab === t.id
                          ? "text-[#B6C6A3] font-semibold border-b-2 border-[#B6C6A3]"
                          : "text-[#829492] hover:text-[#F1F0E9]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Metrics Row (PM2.5, PM10, AQI) */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-mono text-[#829492]">PM2.5</div>
                    <div className="text-base font-serif text-[#F1F0E9] leading-none">32</div>
                    <div className="text-[8px] font-mono text-[#829492]">µg/m³</div>
                    <svg viewBox="0 0 40 10" className="w-full h-2 stroke-[#B6C6A3] fill-none stroke-[1.5]">
                      <path d="M0,8 Q15,4 25,6 T40,2" />
                    </svg>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[9px] font-mono text-[#829492]">PM10</div>
                    <div className="text-base font-serif text-[#F1F0E9] leading-none">56</div>
                    <div className="text-[8px] font-mono text-[#829492]">µg/m³</div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[9px] font-mono text-[#829492]">AQI</div>
                    <div className="text-base font-serif text-[#F1F0E9] leading-none">82</div>
                    <div className="text-[8px] font-mono text-[#D1C6A5]">Moderate</div>
                    <svg viewBox="0 0 40 10" className="w-full h-2 stroke-[#D1C6A5] fill-none stroke-[1.5]">
                      <path d="M0,5 Q20,2 30,7 T40,4" />
                    </svg>
                  </div>
                </div>

                {/* Nearby Infrastructure List */}
                <div className="space-y-2 pt-1 border-t border-[rgba(190,210,202,0.10)]">
                  <div className="text-[10px] font-mono text-[#D1C6A5] uppercase font-semibold">
                    Nearby Infrastructure
                  </div>
                  <div className="space-y-1.5 text-[11px] font-sans">
                    <div className="flex items-center justify-between text-[#B8C5C2]">
                      <span>Hospitals</span>
                      <span className="font-mono text-[#F1F0E9]">3</span>
                    </div>
                    <div className="flex items-center justify-between text-[#B8C5C2]">
                      <span>Pharmacies</span>
                      <span className="font-mono text-[#F1F0E9]">5</span>
                    </div>
                    <div className="flex items-center justify-between text-[#B8C5C2]">
                      <span>Railway Stations</span>
                      <span className="font-mono text-[#F1F0E9]">1</span>
                    </div>
                    <div className="flex items-center justify-between text-[#B8C5C2]">
                      <span>Bus Stops</span>
                      <span className="font-mono text-[#F1F0E9]">6</span>
                    </div>
                    <div className="flex items-center justify-between text-[#B8C5C2]">
                      <span>Parks</span>
                      <span className="font-mono text-[#F1F0E9]">2</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sub-Panel: AI Investigation Report (3 cols) */}
              <div className="md:col-span-3 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-[#192E31]/75">
                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-[#F1F0E9] font-semibold tracking-tight">
                    AI Investigation Report
                  </div>
                  <p className="font-sans text-xs text-[#B8C5C2] leading-relaxed">
                    The air quality in this area is moderate, with PM2.5 levels slightly above the recommended range. The location has good access to healthcare facilities and public transport.
                  </p>
                </div>

                <div className="pt-2 border-t border-[rgba(190,210,202,0.10)]">
                  <button
                    onClick={onLaunchInvestigation}
                    className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#B6C6A3] hover:text-[#DCE7CD] transition-colors cursor-pointer group"
                  >
                    <span>View Full Report</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200 text-[#B6C6A3] group-hover:text-[#DCE7CD]" />
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
