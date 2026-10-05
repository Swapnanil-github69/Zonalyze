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
      {/* Ambient Atmospheric Radial Glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] pointer-events-none opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(ellipse at center, rgba(20, 38, 41, 0.7) 0%, rgba(11, 23, 25, 0) 70%)"
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 sm:px-8 space-y-12 sm:space-y-16">
        
        {/* Editorial Text Block */}
        <div className="max-w-3xl text-left space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-[0.2em] uppercase text-[#B6C6A3]">
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

          {/* Actions: Sage Accent Pill CTA & Outlined Secondary Link */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartInvestigation}
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-full text-sm font-semibold text-[#0B1719] bg-[#B6C6A3] hover:bg-[#DCE7CD] shadow-[0_0_20px_rgba(182,198,163,0.25)] transition-all duration-200 cursor-pointer font-sans"
            >
              <span>Investigate a Location</span>
              <ArrowRight className="w-4 h-4 text-[#0B1719]" />
            </button>

            <button
              onClick={scrollToHowItWorks}
              className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-full text-sm font-medium text-[#B8C5C2] border border-[#192E31] bg-[#102124]/60 hover:text-[#F1F0E9] hover:border-[#B6C6A3]/60 transition-colors cursor-pointer font-sans"
            >
              <span>How it works</span>
              <span className="text-[#829492]">↓</span>
            </button>
          </div>
        </div>

        {/* Real ZONALYZE Application Live Audit Console Card */}
        <div className="relative w-full rounded-[24px] overflow-hidden border border-[#192E31] bg-[#102124] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src="/zonalyze_live_screenshot.jpg"
              alt="ZONALYZE Live Environmental Audit Console displaying real-time atmospheric telemetry and geocoded location dossier"
              className="w-full h-full object-cover object-center"
            />
            {/* Soft border edge overlay */}
            <div className="absolute inset-0 pointer-events-none border border-[#192E31]/50 rounded-[24px]" />
          </div>

          {/* Real Telemetry Field Note Caption */}
          <div className="px-6 py-3.5 bg-[#102124] border-t border-[#192E31] flex flex-wrap items-center justify-between gap-3 text-xs text-[#829492] font-sans">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B6C6A3] shadow-[0_0_8px_rgba(182,198,163,0.8)]" />
              <span className="text-[#F1F0E9] font-medium">Live Audit Console: Bangur, Kolkata Metropolitan Area</span>
            </div>
            <div className="font-mono text-[11px] text-[#B8C5C2]">
              22.60995° N, 88.41794° E • AQI 83 (VERY POOR) • PM2.5 97.6 µg/m³
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
