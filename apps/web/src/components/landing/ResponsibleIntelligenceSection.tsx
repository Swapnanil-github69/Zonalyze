import React from "react";
import { ShieldCheck, Scale, Sparkles } from "lucide-react";

export const ResponsibleIntelligenceSection: React.FC = () => {
  const commitments = [
    {
      id: "traceable",
      title: "ORIGIN & TRACEABILITY",
      subtitle: "[RULE // 01]",
      icon: ShieldCheck,
      description: "We preserve provider identity, sensor station identifiers, and capture timestamps. When an API returns null for a coordinate, that absence is rendered directly rather than patched with synthetic averages.",
    },
    {
      id: "careful",
      title: "MODEL BOUNDARIES",
      subtitle: "[RULE // 02]",
      icon: Scale,
      description: "Mathematical distance decay calculations are explicitly flagged as approximations. We do not generate arbitrary composite ratings such as 'Livability 84/100' without itemized telemetry backing.",
    },
    {
      id: "grounded",
      title: "CONSTRAINED REASONING",
      subtitle: "[RULE // 03]",
      icon: Sparkles,
      description: "Our language synthesis module receives only verified observation arrays from the database cache. It is constrained against fabricating readings, guessing distances, or inventing station records.",
    },
  ];

  return (
    <section id="responsible" className="relative w-full py-20 bg-[#dde2e4] text-[#2d3329] border-b border-[#2d3329]">
      <div className="w-full px-6 sm:px-12 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2d3329] pb-4 text-[11px] font-mono tracking-wider uppercase">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#2d3329] inline-block" />
            <span className="font-bold">SECTION 05 // ETHICAL TELEMETRY</span>
          </div>
          <div>OBJECTIVE SURVEY CRITERIA</div>
        </div>

        <div className="max-w-4xl space-y-4 text-left">
          <h2 className="font-display-stout text-5xl sm:text-7xl lg:text-[80px] text-[#2d3329] tracking-tight leading-[0.90] uppercase">
            INSIGHT SHOULD SHOW <br />
            ITS WORKING.
          </h2>

          <p className="font-mono text-xs sm:text-sm text-[#2d3329] leading-relaxed max-w-2xl">
            Zonalyze cleanly decouples retrieved ground truth from analytical debriefs. Timestamps, coverage radii, and uncertainties matter as much as the synthesis itself.
          </p>
        </div>

        {/* Speculative Marketing Claim vs. Grounded Evidence Comparison Widget */}
        <div className="border border-[#2d3329] p-6 sm:p-8 bg-[#dde2e4] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2d3329] pb-3 text-[11px] font-mono uppercase tracking-wider text-[#84907f]">
            <span className="font-bold text-[#2d3329]">EMPIRICAL COMPARISON // SPECULATION VS. IN-SITU TRUTH</span>
            <span>COORDINATE AUDIT BENCHMARK</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Speculative Listing Fluff */}
            <div className="p-5 border border-red-900/30 bg-red-950/10 space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-red-900/20 pb-2">
                <span className="font-mono text-[10px] font-bold uppercase text-red-700 tracking-wider">
                  [!] UNVERIFIED LISTING NARRATIVE
                </span>
                <span className="text-[10px] font-mono text-red-600">ZERO SENSOR DATA</span>
              </div>

              <blockquote className="font-mono text-xs sm:text-sm text-[#2d3329]/80 italic border-l-2 border-red-700/60 pl-3 leading-relaxed">
                "Bespoke residential haven nestled in tranquil green serenity with pristine fresh morning air and unmatched civic connectivity."
              </blockquote>

              <div className="space-y-1.5 font-mono text-[11px] text-red-900/80 pt-2 border-t border-red-900/20">
                <div>✗ Hides PM2.5 particulate spikes during thermal inversion</div>
                <div>✗ Omits high-frequency rail noise corridor 140m east</div>
                <div>✗ Zero station logs, coordinates, or capture timestamps</div>
              </div>
            </div>

            {/* Right: Zonalyze Grounded Telemetry */}
            <div className="p-5 border border-[#2d3329] bg-[#161b13] text-[#dde2e4] space-y-4 text-left shadow-xl">
              <div className="flex items-center justify-between border-b border-[#84907f]/40 pb-2">
                <span className="font-mono text-[10px] font-bold uppercase text-[#e2ffcc] tracking-wider">
                  [✓] ZONALYZE IN-SITU OBSERVATIONS
                </span>
                <span className="text-[10px] font-mono text-[#84907f]">DATUM: WGS 84</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 border border-[#84907f]/30 bg-[#2d3329]/40">
                  <div className="text-[9px] text-[#84907f] uppercase">PM2.5 CONCENTRATION</div>
                  <div className="font-bold text-[#e2ffcc] text-base">143 µg/m³</div>
                  <div className="text-[9px] text-[#84907f]">9.5x WHO 24h limit</div>
                </div>

                <div className="p-2.5 border border-[#84907f]/30 bg-[#2d3329]/40">
                  <div className="text-[9px] text-[#84907f] uppercase">ACOUSTIC CORRIDOR</div>
                  <div className="font-bold text-[#e2ffcc] text-base">78 dB Peak</div>
                  <div className="text-[9px] text-[#84907f]">Rail line buffer: 140m</div>
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-[11px] text-[#dde2e4] pt-2 border-t border-[#84907f]/30">
                <div className="flex items-center space-x-2 text-[#e2ffcc]">
                  <span>✓</span>
                  <span>Nearest emergency trauma center verified at 420m (OSM registry)</span>
                </div>
                <div className="flex items-center space-x-2 text-[#84907f]">
                  <span>✓</span>
                  <span>Direct physical DEM elevation contour: 11m above mean sea level</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3 Core Commitments in Sharp Topo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {commitments.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="p-6 sm:p-8 border border-[#2d3329] bg-[#dde2e4] space-y-4 text-left flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2d3329]/40 pb-3">
                    <span className="font-mono text-[11px] text-[#84907f] font-bold">
                      {item.subtitle}
                    </span>
                    <div className="w-8 h-8 border border-[#2d3329] flex items-center justify-center text-[#2d3329]">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-display-stout text-2xl sm:text-3xl text-[#2d3329] tracking-wide uppercase">
                    {item.title}
                  </h3>

                  <p className="font-mono text-xs text-[#2d3329] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2d3329]/30 font-mono text-[10px] text-[#84907f] uppercase">
                  VERIFIED PROTOCOL // ZONALYZE GEO-ENGINE
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
