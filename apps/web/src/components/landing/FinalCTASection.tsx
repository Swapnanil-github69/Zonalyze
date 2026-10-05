import React from "react";
import { ArrowRight, Compass } from "lucide-react";

interface FinalCTASectionProps {
  onStartInvestigation: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onStartInvestigation,
}) => {
  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#0B1316] border-b border-[#1F353B]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative">
        {/* Ambient colored backlight */}
        <div className="absolute -inset-6 bg-gradient-to-r from-[#10B981]/15 via-[#06B6D4]/10 to-[#10B981]/15 blur-3xl rounded-[36px] pointer-events-none" />

        <div className="relative p-8 sm:p-14 rounded-[24px] bg-[#132226] border border-[#1F353B] shadow-[0_20px_50px_rgba(0,0,0,0.45)] overflow-hidden text-left space-y-8">
          {/* Specular top highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#34D399]/30 to-transparent pointer-events-none" />
          
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#34D399]">
              <Compass className="w-3.5 h-3.5 text-[#34D399]" />
              <span>START AN INVESTIGATION</span>
            </div>

            <h2
              style={{
                fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
              className="text-3xl sm:text-5xl lg:text-[52px] font-normal text-white"
            >
              Start with a place. <br />
              Follow the evidence.
            </h2>

            <p className="text-base sm:text-lg text-[#94A3B8] font-sans leading-relaxed">
              Explore the signals available around a location and decide which questions to investigate next.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartInvestigation}
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-full text-sm font-semibold text-[#071317] bg-gradient-to-r from-[#10b981] to-[#06b6d4] hover:opacity-95 shadow-[0_4px_24px_rgba(16,185,129,0.25)] transition-all duration-200 cursor-pointer font-sans"
            >
              <span>Open the Investigation Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#071317]" />
            </button>

            <span className="text-xs text-[#64748B] font-mono">
              Preserves active session • Direct coordinate entry
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
