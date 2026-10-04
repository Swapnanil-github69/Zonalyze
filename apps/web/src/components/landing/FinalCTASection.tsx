import React from "react";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface FinalCTASectionProps {
  onStartInvestigation: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onStartInvestigation,
}) => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.14 });

  return (
    <section
      ref={ref}
      className="relative w-full py-28 lg:py-36 bg-[#102124] text-[#F1F0E9] overflow-hidden border-b border-[rgba(190,210,202,0.13)]"
    >
      {/* Seamless Top Gradient Blend */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0B1719]/70 to-transparent pointer-events-none" />

      {/* Background Mountain Landscape with Atmospheric Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Mountain Silhouette Background with Gentle Scale Reveal */}
        <div
          className={`absolute inset-0 bg-cover bg-center filter brightness-90 contrast-110 transition-all duration-1000 ${
            isVisible ? "scale-100 opacity-35" : "scale-105 opacity-20"
          }`}
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80")`,
          }}
        />
        {/* Deep atmospheric gradients blending with charcoal-teal */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#102124] via-[#102124]/90 to-[#102124]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102124] via-[#142629]/40 to-[#102124]" />
        {/* Soft atmospheric ambient mist glow */}
        <div
          className={`absolute top-1/2 right-1/4 -translate-y-1/2 w-[700px] h-[500px] bg-[#142629]/60 rounded-full blur-[170px] transition-all duration-1000 ${
            isVisible ? "opacity-100 scale-100" : "opacity-30 scale-95"
          }`}
        />
        {/* Topographic grid overlay */}
        <div className="absolute inset-0 topographic-grid opacity-25" />
      </div>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Left Side: Editorial Serif Headline (7 cols) */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <h2
              className={`font-serif text-[42px] sm:text-[56px] lg:text-[70px] font-normal text-[#F1F0E9] leading-[1.0] tracking-[-1.5px] max-w-xl reveal-init ${
                isVisible ? "revealed" : ""
              }`}
            >
              Every Coordinate Has a Story <br />
              <em className="italic font-normal text-[#D1C6A5]">Waiting to Be Understood.</em>
            </h2>
          </div>

          {/* Right Side: Supporting text & Refined Muted Sage CTA button (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left lg:text-left">
            <p
              style={{ transitionDelay: "140ms" }}
              className={`font-sans text-sm sm:text-base text-[#B8C5C2] leading-relaxed font-normal max-w-md reveal-init ${
                isVisible ? "revealed" : ""
              }`}
            >
              Explore the environmental conditions, infrastructure, and geographic context surrounding any location.
            </p>

            <div
              style={{ transitionDelay: "260ms" }}
              className={`reveal-init ${isVisible ? "revealed" : ""}`}
            >
              <button
                onClick={onStartInvestigation}
                className="group inline-flex items-center space-x-2.5 px-8 py-4 rounded-full text-sm font-semibold text-[#0B1719] bg-[#B6C6A3] hover:bg-[#DCE7CD] shadow-[0_0_24px_rgba(182,198,163,0.28)] hover:shadow-[0_0_36px_rgba(182,198,163,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer font-sans"
              >
                <span>Start Investigation</span>
                <ArrowRight className="w-4 h-4 text-[#0B1719] group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
