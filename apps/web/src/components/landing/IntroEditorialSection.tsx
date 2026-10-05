import React from "react";
import { Wind, Building2, Mountain, Volume2 } from "lucide-react";

export const IntroEditorialSection: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-20 sm:py-28 bg-[#0B1719] border-y border-[#192E31]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center text-left">
          
          {/* Left Column: Headline and Short Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#B6C6A3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B6C6A3]" />
              <span>WHAT ZONALYZE INVESTIGATES</span>
            </div>

            <h2
              style={{
                fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
              className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#F1F0E9]"
            >
              A clearer reading of the places around us.
            </h2>

            <p className="text-base text-[#B8C5C2] leading-relaxed font-sans">
              A coordinate is only a starting point. ZONALYZE gathers available signals from different sources and places them in context, helping you ask better questions about the environment and built world around a location.
            </p>

            <div className="pt-2 text-xs text-[#829492] font-sans border-t border-[#192E31]">
              Evidence before interpretation • Transparent source limitations
            </div>
          </div>

          {/* Right Column: Schematic Diagram Card with 3D Translucent Effect */}
          <div className="lg:col-span-7 relative">
            {/* Ambient backlight glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#142629]/50 via-[#B6C6A3]/10 to-transparent blur-2xl rounded-[32px] pointer-events-none" />

            <div className="relative p-6 sm:p-8 rounded-[24px] glass-panel-elevated space-y-6">
              
              <div className="flex items-center justify-between text-xs text-[#829492] font-mono border-b border-white/[0.08] pb-3">
                <span>SCHEMATIC 01 — EVIDENCE CONVERGENCE</span>
                <span className="text-[#B6C6A3]">SINGLE COORDINATE CATCHMENT</span>
              </div>

              {/* 4 evidence channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* 1. Atmosphere */}
                <div className="glass-3d-card p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-[#F1F0E9]">
                    <div className="w-7 h-7 rounded-lg bg-[#0B1719]/80 border border-[#192E31] flex items-center justify-center">
                      <Wind className="w-3.5 h-3.5 text-[#B6C6A3]" />
                    </div>
                    <span className="font-medium text-sm text-[#F1F0E9]">Atmosphere</span>
                  </div>
                  <p className="text-xs text-[#B8C5C2] leading-relaxed font-sans">
                    Particulate observations, European AQI scales, and historical atmospheric trends.
                  </p>
                </div>

                {/* 2. Infrastructure */}
                <div className="glass-3d-card p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-[#F1F0E9]">
                    <div className="w-7 h-7 rounded-lg bg-[#0B1719]/80 border border-[#192E31] flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5 text-[#D1C6A5]" />
                    </div>
                    <span className="font-medium text-sm text-[#F1F0E9]">Nearby Infrastructure</span>
                  </div>
                  <p className="text-xs text-[#B8C5C2] leading-relaxed font-sans">
                    Mapped civic amenities, healthcare nodes, public transit, and recreational buffers.
                  </p>
                </div>

                {/* 3. Noise Context */}
                <div className="glass-3d-card p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-[#F1F0E9]">
                    <div className="w-7 h-7 rounded-lg bg-[#0B1719]/80 border border-[#192E31] flex items-center justify-center">
                      <Volume2 className="w-3.5 h-3.5 text-[#B6C6A3]" />
                    </div>
                    <span className="font-medium text-sm text-[#F1F0E9]">Noise Context</span>
                  </div>
                  <p className="text-xs text-[#B8C5C2] leading-relaxed font-sans">
                    Deterministic acoustic decay estimates derived from mapped transit corridors.
                  </p>
                </div>

                {/* 4. Geography */}
                <div className="glass-3d-card p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-[#F1F0E9]">
                    <div className="w-7 h-7 rounded-lg bg-[#0B1719]/80 border border-[#192E31] flex items-center justify-center">
                      <Mountain className="w-3.5 h-3.5 text-[#D1C6A5]" />
                    </div>
                    <span className="font-medium text-sm text-[#F1F0E9]">Environmental Context</span>
                  </div>
                  <p className="text-xs text-[#B8C5C2] leading-relaxed font-sans">
                    Topographical setting, terrain elevation bounds, and surrounding spatial relationships.
                  </p>
                </div>

              </div>

              {/* Schematic Footer Note */}
              <div className="flex items-center justify-between pt-2 text-[11px] text-[#829492] font-mono border-t border-white/[0.08]">
                <span>◉ SELECTED POINT [22.5726° N, 88.3639° E]</span>
                <span className="text-[#B6C6A3] font-medium">OPEN EVIDENCE RECORD →</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
