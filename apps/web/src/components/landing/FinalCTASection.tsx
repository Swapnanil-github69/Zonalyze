import React from "react";
import { ArrowRight, Crosshair } from "lucide-react";

interface FinalCTASectionProps {
  onStartInvestigation: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onStartInvestigation,
}) => {
  return (
    <section className="relative w-full py-24 bg-[#161b13] text-[#dde2e4] border-b border-[#84907f]/30 overflow-hidden">
      <div className="w-full px-6 sm:px-12">
        
        <div className="border border-[#84907f]/35 bg-[#161b13] p-8 sm:p-14 text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center space-x-3">
                <div className="sr-badge-circle">
                  <Crosshair className="w-4 h-4 text-[#e2ffcc]" />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#84907f]">
                  [DISPATCH // INITIATE INVESTIGATION]
                </span>
              </div>

              <h2 className="font-display-stout text-5xl sm:text-7xl lg:text-[88px] text-[#e2ffcc] tracking-tight leading-[0.90] uppercase">
                START WITH A PLACE. <br />
                FOLLOW THE EVIDENCE.
              </h2>

              <p className="font-mono text-xs sm:text-sm text-[#dde2e4] leading-relaxed max-w-xl">
                Explore the verified physical and civic signals around any point on earth. Generate an objective location debrief with real-time telemetry caches.
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-3">
                <button
                  onClick={onStartInvestigation}
                  className="sr-btn-mint text-xs py-4 px-8"
                >
                  <span>[ LAUNCH INVESTIGATION WORKSPACE ]</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className="font-mono text-[11px] text-[#84907f] uppercase">
                  ZERO LOGINS REQUIRED // DIRECT COORDINATE DISPATCH
                </span>
              </div>
            </div>

            {/* Right Column: Hand-Scattered Tilted Polaroid Photo Cluster */}
            <div className="lg:col-span-5 relative flex justify-center py-6">
              <div className="relative w-full max-w-md h-72">
                
                {/* Photo 1: -8deg tilt */}
                <div className="absolute top-2 left-0 w-64 p-2.5 bg-[#dde2e4] border border-[#2d3329] -rotate-6 shadow-2xl transition-transform hover:rotate-0 hover:scale-105 duration-300 z-10">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black mb-2">
                    <img src="/zonalyze_liquid_glass_crop.jpg" alt="Field Crop 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="font-mono text-[9px] text-[#2d3329] font-bold flex justify-between uppercase">
                    <span>SURVEY LOG #01</span>
                    <span>22.60°N // 88.41°E</span>
                  </div>
                </div>

                {/* Photo 2: +6deg tilt overlapping */}
                <div className="absolute top-10 right-4 w-60 p-2.5 bg-[#dde2e4] border border-[#2d3329] rotate-6 shadow-2xl transition-transform hover:rotate-0 hover:scale-105 duration-300 z-20">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black mb-2">
                    <img src="/zonalyze_liquid_glass_ui.jpg" alt="Field Crop 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="font-mono text-[9px] text-[#2d3329] font-bold flex justify-between uppercase">
                    <span>RADAR TELEMETRY</span>
                    <span>AQI: 83 POOR</span>
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
