import React from "react";
import { Wind, Building2, Mountain, Volume2 } from "lucide-react";

export const EvidenceCategoriesSection: React.FC = () => {
  const categories = [
    {
      id: "atmosphere",
      code: "REC-01",
      title: "ATMOSPHERIC TELEMETRY",
      subtitle: "AIR SENSOR OBSERVATIONS",
      icon: Wind,
      observations: [
        "Particulate matters: PM2.5 & PM10 concentrations",
        "European Air Quality Index (AQI) rating scale",
        "72-hour atmospheric telemetry and trend trajectories",
      ],
      sourceNote: "SOURCE: OPEN-METEO & REGIONAL SENSOR ARRAYS. COVERAGE & FRESHNESS VARIES BY COORDINATE.",
    },
    {
      id: "infrastructure",
      code: "REC-02",
      title: "CIVIC INFRASTRUCTURE",
      subtitle: "MAPPED URBAN NODES",
      icon: Building2,
      observations: [
        "Emergency healthcare facilities, hospitals, and pharmacies",
        "Suburban rail terminals, multimodal stations, and bus stops",
        "Public recreational grounds, designated parks, and civic reserves",
      ],
      sourceNote: "SOURCE: OPENSTREETMAP SPATIAL REGISTRY WITHIN 3,000M RADIAL BOUNDARY.",
    },
    {
      id: "environmental",
      code: "REC-03",
      title: "LANDFORM CONTEXT",
      subtitle: "TOPOGRAPHY & ELEVATION",
      icon: Mountain,
      observations: [
        "Geodetic coordinate datum (WGS 84 ellipsoid standard)",
        "Surrounding terrain elevation profile and contour gradients",
        "Hydrographic relations to regional river basins and coastline",
      ],
      sourceNote: "SOURCE: REGIONAL DIGITAL ELEVATION MODELS (DEM). DIRECT PHYSICAL CONTOURS.",
    },
    {
      id: "noise",
      code: "REC-04",
      title: "ACOUSTIC DECAY",
      subtitle: "DETERMINISTIC TRANSIT PROXIMITY",
      icon: Volume2,
      observations: [
        "Corridor proximity to heavy rail lines and primary arterial highways",
        "Mathematical distance decay calculation based on transit geometry",
        "Categorical exposure classifications with explicit confidence bounds",
      ],
      sourceNote: "METHODOLOGY: PHYSICAL DISTANCE PROXY MODEL. EXPLICITLY LABELED AS DERIVED ESTIMATE.",
    },
  ];

  return (
    <section id="categories" className="relative w-full py-20 bg-[#161b13] text-[#dde2e4] border-b border-[#84907f]/30 overflow-hidden">
      {/* Ambient Radial & Caustic Backlights to reveal frosted glass refraction */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#e2ffcc]/5 rounded-full liquid-caustic-blob pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#84907f]/8 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-8s" }} />
      <div className="absolute inset-0 topographic-grid opacity-30 pointer-events-none" />

      <div className="relative w-full px-6 sm:px-12 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#84907f]/30 pb-4 text-[11px] font-mono tracking-wider uppercase text-[#84907f]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#e2ffcc] inline-block animate-pulse" />
            <span className="text-[#e2ffcc] font-bold">SECTION 02 // EVIDENCE INVENTORY</span>
          </div>
          <div className="px-2.5 py-1 glass-badge text-[10px] text-[#e2ffcc]">
            FOUR RECOGNIZED TELEMETRY CHANNELS
          </div>
        </div>

        <div className="max-w-4xl space-y-4 text-left">
          <h2 className="font-display-stout text-5xl sm:text-7xl lg:text-[80px] text-[#e2ffcc] tracking-tight leading-[0.90] uppercase">
            THE SIGNALS WE EXAMINE.
          </h2>

          <p className="font-mono text-xs sm:text-sm text-[#84907f] leading-relaxed max-w-2xl">
            Each category represents a discrete empirical stream. Retrieved data is presented alongside its recorded timestamp, provider origin, and known spatial limitations.
          </p>
        </div>

        {/* 4 Frosted Glass Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                className="p-6 sm:p-8 glass-card border border-[#84907f]/30 hover:border-[#e2ffcc]/40 flex flex-col justify-between space-y-6 text-left transition-all duration-300"
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#84907f]/20 pb-3">
                    <span className="font-mono text-[11px] text-[#e2ffcc] font-bold tracking-wider">
                      [{cat.code}] // {cat.subtitle}
                    </span>
                    <div className="w-8 h-8 glass-badge flex items-center justify-center text-[#e2ffcc] border border-[#e2ffcc]/40">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-display-stout text-3xl sm:text-4xl text-[#dde2e4] tracking-wide uppercase pt-2">
                    {cat.title}
                  </h3>
                </div>

                {/* Observations list */}
                <ul className="space-y-2.5 font-mono text-xs text-[#dde2e4]/90">
                  {cat.observations.map((obs, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <span className="text-[#e2ffcc] font-bold mt-0.5">■</span>
                      <span className="leading-relaxed">{obs}</span>
                    </li>
                  ))}
                </ul>

                {/* Source & Transparency Note */}
                <div className="pt-4 border-t border-[#84907f]/20 font-mono text-[10px] text-[#84907f] leading-relaxed uppercase">
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
