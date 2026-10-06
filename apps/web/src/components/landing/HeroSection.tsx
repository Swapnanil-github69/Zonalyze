import React, { useState } from "react";
import { ArrowDown, ArrowUpRight, Search, MapPin, Radio, ShieldCheck } from "lucide-react";
import { useLandingTheme } from "../../context/LandingThemeContext";

interface HeroSectionProps {
  onStartInvestigation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartInvestigation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useLandingTheme();
  const isLiterary = theme === "literary";

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuickAudit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartInvestigation();
  };

  const presetCoordinates = [
    { label: "Tiretta, Kolkata", coords: "22.57617° N, 88.35801° E" },
    { label: "Lake Town, Bangur", coords: "22.60995° N, 88.41794° E" },
    { label: "Connaught Place, Delhi", coords: "28.6315° N, 77.2167° E" },
  ];

  const trustSources = [
    "OPEN-METEO WMO ARRAYS",
    "OPENSTREETMAP SPATIAL REGISTRY",
    "WHO 2021 AIR QUALITY GUIDELINE",
    "NASA SRTM ELEVATION MODEL",
    "OVERPASS IN-SITU RETRIEVAL",
  ];

  return (
    <section
      id="hero"
      className={`relative w-full min-h-[90vh] pt-28 sm:pt-32 pb-16 overflow-hidden flex flex-col justify-between transition-colors duration-500 ${
        isLiterary
          ? "bg-[#fefffc] border-b border-[#dee2de] text-[#444141]"
          : "bg-[#161b13] border-b border-[#84907f]/30 text-[#dde2e4]"
      }`}
    >
      {/* Background Lighting Layers */}
      {isLiterary ? (
        <>
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[650px] h-[650px] bg-[#41a1cf]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-[#dee2de]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 topographic-grid-dark opacity-15 pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-[#e2ffcc]/5 rounded-full liquid-caustic-blob pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[600px] h-[500px] bg-[#84907f]/8 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-6s" }} />
          <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-emerald-500/5 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-12s" }} />
          <div className="absolute inset-0 topographic-grid opacity-40 pointer-events-none" />
        </>
      )}

      {/* Main Hero Container */}
      <div className="w-full px-6 sm:px-12 py-8 sm:py-10 space-y-8">
        
        {/* Headline & Mission Lead */}
        <div className="space-y-4 text-left max-w-7xl">
          {isLiterary ? (
            <h1 className="font-editorial-serif font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[62px] text-[#2c2c2c] tracking-[-0.035em] leading-[1.08]">
              Geospatial evidence. <br />
              Grounded telemetry.
            </h1>
          ) : (
            <h1 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#e2ffcc] tracking-tight leading-[1.08] uppercase">
              GEOSPATIAL EVIDENCE. <br />
              GROUNDED TELEMETRY.
            </h1>
          )}

          <p
            className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${
              isLiterary ? "font-editorial-sans text-[#444141] font-normal text-[15px]" : "font-mono text-[#dde2e4] tracking-normal"
            }`}
          >
            Zonalyze reads the ground truth beneath municipal coordinates. Atmospheric particulate measurements, acoustic transit corridor decay, and open infrastructure layers synthesized into an unembellished environmental field dossier.
          </p>

          {/* 1. Interactive Quick-Audit Coordinate Input Bar */}
          <div className="pt-2 max-w-3xl space-y-3">
            <form onSubmit={handleQuickAudit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isLiterary ? "text-[#8a7f77]" : "text-[#84907f]"}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter coordinates or locality (e.g. 22.57617, 88.35801)..."
                  className={`w-full px-10 py-3 text-xs sm:text-sm transition-all ${
                    isLiterary
                      ? "rounded-[11px] border border-[#d8cfc7] bg-[#fbf9f6] text-[#2c2c2c] placeholder-[#8a7f77] focus:outline-none focus:border-[#b87c67] focus:bg-[#ffffff] font-editorial-sans shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                      : "glass-input font-mono text-[#dde2e4] placeholder-[#84907f] focus:outline-none focus:border-[#e2ffcc]"
                  }`}
                />
              </div>

              {isLiterary ? (
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 py-3 px-5 sm:px-6 rounded-[11px] border border-[#b87c67] bg-[#fdfbf9] text-[#8a4f38] font-editorial-sans font-medium text-xs sm:text-[13px] tracking-normal shrink-0 transition-all duration-200 hover:bg-[#faeee7] hover:border-[#7c442f] hover:text-[#5c2a1a] active:scale-[0.99] cursor-pointer shadow-[0_1px_2px_rgba(138,79,56,0.05)]"
                >
                  <span>Initiate Audit</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8a4f38] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#5c2a1a] shrink-0" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center px-6 py-3.5 bg-[#e2ffcc] text-[#161b13] font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-[#d5fca8] hover:shadow-[0_0_25px_rgba(226,255,204,0.4)] active:scale-95 cursor-pointer border border-[#e2ffcc] shrink-0"
                >
                  <span>INITIATE AUDIT</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}
            </form>

            {/* Quick Coordinate Chips */}
            <div className={`flex flex-wrap items-center gap-2 text-[11px] ${isLiterary ? "font-editorial-sans text-[#646464]" : "font-mono text-[#84907f]"}`}>
              <span className={isLiterary ? "text-[#444141] font-medium" : "uppercase tracking-wider"}>
                {isLiterary ? "Preset observations:" : "PRESET OBSERVATIONS:"}
              </span>
              {presetCoordinates.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={onStartInvestigation}
                  className={`px-3 py-1 transition-all cursor-pointer ${
                    isLiterary
                      ? "gic-card bg-[#ffffff] border border-[#dee2de] hover:border-[#b87c67] text-[#444141] hover:text-[#8a4f38] rounded-md shadow-none"
                      : "border border-[#84907f]/30 bg-[#2d3329]/40 backdrop-blur-md hover:border-[#e2ffcc] hover:text-[#e2ffcc] hover:bg-[#e2ffcc]/10 text-[#dde2e4]"
                  }`}
                >
                  <MapPin className={`w-3 h-3 inline mr-1.5 ${isLiterary ? "text-[#9c583e]" : "text-[#e2ffcc]"}`} />
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. High-Fidelity Workstation OS Window Console Frame */}
        <div className="w-full pt-2">
          <div
            className={`relative overflow-hidden ${
              isLiterary
                ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-2xl shadow-[0_12px_45px_-10px_rgba(40,40,52,0.08)]"
                : "glass-panel border border-[#e2ffcc]/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(226,255,204,0.25)]"
            }`}
          >
            {/* Geodetic Corner Crosshair Ticks (Dark Mode) */}
            {!isLiterary && (
              <>
                <span className="absolute top-1 left-1.5 text-[10px] font-mono text-[#84907f]/60 select-none pointer-events-none">+</span>
                <span className="absolute top-1 right-1.5 text-[10px] font-mono text-[#84907f]/60 select-none pointer-events-none">+</span>
                <span className="absolute bottom-1 left-1.5 text-[10px] font-mono text-[#84907f]/60 select-none pointer-events-none">+</span>
                <span className="absolute bottom-1 right-1.5 text-[10px] font-mono text-[#84907f]/60 select-none pointer-events-none">+</span>
              </>
            )}

            {/* Workstation Window Chrome Bar */}
            <div
              className={`px-4 sm:px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
                isLiterary
                  ? "border-[#dee2de] bg-[#f9faf7] font-editorial-sans text-[#444141]"
                  : "border-[#84907f]/30 bg-[#161b13]/70 backdrop-blur-md font-mono text-[11px]"
              }`}
            >
              {/* Window Controls & Live Stream Badge */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${isLiterary ? "bg-[#dee2de]" : "bg-[#e2ffcc]"}`} />
                  <div className={`w-2.5 h-2.5 rounded-full ${isLiterary ? "bg-[#b4b8b4]" : "bg-[#84907f]"}`} />
                  <div className={`w-2.5 h-2.5 rounded-full ${isLiterary ? "bg-[#646464]" : "bg-[#2d3329] border border-[#84907f]/40"}`} />
                </div>
                <div className={`h-3 w-px ${isLiterary ? "bg-[#dee2de]" : "bg-[#84907f]/40"}`} />
                <div className={`flex items-center space-x-1.5 text-[11px] font-medium tracking-wide ${isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc] font-bold uppercase tracking-wider"}`}>
                  <span className={`w-2 h-2 rounded-full inline-block animate-pulse ${isLiterary ? "bg-[#41a1cf]" : "bg-[#e2ffcc]"}`} />
                  <span>{isLiterary ? "Live telemetry channel" : "LIVE SENSORY STREAM"}</span>
                </div>
              </div>

              {/* Terminal Address Capsule */}
              <div
                className={`hidden md:flex items-center space-x-2 px-3 py-1 text-[11px] ${
                  isLiterary
                    ? "border border-[#dee2de] bg-[#ffffff] rounded-full text-[#646464] font-editorial-sans"
                    : "border border-[#84907f]/30 bg-[#2d3329]/60 backdrop-blur-sm text-[10px] text-[#84907f] font-mono"
                }`}
              >
                <Radio className={`w-3 h-3 ${isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc]"}`} />
                <span>zonalyze.gis/telemetry?lat=22.57617&lon=88.35801&datum=WGS84</span>
              </div>

              {/* Location Tag */}
              <span className={`text-[11px] ${isLiterary ? "text-[#2c2c2c] font-medium" : "text-[#dde2e4] text-[10px] uppercase tracking-wider"}`}>
                Tiretta Bazaar, Central Kolkata
              </span>
            </div>

            {/* Field Image Canvas */}
            <div className={`relative aspect-[16/9] w-full overflow-hidden ${isLiterary ? "bg-[#f9faf7]" : "bg-[#161b13]"}`}>
              <img
                src="/zonalyze_liquid_glass_ui.jpg"
                alt="ZONALYZE live audit console"
                className="w-full h-full object-contain sm:object-cover"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </div>

            {/* Bottom Telemetry Status Bar */}
            <div
              className={`px-5 py-3.5 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
                isLiterary
                  ? "border-[#dee2de] bg-[#f9faf7] font-editorial-sans text-[#646464]"
                  : "border-[#84907f]/30 bg-[#161b13]/70 backdrop-blur-md font-mono text-[11px] text-[#84907f]"
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={isLiterary ? "text-[#2c2c2c] font-medium" : ""}>[CACHE HIT: 150M]</span>
                <span className={isLiterary ? "text-[#41a1cf] font-medium" : "text-[#e2ffcc] font-bold"}>AQI 101 (VERY POOR)</span>
                <span>PM2.5: 143 µg/m³</span>
                <span>TEMP: 26.9°C</span>
              </div>
              <span className={isLiterary ? "text-[#2c2c2c]" : "text-[#dde2e4]"}>
                {isLiterary ? "Zero fabricated estimates — field evidence only" : "ZERO FABRICATED ESTIMATES // GROUNDED EVIDENCE ONLY"}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Verified Ground-Truth Data Source Trust Ticker */}
        <div
          className={`w-full py-3.5 px-5 flex flex-wrap items-center justify-between gap-3 text-xs tracking-wide ${
            isLiterary
              ? "gic-card bg-[#ffffff] border border-[#dee2de] text-[#646464] font-editorial-sans rounded-xl shadow-none"
              : "glass-card border border-[#84907f]/25 text-[10px] font-mono text-[#84907f] uppercase tracking-wider"
          }`}
        >
          <div className={`flex items-center space-x-2 ${isLiterary ? "text-[#2c2c2c] font-medium" : "text-[#e2ffcc] font-bold"}`}>
            <ShieldCheck className={`w-4 h-4 ${isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc]"}`} />
            <span>{isLiterary ? "Verified observation feeds:" : "VERIFIED OBSERVATION FEEDS:"}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {trustSources.map((source, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span>{source}</span>
                {index < trustSources.length - 1 && <span className={isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc]"}>◇</span>}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Scroll Cue Indicator */}
      <div className={`w-full px-6 sm:px-12 flex justify-between items-center text-xs ${isLiterary ? "font-editorial-sans text-[#646464]" : "font-mono text-[10px] text-[#84907f]"}`}>
        <span>{isLiterary ? "Scroll to examine signals" : "[SCROLL TO AUDIT SIGNALS]"}</span>
        <button
          onClick={scrollToHowItWorks}
          className={`flex items-center space-x-2 transition-colors cursor-pointer ${
            isLiterary ? "hover:text-[#171717] text-[#444141]" : "hover:text-[#e2ffcc]"
          }`}
        >
          <span>{isLiterary ? "Methodology" : "SEC 01 // METHODOLOGY"}</span>
          <ArrowDown className={`w-3.5 h-3.5 ${isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc]"}`} />
        </button>
      </div>

    </section>
  );
};
