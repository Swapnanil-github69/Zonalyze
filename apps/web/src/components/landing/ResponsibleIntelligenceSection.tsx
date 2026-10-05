import React from "react";
import { ShieldCheck, Scale, Sparkles } from "lucide-react";

export const ResponsibleIntelligenceSection: React.FC = () => {
  const commitments = [
    {
      id: "traceable",
      title: "Traceable",
      subtitle: "Origin & Freshness",
      icon: ShieldCheck,
      description: "We show the origin, recording timestamp, and spatial coverage of available data. When a provider returns no measurements, we preserve that gap explicitly rather than masking it.",
    },
    {
      id: "careful",
      title: "Careful",
      subtitle: "Transparent Limitations",
      icon: Scale,
      description: "We explain analytical models and mathematical estimates as approximations. We do not generate arbitrary composite ratings such as 'Livability 82/100' or claim guaranteed completeness.",
    },
    {
      id: "grounded",
      title: "Grounded",
      subtitle: "Evidence-Based AI",
      icon: Sparkles,
      description: "Our language model receives only verified backend observation records. It is instructed to synthesize findings without fabricating readings, inventing distances, or hallucinating source coverage.",
    },
  ];

  return (
    <section id="responsible" className="relative w-full py-20 sm:py-28 bg-[#0B1719] border-b border-[#192E31]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 space-y-12 sm:space-y-16 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#B6C6A3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B6C6A3]" />
            <span>RESPONSIBLE EVIDENCE</span>
          </div>

          <h2
            style={{
              fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
            className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#F1F0E9]"
          >
            Insight should show its working.
          </h2>

          <p className="text-base text-[#B8C5C2] font-sans leading-relaxed">
            ZONALYZE separates retrieved observations from interpretation. Sources, timestamps, coverage gaps, and uncertainty matter as much as the summary itself.
          </p>
        </div>

        {/* 3 Core Commitments Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {commitments.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="p-6 sm:p-8 rounded-[24px] bg-[#102124] border border-[#192E31] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#B6C6A3]/40 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl border border-[#192E31] bg-[#142629] flex items-center justify-center text-[#B6C6A3]">
                    <IconComponent className="w-4 h-4 text-[#B6C6A3]" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D1C6A5]">
                    {item.subtitle}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
                  }}
                  className="text-2xl font-normal text-[#F1F0E9]"
                >
                  {item.title}
                </h3>

                <p className="text-sm text-[#B8C5C2] leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
