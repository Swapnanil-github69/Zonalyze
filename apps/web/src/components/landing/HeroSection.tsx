import React from "react";
import { ArrowRight, Compass } from "lucide-react";
import { CinematicBackground } from "./CinematicBackground";

interface HeroSectionProps {
  onStartInvestigation: () => void;
  onExploreCapabilities: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartInvestigation,
  onExploreCapabilities,
}) => {
  return (
    <section id="home" className="relative min-h-screen w-full flex items-center justify-center scroll-mt-24">
      <CinematicBackground className="min-h-screen flex items-center justify-center py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 w-full text-center flex flex-col items-center justify-center space-y-8 sm:space-y-10">
          {/* Main Headline & Supporting Heading */}
          <div className="space-y-4 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-800">
            <h1 className="font-serif text-[54px] sm:text-[72px] lg:text-[88px] font-normal text-[#F1EFE8] leading-[0.98] tracking-[-2px]">
              Investigate Any <br />
              <em className="italic font-normal">Location.</em>
            </h1>
            <p className="font-serif italic text-2xl sm:text-[30px] lg:text-[34px] text-[#F1EFE8]/85 tracking-tight font-normal pt-1">
              See Beyond the Map.
            </p>
          </div>

          {/* Description Paragraph (approx 670px width) */}
          <p className="text-base sm:text-lg text-[rgba(241,239,232,0.75)] leading-relaxed max-w-[670px] text-center font-sans font-normal animate-in fade-in slide-in-from-bottom-5 duration-800 delay-200">
            Explore environmental conditions, nearby infrastructure, noise exposure, and geographic
            context through one unified intelligence platform.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 animate-in fade-in slide-in-from-bottom-6 duration-800 delay-300">
            {/* Primary Large Pill CTA */}
            <button
              onClick={onStartInvestigation}
              className="group inline-flex items-center justify-center space-x-3 px-14 py-5 rounded-full text-[15px] font-medium text-white bg-[#000000] hover:bg-[#111111] border border-white/20 shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <span>Start Investigation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
            </button>

            {/* Secondary CTA */}
            <button
              onClick={onExploreCapabilities}
              className="inline-flex items-center justify-center space-x-2 px-8 py-5 rounded-full text-[15px] font-medium text-white/90 hover:text-white bg-white/5 hover:bg-white/10 border border-white/20 transition-all duration-200 backdrop-blur-sm cursor-pointer"
            >
              <Compass className="w-4 h-4 text-white/80" />
              <span>Explore Capabilities</span>
            </button>
          </div>

          {/* Subtle Vertical Scroll Indicator */}
          <div
            onClick={onExploreCapabilities}
            className="pt-6 flex flex-col items-center space-y-2 cursor-pointer text-white/50 hover:text-white/80 transition duration-200"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-6 bg-white/30" />
          </div>
        </div>
      </CinematicBackground>
    </section>
  );
};
