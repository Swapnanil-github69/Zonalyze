import React from "react";
import { ShieldCheck, Scale, Sparkles } from "lucide-react";
import { useLandingTheme } from "../../context/LandingThemeContext";

export const ResponsibleIntelligenceSection: React.FC = () => {
  const { theme } = useLandingTheme();
  const isLiterary = theme === "literary";

  const commitments = [
    {
      id: "traceable",
      title: isLiterary ? "Origin & Traceability" : "ORIGIN & TRACEABILITY",
      subtitle: "Rule 01",
      icon: ShieldCheck,
      description: "We preserve provider identity, sensor station identifiers, and capture timestamps. When an API returns null for a coordinate, that absence is rendered directly rather than patched with synthetic averages.",
    },
    {
      id: "careful",
      title: isLiterary ? "Model Boundaries" : "MODEL BOUNDARIES",
      subtitle: "Rule 02",
      icon: Scale,
      description: "Mathematical distance decay calculations are explicitly flagged as approximations. We do not generate arbitrary composite ratings such as 'Livability 84/100' without itemized telemetry backing.",
    },
    {
      id: "grounded",
      title: isLiterary ? "Constrained Reasoning" : "CONSTRAINED REASONING",
      subtitle: "Rule 03",
      icon: Sparkles,
      description: "Our language synthesis module receives only verified observation arrays from the database cache. It is constrained against fabricating readings, guessing distances, or inventing station records.",
    },
  ];

  return (
    <section
      id="responsible"
      className={`relative w-full py-20 overflow-hidden transition-colors duration-500 ${
        isLiterary
          ? "bg-[#fefffc] border-b border-[#dee2de] text-[#444141]"
          : "bg-[#dde2e4] text-[#2d3329] border-b border-[#2d3329]"
      }`}
    >
      {/* Background ambient elements */}
      {isLiterary ? (
        <div className="absolute inset-0 topographic-grid-dark opacity-10 pointer-events-none" />
      ) : (
        <>
          <div className="absolute inset-0 topographic-grid-dark opacity-35 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-[550px] h-[550px] bg-emerald-700/10 rounded-full liquid-caustic-blob pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#84907f]/15 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-8s" }} />
        </>
      )}

      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        
        {/* Section Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 pb-4 text-xs tracking-wider uppercase border-b ${
            isLiterary
              ? "border-[#dee2de] font-editorial-sans text-[#646464]"
              : "border-[#2d3329]/30 font-editorial-sans text-[11px] text-[#2d3329]"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 inline-block ${isLiterary ? "bg-[#41a1cf] rounded-full" : "bg-[#2d3329] animate-pulse"}`} />
            <span className="font-bold">{isLiterary ? "Ethical Telemetry" : "ETHICAL TELEMETRY"}</span>
          </div>
          <div
            className={`px-3 py-1 font-medium font-editorial-sans ${
              isLiterary
                ? "gic-card bg-[#ffffff] border border-[#dee2de] text-[11px] text-[#444141] rounded-full shadow-none"
                : "px-2.5 py-1 glass-card-light text-[10px] font-bold"
            }`}
          >
            {isLiterary ? "Objective survey criteria" : "OBJECTIVE SURVEY CRITERIA"}
          </div>
        </div>

        <div className="max-w-4xl space-y-4 text-left">
          <h2 className={`font-editorial-serif font-normal text-3xl sm:text-5xl lg:text-[54px] tracking-[-0.03em] leading-[1.1] ${
            isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"
          }`}>
            Insight should show its working.
          </h2>

          <p
            className={`text-sm sm:text-[15px] leading-relaxed max-w-2xl font-editorial-sans ${
              isLiterary ? "text-[#444141]" : "text-[#2d3329]"
            }`}
          >
            Zonalyze cleanly decouples retrieved ground truth from analytical debriefs. Timestamps, coverage radii, and uncertainties matter as much as the synthesis itself.
          </p>
        </div>

        {/* Speculative Marketing Claim vs. Grounded Evidence Comparison Widget */}
        <div
          className={`p-6 sm:p-8 space-y-6 ${
            isLiterary
              ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-2xl shadow-sm"
              : "glass-panel-light"
          }`}
        >
          <div
            className={`flex flex-wrap items-center justify-between gap-2 pb-3 text-xs uppercase tracking-wider border-b ${
              isLiterary
                ? "border-[#dee2de] font-editorial-sans text-[#646464]"
                : "border-[#2d3329]/25 font-editorial-sans text-[11px] text-[#84907f]"
            }`}
          >
            <span className={`font-bold font-editorial-sans ${isLiterary ? "text-[#2c2c2c]" : "text-[#2d3329]"}`}>
              {isLiterary ? "Empirical comparison — Speculation vs. in-situ truth" : "EMPIRICAL COMPARISON // SPECULATION VS. IN-SITU TRUTH"}
            </span>
            <span className="font-editorial-sans">COORDINATE AUDIT BENCHMARK</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Speculative Listing Fluff */}
            <div
              className={`p-5 space-y-4 text-left shadow-sm ${
                isLiterary
                  ? "border border-red-200 bg-red-50/50 rounded-xl"
                  : "border border-red-900/30 bg-red-950/5 backdrop-blur-md"
              }`}
            >
              <div className="flex items-center justify-between border-b border-red-900/20 pb-2">
                <span className="font-editorial-sans text-[10px] font-bold uppercase text-red-700 tracking-wider">
                  [!] UNVERIFIED LISTING NARRATIVE
                </span>
                <span className="text-[10px] font-editorial-sans text-red-600">ZERO SENSOR DATA</span>
              </div>

              <blockquote className={`italic border-l-2 border-red-700/60 pl-3 leading-relaxed font-editorial-serif text-sm ${isLiterary ? "text-[#444141]" : "text-[#2d3329]/80"}`}>
                "Bespoke residential haven nestled in tranquil green serenity with pristine fresh morning air and unmatched civic connectivity."
              </blockquote>

              <div className={`space-y-1.5 pt-2 border-t border-red-900/20 text-xs font-editorial-sans ${isLiterary ? "text-red-900/80" : "text-[11px] text-red-900/80"}`}>
                <div>✗ Hides PM2.5 particulate spikes during thermal inversion</div>
                <div>✗ Omits high-frequency rail noise corridor 140m east</div>
                <div>✗ Zero station logs, coordinates, or capture timestamps</div>
              </div>
            </div>

            {/* Right: Zonalyze Grounded Telemetry */}
            <div
              className={`p-5 space-y-4 text-left shadow-md ${
                isLiterary
                  ? "gic-card bg-[#f9faf7] border border-[#dee2de] rounded-xl text-[#2c2c2c]"
                  : "glass-panel text-[#dde2e4] shadow-2xl"
              }`}
            >
              <div className={`flex items-center justify-between pb-2 border-b ${isLiterary ? "border-[#dee2de]" : "border-[#84907f]/40"}`}>
                <span className={`text-[11px] font-bold uppercase tracking-wider font-editorial-sans ${isLiterary ? "text-[#41a1cf]" : "text-[10px] text-[#e2ffcc]"}`}>
                  [✓] ZONALYZE IN-SITU OBSERVATIONS
                </span>
                <span className={`text-xs font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[10px] text-[#84907f]"}`}>
                  DATUM: WGS 84
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-editorial-sans">
                <div className={`p-2.5 ${isLiterary ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-lg" : "glass-card border border-[#84907f]/30"}`}>
                  <div className={`text-[9px] uppercase font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>PM2.5 CONCENTRATION</div>
                  <div className={`font-bold text-base font-editorial-serif ${isLiterary ? "text-[#2c2c2c]" : "text-[#e2ffcc]"}`}>143 µg/m³</div>
                  <div className={`text-[9px] font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>9.5x WHO 24h limit</div>
                </div>

                <div className={`p-2.5 ${isLiterary ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-lg" : "glass-card border border-[#84907f]/30"}`}>
                  <div className={`text-[9px] uppercase font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>ACOUSTIC CORRIDOR</div>
                  <div className={`font-bold text-base font-editorial-serif ${isLiterary ? "text-[#2c2c2c]" : "text-[#e2ffcc]"}`}>78 dB Peak</div>
                  <div className={`text-[9px] font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>Rail line buffer: 140m</div>
                </div>
              </div>

              <div className={`space-y-1.5 pt-2 border-t text-xs font-editorial-sans ${isLiterary ? "border-[#dee2de] text-[#444141]" : "border-[#84907f]/30 text-[11px] text-[#dde2e4]"}`}>
                <div className={`flex items-center space-x-2 ${isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc]"}`}>
                  <span>✓</span>
                  <span>Nearest emergency trauma center verified at 420m (OSM registry)</span>
                </div>
                <div className={`flex items-center space-x-2 ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>
                  <span>✓</span>
                  <span>Direct physical DEM elevation contour: 11m above mean sea level</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3 Core Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {commitments.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className={`p-6 sm:p-8 space-y-4 text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                  isLiterary
                    ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-xl hover:border-[#b4b8b4]"
                    : "glass-card-light"
                }`}
              >
                <div className="space-y-4">
                  <div
                    className={`flex items-center justify-between pb-3 border-b ${
                      isLiterary ? "border-[#dee2de]" : "border-[#2d3329]/25"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium font-editorial-sans ${
                        isLiterary ? "text-[#41a1cf]" : "text-[11px] text-[#84907f] font-bold"
                      }`}
                    >
                      {item.subtitle}
                    </span>
                    <div
                      className={`w-8 h-8 flex items-center justify-center ${
                        isLiterary
                          ? "rounded-full bg-[#f9faf7] border border-[#dee2de] text-[#282834]"
                          : "glass-card-light border border-[#2d3329]/30 text-[#2d3329]"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3
                    className={`text-xl sm:text-2xl font-editorial-serif font-normal ${
                      isLiterary
                        ? "text-[#2c2c2c]"
                        : "text-[#2d3329]"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`text-xs sm:text-[13px] leading-relaxed font-editorial-sans ${
                      isLiterary ? "text-[#444141]" : "text-[#2d3329]"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                <div
                  className={`pt-4 border-t text-[10px] uppercase font-editorial-sans ${
                    isLiterary
                      ? "border-[#dee2de] text-[#646464]"
                      : "border-[#2d3329]/25 text-[#84907f]"
                  }`}
                >
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
