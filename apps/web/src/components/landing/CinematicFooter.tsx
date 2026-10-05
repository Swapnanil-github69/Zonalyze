import React from "react";
import { Crosshair } from "lucide-react";

export const CinematicFooter: React.FC = () => {
  const scrollTo = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#161b13]/85 backdrop-blur-xl text-[#dde2e4] py-16 border-t border-[#e2ffcc]/15 shadow-[0_-10px_30px_rgba(0,0,0,0.4)] text-left font-mono overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-[#e2ffcc]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full px-6 sm:px-12 space-y-10">
        
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#84907f]/25">
          {/* Brand Wordmark Stamp with Crosshair Symbol */}
          <div
            onClick={() => scrollTo("top")}
            className="cursor-pointer select-none group flex items-center space-x-3"
          >
            <div className="w-8 h-8 rounded-full glass-badge border border-[#e2ffcc]/50 flex items-center justify-center text-[#e2ffcc] group-hover:scale-105 group-hover:border-[#e2ffcc] transition-all duration-200 shadow-[0_0_15px_rgba(226,255,204,0.15)]">
              <Crosshair className="w-4 h-4 text-[#e2ffcc]" />
            </div>
            <span className="font-display-stout text-3xl sm:text-4xl text-[#e2ffcc] tracking-wider leading-none">
              ZONALYZE
            </span>
          </div>

          {/* Navigation Links: Clean mono caps with glassy hover effect */}
          <nav className="flex flex-wrap items-center gap-8 text-[11px] font-mono tracking-wider uppercase text-[#84907f]">
            <button
              onClick={() => scrollTo("about")}
              className="hover:text-[#e2ffcc] transition-colors cursor-pointer"
            >
              SYSTEM
            </button>
            <button
              onClick={() => scrollTo("categories")}
              className="hover:text-[#e2ffcc] transition-colors cursor-pointer"
            >
              EVIDENCE
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="hover:text-[#e2ffcc] transition-colors cursor-pointer"
            >
              METHODOLOGY
            </button>
            <button
              onClick={() => scrollTo("preview")}
              className="hover:text-[#e2ffcc] transition-colors cursor-pointer"
            >
              FIELD PREVIEW
            </button>
          </nav>
        </div>

        {/* Bottom Footer Row: Geographical & Technical Lineage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end text-[10px] text-[#84907f] uppercase tracking-wider">
          <div className="md:col-span-7 space-y-1 leading-relaxed">
            <div>AN OBJECTIVE FIELD GUIDE TO ENVIRONMENTAL AND CIVIC CONTEXT.</div>
            <div>VERIFIED TELEMETRY HARVESTED VIA OPEN-METEO & OPENSTREETMAP REGISTRIES.</div>
            <div>ALL GAPS, RADIUS LIMITS, AND DECIBEL DECAY FACTORS REMAIN TRANSPARENT.</div>
          </div>

          <div className="md:col-span-5 md:text-right font-mono text-[#e2ffcc] space-y-1">
            <div>GEODETIC DATUM: WGS 84 (EPSG:4326)</div>
            <div>© {new Date().getFullYear()} ZONALYZE. ALL SURVEY RIGHTS RESERVED.</div>
          </div>
        </div>

      </div>
    </footer>
  );
};
