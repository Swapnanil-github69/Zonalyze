import React from "react";
import { Compass, Crosshair } from "lucide-react";
import { useLandingTheme } from "../../context/LandingThemeContext";

export const CinematicFooter: React.FC = () => {
  const { isLiterary } = useLandingTheme();

  const scrollTo = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (isLiterary) {
    return (
      <footer className="relative w-full bg-[#ffffff] text-[#444141] py-20 border-t border-[#dee2de] text-left">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 space-y-12">
          
          {/* Top Colophon Statement */}
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center space-x-2 text-[#41a1cf]">
              <Compass className="w-4 h-4" />
              <span className="font-editorial-sans text-[13px] font-medium tracking-tight">
                Colophon · Zonalyze Geospatial Field Intelligence
              </span>
            </div>
            <h3 className="font-editorial-serif font-normal text-3xl sm:text-4xl text-[#171717] tracking-[-0.03em] leading-[1.2]">
              An objective inquiry into environmental boundaries and civic context.
            </h3>
            <p className="font-editorial-sans text-[15px] text-[#646464] leading-relaxed">
              Every coordinate holds a verifiable story of atmospheric drift, structural density, and quiet civic lifelines. Synthesized directly from open planetary sensors.
            </p>
          </div>

          {/* Middle Row: Brand & Navigation */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-6 pb-6 border-t border-[#dee2de]">
            {/* Brand Wordmark with consistent Crosshair mark adapted to warm editorial palette */}
            <div
              onClick={() => scrollTo("top")}
              className="cursor-pointer select-none group flex items-center space-x-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#f9faf7] border border-[#282834]/30 flex items-center justify-center text-[#282834] group-hover:scale-105 group-hover:border-[#41a1cf] group-hover:text-[#41a1cf] transition-all duration-200 shadow-sm">
                <Crosshair className="w-4 h-4 text-[#282834] group-hover:text-[#41a1cf] transition-colors" />
              </div>
              <span className="font-editorial-serif font-normal text-2xl text-[#171717] tracking-[-0.02em]">
                Zonalyze
              </span>
            </div>

            {/* Navigation Links in Inter 15px font-medium */}
            <nav className="flex flex-wrap items-center gap-8 text-[15px] font-editorial-sans font-medium text-[#444141]">
              <button
                onClick={() => scrollTo("about")}
                className="hover:text-[#171717] transition-colors cursor-pointer"
              >
                System
              </button>
              <button
                onClick={() => scrollTo("categories")}
                className="hover:text-[#171717] transition-colors cursor-pointer"
              >
                Evidence
              </button>
              <button
                onClick={() => scrollTo("how-it-works")}
                className="hover:text-[#171717] transition-colors cursor-pointer"
              >
                Methodology
              </button>
              <button
                onClick={() => scrollTo("preview")}
                className="hover:text-[#171717] transition-colors cursor-pointer"
              >
                Field Preview
              </button>
              <button
                onClick={() => scrollTo("top")}
                className="text-[#41a1cf] hover:underline cursor-pointer"
              >
                Return to Top ↑
              </button>
            </nav>
          </div>

          {/* Bottom Row: Colophon Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end text-[13px] font-editorial-sans text-[#646464] border-t border-[#dee2de]/60 pt-6">
            <div className="md:col-span-7 space-y-1.5 leading-relaxed">
              <div>Geodetic Datum: WGS 84 (EPSG:4326) · Direct coordinate resolution</div>
              <div>Telemetry verified via Open-Meteo atmospheric registries and OpenStreetMap civic models.</div>
              <div>Radial buffers, sensor distance decay, and catchment margins remain fully transparent.</div>
            </div>

            <div className="md:col-span-5 md:text-right space-y-1 text-[#444141]">
              <div>General Intelligence System · Release 2026.04</div>
              <div>© {new Date().getFullYear()} Zonalyze. All field rights reserved.</div>
            </div>
          </div>

        </div>
      </footer>
    );
  }

  return (
    <footer className="relative w-full bg-[#161b13]/85 backdrop-blur-xl text-[#dde2e4] py-16 border-t border-[#e2ffcc]/15 shadow-[0_-10px_30px_rgba(0,0,0,0.4)] text-left font-editorial-sans overflow-hidden">
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
            <span className="font-editorial-serif text-2xl sm:text-3xl text-[#e2ffcc] tracking-tight leading-none font-normal">
              Zonalyze
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-8 text-[14px] font-editorial-sans font-medium text-[#84907f]">
            <button
              onClick={() => scrollTo("about")}
              className="hover:text-[#e2ffcc] transition-colors cursor-pointer"
            >
              System
            </button>
            <button
              onClick={() => scrollTo("categories")}
              className="hover:text-[#e2ffcc] transition-colors cursor-pointer"
            >
              Evidence
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="hover:text-[#e2ffcc] transition-colors cursor-pointer"
            >
              Methodology
            </button>
            <button
              onClick={() => scrollTo("preview")}
              className="hover:text-[#e2ffcc] transition-colors cursor-pointer"
            >
              Field Preview
            </button>
          </nav>
        </div>

        {/* Bottom Footer Row: Geographical & Technical Lineage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end text-xs font-editorial-sans text-[#84907f]">
          <div className="md:col-span-7 space-y-1.5 leading-relaxed">
            <div>An objective field guide to environmental and civic context.</div>
            <div>Verified telemetry harvested via Open-Meteo & OpenStreetMap registries.</div>
            <div>All gaps, radius limits, and decibel decay factors remain transparent.</div>
          </div>

          <div className="md:col-span-5 md:text-right font-editorial-sans text-[#e2ffcc] space-y-1">
            <div>Geodetic Datum: WGS 84 (EPSG:4326)</div>
            <div>© {new Date().getFullYear()} Zonalyze. All survey rights reserved.</div>
          </div>
        </div>

      </div>
    </footer>
  );
};
