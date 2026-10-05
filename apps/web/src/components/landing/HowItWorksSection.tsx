import React from "react";
import { Search, Database, FileCheck, BookOpen } from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "COORDINATE ENTRY",
      icon: Search,
      description: "Input exact decimal degrees, search a municipal locality, or select a pinpoint directly on the cartographic canvas.",
      clarification: "[GLOBAL COVERAGE // ACCEPTS DUAL-PRECISION EPSG:4326]",
    },
    {
      number: "02",
      title: "OBSERVATION HARVEST",
      icon: Database,
      description: "Query open-access atmospheric arrays, regional digital elevation profiles, and mapped urban infrastructure nodes.",
      clarification: "[REST API // SENSOR FRESHNESS TIMESTAMPED IN-SITU]",
    },
    {
      number: "03",
      title: "LIMITATION PRESERVATION",
      icon: FileCheck,
      description: "Inspect measured values, sensor radii, and spatial gaps. Missing provider measurements are preserved rather than invented.",
      clarification: "[UNCERTAINTY EXPLICIT // NO SYNTHETIC RATINGS]",
    },
    {
      number: "04",
      title: "GROUNDED DOSSIER",
      icon: BookOpen,
      description: "Review a deterministic synthesis and narrative debrief derived strictly from verified retrieval records.",
      clarification: "[ZERO HALLUCINATION // FIELD EVIDENCE ONLY]",
    },
  ];

  return (
    <section id="how-it-works" className="relative w-full py-20 bg-[#161b13] text-[#dde2e4] border-b border-[#84907f]/30">
      <div className="w-full px-6 sm:px-12 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#84907f]/30 pb-4 text-[11px] font-mono tracking-wider uppercase text-[#84907f]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#e2ffcc] inline-block" />
            <span className="text-[#e2ffcc] font-bold">SECTION 04 // PIPELINE SPECIFICATION</span>
          </div>
          <div>DETERMINISTIC RETRIEVAL PROTOCOL</div>
        </div>

        <div className="max-w-4xl space-y-4 text-left">
          <h2 className="font-display-stout text-5xl sm:text-7xl lg:text-[80px] text-[#e2ffcc] tracking-tight leading-[0.90] uppercase">
            EMPIRICAL METHODOLOGY.
          </h2>

          <p className="font-mono text-xs sm:text-sm text-[#84907f] leading-relaxed max-w-2xl">
            Our pipeline prioritizes verifiable physical observations prior to analytical synthesis. Missing signals are left visible as spatial gaps.
          </p>
        </div>

        {/* 4 Steps in Sharp 0px Border Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.number}
                className="p-6 border border-[#84907f]/35 bg-[#161b13] flex flex-col justify-between space-y-6 text-left"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#84907f]/20 pb-3">
                    <span className="font-mono text-xs font-bold text-[#e2ffcc]">
                      [STEP {step.number}]
                    </span>
                    <div className="w-7 h-7 border border-[#e2ffcc] flex items-center justify-center text-[#e2ffcc]">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h3 className="font-display-stout text-2xl text-[#dde2e4] tracking-wide uppercase">
                    {step.title}
                  </h3>

                  <p className="font-mono text-xs text-[#dde2e4]/90 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#84907f]/20 font-mono text-[10px] text-[#84907f] uppercase leading-tight">
                  {step.clarification}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
