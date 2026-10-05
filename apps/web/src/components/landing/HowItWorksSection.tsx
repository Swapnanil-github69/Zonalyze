import React from "react";
import { Search, Database, FileCheck, BookOpen } from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Choose a place",
      icon: Search,
      description: "Search a location, enter latitude and longitude coordinates, or select a specific point directly on the map.",
      clarification: "Accepts any global coordinate or municipal address.",
    },
    {
      number: "02",
      title: "Gather available evidence",
      icon: Database,
      description: "Retrieve relevant source observations, atmospheric readings, and mapped infrastructure context.",
      clarification: "Data retrieval depends on regional provider coverage.",
    },
    {
      number: "03",
      title: "Review the record",
      icon: FileCheck,
      description: "Inspect measured values, observation timestamps, source coverage boundaries, and analytical limitations.",
      clarification: "Uncertainties and missing signals are visibly preserved.",
    },
    {
      number: "04",
      title: "Read the interpretation",
      icon: BookOpen,
      description: "Receive an AI-assisted explanation grounded strictly in the retrieved evidence without invented data.",
      clarification: "Synthesizes observations; does not fabricate scores.",
    },
  ];

  return (
    <section id="how-it-works" className="relative w-full py-20 sm:py-28 bg-[#0B1719] border-b border-[#192E31]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 space-y-12 sm:space-y-16 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#B6C6A3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B6C6A3]" />
            <span>METHODOLOGY</span>
          </div>

          <h2
            style={{
              fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
            className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#F1F0E9]"
          >
            How ZONALYZE works.
          </h2>

          <p className="text-base text-[#B8C5C2] font-sans leading-relaxed">
            Our pipeline prioritizes empirical observations before generating narrative synthesis. We do not claim every data provider returns observations for every coordinate on earth.
          </p>
        </div>

        {/* 4 Steps in Restrained Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.number}
                className="glass-3d-card p-6 rounded-[24px] relative overflow-hidden flex flex-col justify-between space-y-6"
              >
                {/* Specular top highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B6C6A3]/20 to-transparent pointer-events-none" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#B6C6A3] px-2.5 py-1 rounded-md bg-[#142629] border border-[#192E31]">
                      {step.number}
                    </span>
                    <div className="w-8 h-8 rounded-lg border border-[#192E31] bg-[#142629] flex items-center justify-center text-[#B8C5C2]">
                      <IconComponent className="w-4 h-4 text-[#B8C5C2]" />
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
                    }}
                    className="text-xl font-normal text-[#F1F0E9] leading-snug"
                  >
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#B8C5C2] leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#192E31] text-[11px] font-mono text-[#829492] leading-relaxed">
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
