import React from "react";
import { ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { useLandingTheme } from "../../context/LandingThemeContext";

interface InvestigationPreviewSectionProps {
  onLaunchInvestigation?: () => void;
}

export const InvestigationPreviewSection: React.FC<InvestigationPreviewSectionProps> = ({
  onLaunchInvestigation,
}) => {
  const { theme } = useLandingTheme();
  const isLiterary = theme === "literary";

  return (
    <section
      id="preview"
      className={`relative w-full py-20 overflow-hidden transition-colors duration-500 ${
        isLiterary
          ? "bg-[#fefffc] border-b border-[#dee2de] text-[#444141]"
          : "bg-[#dde2e4] text-[#2d3329] border-b border-[#2d3329]"
      }`}
    >
      {/* Ambient background elements */}
      {isLiterary ? (
        <div className="absolute inset-0 topographic-grid-dark opacity-10 pointer-events-none" />
      ) : (
        <>
          <div className="absolute inset-0 topographic-grid-dark opacity-35 pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full liquid-caustic-blob pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#84907f]/15 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-9s" }} />
        </>
      )}

      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        
        {/* Top Header Row */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 pb-4 text-xs tracking-wider uppercase border-b ${
            isLiterary
              ? "border-[#dee2de] font-editorial-sans text-[#646464]"
              : "border-[#2d3329]/30 font-editorial-sans text-[11px] text-[#2d3329]"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 inline-block ${isLiterary ? "bg-[#41a1cf] rounded-full" : "bg-[#2d3329] animate-pulse"}`} />
            <span className="font-bold">{isLiterary ? "Live Field Telemetry" : "LIVE FIELD TELEMETRY"}</span>
          </div>
          <div
            className={`px-3 py-1 font-medium font-editorial-sans ${
              isLiterary
                ? "gic-card bg-[#ffffff] border border-[#dee2de] text-[11px] text-[#444141] rounded-full shadow-none"
                : "px-2.5 py-1 glass-card-light text-[10px] font-bold"
            }`}
          >
            {isLiterary ? "Bangur Lake Town Survey — Kolkata Basin" : "BANGUR LAKE TOWN SURVEY // KOLKATA BASIN"}
          </div>
        </div>

        {/* Section Header */}
        <div className="max-w-4xl space-y-4 text-left">
          <h2 className={`font-editorial-serif font-normal text-3xl sm:text-5xl lg:text-[54px] tracking-[-0.03em] leading-[1.1] ${
            isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"
          }`}>
            How evidence appears in the field.
          </h2>

          <p
            className={`text-sm sm:text-[15px] leading-relaxed max-w-2xl font-editorial-sans ${
              isLiterary ? "text-[#444141]" : "text-[#2d3329]"
            }`}
          >
            When you select a location, Zonalyze opens an unembellished investigation log. Direct sensor telemetry, mapped transit points, and deterministic models are presented with zero cosmetic rating distortion.
          </p>
        </div>

        {/* Field Dossier Card */}
        <div className="relative">
          <div
            className={`relative text-left overflow-hidden ${
              isLiterary
                ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-2xl shadow-[0_16px_50px_-12px_rgba(40,40,52,0.08)]"
                : "glass-panel-light border border-[#2d3329]/35 shadow-[0_25px_60px_-15px_rgba(45,51,41,0.25)]"
            }`}
          >
            
            {/* Card Top Utility Bar */}
            <div
              className={`px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs ${
                isLiterary
                  ? "bg-[#f9faf7] border-b border-[#dee2de] font-editorial-sans text-[#444141]"
                  : "bg-[#dde2e4]/70 backdrop-blur-md border-b border-[#2d3329]/25 font-editorial-sans uppercase text-[11px]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`px-2.5 py-0.5 font-bold ${
                    isLiterary
                      ? "border border-[#dee2de] bg-[#ffffff] text-[#2c2c2c] rounded-md font-medium font-editorial-sans"
                      : "border border-[#2d3329] bg-[#2d3329] text-[#dde2e4] font-editorial-sans"
                  }`}
                >
                  [CACHE HIT // 150M]
                </span>
                <span className={isLiterary ? "text-[#646464] font-editorial-sans" : "text-[#84907f] font-editorial-sans"}>
                  TIMESTAMP: 2026.10.05 18:39 UTC+5.5
                </span>
                <span className={`hidden md:inline font-medium font-editorial-sans ${isLiterary ? "text-[#2c2c2c]" : "font-bold text-[#2d3329]"}`}>
                  Bangur, South Dumdum, Kolkata
                </span>
              </div>

              <div
                className={`px-3 py-1 font-medium font-editorial-sans ${
                  isLiterary
                    ? "border border-[#dee2de] bg-[#ffffff] rounded-md text-[#2c2c2c]"
                    : "glass-card-light font-bold text-[#2d3329]"
                }`}
              >
                <span>COORD: 22.60995° N, 88.41794° E</span>
              </div>
            </div>

            {/* Split Preview Grid: Map + Objective Livability Index & Telemetry */}
            <div
              className={`grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x ${
                isLiterary ? "divide-[#dee2de]" : "divide-[#2d3329]/25"
              }`}
            >
              
              {/* Left Column: Field Map Crop */}
              <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div
                    className={`flex items-center justify-between text-xs ${
                      isLiterary ? "font-editorial-sans text-[#646464]" : "text-[11px] font-editorial-sans uppercase tracking-wider text-[#84907f]"
                    }`}
                  >
                    <span>{isLiterary ? "Geodetic Catchment" : "GEODETIC CATCHMENT"}</span>
                    <span className={`font-bold ${isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"}`}>
                      RADIUS: 3,000M
                    </span>
                  </div>

                  <div
                    className={`relative aspect-[4/3] w-full overflow-hidden shadow-md ${
                      isLiterary ? "border border-[#dee2de] rounded-xl bg-black" : "border border-[#2d3329]/30 bg-black"
                    }`}
                  >
                    <img
                      src={isLiterary ? "/zonalyze_literary_map_crop.jpg" : "/zonalyze_tactical_map_crop.jpg"}
                      alt="Real interactive map view with dropped pin at Tiretta Bazaar, Kolkata"
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    
                    <div
                      className={`absolute bottom-3 left-3 px-2.5 py-1 text-[11px] shadow-sm font-medium ${
                        isLiterary
                          ? "gic-card bg-[#ffffff] border border-[#dee2de] text-[#2c2c2c] rounded-md"
                          : "glass-card-light text-[10px] font-editorial-sans text-[#2d3329] font-bold uppercase"
                      }`}
                    >
                      [PIN: 22.57617°N, 88.35801°E]
                    </div>
                  </div>
                  {/* In-Situ Physical & Civic Catchment Telemetry */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-editorial-sans pt-1">
                    <div
                      className={`p-3 ${
                        isLiterary
                          ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-xl"
                          : "border border-[#2d3329]/20 bg-white/45 backdrop-blur-md"
                      }`}
                    >
                      <div className={`text-[10px] uppercase font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>
                        {isLiterary ? "Elevation Datum" : "ELEVATION DATUM"}
                      </div>
                      <div className={`font-bold text-lg font-editorial-serif ${isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"}`}>
                        11 m a.s.l.
                      </div>
                      <div className={`text-[10px] font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>
                        SRTM DEM CONTOUR
                      </div>
                    </div>

                    <div
                      className={`p-3 ${
                        isLiterary
                          ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-xl"
                          : "border border-[#2d3329]/20 bg-white/45 backdrop-blur-md"
                      }`}
                    >
                      <div className={`text-[10px] uppercase font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>
                        {isLiterary ? "Civic Density" : "CIVIC DENSITY"}
                      </div>
                      <div className={`font-bold text-lg font-editorial-serif ${isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"}`}>
                        66 Facilities
                      </div>
                      <div className={`text-[10px] font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>
                        3,000M CATCHMENT
                      </div>
                    </div>

                    <div
                      className={`p-3 ${
                        isLiterary
                          ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-xl"
                          : "border border-[#2d3329]/20 bg-white/45 backdrop-blur-md"
                      }`}
                    >
                      <div className={`text-[10px] uppercase font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>
                        {isLiterary ? "Transit Corridor" : "TRANSIT CORRIDOR"}
                      </div>
                      <div className={`font-bold text-lg font-editorial-serif ${isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"}`}>
                        140 m Buffer
                      </div>
                      <div className={`text-[10px] font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>
                        HEAVY RAIL PROXIMITY
                      </div>
                    </div>

                    <div
                      className={`p-3 ${
                        isLiterary
                          ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-xl"
                          : "border border-[#2d3329]/20 bg-white/45 backdrop-blur-md"
                      }`}
                    >
                      <div className={`text-[10px] uppercase font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>
                        {isLiterary ? "Emergency Care" : "EMERGENCY CARE"}
                      </div>
                      <div className={`font-bold text-lg font-editorial-serif ${isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"}`}>
                        420 m Radial
                      </div>
                      <div className={`text-[10px] font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>
                        TRAUMA FACILITY
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-3.5 flex items-center justify-between text-xs ${
                    isLiterary
                      ? "gic-card bg-[#f9faf7] border border-[#dee2de] rounded-lg font-editorial-sans text-[#444141]"
                      : "p-3 glass-card-light font-editorial-sans text-[11px] text-[#2d3329] uppercase"
                  }`}
                >
                  <span>DATUM: WGS 84</span>
                  <span className="font-bold">EPSG:4326 DUAL-PRECISION</span>
                </div>
              </div>

              {/* Right Column: Telemetry & Objective Livability Index */}
              <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-6">
                
                <div className="space-y-6">
                  {/* Block 1: Objective Livability Index */}
                  <div
                    className={`p-5 space-y-4 ${
                      isLiterary
                        ? "gic-card bg-[#f9faf7] border border-[#dee2de] rounded-xl"
                        : "glass-card-light border border-[#2d3329]/25"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between pb-2 border-b ${
                        isLiterary ? "border-[#dee2de]" : "border-[#2d3329]/20"
                      }`}
                    >
                      <div className="flex items-center space-x-2 text-xs font-bold tracking-wide uppercase">
                        <ShieldCheck className={`w-4 h-4 ${isLiterary ? "text-[#41a1cf]" : "text-[#2d3329]"}`} />
                        <span className="font-editorial-sans">
                          {isLiterary ? "Objective Livability Synthesis" : "OBJECTIVE LIVABILITY SYNTHESIS"}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 font-editorial-sans ${
                          isLiterary
                            ? "border border-[#dee2de] bg-[#ffffff] text-[#41a1cf] rounded-md"
                            : "text-[#2d3329] border border-[#2d3329]/40 bg-white/40"
                        }`}
                      >
                        RATING: 7.0 / 10
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center pt-2">
                      {/* Score Box */}
                      <div
                        className={`sm:col-span-4 p-4 flex flex-col items-center justify-center text-center shadow-sm ${
                          isLiterary
                            ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-xl"
                            : "border border-[#2d3329]/25 bg-white/45 backdrop-blur-md"
                        }`}
                      >
                        <span
                          className={`text-5xl sm:text-6xl leading-none font-editorial-serif font-normal ${
                            isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"
                          }`}
                        >
                          7.0
                        </span>
                        <span className={`text-[10px] uppercase mt-1 font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>
                          BASE TEN SCALE
                        </span>
                      </div>

                      {/* 4 Score Bars */}
                      <div className="sm:col-span-8 space-y-2.5 text-xs font-editorial-sans">
                        <div className="space-y-1">
                          <div className={`flex justify-between ${isLiterary ? "text-[#444141]" : "text-[#2d3329]"}`}>
                            <span>AIR QUALITY INDEX</span>
                            <span className="font-bold">0.4 / 2.5</span>
                          </div>
                          <div className={`h-1.5 w-full ${isLiterary ? "bg-[#dee2de] rounded-full overflow-hidden" : "bg-[#84907f]/25 border border-[#2d3329]/30"}`}>
                            <div className={`h-full ${isLiterary ? "bg-[#41a1cf]" : "bg-[#2d3329]"} w-[16%]`} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className={`flex justify-between ${isLiterary ? "text-[#444141]" : "text-[#2d3329]"}`}>
                            <span>ACOUSTIC BUFFER</span>
                            <span className="font-bold">2.5 / 2.5</span>
                          </div>
                          <div className={`h-1.5 w-full ${isLiterary ? "bg-[#dee2de] rounded-full overflow-hidden" : "bg-[#84907f]/25 border border-[#2d3329]/30"}`}>
                            <div className={`h-full ${isLiterary ? "bg-[#41a1cf]" : "bg-[#2d3329]"} w-full`} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className={`flex justify-between ${isLiterary ? "text-[#444141]" : "text-[#2d3329]"}`}>
                            <span>TRANSIT ACCESS</span>
                            <span className="font-bold">2.5 / 2.5</span>
                          </div>
                          <div className={`h-1.5 w-full ${isLiterary ? "bg-[#dee2de] rounded-full overflow-hidden" : "bg-[#84907f]/25 border border-[#2d3329]/30"}`}>
                            <div className={`h-full ${isLiterary ? "bg-[#41a1cf]" : "bg-[#2d3329]"} w-full`} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className={`flex justify-between ${isLiterary ? "text-[#444141]" : "text-[#2d3329]"}`}>
                            <span>ESSENTIAL PROXIMITY</span>
                            <span className="font-bold">1.6 / 2.5</span>
                          </div>
                          <div className={`h-1.5 w-full ${isLiterary ? "bg-[#dee2de] rounded-full overflow-hidden" : "bg-[#84907f]/25 border border-[#2d3329]/30"}`}>
                            <div className={`h-full ${isLiterary ? "bg-[#41a1cf]" : "bg-[#2d3329]"} w-[64%]`} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`pt-2 text-[11px] uppercase font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>
                      [!] MULTI-FACTOR HEURISTIC GROUNDED ON OPEN SENSOR TELEMETRY
                    </div>
                  </div>

                  {/* Block 2: Atmospheric Telemetry */}
                  <div
                    className={`p-5 space-y-4 ${
                      isLiterary
                        ? "gic-card bg-[#f9faf7] border border-[#dee2de] rounded-xl"
                        : "glass-card-light border border-[#2d3329]/25"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between pb-2 border-b ${
                        isLiterary ? "border-[#dee2de]" : "border-[#2d3329]/20"
                      }`}
                    >
                      <div className="flex items-center space-x-2 text-xs font-bold tracking-wide uppercase">
                        <Activity className={`w-4 h-4 ${isLiterary ? "text-[#41a1cf]" : "text-[#2d3329]"}`} />
                        <span className="font-editorial-sans">
                          {isLiterary ? "Atmospheric Observations" : "ATMOSPHERIC OBSERVATIONS"}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 font-editorial-sans ${
                          isLiterary
                            ? "border border-[#dee2de] bg-[#ffffff] text-red-600 rounded-md"
                            : "text-[#2d3329] border border-[#2d3329]/40 bg-white/40"
                        }`}
                      >
                        AQI 101 // VERY POOR
                      </span>
                    </div>

                    {/* 4 Sensor Boxes */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div
                        className={`p-3.5 space-y-1 ${
                          isLiterary
                            ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-lg"
                            : "p-3 border border-[#2d3329]/20 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors"
                        }`}
                      >
                        <div className={`text-[10px] uppercase font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>PM2.5 PARTICULATES</div>
                        <div className={`text-2xl sm:text-3xl leading-none font-editorial-serif font-normal ${isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"}`}>143 µg/m³</div>
                        <div className={`text-[10px] font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>WHO LIMIT: 15 µg/m³</div>
                      </div>

                      <div
                        className={`p-3.5 space-y-1 ${
                          isLiterary
                            ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-lg"
                            : "p-3 border border-[#2d3329]/20 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors"
                        }`}
                      >
                        <div className={`text-[10px] uppercase font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>PM10 COARSE DUST</div>
                        <div className={`text-2xl sm:text-3xl leading-none font-editorial-serif font-normal ${isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"}`}>159.3 µg/m³</div>
                        <div className={`text-[10px] font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>WHO LIMIT: 45 µg/m³</div>
                      </div>

                      <div
                        className={`p-3.5 space-y-1 ${
                          isLiterary
                            ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-lg"
                            : "p-3 border border-[#2d3329]/20 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors"
                        }`}
                      >
                        <div className={`text-[10px] uppercase font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>SURFACE TEMPERATURE</div>
                        <div className={`text-2xl sm:text-3xl leading-none font-editorial-serif font-normal ${isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"}`}>26.9°C</div>
                        <div className={`text-[10px] font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>LIVE SENSOR 2M</div>
                      </div>

                      <div
                        className={`p-3.5 space-y-1 ${
                          isLiterary
                            ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-lg"
                            : "p-3 border border-[#2d3329]/20 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors"
                        }`}
                      >
                        <div className={`text-[10px] uppercase font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>SEASONAL BASELINE</div>
                        <div className={`text-2xl sm:text-3xl leading-none font-editorial-serif font-normal ${isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"}`}>28.4°C</div>
                        <div className={`text-[10px] font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>7-DAY SENSORY MEAN</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action inside preview */}
                <div
                  className={`pt-4 border-t flex flex-wrap items-center justify-between gap-4 ${
                    isLiterary ? "border-[#dee2de]" : "border-[#2d3329]/25"
                  }`}
                >
                  <span className={`text-xs font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f] uppercase"}`}>
                    {isLiterary ? "Enter any global coordinate to generate dossier." : "ENTER ANY GLOBAL COORDINATE TO GENERATE LOG."}
                  </span>

                  {isLiterary ? (
                    <button
                      onClick={onLaunchInvestigation}
                      className="gic-btn-secondary text-xs sm:text-sm py-2 px-5"
                    >
                      <span>Open Investigation Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#282834]" />
                    </button>
                  ) : (
                    <button
                      onClick={onLaunchInvestigation}
                      className="sr-btn-charcoal text-xs sm:text-sm py-2.5 px-6 font-editorial-sans font-medium shadow-sm hover:shadow-md"
                    >
                      <span>OPEN INVESTIGATION WORKSPACE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
