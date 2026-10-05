import React from "react";
import { Wind, Building2, Mountain, Volume2 } from "lucide-react";

export const IntroEditorialSection: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-20 sm:py-28 bg-[#0B1316] border-y border-[#1F353B]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center text-left">
          
          {/* Left Column: Headline and Short Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#34D399]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              <span>WHAT ZONALYZE INVESTIGATES</span>
            </div>

            <h2
              style={{
                fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
              className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-white"
            >
              A clearer reading of the places around us.
            </h2>

            <p className="text-base text-[#94A3B8] leading-relaxed font-sans">
              A coordinate is only a starting point. ZONALYZE gathers available signals from verified telemetry sources and places them in context, helping you ask better questions about the environmental reality and built world around any location.
            </p>

            <div className="pt-2 text-xs text-[#64748B] font-sans border-t border-[#1F353B]">
              Evidence before interpretation • Transparent source limitations
            </div>
          </div>

          {/* Right Column: Schematic Diagram Card with 3D Translucent Effect */}
          <div className="lg:col-span-7 relative">
            {/* Ambient backlight glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#10B981]/15 via-[#06B6D4]/10 to-transparent blur-2xl rounded-[32px] pointer-events-none" />

            <div className="relative p-6 sm:p-8 rounded-[24px] bg-[#132226] border border-[#1F353B] shadow-[0_16px_40px_rgba(0,0,0,0.4)] space-y-6">
              
              <div className="flex items-center justify-between text-xs text-[#64748B] font-mono border-b border-[#1F353B] pb-3">
                <span>SCHEMATIC 01 — EVIDENCE CONVERGENCE</span>
                <span className="text-[#34D399]">SINGLE COORDINATE CATCHMENT</span>
              </div>

              {/* 4 evidence channels matching livability metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* 1. Atmosphere */}
                <div className="p-4 rounded-xl bg-[#0E1A1D] border border-[#1F353B] space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#0284C7]/15 border border-[#0284C7]/30 flex items-center justify-center">
                      <Wind className="w-3.5 h-3.5 text-[#38BDF8]" />
                    </div>
                    <span className="font-semibold text-sm text-white">Atmosphere</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                    Particulate observations, European AQI scales, and historical atmospheric telemetry.
                  </p>
                </div>

                {/* 2. Infrastructure */}
                <div className="p-4 rounded-xl bg-[#0E1A1D] border border-[#1F353B] space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#059669]/15 border border-[#059669]/30 flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5 text-[#34D399]" />
                    </div>
                    <span className="font-semibold text-sm text-white">Transit & Infrastructure</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                    Mapped civic amenities, healthcare nodes, public transit, and recreational buffers.
                  </p>
                </div>

                {/* 3. Noise Context */}
                <div className="p-4 rounded-xl bg-[#0E1A1D] border border-[#1F353B] space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/30 flex items-center justify-center">
                      <Volume2 className="w-3.5 h-3.5 text-[#818CF8]" />
                    </div>
                    <span className="font-semibold text-sm text-white">Acoustic Buffer</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                    Deterministic acoustic decay estimates derived from mapped transit corridors.
                  </p>
                </div>

                {/* 4. Geography */}
                <div className="p-4 rounded-xl bg-[#0E1A1D] border border-[#1F353B] space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center">
                      <Mountain className="w-3.5 h-3.5 text-[#F59E0B]" />
                    </div>
                    <span className="font-semibold text-sm text-white">Essential Proximity</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                    Topographical setting, terrain elevation bounds, and surrounding spatial relationships.
                  </p>
                </div>

              </div>

              {/* Schematic Footer Note */}
              <div className="flex items-center justify-between pt-2 text-[11px] text-[#64748B] font-mono border-t border-[#1F353B]">
                <span>◉ SELECTED POINT [22.60995° N, 88.41794° E]</span>
                <span className="text-[#38BDF8] font-medium cursor-pointer hover:underline">OPEN EVIDENCE RECORD →</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
