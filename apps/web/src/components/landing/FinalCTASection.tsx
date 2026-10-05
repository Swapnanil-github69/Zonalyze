import React from "react";
import { ArrowRight, Compass } from "lucide-react";

interface FinalCTASectionProps {
  onStartInvestigation: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onStartInvestigation,
}) => {
  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#0B1719] border-b border-[#192E31]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative">
        {/* Ambient colored backlight */}
        <div className="absolute -inset-6 bg-gradient-to-r from-[#142629]/50 via-[#B6C6A3]/15 to-[#142629]/40 blur-3xl rounded-[36px] pointer-events-none" />

        <div className="relative p-8 sm:p-14 rounded-[24px] glass-panel-elevated overflow-hidden text-left space-y-8">
          {/* Specular top highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B6C6A3]/35 to-transparent pointer-events-none" />
          
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#B6C6A3]">
              <Compass className="w-3.5 h-3.5 text-[#B6C6A3]" />
              <span>START AN INVESTIGATION</span>
            </div>

            <h2
              style={{
                fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
              className="text-3xl sm:text-5xl lg:text-[52px] font-normal text-[#F1F0E9]"
            >
              Start with a place. <br />
              Follow the evidence.
            </h2>

            <p className="text-base sm:text-lg text-[#B8C5C2] font-sans leading-relaxed">
              Explore the signals available around a location and decide which questions to investigate next.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartInvestigation}
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-full text-sm font-semibold text-[#0B1719] bg-[#B6C6A3] hover:bg-[#DCE7CD] shadow-[0_0_20px_rgba(182,198,163,0.25)] transition-all duration-200 cursor-pointer font-sans"
            >
              <span>Open the Investigation Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#0B1719]" />
            </button>

            <span className="text-xs text-[#829492] font-mono">
              Preserves active session • Direct coordinate entry
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
