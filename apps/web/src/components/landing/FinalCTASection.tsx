import React from "react";
import { ArrowRight, Compass } from "lucide-react";

interface FinalCTASectionProps {
  onStartInvestigation: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onStartInvestigation,
}) => {
  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#fefffc] border-b border-[#dee2de]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="p-8 sm:p-14 rounded-2xl bg-[#ffffff] border border-[#dee2de] shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-left space-y-8">
          
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#646464]">
              <Compass className="w-3.5 h-3.5 text-[#282834]" />
              <span>START AN INVESTIGATION</span>
            </div>

            <h2
              style={{
                fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
              className="text-3xl sm:text-5xl lg:text-[52px] font-normal text-[#2c2c2c]"
            >
              Start with a place. <br />
              Follow the evidence.
            </h2>

            <p className="text-base sm:text-lg text-[#444141] font-sans leading-relaxed">
              Explore the signals available around a location and decide which questions to investigate next.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartInvestigation}
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-lg text-sm font-medium text-[#171717] border border-[#41a1cf] hover:bg-[#41a1cf]/10 hover:text-[#0081c0] transition-all duration-200 cursor-pointer font-sans"
            >
              <span>Open the Investigation Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#41a1cf]" />
            </button>

            <span className="text-xs text-[#646464] font-mono">
              Preserves active session • Direct coordinate entry
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
