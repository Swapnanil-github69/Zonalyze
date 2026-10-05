import React from "react";
import { ArrowRight, Compass } from "lucide-react";

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
    <section id="hero" className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden bg-[#0B1719]">
      {/* Liquid Caustic Animated Background Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-emerald-500/12 rounded-full liquid-caustic-blob pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[500px] bg-[#41a1cf]/12 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-6s" }} />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-[#B6C6A3]/10 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-12s" }} />

      <div className="relative max-w-[1200px] mx-auto px-6 sm:px-8 space-y-12 sm:space-y-16">
        
        {/* Editorial Text Block */}
        <div className="max-w-3xl text-left space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-[0.2em] uppercase text-[#B6C6A3] bg-[#142629]/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <Compass className="w-3.5 h-3.5 text-[#B6C6A3]" />
            <span>A FIELD GUIDE TO PLACE</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
            className="text-4xl sm:text-5xl lg:text-[56px] font-normal text-[#F1F0E9]"
          >
            Every place holds more than its coordinates.
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-[#B8C5C2] leading-relaxed font-sans max-w-2xl">
            ZONALYZE brings environmental observations, nearby infrastructure, and location context together — so you can explore what the evidence says, what it may suggest, and what remains unknown.
          </p>

          {/* Actions: Liquid Glass Accent Pill CTA & Outlined Secondary Link */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartInvestigation}
              className="inline-flex items-center space-x-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-[#0B1719] bg-gradient-to-b from-[#DCE7CD] via-[#B6C6A3] to-[#98A885] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8),0_10px_25px_rgba(182,198,163,0.35)] hover:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),0_14px_30px_rgba(182,198,163,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer font-sans"
            >
              <span>Investigate a Location</span>
              <ArrowRight className="w-4 h-4 text-[#0B1719]" />
            </button>

            <button
              onClick={scrollToHowItWorks}
              className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-full text-sm font-medium text-[#B8C5C2] border border-white/[0.12] bg-[#142629]/50 backdrop-blur-xl hover:text-[#F1F0E9] hover:border-[#B6C6A3]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all cursor-pointer font-sans"
            >
              <span>How it works</span>
              <span className="text-[#829492]">↓</span>
            </button>
          </div>
        </div>

        {/* Liquid Glass 3D ZONALYZE Application Live Audit Console Card */}
        <div className="hero-3d-perspective w-full pt-4">
          <div className="liquid-glass-stage relative w-full rounded-[28px] overflow-hidden">
            {/* Liquid Specular Top Rim */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent z-20 pointer-events-none" />

            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src="/zonalyze_liquid_glass_ui.jpg"
                alt="ZONALYZE Liquid Glass Live Environmental Audit Console displaying real-time atmospheric telemetry and geocoded location dossier"
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle fluid refractive glass gradient overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-[#0B1719]/30 via-transparent to-white/[0.06]" />
            </div>

            {/* Liquid Glass Telemetry Field Note Caption */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#102124]/90 via-[#142629]/80 to-[#102124]/90 backdrop-blur-2xl border-t border-white/[0.12] flex flex-wrap items-center justify-between gap-3 text-xs text-[#829492] font-sans shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B6C6A3] shadow-[0_0_12px_rgba(182,198,163,0.95)] animate-pulse" />
                <span className="text-[#F1F0E9] font-medium tracking-wide">Live Audit Console: Bangur, Kolkata Metropolitan Area</span>
              </div>
              <div className="font-mono text-[11px] text-[#B8C5C2] bg-[#0B1719]/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                22.60995° N, 88.41794° E • AQI 83 (VERY POOR) • PM2.5 97.6 µg/m³
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
