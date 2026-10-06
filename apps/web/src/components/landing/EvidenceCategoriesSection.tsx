import React from "react";
import { Wind, Building2, Mountain, Volume2 } from "lucide-react";
import { useLandingTheme } from "../../context/LandingThemeContext";

export const EvidenceCategoriesSection: React.FC = () => {
  const { theme } = useLandingTheme();
  const isLiterary = theme === "literary";

  const categories = [
    {
      id: "atmosphere",
      code: "REC-01",
      title: isLiterary ? "Atmospheric Telemetry" : "ATMOSPHERIC TELEMETRY",
      subtitle: isLiterary ? "Air sensor observations" : "AIR SENSOR OBSERVATIONS",
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
      title: isLiterary ? "Civic Infrastructure" : "CIVIC INFRASTRUCTURE",
      subtitle: isLiterary ? "Mapped urban nodes" : "MAPPED URBAN NODES",
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
      title: isLiterary ? "Landform Context" : "LANDFORM CONTEXT",
      subtitle: isLiterary ? "Topography & elevation" : "TOPOGRAPHY & ELEVATION",
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
      title: isLiterary ? "Acoustic Decay" : "ACOUSTIC DECAY",
      subtitle: isLiterary ? "Deterministic transit proximity" : "DETERMINISTIC TRANSIT PROXIMITY",
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
    <section
      id="categories"
      className={`relative w-full py-20 overflow-hidden transition-colors duration-500 ${
        isLiterary
          ? "bg-[#fefffc] border-b border-[#dee2de] text-[#444141]"
          : "bg-[#161b13] text-[#dde2e4] border-b border-[#84907f]/30"
      }`}
    >
      {/* Ambient Backlights */}
      {isLiterary ? (
        <div className="absolute inset-0 topographic-grid-dark opacity-10 pointer-events-none" />
      ) : (
        <>
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#e2ffcc]/5 rounded-full liquid-caustic-blob pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#84907f]/8 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-8s" }} />
          <div className="absolute inset-0 topographic-grid opacity-30 pointer-events-none" />
        </>
      )}

      <div className="relative w-full px-6 sm:px-12 space-y-12">
        
        {/* Section Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 pb-4 text-xs tracking-wider uppercase border-b ${
            isLiterary
              ? "border-[#dee2de] font-editorial-sans text-[#646464]"
              : "border-[#84907f]/30 font-editorial-sans text-[11px] text-[#84907f]"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 inline-block ${isLiterary ? "bg-[#41a1cf] rounded-full" : "bg-[#e2ffcc] animate-pulse"}`} />
            <span className={`font-bold ${isLiterary ? "text-[#2c2c2c]" : "text-[#e2ffcc]"}`}>
              {isLiterary ? "Section 02 — Evidence Inventory" : "SECTION 02 // EVIDENCE INVENTORY"}
            </span>
          </div>
          <div
            className={`px-3 py-1 font-medium ${
              isLiterary
                ? "gic-card bg-[#ffffff] border border-[#dee2de] text-[11px] text-[#444141] rounded-full shadow-none"
                : "px-2.5 py-1 glass-badge text-[10px] text-[#e2ffcc]"
            }`}
          >
            <span className="font-editorial-sans">
              Four recognized telemetry channels
            </span>
          </div>
        </div>

        <div className="max-w-4xl space-y-4 text-left">
          <h2 className={`font-editorial-serif font-normal text-3xl sm:text-5xl lg:text-[54px] tracking-[-0.03em] leading-[1.1] ${
            isLiterary ? "text-[#2c2c2c]" : "text-[#e2ffcc]"
          }`}>
            The signals we examine.
          </h2>

          <p
            className={`text-sm sm:text-[15px] leading-relaxed max-w-2xl font-editorial-sans font-normal ${
              isLiterary ? "text-[#444141]" : "text-[#84907f]"
            }`}
          >
            Each category represents a discrete empirical stream. Retrieved data is presented alongside its recorded timestamp, provider origin, and known spatial limitations.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                className={`p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left transition-all duration-300 ${
                  isLiterary
                    ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-xl hover:border-[#b4b8b4]"
                    : "glass-card border border-[#84907f]/30 hover:border-[#e2ffcc]/40"
                }`}
              >
                {/* Header */}
                <div className="space-y-3">
                  <div
                    className={`flex items-center justify-between pb-3 border-b ${
                      isLiterary ? "border-[#dee2de]" : "border-[#84907f]/20"
                    }`}
                  >
                    <span
                      className={`text-xs font-editorial-sans font-semibold tracking-wide ${
                        isLiterary
                          ? "text-[#41a1cf]"
                          : "text-[#e2ffcc]"
                      }`}
                    >
                      [{cat.code}] // {cat.subtitle}
                    </span>
                    <div
                      className={`w-8 h-8 flex items-center justify-center ${
                        isLiterary
                          ? "rounded-full bg-[#f9faf7] border border-[#dee2de] text-[#282834]"
                          : "glass-badge text-[#e2ffcc] border border-[#e2ffcc]/40"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3
                    className={`text-2xl sm:text-3xl tracking-tight pt-2 font-editorial-serif font-normal ${
                      isLiterary
                        ? "text-[#2c2c2c]"
                        : "text-[#dde2e4]"
                    }`}
                  >
                    {cat.title}
                  </h3>
                </div>

                {/* Observations list */}
                <ul className="space-y-2.5 text-xs font-editorial-sans">
                  {cat.observations.map((obs, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start space-x-3 text-[13px] ${
                        isLiterary ? "text-[#444141]" : "text-[#dde2e4]/90"
                      }`}
                    >
                      <span className={`font-bold mt-0.5 ${isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc]"}`}>
                        {isLiterary ? "•" : "■"}
                      </span>
                      <span className="leading-relaxed">{obs}</span>
                    </li>
                  ))}
                </ul>

                {/* Source & Transparency Note */}
                <div
                  className={`pt-4 border-t text-xs leading-relaxed font-editorial-sans ${
                    isLiterary
                      ? "border-[#dee2de] text-[#646464] text-[10px]"
                      : "border-[#84907f]/20 text-[11px] text-[#84907f]"
                  }`}
                >
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
