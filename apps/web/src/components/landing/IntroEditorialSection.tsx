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

      <div className="relative w-full px-6 sm:px-12 space-y-12">
        
        {/* Top Header Row */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 pb-4 text-xs tracking-wider uppercase border-b ${
            isLiterary
              ? "border-[#dee2de] font-editorial-sans text-[#646464]"
              : "border-[#2d3329]/30 font-mono text-[11px] text-[#2d3329]"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 inline-block ${isLiterary ? "bg-[#41a1cf] rounded-full" : "bg-[#2d3329] animate-pulse"}`} />
            <span className="font-bold">{isLiterary ? "Section 01 — Scope & Architecture" : "SECTION 01 // SCOPE & ARCHITECTURE"}</span>
          </div>
          <div
            className={`px-3 py-1 font-medium ${
              isLiterary
                ? "gic-card bg-[#ffffff] border border-[#dee2de] text-[11px] text-[#444141] rounded-full shadow-none"
                : "glass-card-light text-[10px] font-bold"
            }`}
          >
            {isLiterary ? "Catchment standard: 3,000m geo-radial" : "CATCHMENT STANDARD: 3,000M GEO-RADIAL"}
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left">
          
          <div className="lg:col-span-5 space-y-5">
            {isLiterary ? (
              <h2 className="font-editorial-serif font-normal text-3xl sm:text-5xl lg:text-[54px] text-[#2c2c2c] tracking-[-0.03em] leading-[1.1]">
                The observation framework.
              </h2>
            ) : (
              <h2 className="font-display-stout text-4xl sm:text-6xl lg:text-[72px] text-[#2d3329] tracking-tight leading-[0.90] uppercase">
                THE OBSERVATION <br />
                FRAMEWORK.
              </h2>
            )}

            <p
              className={`text-sm leading-relaxed ${
                isLiterary
                  ? "font-editorial-sans text-[#444141] text-[15px]"
                  : "font-mono text-xs sm:text-sm text-[#2d3329]"
              }`}
            >
              A coordinate is merely a spatial pin. Zonalyze retrieves empirical signals across atmospheric arrays, civic registries, and physical terrain, documenting what is measurable and explicitly leaving missing records uninvented.
            </p>

            <div
              className={`pt-3 border-t text-xs leading-normal ${
                isLiterary
                  ? "border-[#dee2de] font-editorial-sans text-[#646464]"
                  : "border-[#2d3329]/40 font-mono text-[11px] text-[#84907f] uppercase"
              }`}
            >
              <span>Read the methodology on </span>
              <a
                href="#how-it-works"
                className={`underline hover:opacity-80 ${
                  isLiterary ? "text-[#41a1cf] font-medium" : "font-serif-times italic text-base text-[#2d3329]"
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
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isLiterary ? "font-editorial-sans text-[#646464] font-medium" : "text-[10px] font-mono uppercase text-[#84907f]"}`}>
                    [CH-01]
                  </span>
                  <Wind className={`w-4 h-4 ${isLiterary ? "text-[#41a1cf]" : "text-[#2d3329]"}`} />
                </div>
                <h3
                  className={`text-xl sm:text-2xl tracking-wide ${
                    isLiterary
                      ? "font-editorial-serif font-normal text-[#2c2c2c]"
                      : "font-display-stout text-[#2d3329] uppercase"
                  }`}
                >
                  {isLiterary ? "Atmosphere" : "ATMOSPHERE"}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isLiterary ? "font-editorial-sans text-[#444141] text-[13px]" : "font-mono text-[#2d3329]"
                  }`}
                >
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
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isLiterary ? "font-editorial-sans text-[#646464] font-medium" : "text-[10px] font-mono uppercase text-[#84907f]"}`}>
                    [CH-02]
                  </span>
                  <Building2 className={`w-4 h-4 ${isLiterary ? "text-[#41a1cf]" : "text-[#2d3329]"}`} />
                </div>
                <h3
                  className={`text-xl sm:text-2xl tracking-wide ${
                    isLiterary
                      ? "font-editorial-serif font-normal text-[#2c2c2c]"
                      : "font-display-stout text-[#2d3329] uppercase"
                  }`}
                >
                  {isLiterary ? "Transit & Amenities" : "TRANSIT & AMENITIES"}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isLiterary ? "font-editorial-sans text-[#444141] text-[13px]" : "font-mono text-[#2d3329]"
                  }`}
                >
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
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isLiterary ? "font-editorial-sans text-[#646464] font-medium" : "text-[10px] font-mono uppercase text-[#84907f]"}`}>
                    [CH-03]
                  </span>
                  <Volume2 className={`w-4 h-4 ${isLiterary ? "text-[#41a1cf]" : "text-[#2d3329]"}`} />
                </div>
                <h3
                  className={`text-xl sm:text-2xl tracking-wide ${
                    isLiterary
                      ? "font-editorial-serif font-normal text-[#2c2c2c]"
                      : "font-display-stout text-[#2d3329] uppercase"
                  }`}
                >
                  {isLiterary ? "Acoustic Buffer" : "ACOUSTIC BUFFER"}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isLiterary ? "font-editorial-sans text-[#444141] text-[13px]" : "font-mono text-[#2d3329]"
                  }`}
                >
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
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isLiterary ? "font-editorial-sans text-[#646464] font-medium" : "text-[10px] font-mono uppercase text-[#84907f]"}`}>
                    [CH-04]
                  </span>
                  <Mountain className={`w-4 h-4 ${isLiterary ? "text-[#41a1cf]" : "text-[#2d3329]"}`} />
                </div>
                <h3
                  className={`text-xl sm:text-2xl tracking-wide ${
                    isLiterary
                      ? "font-editorial-serif font-normal text-[#2c2c2c]"
                      : "font-display-stout text-[#2d3329] uppercase"
                  }`}
                >
                  {isLiterary ? "Elevation Context" : "ELEVATION CONTEXT"}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isLiterary ? "font-editorial-sans text-[#444141] text-[13px]" : "font-mono text-[#2d3329]"
                  }`}
                >
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
