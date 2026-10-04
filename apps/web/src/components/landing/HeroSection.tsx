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
    <section id="hero" className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden bg-[#fefffc]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 space-y-12 sm:space-y-16">
        
        {/* Editorial Text Block */}
        <div className="max-w-3xl text-left space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-[0.2em] uppercase text-[#646464]">
            <Compass className="w-3.5 h-3.5 text-[#282834]" />
            <span>A FIELD GUIDE TO PLACE</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
            className="text-4xl sm:text-5xl lg:text-[54px] font-normal text-[#2c2c2c]"
          >
            Every place holds more than its coordinates.
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-[#444141] leading-relaxed font-sans max-w-2xl">
            ZONALYZE brings environmental observations, nearby infrastructure, and location context together — so you can explore what the evidence says, what it may suggest, and what remains unknown.
          </p>

          {/* Actions: Outlined Signal Blue Primary CTA & Secondary Link */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartInvestigation}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium text-[#171717] border border-[#41a1cf] hover:bg-[#41a1cf]/10 hover:text-[#0081c0] transition-all duration-200 cursor-pointer font-sans"
            >
              <span>Investigate a Location</span>
              <ArrowRight className="w-4 h-4 text-[#41a1cf]" />
            </button>

            <button
              onClick={scrollToHowItWorks}
              className="inline-flex items-center space-x-1.5 px-4 py-3 text-sm font-medium text-[#646464] hover:text-[#171717] transition-colors cursor-pointer font-sans"
            >
              <span>How it works</span>
              <span className="text-[#b4b8b4]">↓</span>
            </button>
          </div>
        </div>

        {/* Atmospheric Painted Geography Illustration */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#dee2de] bg-[#ffffff] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <img
              src="/field_guide_landscape.jpg"
              alt="Hand-painted geographic river valley landscape with topographical contour lines"
              className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-[0.98]"
            />
            {/* Subtle paper grain and soft hairline vignette */}
            <div className="absolute inset-0 pointer-events-none border border-black/[0.04] rounded-2xl" />
          </div>

          {/* Quiet Field Note Caption */}
          <div className="px-6 py-3.5 bg-[#ffffff] border-t border-[#dee2de] flex flex-wrap items-center justify-between gap-3 text-xs text-[#646464] font-sans">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#41a1cf]" />
              <span>Figure 1.0 — Spatial and topographical elevation study</span>
            </div>
            <div className="font-mono text-[11px] text-[#646464]">
              LAT 22.5726° N, LON 88.3639° E • WGS 84 DATUM
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
