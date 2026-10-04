import React from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export const HowItWorksSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.14 });

  const steps = [
    {
      number: "01",
      title: "Choose a Location",
      description: "Select a place using the map or coordinates.",
    },
    {
      number: "02",
      title: "Gather the Evidence",
      description: "Retrieve environmental and infrastructure data.",
    },
    {
      number: "03",
      title: "Examine the Context",
      description: "Analyze metrics and noise exposure estimates.",
    },
    {
      number: "04",
      title: "Discover the Findings",
      description: "Get an AI-powered report based on verified evidence.",
    },
  ];

  return (
    <section
      ref={ref}
      id="process"
      className="relative w-full py-28 lg:py-36 bg-[#102124] text-[#F1F0E9] overflow-hidden border-b border-[rgba(190,210,202,0.13)] scroll-mt-20"
    >
      {/* Seamless Top Gradient Blend */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0B1719]/70 to-transparent pointer-events-none" />

      {/* Background Radial Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-1/2 left-1/3 -translate-y-1/2 w-[850px] h-[550px] bg-[#142629]/70 rounded-full blur-[190px] transition-all duration-1000 ${
            isVisible ? "opacity-100 scale-100" : "opacity-40 scale-95"
          }`}
        />
        <div className="absolute inset-0 topographic-grid opacity-30" />
      </div>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16 lg:space-y-20">
        {/* Section Header */}
        <div className="text-left space-y-4 max-w-2xl">
          <h2
            className={`font-serif text-[42px] sm:text-[54px] lg:text-[64px] font-normal text-[#F1F0E9] leading-[1.04] tracking-[-1.5px] reveal-init ${
              isVisible ? "revealed" : ""
            }`}
          >
            From a Point on the Map <br />
            to a <em className="italic font-normal text-[#D1C6A5]">Deeper Understanding.</em>
          </h2>
          <p
            style={{ transitionDelay: "140ms" }}
            className={`font-sans text-sm sm:text-base text-[#B8C5C2] leading-relaxed font-normal max-w-lg reveal-init ${
              isVisible ? "revealed" : ""
            }`}
          >
            A seamless four-stage analytical pipeline converting raw geographical coordinates into evidence-grounded spatial intelligence.
          </p>
        </div>

        {/* Horizontal Process Timeline */}
        <div className="relative">
          {/* Subtle animated connecting line running behind the circular step nodes on desktop */}
          <div
            className={`hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(182,198,163,0.35)] to-transparent z-0 shadow-[0_0_8px_rgba(182,198,163,0.2)] reveal-line-init ${
              isVisible ? "revealed" : ""
            }`}
          />

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                style={{ transitionDelay: `${150 + idx * 120}ms` }}
                className={`flex flex-col items-center lg:items-center text-center space-y-5 group cursor-default p-5 rounded-2xl hover:bg-[#142629]/60 border border-transparent hover:border-[rgba(190,210,202,0.12)] transition-all duration-300 reveal-init ${
                  isVisible ? "revealed" : ""
                }`}
              >
                {/* Circular Number Marker */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-mono text-sm transition-all duration-300 ${
                    idx === 0
                      ? "border border-[#B6C6A3] bg-[#142629] text-[#B6C6A3] shadow-[0_0_20px_rgba(182,198,163,0.25)]"
                      : "border border-[rgba(190,210,202,0.14)] bg-[#102124] text-[#829492] group-hover:border-[#B6C6A3]/60 group-hover:text-[#F1F0E9] group-hover:bg-[#142629] group-hover:shadow-[0_0_16px_rgba(182,198,163,0.18)]"
                  }`}
                >
                  {step.number}
                </div>

                <div className="space-y-2 max-w-[220px]">
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#F1F0E9] tracking-tight group-hover:text-[#D1C6A5] transition-colors">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-[13px] text-[#829492] group-hover:text-[#B8C5C2] leading-relaxed transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
