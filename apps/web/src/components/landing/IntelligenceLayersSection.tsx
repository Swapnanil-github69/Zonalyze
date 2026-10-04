import React from "react";
import {
  Wind,
  Building2,
  Volume2,
  Mountain,
  ArrowRight,
} from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export const IntelligenceLayersSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.12 });

  const cards = [
    {
      id: "environmental",
      title: "Environmental Context",
      icon: Wind,
      items: [
        "PM2.5",
        "PM10",
        "European AQI",
        "Historical Trends",
      ],
      previewGradient: "from-[#13272B]/70 via-[#0B1719]/50 to-transparent",
    },
    {
      id: "infrastructure",
      title: "Nearby Infrastructure",
      icon: Building2,
      items: [
        "Hospitals",
        "Pharmacies",
        "Railway Stations",
        "Bus Stops",
        "Parks",
      ],
      previewGradient: "from-[#1B3239]/65 via-[#0B1719]/50 to-transparent",
    },
    {
      id: "noise",
      title: "Noise Exposure",
      icon: Volume2,
      items: [
        "Exposure Category",
        "Source Type",
        "Distance (if available)",
        "Confidence & Limitations",
      ],
      previewGradient: "from-[#20383E]/60 via-[#0B1719]/50 to-transparent",
    },
    {
      id: "geographic",
      title: "Geographic Context",
      icon: Mountain,
      items: [
        "Coordinates",
        "Surrounding Geography",
        "Spatial Relationships",
        "Terrain Information",
      ],
      previewGradient: "from-[#294248]/60 via-[#0B1719]/50 to-transparent",
    },
  ];

  const scrollToWorkspace = () => {
    const el = document.getElementById("workspace");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="layers"
      className="relative w-full py-28 lg:py-36 bg-[#0B1719] text-[#F1F0E9] overflow-hidden border-b border-[rgba(190,210,202,0.13)] scroll-mt-20"
    >
      {/* Seamless Top Gradient Blend from Hero Section */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#071013]/60 to-transparent pointer-events-none" />

      {/* Atmospheric Background Layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft atmospheric ambient illumination with smooth scale */}
        <div
          className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-[850px] h-[550px] bg-[#142629]/60 rounded-full blur-[180px] transition-all duration-1000 ${
            isVisible ? "opacity-100 scale-100" : "opacity-40 scale-95"
          }`}
        />
        <div
          className={`absolute -top-32 right-1/4 w-[600px] h-[400px] bg-[#192E31]/40 rounded-full blur-[160px] transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 scale-100" : "opacity-30 scale-95"
          }`}
        />
        {/* Subtle topographic grid texture */}
        <div className="absolute inset-0 topographic-grid opacity-35" />
      </div>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Heading, description, and "Explore All Layers" link (4 cols) */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <h2
              className={`font-serif text-[44px] sm:text-[56px] lg:text-[66px] font-normal text-[#F1F0E9] leading-[1.02] tracking-[-1.5px] reveal-init ${
                isVisible ? "revealed" : ""
              }`}
            >
              Understand What <br />
              Surrounds <em className="italic font-normal text-[#D1C6A5]">You.</em>
            </h2>

            <p
              style={{ transitionDelay: "140ms" }}
              className={`font-sans text-sm sm:text-base text-[#B8C5C2] leading-relaxed font-normal max-w-sm reveal-init ${
                isVisible ? "revealed" : ""
              }`}
            >
              From air quality to infrastructure, noise exposure to geographic context — get a complete picture of any location with multi-layered intelligence.
            </p>

            <div
              style={{ transitionDelay: "240ms" }}
              className={`pt-2 reveal-init ${isVisible ? "revealed" : ""}`}
            >
              <button
                onClick={scrollToWorkspace}
                className="inline-flex items-center space-x-2 text-sm font-medium text-[#B6C6A3] hover:text-[#DCE7CD] transition-colors duration-200 cursor-pointer group"
              >
                <span>Explore All Layers</span>
                <ArrowRight className="w-4 h-4 text-[#B6C6A3] group-hover:text-[#DCE7CD] group-hover:translate-x-1.5 transition-all duration-200" />
              </button>
            </div>
          </div>

          {/* Right Column: 4 Editorial Translucent Cards (8 cols) with Staggered Fade-Up */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  style={{ transitionDelay: `${120 + idx * 110}ms` }}
                  className={`rounded-2xl border border-[rgba(190,210,202,0.13)] bg-[#142629] hover:bg-[#192E31] hover:border-[#B6C6A3]/45 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(11,23,25,0.7),inset_0_1px_1px_rgba(255,255,255,0.06)] p-5 flex flex-col justify-between space-y-6 text-left relative overflow-hidden group shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] backdrop-blur-xl reveal-init ${
                    isVisible ? "revealed" : ""
                  }`}
                >
                  {/* Subtle top landscape header background gradient */}
                  <div
                    className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#192E31]/70 via-[#142629]/40 to-transparent opacity-60 pointer-events-none group-hover:opacity-90 transition-opacity duration-300"
                  />

                  {/* Top: Icon in refined container with muted sage accent */}
                  <div className="relative z-10 space-y-4">
                    <div className="w-11 h-11 rounded-xl bg-[#102124] border border-[rgba(190,210,202,0.15)] flex items-center justify-center text-[#B6C6A3] shadow-[0_2px_10px_rgba(11,23,25,0.4)] group-hover:border-[#B6C6A3]/40 group-hover:text-[#DCE7CD] group-hover:shadow-[0_0_16px_rgba(182,198,163,0.2)] transition-all duration-300">
                      <Icon className="w-4 h-4 text-[#B6C6A3] group-hover:text-[#DCE7CD] transition-colors" />
                    </div>

                    <h3 className="font-sans text-base font-semibold text-[#F1F0E9] tracking-tight leading-snug">
                      {card.title}
                    </h3>
                  </div>

                  {/* Bullet points with small muted sage indicators and soft secondary text */}
                  <ul className="relative z-10 space-y-2 text-xs font-sans text-[#B8C5C2]">
                    {card.items.map((item, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B6C6A3]/85 shrink-0 group-hover:bg-[#D1C6A5] transition-colors duration-200" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
