import React from "react";
import { Wind, Building2, Mountain, Volume2 } from "lucide-react";
import { useLandingTheme } from "../../context/LandingThemeContext";

export const IntroEditorialSection: React.FC = () => {
  const { theme } = useLandingTheme();
  const isLiterary = theme === "literary";

  return (
    <section
      id="about"
      className={`relative w-full py-20 overflow-hidden transition-colors duration-500 ${
        isLiterary
          ? "bg-[#fefffc] border-b border-[#dee2de] text-[#444141]"
          : "bg-[#dde2e4] text-[#2d3329] border-b border-[#2d3329]"
      }`}
    >
      {/* Background elements */}
      {isLiterary ? (
        <div className="absolute inset-0 topographic-grid-dark opacity-10 pointer-events-none" />
      ) : (
        <>
          <div className="absolute inset-0 topographic-grid-dark opacity-35 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-700/10 rounded-full liquid-caustic-blob pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#84907f]/15 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-6s" }} />
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
            <span className="font-bold">{isLiterary ? "Scope & Architecture" : "SCOPE & ARCHITECTURE"}</span>
          </div>
          <div
            className={`px-3 py-1 font-medium ${
              isLiterary
                ? "gic-card bg-[#ffffff] border border-[#dee2de] text-[11px] text-[#444141] rounded-full shadow-none"
                : "glass-card-light text-[10px] font-bold"
            }`}
          >
            <span className="font-editorial-sans">
              Catchment standard: 3,000m geo-radial
            </span>
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left">
          
          <div className="lg:col-span-5 space-y-5">
            <h2 className={`font-editorial-serif font-normal text-3xl sm:text-5xl lg:text-[54px] tracking-[-0.03em] leading-[1.1] ${
              isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"
            }`}>
              The observation framework.
            </h2>

            <p
              className={`text-sm leading-relaxed font-editorial-sans ${
                isLiterary
                  ? "text-[#444141] text-[15px]"
                  : "text-[#2d3329] text-xs sm:text-[15px]"
              }`}
            >
              A coordinate is merely a spatial pin. Zonalyze retrieves empirical signals across atmospheric arrays, civic registries, and physical terrain, documenting what is measurable and explicitly leaving missing records uninvented.
            </p>

            <div
              className={`pt-3 border-t text-xs leading-normal font-editorial-sans ${
                isLiterary
                  ? "border-[#dee2de] text-[#646464]"
                  : "border-[#2d3329]/40 text-[#84907f]"
              }`}
            >
              <span>Read the methodology on </span>
              <a
                href="#how-it-works"
                className={`underline hover:opacity-80 font-medium ${
                  isLiterary ? "text-[#41a1cf]" : "text-[#2d3329]"
                }`}
              >
                deterministic distance decay & sensor freshness.
              </a>
            </div>
          </div>

          {/* Right Column: 4 Field Channel Cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Channel 1: Atmosphere */}
              <div
                className={`p-6 transition-all duration-300 hover:-translate-y-1 space-y-3 ${
                  isLiterary
                    ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-xl hover:border-[#b4b8b4]"
                    : "glass-card-light"
                }`}
              >
                <div className="flex items-center justify-end">
                  <Wind className={`w-4 h-4 ${isLiterary ? "text-[#41a1cf]" : "text-[#2d3329]"}`} />
                </div>
                <h3 className={`text-xl sm:text-2xl tracking-tight font-editorial-serif font-normal ${
                  isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"
                }`}>
                  Atmosphere
                </h3>
                <p className={`text-xs leading-relaxed font-editorial-sans ${
                  isLiterary ? "text-[#444141] text-[13px]" : "text-[#2d3329]"
                }`}>
                  Real-time PM2.5, PM10 inhalables, temperature variance, and European Air Quality Index scales.
                </p>
              </div>

              {/* Channel 2: Transit */}
              <div
                className={`p-6 transition-all duration-300 hover:-translate-y-1 space-y-3 ${
                  isLiterary
                    ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-xl hover:border-[#b4b8b4]"
                    : "glass-card-light"
                }`}
              >
                <div className="flex items-center justify-end">
                  <Building2 className={`w-4 h-4 ${isLiterary ? "text-[#41a1cf]" : "text-[#2d3329]"}`} />
                </div>
                <h3 className={`text-xl sm:text-2xl tracking-tight font-editorial-serif font-normal ${
                  isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"
                }`}>
                  Transit & Amenities
                </h3>
                <p className={`text-xs leading-relaxed font-editorial-sans ${
                  isLiterary ? "text-[#444141] text-[13px]" : "text-[#2d3329]"
                }`}>
                  Mapped healthcare facilities, suburban rail lines, bus stops, and public recreational grounds.
                </p>
              </div>

              {/* Channel 3: Acoustic buffer */}
              <div
                className={`p-6 transition-all duration-300 hover:-translate-y-1 space-y-3 ${
                  isLiterary
                    ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-xl hover:border-[#b4b8b4]"
                    : "glass-card-light"
                }`}
              >
                <div className="flex items-center justify-end">
                  <Volume2 className={`w-4 h-4 ${isLiterary ? "text-[#41a1cf]" : "text-[#2d3329]"}`} />
                </div>
                <h3 className={`text-xl sm:text-2xl tracking-tight font-editorial-serif font-normal ${
                  isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"
                }`}>
                  Acoustic Buffer
                </h3>
                <p className={`text-xs leading-relaxed font-editorial-sans ${
                  isLiterary ? "text-[#444141] text-[13px]" : "text-[#2d3329]"
                }`}>
                  Mathematical transit corridor proximity decay modeling with categorical confidence ratings.
                </p>
              </div>

              {/* Channel 4: Topography */}
              <div
                className={`p-6 transition-all duration-300 hover:-translate-y-1 space-y-3 ${
                  isLiterary
                    ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-xl hover:border-[#b4b8b4]"
                    : "glass-card-light"
                }`}
              >
                <div className="flex items-center justify-end">
                  <Mountain className={`w-4 h-4 ${isLiterary ? "text-[#41a1cf]" : "text-[#2d3329]"}`} />
                </div>
                <h3 className={`text-xl sm:text-2xl tracking-tight font-editorial-serif font-normal ${
                  isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"
                }`}>
                  Elevation Context
                </h3>
                <p className={`text-xs leading-relaxed font-editorial-sans ${
                  isLiterary ? "text-[#444141] text-[13px]" : "text-[#2d3329]"
                }`}>
                  Digital elevation contour profiles, surface gradient degrees, and hydrographic basin relations.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
