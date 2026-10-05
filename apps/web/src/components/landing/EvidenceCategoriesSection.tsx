import React from "react";
import { Wind, Building2, Mountain, Volume2 } from "lucide-react";

export const EvidenceCategoriesSection: React.FC = () => {
  const categories = [
    {
      id: "atmosphere",
      title: "Atmosphere",
      subtitle: "Air-Quality Observations",
      icon: Wind,
      observations: [
        "Particulate matters: PM2.5 & PM10 concentrations",
        "European Air Quality Index (AQI) rating scale",
        "72-hour atmospheric telemetry and trend trajectories",
      ],
      sourceNote: "Source: Open-Meteo & verified environmental sensor arrays. Coverage, timestamp freshness, and resolution vary by coordinates.",
      accent: "text-[#38BDF8]",
      bgAccent: "bg-[#0284C7]/15",
      borderAccent: "border-[#0284C7]/30",
      bulletColor: "bg-[#38BDF8]",
    },
    {
      id: "infrastructure",
      title: "Nearby Infrastructure",
      subtitle: "Mapped Civic & Urban Nodes",
      icon: Building2,
      observations: [
        "Emergency healthcare facilities, hospitals, and pharmacies",
        "Suburban rail terminals, multimodal stations, and bus stops",
        "Public recreational grounds, designated parks, and civic reserves",
      ],
      sourceNote: "Source: OpenStreetMap spatial database within a 3,000m radial catchment. Mapped completeness reflects registry records.",
      accent: "text-[#34D399]",
      bgAccent: "bg-[#059669]/15",
      borderAccent: "border-[#059669]/30",
      bulletColor: "bg-[#34D399]",
    },
    {
      id: "environmental",
      title: "Environmental Context",
      subtitle: "Topography & Landform Geometry",
      icon: Mountain,
      observations: [
        "Geodetic coordinate datum (WGS 84 ellipsoid standard)",
        "Surrounding terrain elevation profile and contour gradients",
        "Hydrographic relations to regional river basins and coastline",
      ],
      sourceNote: "Source: Regional digital elevation models. Direct physical landform records are clearly distinguished from derived summaries.",
      accent: "text-[#F59E0B]",
      bgAccent: "bg-[#D97706]/15",
      borderAccent: "border-[#D97706]/30",
      bulletColor: "bg-[#F59E0B]",
    },
    {
      id: "noise",
      title: "Noise Context",
      subtitle: "Deterministic Acoustic Modeling",
      icon: Volume2,
      observations: [
        "Corridor proximity to heavy rail lines and primary arterial highways",
        "Mathematical distance decay calculation based on transit geometry",
        "Categorical exposure classifications with explicit confidence bounds",
      ],
      sourceNote: "Methodology: Mathematical physical distance proxy. Expressly labeled as an estimate rather than direct in-situ decibel sound meters.",
      accent: "text-[#818CF8]",
      bgAccent: "bg-[#6366F1]/15",
      borderAccent: "border-[#6366F1]/30",
      bulletColor: "bg-[#818CF8]",
    },
  ];

  return (
    <section id="categories" className="relative w-full py-20 sm:py-28 bg-[#0B1316] border-b border-[#1F353B]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 space-y-12 sm:space-y-16 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#34D399]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            <span>FOUR EVIDENCE CHANNELS</span>
          </div>

          <h2
            style={{
              fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
            className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-white"
          >
            The signals we examine.
          </h2>

          <p className="text-base text-[#94A3B8] font-sans leading-relaxed">
            Each category represents a distinct layer of geographical and environmental evidence. We present retrieved source data alongside its known coverage bounds.
          </p>
        </div>

        {/* Four Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                className="p-6 sm:p-8 rounded-[24px] bg-[#132226] border border-[#1F353B] shadow-[0_12px_32px_rgba(0,0,0,0.35)] relative overflow-hidden flex flex-col justify-between space-y-6"
              >
                {/* Subtle top edge specular highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#34D399]/20 to-transparent pointer-events-none" />
                {/* Card Title & Icon */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
                      {cat.subtitle}
                    </span>
                    <div className={`w-8 h-8 rounded-lg border ${cat.borderAccent} ${cat.bgAccent} flex items-center justify-center`}>
                      <IconComponent className={`w-4 h-4 ${cat.accent}`} />
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
                      lineHeight: 1.2,
                    }}
                    className="text-2xl sm:text-[26px] font-normal text-white"
                  >
                    {cat.title}
                  </h3>
                </div>

                {/* Observations list */}
                <ul className="space-y-2.5 text-sm text-[#CBD5E1] font-sans">
                  {cat.observations.map((obs, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.bulletColor} mt-2 shrink-0`} />
                      <span className="leading-relaxed">{obs}</span>
                    </li>
                  ))}
                </ul>

                {/* Source & Transparency Note */}
                <div className="pt-4 border-t border-[#1F353B] text-xs text-[#64748B] font-sans leading-relaxed">
                  {cat.sourceNote}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
