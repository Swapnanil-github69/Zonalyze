import React from "react";
import { ArrowRight } from "lucide-react";

interface FinalCTAProps {
  onInvestigateLocation: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onInvestigateLocation }) => {
  return (
    <section id="cta" className="relative py-36 bg-[#0B1D2A] text-[#F4F7F8] overflow-hidden flex items-center justify-center text-center scroll-mt-24 border-b border-white/[0.16]">
      {/* Alpine Twilight Mountain Background Matching Hero Atmosphere */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />

      {/* Atmospheric Mountain Mist Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D2A] via-[#0B1D2A]/80 to-[#0B1D2A] pointer-events-none" />

      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#78D6E7]/10 via-[#123747]/30 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Coordinate Grid Texture matching Home */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-3xl mx-auto px-8 relative z-10 space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] text-white/90 border border-white/[0.16] text-xs font-mono backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#78D6E7] animate-pulse" />
          <span className="text-[#E8F0F1]">CIVIC TELEMETRY READY</span>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-white tracking-[-2px] leading-tight">
            Every Location Has <br />
            <em className="italic font-normal text-[#78D6E7]">a Story.</em>
          </h2>
          <p className="text-base sm:text-lg text-[#A8C0CA] font-sans leading-relaxed max-w-lg mx-auto">
            Discover the context beyond the coordinates.
          </p>
        </div>

        <div className="pt-2">
          {/* Black Pill Button with White Text */}
          <button
            onClick={onInvestigateLocation}
            className="group inline-flex items-center justify-center space-x-3 px-14 py-5 rounded-full text-[15px] font-medium text-white bg-[#000000] hover:bg-[#111111] border border-white/[0.22] shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>Investigate a Location</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200 text-[#78D6E7]" />
          </button>
        </div>

        <div className="pt-8 flex items-center justify-center space-x-6 text-xs text-[#91B9C5] font-mono">
          <span>₹0 API Footprint</span>
          <span>•</span>
          <span>OpenStreetMap & Open-Meteo</span>
          <span>•</span>
          <span>150m MongoDB Cache</span>
        </div>
      </div>
    </section>
  );
};
