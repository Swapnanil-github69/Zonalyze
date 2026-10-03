import React from "react";
import { MapPin, Database, FileText, CheckCircle2 } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Select a Location",
      description: "Drop a pin anywhere on the interactive map or enter geographic coordinates. The platform immediately establishes an auditable 3,000m investigation envelope.",
      detail: "Global coordinate resolution with interactive crosshairs.",
      icon: MapPin,
    },
    {
      number: "02",
      title: "Gather Geographic Evidence",
      description: "Concurrently harvest real-time meteorological observations and nearby OpenStreetMap infrastructure without synthetic model blending or redundant latency.",
      detail: "Open-Meteo European telemetry + OSM amenity nodes.",
      icon: Database,
    },
    {
      number: "03",
      title: "Explore the Investigation",
      description: "Review verified measurements, physical distance calculations, explicit analytical limits, and an evidence-grounded AI debrief with actionable inspection targets.",
      detail: "Deterministic physics paired with zero-hallucination debrief.",
      icon: FileText,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-28 lg:py-36 bg-[#0B1D2A] text-[#F4F7F8] border-b border-white/[0.16] relative scroll-mt-24 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#123747]/30 via-[#0D3442]/20 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Coordinate Grid Texture matching Home */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 text-left relative z-10 space-y-16 lg:space-y-20">
        {/* Section Header */}
        <div className="max-w-2xl space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/[0.16] bg-white/[0.04] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#78D6E7] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[#E8F0F1] uppercase font-medium">
              INVESTIGATION WORKFLOW
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-[44px] sm:text-[58px] lg:text-[72px] font-normal text-[#F4F7F8] leading-[0.95] tracking-[-2px]">
              From Location <br />
              <em className="italic font-normal text-[#78D6E7]">to Understanding.</em>
            </h2>
          </div>

          <p className="text-base sm:text-lg text-[#A8C0CA] leading-relaxed font-sans font-normal">
            A deterministic, three-stage pipeline engineered to surface verified spatial evidence without arbitrary composite scoring.
          </p>
        </div>

        {/* Connected Horizontal Workflow Track */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch">
          {/* Subtle horizontal connecting line on desktop */}
          <div className="hidden md:block absolute top-12 left-16 right-16 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 pointer-events-none" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative z-10 p-8 sm:p-10 rounded-2xl bg-white/[0.025] hover:bg-white/[0.04] border border-white/[0.12] hover:border-white/[0.22] transition-all duration-300 flex flex-col justify-between space-y-8 group shadow-xl"
              >
                <div className="space-y-6">
                  {/* Waypoint Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/15 flex items-center justify-center text-white group-hover:scale-105 group-hover:border-[#78D6E7] transition duration-200">
                        <Icon className="w-4 h-4 text-[#78D6E7]" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-[#91B9C5] tracking-wider">
                        STEP {step.number}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono tracking-widest text-[#78D6E7] bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.12]">
                      STAGE {step.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#A8C0CA] leading-relaxed font-sans pt-1">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#91B9C5]">
                  <div className="flex items-center space-x-1.5 text-[#78D6E7]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{step.detail}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
