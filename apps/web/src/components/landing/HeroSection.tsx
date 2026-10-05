import React from "react";
import { Crosshair, ArrowDown } from "lucide-react";

interface HeroSectionProps {
  onStartInvestigation: () => void;
  onExploreCapabilities?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartInvestigation,
}) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative w-full min-h-[90vh] pt-32 pb-20 bg-[#161b13] border-b border-[#84907f]/30 overflow-hidden flex flex-col justify-between">
      
      {/* Animated Liquid Caustic Background Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-[#e2ffcc]/5 rounded-full liquid-caustic-blob pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[500px] bg-[#84907f]/8 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-6s" }} />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-emerald-500/5 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-12s" }} />

      {/* Topographic grid overlay */}
      <div className="absolute inset-0 topographic-grid opacity-40 pointer-events-none" />

      {/* Top Field Survey Meta Bar */}
      <div className="relative z-10 w-full px-6 sm:px-12 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#84907f]/25 pb-4 text-[11px] font-mono tracking-wider text-[#84907f]">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 bg-[#e2ffcc] inline-block" />
            <span className="text-[#e2ffcc] font-bold">SYSTEM ACTIVE</span>
            <span>// LOG: 2026.10</span>
            <span className="hidden md:inline">// CATCHMENT: 3,000M RADIUS</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline">PROJECTION: EPSG:4326</span>
            <span className="text-[#dde2e4]">DATUM: WGS 84</span>
          </div>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="w-full px-6 sm:px-12 py-10 sm:py-14 space-y-10">
        
        {/* Massive Landscape-Blocking Display Headline */}
        <div className="space-y-4 text-left max-w-7xl">
          <div className="flex items-center space-x-4">
            {/* San Rita Circular Icon Badge */}
            <div className="sr-badge-circle">
              <Crosshair className="w-5 h-5 text-[#e2ffcc]" />
            </div>
            <span className="text-xs uppercase tracking-widest text-[#84907f] font-mono">
              [ ALP.FIELD.GUIDE // VOL. 04 ]
            </span>
          </div>

          <h1 className="font-display-stout text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[132px] text-[#e2ffcc] tracking-tight leading-[0.90] uppercase">
            GEOSPATIAL EVIDENCE. <br />
            GROUNDED TELEMETRY.
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-end">
            <p className="lg:col-span-7 font-mono text-xs sm:text-sm text-[#dde2e4] leading-relaxed max-w-2xl tracking-normal">
              Zonalyze reads the ground truth beneath municipal coordinates. Atmospheric particulate measurements, acoustic transit corridor decay, and open infrastructure layers synthesized into an unembellished environmental field dossier.
            </p>

            {/* Outlined Action Buttons */}
            <div className="lg:col-span-5 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartInvestigation}
                className="sr-btn-mint text-xs py-3.5 px-6"
              >
                <span>[ INITIATE SURVEY RECORD ]</span>
              </button>

              <button
                onClick={scrollToHowItWorks}
                className="sr-btn-mint border-[#84907f] text-[#84907f] hover:border-[#e2ffcc] hover:text-[#e2ffcc] text-xs py-3.5 px-5"
              >
                <span>METHODOLOGY</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D Liquid Glass Perspective Console Stage */}
        <div className="hero-3d-perspective w-full pt-6">
          <div className="liquid-glass-stage relative border border-[#84907f]/40 bg-[#161b13]">
            {/* Liquid Specular Top Rim */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#e2ffcc]/40 to-transparent z-20 pointer-events-none" />

            {/* Top Bar of Field Card */}
            <div className="px-5 py-3 border-b border-[#84907f]/30 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#84907f] bg-[#161b13]/80 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <span className="text-[#e2ffcc] font-bold">[RADAR SURVEY VIEW]</span>
                <span>LAT 22.60995° N, LON 88.41794° E</span>
              </div>
              <span className="text-[#dde2e4]">KOLKATA METROPOLITAN BASIN // IN-SITU OBSERVATION</span>
            </div>

            {/* Field Image Canvas with Stamp Elements */}
            <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-[#161b13]">
              <img
                src="/zonalyze_liquid_glass_ui.jpg"
                alt="ZONALYZE field telemetry display"
                className="w-full h-full object-cover filter contrast-[1.08] brightness-[0.92]"
              />
              <div className="absolute inset-0 bg-[#161b13]/20 pointer-events-none" />

              {/* Tilted Polaroid Stamp in corner with hover effect */}
              <div className="hidden lg:block absolute bottom-6 right-8 w-72 bg-[#dde2e4] p-3 shadow-2xl rotate-2 border border-[#2d3329] pointer-events-none transition-transform duration-300">
                <div className="aspect-[4/3] w-full overflow-hidden bg-black mb-2">
                  <img src="/zonalyze_liquid_glass_crop.jpg" alt="Field Crop" className="w-full h-full object-cover" />
                </div>
                <div className="font-mono text-[9px] text-[#2d3329] font-bold leading-tight uppercase flex justify-between">
                  <span>FIG 01 // CATCHMENT</span>
                  <span>ELEV: 11M</span>
                </div>
              </div>
            </div>

            {/* Bottom Caption Bar */}
            <div className="px-5 py-3 border-t border-[#84907f]/30 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#84907f] bg-[#161b13]/80 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                <span>[CACHE HIT: 150M]</span>
                <span className="text-[#e2ffcc]">AQI 83 (POOR)</span>
                <span>PM2.5: 97.6 µg/m³</span>
              </div>
              <span className="text-[#dde2e4]">ZERO FABRICATED ESTIMATES // GROUNDED EVIDENCE ONLY</span>
            </div>
          </div>
        </div>

      </div>

      {/* Scroll Cue Indicator */}
      <div className="w-full px-6 sm:px-12 flex justify-between items-center text-[10px] font-mono text-[#84907f]">
        <span>[SCROLL TO AUDIT SIGNALS]</span>
        <div className="flex items-center space-x-2">
          <span>SEC 01 // INTRO</span>
          <div className="w-3 h-3 border border-[#e2ffcc] rotate-45 inline-block" />
        </div>
      </div>

    </section>
  );
};
