import React, { useState } from "react";
import { ArrowRight, MapPin, Wind, Compass, Sparkles, Cpu, CheckCircle2 } from "lucide-react";
import { ArchitecturalSurroundingsScene } from "../three/ArchitecturalSurroundingsScene";

interface GeographicModelProps {
  onStartExploring?: () => void;
}

export const GeographicModel: React.FC<GeographicModelProps> = ({ onStartExploring }) => {
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const capabilities = [
    {
      number: "01",
      title: "Geographic Data",
      badge: "SPATIAL PRIMITIVES",
      desc: "OpenStreetMap-based geographic context and nearby infrastructure. Extracts civic topology, roads, hospitals, schools, and parks within an auditable 3,000m radial envelope.",
      provenance: "OSM Global Node Graph • 150m Spatial Tile Cache",
      icon: MapPin,
    },
    {
      number: "02",
      title: "Environmental Intelligence",
      badge: "ATMOSPHERIC TELEMETRY",
      desc: "Air quality and weather information, subject to source availability. Ingests raw European sensor station telemetry for PM2.5, PM10, AQI, temperature, and wind vectors without synthetic interpolation.",
      provenance: "Open-Meteo European CAMS • Official Station Network",
      icon: Wind,
    },
    {
      number: "03",
      title: "Spatial Analysis",
      badge: "DETERMINISTIC PHYSICS",
      desc: "Geographic proximity and contextual relationships. Computes deterministic inverse-square acoustic decay from transport arteries, clearly disclosed as proximity approximations.",
      provenance: "Geometric Falloff Formula: L = L₀ - 20·log(d)",
      icon: Compass,
    },
    {
      number: "04",
      title: "AI-Assisted Investigation",
      badge: "FORENSIC SYNTHESIS",
      desc: "Evidence-grounded explanations that distinguish verified information, estimates, and AI interpretations. Generates actionable on-site inspection targets with zero hallucination.",
      provenance: "Gemini Forensic Synthesis • Bound by Raw Coordinates",
      icon: Sparkles,
    },
  ];

  return (
    <section
      id="technology"
      className="py-28 lg:py-36 bg-[#0B1D2A] text-[#F4F7F8] relative border-b border-white/[0.16] scroll-mt-24 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 right-0 w-[1000px] h-[600px] bg-gradient-to-l from-[#123747]/30 via-[#0D3442]/20 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Coordinate Grid Texture matching Home */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 text-left space-y-16 lg:space-y-20 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/[0.16] bg-white/[0.04] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#78D6E7] animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#E8F0F1] uppercase font-medium">
                THE INTELLIGENCE ENGINE
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-[44px] sm:text-[58px] lg:text-[72px] font-normal text-[#F4F7F8] leading-[0.95] tracking-[-2px]">
                See the <br />
                <em className="italic font-normal text-[#78D6E7]">Bigger Picture.</em>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#A8C0CA] leading-relaxed font-sans font-normal">
              Geographic data, environmental observations, spatial relationships, and AI-assisted interpretation work together to reveal the context behind a place.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onStartExploring}
              className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full text-[14px] font-medium text-white bg-[#000000] hover:bg-[#111111] border border-white/[0.16] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <span>Launch Investigation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200 text-[#78D6E7]" />
            </button>
          </div>
        </div>

        {/* Stacked Architecture Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 4 Capabilities with Restrained Cyan Accents (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#91B9C5] mb-2 flex items-center justify-between">
              <span>FOUR ENGINE LAYERS</span>
              <span className="text-[#78D6E7]">INTERACTIVE LAYER PROJECTION</span>
            </div>

            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              const isActive = activeLayer === idx;
              return (
                <div
                  key={cap.number}
                  onClick={() => setActiveLayer(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white/[0.06] border-[#78D6E7]/50 shadow-xl"
                      : "bg-white/[0.02] border-white/[0.1] hover:bg-white/[0.04] hover:border-white/[0.18]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`font-mono text-xs font-semibold ${isActive ? "text-[#78D6E7]" : "text-[#91B9C5]"}`}>
                        LAYER {cap.number}
                      </span>
                      <span className="text-white/20">—</span>
                      <span className="text-[10px] font-mono tracking-wider uppercase text-[#A8C0CA]">
                        {cap.badge}
                      </span>
                    </div>
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#78D6E7]" : "text-white/40"}`} />
                  </div>

                  <div className="mt-2 font-serif text-xl sm:text-2xl text-white">
                    {cap.title}
                  </div>

                  {isActive && (
                    <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-2 animate-in fade-in duration-200">
                      <p className="text-xs text-[#E8F0F1] font-sans leading-relaxed">
                        {cap.desc}
                      </p>
                      <div className="flex items-center space-x-2 text-[11px] font-mono text-[#91B9C5]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#78D6E7]" />
                        <span>{cap.provenance}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Architectural Surroundings 3D Scene (6 cols) */}
          <div className="lg:col-span-6 w-full">
            <ArchitecturalSurroundingsScene />
          </div>
        </div>

        {/* Engine Quality Guarantees Bar */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.12] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs font-mono">
          <div className="flex items-center space-x-3 text-[#E8F0F1]">
            <Cpu className="w-4 h-4 text-[#78D6E7]" />
            <span className="font-semibold text-white">Deterministic Execution:</span>
            <span className="text-[#A8C0CA]">Zero black-box composite ratings. Complete raw data lineage.</span>
          </div>
          <div className="flex items-center space-x-6 text-[#91B9C5]">
            <span>Cache TTL: 7 Days</span>
            <span>•</span>
            <span>Overpass Latency: ~340ms</span>
            <span>•</span>
            <span>European CAMS Telemetry</span>
          </div>
        </div>
      </div>
    </section>
  );
};
