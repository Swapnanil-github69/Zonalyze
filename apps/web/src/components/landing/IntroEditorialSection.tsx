import React from "react";
import { Wind, Building2, Mountain, Volume2 } from "lucide-react";

export const IntroEditorialSection: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-20 sm:py-28 bg-[#ffffff] border-y border-[#dee2de]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center text-left">
          
          {/* Left Column: Headline and Short Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#646464]">
              <span>WHAT ZONALYZE INVESTIGATES</span>
            </div>

            <h2
              style={{
                fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
              className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#2c2c2c]"
            >
              A clearer reading of the places around us.
            </h2>

            <p className="text-base text-[#444141] leading-relaxed font-sans">
              A coordinate is only a starting point. ZONALYZE gathers available signals from different sources and places them in context, helping you ask better questions about the environment and built world around a location.
            </p>

            <div className="pt-2 text-xs text-[#646464] font-sans border-t border-[#dee2de]">
              Evidence before interpretation • Transparent source limitations
            </div>
          </div>

          {/* Right Column: Minimal Line-Art Diagram */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#fefffc] border border-[#dee2de] shadow-[0_1px_8px_rgba(0,0,0,0.03)] space-y-6">
              
              <div className="flex items-center justify-between text-xs text-[#646464] font-mono border-b border-[#dee2de] pb-3">
                <span>SCHEMATIC 01 — EVIDENCE CONVERGENCE</span>
                <span>SINGLE COORDINATE CATCHMENT</span>
              </div>

              {/* Minimal Line Diagram showing Point connected to 4 evidence channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* 1. Atmosphere */}
                <div className="p-4 rounded-xl bg-[#ffffff] border border-[#dee2de] space-y-2 hover:border-[#b4b8b4] transition-colors">
                  <div className="flex items-center space-x-2 text-[#282834]">
                    <Wind className="w-4 h-4 text-[#41a1cf]" />
                    <span className="font-medium text-sm text-[#171717]">Atmosphere</span>
                  </div>
                  <p className="text-xs text-[#646464] leading-relaxed font-sans">
                    Particulate observations, European AQI scales, and historical atmospheric trends.
                  </p>
                </div>

                {/* 2. Infrastructure */}
                <div className="p-4 rounded-xl bg-[#ffffff] border border-[#dee2de] space-y-2 hover:border-[#b4b8b4] transition-colors">
                  <div className="flex items-center space-x-2 text-[#282834]">
                    <Building2 className="w-4 h-4 text-[#282834]" />
                    <span className="font-medium text-sm text-[#171717]">Nearby Infrastructure</span>
                  </div>
                  <p className="text-xs text-[#646464] leading-relaxed font-sans">
                    Mapped civic amenities, healthcare nodes, public transit, and recreational buffers.
                  </p>
                </div>

                {/* 3. Noise Context */}
                <div className="p-4 rounded-xl bg-[#ffffff] border border-[#dee2de] space-y-2 hover:border-[#b4b8b4] transition-colors">
                  <div className="flex items-center space-x-2 text-[#282834]">
                    <Volume2 className="w-4 h-4 text-[#41a1cf]" />
                    <span className="font-medium text-sm text-[#171717]">Noise Context</span>
                  </div>
                  <p className="text-xs text-[#646464] leading-relaxed font-sans">
                    Deterministic acoustic decay estimates derived from mapped transit corridors.
                  </p>
                </div>

                {/* 4. Geography */}
                <div className="p-4 rounded-xl bg-[#ffffff] border border-[#dee2de] space-y-2 hover:border-[#b4b8b4] transition-colors">
                  <div className="flex items-center space-x-2 text-[#282834]">
                    <Mountain className="w-4 h-4 text-[#282834]" />
                    <span className="font-medium text-sm text-[#171717]">Environmental Context</span>
                  </div>
                  <p className="text-xs text-[#646464] leading-relaxed font-sans">
                    Topographical setting, terrain elevation bounds, and surrounding spatial relationships.
                  </p>
                </div>

              </div>

              {/* Schematic Footer Note */}
              <div className="flex items-center justify-between pt-2 text-[11px] text-[#646464] font-mono">
                <span>◉ SELECTED POINT [22.5726° N, 88.3639° E]</span>
                <span className="text-[#41a1cf]">OPEN EVIDENCE RECORD →</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
