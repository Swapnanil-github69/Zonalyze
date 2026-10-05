import React from "react";
import { Wind, Building2, Mountain, Volume2 } from "lucide-react";

export const IntroEditorialSection: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-20 bg-[#dde2e4] text-[#2d3329] border-b border-[#2d3329] overflow-hidden">
      {/* Ambient background grid & light glow */}
      <div className="absolute inset-0 topographic-grid-dark opacity-35 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-700/10 rounded-full liquid-caustic-blob pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#84907f]/15 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-6s" }} />

      <div className="relative w-full px-6 sm:px-12 space-y-12">
        
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2d3329]/30 pb-4 text-[11px] font-mono tracking-wider uppercase">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#2d3329] inline-block animate-pulse" />
            <span className="font-bold">SECTION 01 // SCOPE & ARCHITECTURE</span>
          </div>
          <div className="px-2.5 py-1 glass-card-light text-[10px] font-bold">
            CATCHMENT STANDARD: 3,000M GEO-RADIAL
          </div>
        </div>

        {/* Two-Column Grid: Stamped Signage Headline & Utilitarian Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left">
          
          <div className="lg:col-span-5 space-y-5">
            <h2 className="font-display-stout text-4xl sm:text-6xl lg:text-[72px] text-[#2d3329] tracking-tight leading-[0.90] uppercase">
              THE OBSERVATION <br />
              FRAMEWORK.
            </h2>

            <p className="font-mono text-xs sm:text-sm text-[#2d3329] leading-relaxed">
              A coordinate is merely a spatial pin. Zonalyze retrieves empirical signals across atmospheric arrays, civic registries, and physical terrain, documenting what is measurable and explicitly leaving missing records uninvented.
            </p>

            <div className="pt-3 border-t border-[#2d3329]/40 font-mono text-[11px] text-[#84907f] leading-normal uppercase">
              <span>Read the methodology on </span>
              <a href="#how-it-works" className="font-serif-times italic text-base text-[#2d3329] underline hover:text-[#000000]">
                deterministic distance decay & sensor freshness.
              </a>
            </div>
          </div>

          {/* Right Column: 4 Sharp Field Channel Cards with Glassmorphism */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Channel 1: Atmosphere */}
              <div className="p-6 glass-card-light space-y-3 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#84907f]">[CH-01]</span>
                  <Wind className="w-4 h-4 text-[#2d3329]" />
                </div>
                <h3 className="font-display-stout text-2xl text-[#2d3329] tracking-wide uppercase">
                  ATMOSPHERE
                </h3>
                <p className="font-mono text-xs text-[#2d3329] leading-relaxed">
                  Real-time PM2.5, PM10 inhalables, temperature variance, and European Air Quality Index scales.
                </p>
              </div>

              {/* Channel 2: Transit */}
              <div className="p-6 glass-card-light space-y-3 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#84907f]">[CH-02]</span>
                  <Building2 className="w-4 h-4 text-[#2d3329]" />
                </div>
                <h3 className="font-display-stout text-2xl text-[#2d3329] tracking-wide uppercase">
                  TRANSIT & AMENITIES
                </h3>
                <p className="font-mono text-xs text-[#2d3329] leading-relaxed">
                  Mapped healthcare facilities, suburban rail lines, bus stops, and public recreational grounds.
                </p>
              </div>

              {/* Channel 3: Acoustic buffer */}
              <div className="p-6 glass-card-light space-y-3 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#84907f]">[CH-03]</span>
                  <Volume2 className="w-4 h-4 text-[#2d3329]" />
                </div>
                <h3 className="font-display-stout text-2xl text-[#2d3329] tracking-wide uppercase">
                  ACOUSTIC BUFFER
                </h3>
                <p className="font-mono text-xs text-[#2d3329] leading-relaxed">
                  Mathematical transit corridor proximity decay modeling with categorical confidence ratings.
                </p>
              </div>

              {/* Channel 4: Topography */}
              <div className="p-6 glass-card-light space-y-3 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#84907f]">[CH-04]</span>
                  <Mountain className="w-4 h-4 text-[#2d3329]" />
                </div>
                <h3 className="font-display-stout text-2xl text-[#2d3329] tracking-wide uppercase">
                  ELEVATION CONTEXT
                </h3>
                <p className="font-mono text-xs text-[#2d3329] leading-relaxed">
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
