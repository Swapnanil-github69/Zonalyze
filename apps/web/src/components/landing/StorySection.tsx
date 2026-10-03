import React from "react";
import { ArrowRight, Compass, ShieldCheck, Layers, CheckCircle2 } from "lucide-react";
import { GeographicContextModel } from "../three/GeographicContextModel";

interface StorySectionProps {
  onExplore?: () => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ onExplore }) => {
  const principles = [
    {
      number: "01",
      title: "Context Over Coordinates",
      badge: "SPATIAL RADIUS",
      description: "Understand a location through its surroundings, not only its latitude and longitude. Built footprints, tree canopies, and transport axes define the living reality of any site.",
      icon: Compass,
    },
    {
      number: "02",
      title: "Evidence Before Interpretation",
      badge: "FACT-GROUNDED",
      description: "Strictly separate available physical evidence from mathematical estimates and AI-generated explanations. Never disguise proximity proxies as physical microphone decibels.",
      icon: ShieldCheck,
    },
    {
      number: "03",
      title: "Clarity Through Connection",
      badge: "MULTI-LAYERED SYNTHESIS",
      description: "Bring fragmented geographic information together into a coherent, actionable picture. Decision-makers see the complete civic and atmospheric picture in one unified view.",
      icon: Layers,
    },
  ];

  return (
    <section
      id="about"
      className="py-28 lg:py-36 bg-[#0B1D2A] text-[#F4F7F8] relative border-b border-white/[0.16] scroll-mt-24 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-0 w-[900px] h-[550px] bg-gradient-to-r from-[#123747]/30 via-[#0D3442]/20 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Coordinate Grid Texture matching Home */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 text-left space-y-20 lg:space-y-24 relative z-10">
        {/* Top Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/[0.16] bg-white/[0.04] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#78D6E7] animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#E8F0F1] uppercase font-medium">
                THE PHILOSOPHY
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-[44px] sm:text-[58px] lg:text-[72px] font-normal text-[#F4F7F8] leading-[0.95] tracking-[-2px]">
                A Place Is More Than <br />
                <em className="italic font-normal text-[#78D6E7]">a Coordinate.</em>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#A8C0CA] leading-relaxed font-sans font-normal">
              Coordinates tell us where a place exists. Context reveals what exists around it. ZONALYZE connects geographic evidence to make the deeper story of a location easier to understand.
            </p>

            <div className="pt-2">
              <button
                onClick={onExplore}
                className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full text-[14px] font-medium text-white bg-[#000000] hover:bg-[#111111] border border-white/[0.16] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <span>Understand the Spatial Methodology</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200 text-[#78D6E7]" />
              </button>
            </div>
          </div>

          {/* Right Column: Large Architectural 3D Geographic Visualization (7 cols) */}
          <div className="lg:col-span-7 w-full">
            <GeographicContextModel />
          </div>
        </div>

        {/* Three Foundational Principles: Balanced Editorial Composition with Dividers */}
        <div className="space-y-8 pt-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.12] text-xs font-mono text-[#A8C0CA]">
            <span className="tracking-widest uppercase font-semibold text-[#78D6E7]">
              ARCHITECTURAL PRINCIPLES
            </span>
            <span>THREE FACT-GROUNDED STANDARDS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.number}
                  className="p-8 rounded-2xl bg-white/[0.025] hover:bg-white/[0.04] border border-white/[0.12] hover:border-white/[0.22] transition-all duration-300 space-y-6 group shadow-lg"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <span className="font-serif text-4xl font-normal text-white/30 group-hover:text-[#78D6E7] transition-colors">
                      {p.number}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.12] flex items-center justify-center text-[#78D6E7]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-mono tracking-widest uppercase text-[#91B9C5]">
                      {p.badge}
                    </div>
                    <h3 className="font-serif text-2xl font-normal text-white">
                      {p.title}
                    </h3>
                    <p className="text-sm text-[#A8C0CA] leading-relaxed font-sans pt-1">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.08] flex items-center space-x-1.5 text-[11px] font-mono text-[#91B9C5]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#78D6E7]" />
                    <span>ZONALYZE Verified Standard</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
