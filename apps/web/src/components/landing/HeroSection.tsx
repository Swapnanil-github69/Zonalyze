import React, { useState } from "react";
import { ArrowDown, ArrowUpRight, Search, MapPin, Radio, ShieldCheck } from "lucide-react";

interface HeroSectionProps {
  onStartInvestigation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartInvestigation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

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
    <section id="hero" className="relative w-full min-h-[90vh] pt-28 sm:pt-32 pb-16 bg-[#161b13] border-b border-[#84907f]/30 overflow-hidden flex flex-col justify-between">
      
      {/* Animated Liquid Caustic Background Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-[#e2ffcc]/5 rounded-full liquid-caustic-blob pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[500px] bg-[#84907f]/8 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-6s" }} />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-emerald-500/5 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-12s" }} />

      {/* Topographic grid overlay */}
      <div className="absolute inset-0 topographic-grid opacity-40 pointer-events-none" />

      {/* Main Hero Container */}
      <div className="w-full px-6 sm:px-12 py-8 sm:py-10 space-y-8">
        
        {/* Massive Landscape-Blocking Display Headline */}
        <div className="space-y-4 text-left max-w-7xl">
          <h1 className="font-display-stout text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[132px] text-[#e2ffcc] tracking-tight leading-[0.90] uppercase">
            GEOSPATIAL EVIDENCE. <br />
            GROUNDED TELEMETRY.
          </h1>

          <p className="font-mono text-xs sm:text-sm text-[#dde2e4] leading-relaxed max-w-2xl tracking-normal">
            Zonalyze reads the ground truth beneath municipal coordinates. Atmospheric particulate measurements, acoustic transit corridor decay, and open infrastructure layers synthesized into an unembellished environmental field dossier.
          </p>

          {/* 1. Interactive Quick-Audit Coordinate Input Bar */}
          <div className="pt-2 max-w-3xl space-y-3">
            <form onSubmit={handleQuickAudit} className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84907f]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter coordinates or locality (e.g. 22.57617, 88.35801)..."
                  className="w-full bg-[#161b13] border border-[#84907f]/50 px-10 py-3.5 text-xs font-mono text-[#dde2e4] placeholder-[#84907f] focus:outline-none focus:border-[#e2ffcc] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="group inline-flex items-center justify-center px-6 py-3.5 bg-[#e2ffcc] text-[#161b13] font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-[#d5fca8] hover:shadow-[0_0_25px_rgba(226,255,204,0.4)] active:scale-95 cursor-pointer border border-[#e2ffcc] shrink-0"
              >
                <span>INITIATE AUDIT</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>

            {/* Quick Coordinate Chips */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#84907f]">
              <span className="uppercase tracking-wider">PRESET OBSERVATIONS:</span>
              {presetCoordinates.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={onStartInvestigation}
                  className="px-2.5 py-1 border border-[#84907f]/30 bg-[#2d3329]/40 hover:border-[#e2ffcc] hover:text-[#e2ffcc] text-[#dde2e4] transition-colors cursor-pointer"
                >
                  <MapPin className="w-2.5 h-2.5 inline mr-1 text-[#e2ffcc]" />
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. High-Fidelity Workstation OS Window Console Frame */}
        <div className="w-full pt-2">
          <div className="relative border border-[#84907f]/50 bg-[#161b13] shadow-2xl overflow-hidden">
            
            {/* Geodetic Corner Crosshair Ticks */}
            <span className="absolute top-1 left-1.5 text-[10px] font-mono text-[#84907f]/60 select-none pointer-events-none">+</span>
            <span className="absolute top-1 right-1.5 text-[10px] font-mono text-[#84907f]/60 select-none pointer-events-none">+</span>
            <span className="absolute bottom-1 left-1.5 text-[10px] font-mono text-[#84907f]/60 select-none pointer-events-none">+</span>
            <span className="absolute bottom-1 right-1.5 text-[10px] font-mono text-[#84907f]/60 select-none pointer-events-none">+</span>

            {/* Workstation Window Chrome Bar */}
            <div className="px-4 py-2.5 border-b border-[#84907f]/30 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono bg-[#161b13]">
              
              {/* Window Controls & Live Stream Badge */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e2ffcc]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#84907f]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2d3329] border border-[#84907f]/40" />
                </div>
                <div className="h-3 w-px bg-[#84907f]/40" />
                <div className="flex items-center space-x-1.5 text-[#e2ffcc] text-[10px] tracking-wider uppercase font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#e2ffcc] inline-block animate-pulse" />
                  <span>LIVE SENSORY STREAM</span>
                </div>
              </div>

              {/* Simulated Terminal Address Capsule */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-0.5 border border-[#84907f]/30 bg-[#2d3329]/50 text-[10px] text-[#84907f]">
                <Radio className="w-3 h-3 text-[#e2ffcc]" />
                <span className="text-[#dde2e4]">zonalyze.gis/telemetry?lat=22.57617&lon=88.35801&datum=WGS84</span>
              </div>

              {/* Location Tag */}
              <span className="text-[#dde2e4] text-[10px] uppercase tracking-wider">
                TIRETTA BAZAAR, CENTRAL KOLKATA
              </span>
            </div>

            {/* Field Image Canvas - Unobstructed, Neat, Clean, and Razor-Sharp */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#161b13]">
              <img
                src="/zonalyze_liquid_glass_ui.jpg"
                alt="ZONALYZE live audit console"
                className="w-full h-full object-contain sm:object-cover"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </div>

            {/* Bottom Telemetry Status Bar */}
            <div className="px-5 py-3 border-t border-[#84907f]/30 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#84907f] bg-[#161b13]">
              <div className="flex items-center space-x-4">
                <span>[CACHE HIT: 150M]</span>
                <span className="text-[#e2ffcc] font-bold">AQI 101 (VERY POOR)</span>
                <span>PM2.5: 143 µg/m³</span>
                <span>TEMP: 26.9°C</span>
              </div>
              <span className="text-[#dde2e4]">ZERO FABRICATED ESTIMATES // GROUNDED EVIDENCE ONLY</span>
            </div>
          </div>
        </div>

        {/* 3. Verified Ground-Truth Data Source Trust Ticker */}
        <div className="w-full border-t border-b border-[#84907f]/25 py-3.5 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-[#84907f] uppercase tracking-wider">
          <div className="flex items-center space-x-2 text-[#e2ffcc]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-bold">VERIFIED OBSERVATION FEEDS:</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {trustSources.map((source, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span>{source}</span>
                {index < trustSources.length - 1 && <span className="text-[#e2ffcc]">◇</span>}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Scroll Cue Indicator */}
      <div className="w-full px-6 sm:px-12 flex justify-between items-center text-[10px] font-mono text-[#84907f]">
        <span>[SCROLL TO AUDIT SIGNALS]</span>
        <button onClick={scrollToHowItWorks} className="flex items-center space-x-2 hover:text-[#e2ffcc] transition-colors cursor-pointer">
          <span>SEC 01 // METHODOLOGY</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#e2ffcc]" />
        </button>
      </div>

    </section>
  );
};
