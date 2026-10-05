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
    <section id="how-it-works" className="relative w-full py-20 sm:py-28 bg-[#fefffc] border-b border-[#dee2de]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 space-y-12 sm:space-y-16 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#646464]">
            <span>METHODOLOGY</span>
          </div>

          <h2
            style={{
              fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
            className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#2c2c2c]"
          >
            How ZONALYZE works.
          </h2>

          <p className="text-base text-[#444141] font-sans leading-relaxed">
            Our pipeline prioritizes empirical observations before generating narrative synthesis. We do not claim every data provider returns observations for every coordinate on earth.
          </p>
        </div>

        {/* 4 Steps in Restrained Diagram Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.number}
                className="p-6 rounded-2xl bg-[#ffffff] border border-[#dee2de] shadow-[0_1px_6px_rgba(0,0,0,0.02)] hover:border-[#b4b8b4] transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-[#282834]">
                      {step.number}
                    </span>
                    <div className="w-8 h-8 rounded-lg border border-[#dee2de] flex items-center justify-center text-[#282834]">
                      <IconComponent className="w-4 h-4 text-[#282834]" />
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
                    }}
                    className="text-xl font-normal text-[#171717] leading-snug"
                  >
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#444141] leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#dee2de] text-[11px] font-mono text-[#646464] leading-relaxed">
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
