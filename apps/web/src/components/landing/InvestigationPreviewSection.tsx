import React from "react";
import { ArrowRight, ShieldCheck, Activity } from "lucide-react";

interface InvestigationPreviewSectionProps {
  onLaunchInvestigation?: () => void;
}

export const InvestigationPreviewSection: React.FC<InvestigationPreviewSectionProps> = ({
  onLaunchInvestigation,
}) => {
  return (
    <section id="preview" className="relative w-full py-20 bg-[#dde2e4] text-[#2d3329] border-b border-[#2d3329]">
      <div className="w-full px-6 sm:px-12 space-y-12">
        
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2d3329] pb-4 text-[11px] font-mono tracking-wider uppercase">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#2d3329] inline-block" />
            <span className="font-bold">SECTION 03 // LIVE FIELD TELEMETRY</span>
          </div>
          <div>BANGUR LAKE TOWN SURVEY // KOLKATA BASIN</div>
        </div>

        {/* Section Header */}
        <div className="max-w-4xl space-y-4 text-left">
          <h2 className="font-display-stout text-5xl sm:text-7xl lg:text-[80px] text-[#2d3329] tracking-tight leading-[0.90] uppercase">
            HOW EVIDENCE APPEARS <br />
            IN THE FIELD.
          </h2>

          <p className="font-mono text-xs sm:text-sm text-[#2d3329] leading-relaxed max-w-2xl">
            When you select a location, Zonalyze opens an unembellished investigation log. Direct sensor telemetry, mapped transit points, and deterministic models are presented with zero cosmetic rating distortion.
          </p>
        </div>

        {/* San Rita Utilitarian Field Dossier Card with Liquid Glass Caustic Animation */}
        <div className="relative">
          {/* Animated Liquid Caustic Backlight Blob */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#2d3329]/15 via-emerald-500/10 to-[#84907f]/15 blur-2xl liquid-caustic-blob pointer-events-none" />

          <div className="relative border border-[#2d3329] bg-[#dde2e4]/95 backdrop-blur-xl text-left shadow-lg">
            
            {/* Card Top Utility Bar */}
          <div className="px-6 py-3 bg-[#dde2e4] border-b border-[#2d3329] flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono uppercase">
            <div className="flex items-center space-x-3">
              <span className="border border-[#2d3329] px-2 py-0.5 font-bold bg-[#2d3329] text-[#dde2e4]">
                [CACHE HIT // 150M]
              </span>
              <span className="text-[#84907f]">TIMESTAMP: 2026.10.05 18:39 UTC+5.5</span>
              <span className="font-bold text-[#2d3329] hidden md:inline">
                BANGUR, SOUTH DUMDUM, KOLKATA
              </span>
            </div>

            <div className="border border-[#2d3329] px-3 py-1 font-bold text-[#2d3329]">
              <span>COORD: 22.60995° N, 88.41794° E</span>
            </div>
          </div>

          {/* Split Preview Grid: Map + Objective Livability Index & Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#2d3329]">
            
            {/* Left Column: Field Map Crop */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#84907f] flex items-center justify-between">
                  <span>GEODETIC CATCHMENT</span>
                  <span className="text-[#2d3329] font-bold">RADIUS: 3,000M</span>
                </div>

                <div className="relative aspect-[4/3] w-full border border-[#2d3329] bg-black">
                  <img
                    src="/zonalyze_liquid_glass_crop.jpg"
                    alt="Real interactive map view with dropped pin at Tiretta Bazaar, Kolkata"
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "-webkit-optimize-contrast" }}
                  />
                  
                  <div className="absolute bottom-3 left-3 bg-[#dde2e4] border border-[#2d3329] px-2.5 py-1 text-[10px] font-mono text-[#2d3329] font-bold uppercase">
                    [PIN: 22.57617°N, 88.35801°E]
                  </div>
                </div>
              </div>

              <div className="p-3 border border-[#2d3329] flex items-center justify-between text-[11px] font-mono text-[#2d3329] uppercase">
                <span>DATUM: WGS 84</span>
                <span>EPSG:4326 DUAL-PRECISION</span>
              </div>
            </div>

            {/* Right Column: Telemetry & Objective Livability Index */}
            <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-6">
              
              <div className="space-y-6">
                {/* Block 1: Objective Livability Index */}
                <div className="p-5 border border-[#2d3329] space-y-4 bg-[#dde2e4]">
                  <div className="flex items-center justify-between border-b border-[#2d3329] pb-2">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#2d3329] tracking-wider uppercase">
                      <ShieldCheck className="w-4 h-4 text-[#2d3329]" />
                      <span>OBJECTIVE LIVABILITY SYNTHESIS</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#2d3329] border border-[#2d3329] px-2 py-0.5">
                      RATING: 7.0 / 10
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center pt-2">
                    {/* Score Box */}
                    <div className="sm:col-span-4 p-4 border border-[#2d3329] flex flex-col items-center justify-center text-center">
                      <span className="font-display-stout text-6xl text-[#2d3329] leading-none">7.0</span>
                      <span className="text-[10px] font-mono text-[#84907f] uppercase mt-1">BASE TEN SCALE</span>
                    </div>

                    {/* 4 Score Bars */}
                    <div className="sm:col-span-8 space-y-2 text-xs font-mono">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[#2d3329]">
                          <span>AIR QUALITY INDEX</span>
                          <span>0.4 / 2.5</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#84907f]/30 border border-[#2d3329]">
                          <div className="h-full bg-[#2d3329] w-[16%]" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[#2d3329]">
                          <span>ACOUSTIC BUFFER</span>
                          <span>2.5 / 2.5</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#84907f]/30 border border-[#2d3329]">
                          <div className="h-full bg-[#2d3329] w-full" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[#2d3329]">
                          <span>TRANSIT ACCESS</span>
                          <span>2.5 / 2.5</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#84907f]/30 border border-[#2d3329]">
                          <div className="h-full bg-[#2d3329] w-full" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[#2d3329]">
                          <span>ESSENTIAL PROXIMITY</span>
                          <span>1.6 / 2.5</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#84907f]/30 border border-[#2d3329]">
                          <div className="h-full bg-[#2d3329] w-[64%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] font-mono text-[#84907f] uppercase">
                    [!] MULTI-FACTOR HEURISTIC GROUNDED ON OPEN SENSOR TELEMETRY
                  </div>
                </div>

                {/* Block 2: Atmospheric Telemetry */}
                <div className="p-5 border border-[#2d3329] space-y-4 bg-[#dde2e4]">
                  <div className="flex items-center justify-between border-b border-[#2d3329] pb-2">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#2d3329] tracking-wider uppercase">
                      <Activity className="w-4 h-4 text-[#2d3329]" />
                      <span>ATMOSPHERIC OBSERVATIONS</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#2d3329] border border-[#2d3329] px-2 py-0.5">
                      AQI 101 // VERY POOR
                    </span>
                  </div>

                  {/* 4 Sensor Boxes */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 border border-[#2d3329] space-y-1">
                      <div className="text-[10px] font-mono text-[#84907f] uppercase">PM2.5 PARTICULATES</div>
                      <div className="font-display-stout text-3xl text-[#2d3329] leading-none">143 µg/m³</div>
                      <div className="text-[10px] font-mono text-[#84907f]">WHO LIMIT: 15 µg/m³</div>
                    </div>

                    <div className="p-3 border border-[#2d3329] space-y-1">
                      <div className="text-[10px] font-mono text-[#84907f] uppercase">PM10 COARSE DUST</div>
                      <div className="font-display-stout text-3xl text-[#2d3329] leading-none">159.3 µg/m³</div>
                      <div className="text-[10px] font-mono text-[#84907f]">WHO LIMIT: 45 µg/m³</div>
                    </div>

                    <div className="p-3 border border-[#2d3329] space-y-1">
                      <div className="text-[10px] font-mono text-[#84907f] uppercase">SURFACE TEMPERATURE</div>
                      <div className="font-display-stout text-3xl text-[#2d3329] leading-none">26.9°C</div>
                      <div className="text-[10px] font-mono text-[#84907f]">LIVE SENSOR 2M</div>
                    </div>

                    <div className="p-3 border border-[#2d3329] space-y-1">
                      <div className="text-[10px] font-mono text-[#84907f] uppercase">SEASONAL BASELINE</div>
                      <div className="font-display-stout text-3xl text-[#2d3329] leading-none">28.4°C</div>
                      <div className="text-[10px] font-mono text-[#84907f]">7-DAY SENSORY MEAN</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action inside preview */}
              <div className="pt-4 border-t border-[#2d3329] flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono text-xs text-[#84907f] uppercase">
                  ENTER ANY GLOBAL COORDINATE TO GENERATE LOG.
                </span>

                <button
                  onClick={onLaunchInvestigation}
                  className="sr-btn-charcoal text-xs py-3 px-6"
                >
                  <span>[ OPEN INVESTIGATION WORKSPACE ]</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
