import React from "react";
import { ArrowRight, Compass, Crosshair } from "lucide-react";
import { useLandingTheme } from "../../context/LandingThemeContext";

interface FinalCTASectionProps {
  onStartInvestigation: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onStartInvestigation,
}) => {
  const { isLiterary } = useLandingTheme();

  if (isLiterary) {
    return (
      <section className="relative w-full py-24 bg-[#fefffc] text-[#444141] border-b border-[#dee2de] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
          <div className="bg-[#ffffff] rounded-[24px] p-8 sm:p-14 lg:p-16 border border-[#dee2de] shadow-[rgba(0,0,0,0.06)_0px_2px_4px_0px,rgba(0,0,0,0.04)_0px_0px_0px_1px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Literary Dispatch */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full border border-[#41a1cf]/40 bg-[#41a1cf]/5 flex items-center justify-center text-[#41a1cf]">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="font-editorial-sans text-[13px] font-medium tracking-tight text-[#41a1cf]">
                    Dispatch · Initiate Inquiry
                  </span>
                </div>

                <h2 className="font-editorial-serif font-normal text-4xl sm:text-5xl lg:text-6xl text-[#2c2c2c] tracking-[-0.035em] leading-[1.1]">
                  Start with a place. <br />
                  Follow the evidence.
                </h2>

                <p className="font-editorial-sans text-[16px] text-[#444141] leading-relaxed max-w-xl">
                  Explore verified physical and civic signals around any point on earth. Generate an objective location debrief with real-time sensor telemetry and atmospheric depth.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <button
                    onClick={onStartInvestigation}
                    className="gic-btn-primary"
                  >
                    <span>Launch Investigation Workspace</span>
                    <span className="w-5 h-5 rounded-full border border-[#41a1cf] flex items-center justify-center">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>

                  <span className="font-editorial-sans text-[13px] text-[#646464]">
                    Direct coordinates · Zero sign-in required
                  </span>
                </div>
              </div>

              {/* Right Column: Hand-painted atmospheric illustration cards */}
              <div className="lg:col-span-5 relative flex justify-center py-6">
                <div className="relative w-full max-w-md h-72">
                  
                  {/* Card 1: Warm landscape frame */}
                  <div className="absolute top-2 left-0 w-64 p-3 bg-[#ffffff] rounded-[16px] border border-[#dee2de] shadow-[rgba(0,0,0,0.08)_0px_2px_8px] -rotate-3 transition-transform hover:rotate-0 hover:scale-105 duration-300 z-10">
                    <div className="aspect-[4/3] w-full rounded-[10px] overflow-hidden bg-[#f9faf7] mb-2 border border-[#dee2de]/50">
                      <img src="/zonalyze_literary_map_crop.jpg" alt="Atmospheric Field View" className="w-full h-full object-cover" />
                    </div>
                    <div className="font-editorial-sans text-[13px] text-[#2c2c2c] font-medium flex justify-between">
                      <span>Survey Log · Tiretta</span>
                      <span className="text-[#646464]">22.58°N // 88.36°E</span>
                    </div>
                  </div>

                  {/* Card 2: Field sensor frame */}
                  <div className="absolute top-10 right-4 w-60 p-3 bg-[#ffffff] rounded-[16px] border border-[#dee2de] shadow-[rgba(0,0,0,0.08)_0px_4px_12px] rotate-3 transition-transform hover:rotate-0 hover:scale-105 duration-300 z-20">
                    <div className="aspect-[4/3] w-full rounded-[10px] overflow-hidden bg-[#f9faf7] mb-2 border border-[#dee2de]/50">
                      <img src="/zonalyze_literary_paper_console.jpg" alt="Atmospheric Sensor View" className="w-full h-full object-cover" />
                    </div>
                    <div className="font-editorial-sans text-[13px] text-[#2c2c2c] font-medium flex justify-between">
                      <span>Sensor Telemetry</span>
                      <span className="text-[#41a1cf]">AQI 101 · Poor</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full py-24 bg-[#161b13] text-[#dde2e4] border-b border-[#84907f]/30 overflow-hidden">
      {/* Ambient background light & grid */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#e2ffcc]/6 rounded-full liquid-caustic-blob pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-10s" }} />
      <div className="absolute inset-0 topographic-grid opacity-35 pointer-events-none" />

      <div className="relative w-full px-6 sm:px-12">
        <div className="glass-panel p-8 sm:p-14 text-left border border-[#e2ffcc]/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(226,255,204,0.3)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="sr-badge-circle border-[#e2ffcc]/60 bg-[#e2ffcc]/10 backdrop-blur-md">
                  <Crosshair className="w-4 h-4 text-[#e2ffcc]" />
                </div>
                <span className="font-editorial-sans text-xs uppercase tracking-widest text-[#e2ffcc] font-bold">
                  [DISPATCH // INITIATE INVESTIGATION]
                </span>
              </div>

              <h2 className="font-editorial-serif font-normal text-4xl sm:text-5xl lg:text-6xl text-[#e2ffcc] tracking-[-0.035em] leading-[1.1]">
                Start with a place. <br />
                Follow the evidence.
              </h2>

              <p className="font-editorial-sans text-[15px] text-[#dde2e4] leading-relaxed max-w-xl">
                Explore the verified physical and civic signals around any point on earth. Generate an objective location debrief with real-time telemetry caches.
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-3">
                <button
                  onClick={onStartInvestigation}
                  className="sr-btn-mint text-xs sm:text-sm py-3.5 px-7 font-editorial-sans font-medium shadow-[0_0_20px_rgba(226,255,204,0.2)] hover:shadow-[0_0_30px_rgba(226,255,204,0.4)]"
                >
                  <span>[ LAUNCH INVESTIGATION WORKSPACE ]</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className="font-editorial-sans text-[12px] text-[#84907f]">
                  Zero logins required // Direct coordinate dispatch
                </span>
              </div>
            </div>

            {/* Right Column: Frosted Glass Polaroid Photo Displays */}
            <div className="lg:col-span-5 relative flex justify-center py-6">
              <div className="relative w-full max-w-md h-72">
                <div className="absolute top-2 left-0 w-64 p-3 glass-card-light -rotate-3 shadow-2xl transition-transform hover:rotate-0 hover:scale-105 duration-300 z-10 border border-[#2d3329]/30">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black mb-2 shadow-inner">
                    <img src="/zonalyze_tactical_map_crop.jpg" alt="Field Crop 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="font-editorial-sans text-[10px] text-[#2d3329] font-medium flex justify-between uppercase">
                    <span>SURVEY LOG #01</span>
                    <span>22.58°N // 88.36°E</span>
                  </div>
                </div>

                <div className="absolute top-10 right-4 w-60 p-3 glass-card-light rotate-3 shadow-2xl transition-transform hover:rotate-0 hover:scale-105 duration-300 z-20 border border-[#2d3329]/30">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black mb-2 shadow-inner">
                    <img src="/zonalyze_tactical_dark_console.jpg" alt="Field Crop 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="font-editorial-sans text-[10px] text-[#2d3329] font-medium flex justify-between uppercase">
                    <span>RADAR TELEMETRY</span>
                    <span className="text-red-700">AQI: 101 POOR</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
