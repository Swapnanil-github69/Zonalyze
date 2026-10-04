import React, { useState } from "react";
import { ArrowRight, Wind, Building2, Volume2, Sparkles, ShieldCheck, Activity } from "lucide-react";
import { ExploreSpatialVisual } from "../three/ExploreSpatialVisual";

interface IntelligenceDimensionsProps {
  onExplore?: () => void;
}

export const IntelligenceDimensions: React.FC<IntelligenceDimensionsProps> = ({ onExplore }) => {
  const [activeCapability, setActiveCapability] = useState<number>(0);

  const capabilities = [
    {
      number: "01",
      title: "Environmental Intelligence",
      tag: "ATMOSPHERIC DISPERSION",
      summary: "PM2.5, PM10, AQI, temperature, and atmospheric trends.",
      description: "Direct telemetry from European sensor stations tracking fine particulates, humidity, wind vectors, and air quality indices without synthetic interpolation.",
      metrics: [
        { label: "PM2.5 Sensor", val: "32 µg/m³", state: "Moderate" },
        { label: "PM10 Particulates", val: "48 µg/m³", state: "Within Limit" },
        { label: "Ambient Temp", val: "24.6°C", state: "Nominal" },
        { label: "Wind Vector", val: "14 km/h NW", state: "Dispersive" },
      ],
      icon: Wind,
      provenance: "Open-Meteo European CAMS • Official Station Feeds",
    },
    {
      number: "02",
      title: "Infrastructure Intelligence",
      tag: "3,000M CIVIC ENVELOPE",
      summary: "Hospitals, pharmacies, railway stations, bus stops, and parks.",
      description: "Comprehensive geodetic querying of essential civic assets, emergency medical hubs, public green buffers, and multimodal transit nodes within walking reach.",
      metrics: [
        { label: "Emergency Care", val: "4 Hubs (1.2km)", state: "Verified" },
        { label: "Transit Network", val: "Metro + 6 Bus", state: "Active" },
        { label: "Civic Parks", val: "3 Public Zones", state: "Verified" },
        { label: "Walk Envelope", val: "15 min isochrone", state: "Computed" },
      ],
      icon: Building2,
      provenance: "OpenStreetMap Global Geodetic Graph",
    },
    {
      number: "03",
      title: "Noise Exposure",
      tag: "ACOUSTIC PROXIMITY",
      summary: "Proximity-based exposure estimates with clear limitations.",
      description: "Applies geometric inverse-square acoustic attenuation (L = L₀ - 20·log(d)) to arterial transit corridors. Explicitly disclosed as proximity estimates, not physical sound meters.",
      metrics: [
        { label: "Decay Proxy", val: "L = L₀ - 20·log(d)", state: "Physics Model" },
        { label: "Arterial Road", val: "Primary Axis 380m", state: "Modeled" },
        { label: "Calculated Noise", val: "54 dBA (nominal)", state: "Estimated" },
        { label: "Rail Corridor", val: "None (<2.5km)", state: "Clear" },
      ],
      icon: Volume2,
      provenance: "Deterministic Geometric Propagation Proxy",
    },
    {
      number: "04",
      title: "AI Investigation",
      tag: "EVIDENCE-GROUNDED",
      summary: "Evidence-grounded findings and contextual observations.",
      description: "Forensic contextual debriefing that cross-references all spatial layers to highlight environmental anomalies, accessibility gaps, and suggested on-site inspection targets.",
      metrics: [
        { label: "Hallucination Risk", val: "0.0% Bound", state: "Audited" },
        { label: "On-Site Targets", val: "6 Key Points", state: "Generated" },
        { label: "Composite Bias", val: "None (Zero)", state: "Objective" },
        { label: "Data Lineage", val: "100% Traceable", state: "Audited" },
      ],
      icon: Sparkles,
      provenance: "Gemini Forensic Synthesis • Bound Strictly by Raw Data",
    },
  ];

  const current = capabilities[activeCapability];
  const CurrentIcon = current.icon;

  return (
    <section
      id="explore"
      className="py-28 lg:py-36 bg-[#0B1D2A] text-[#F4F7F8] relative border-b border-white/[0.16] scroll-mt-24 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#123747]/40 via-[#0D3442]/20 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Coordinate Grid Texture matching Home */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 text-left space-y-16 lg:space-y-20 relative z-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/[0.16] bg-white/[0.04] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#78D6E7] animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#E8F0F1] uppercase font-medium">
                SPATIAL INTELLIGENCE
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-[44px] sm:text-[58px] lg:text-[72px] font-normal text-[#F4F7F8] leading-[0.95] tracking-[-2px]">
                Understand What <br />
                <em className="italic font-normal text-[#78D6E7]">Surrounds You.</em>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#A8C0CA] leading-relaxed font-sans font-normal">
              Every location holds a deeper story. Explore environmental conditions, nearby infrastructure, noise exposure, and geographic context through connected spatial intelligence.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onExplore}
              className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full text-[14px] font-medium text-white bg-[#000000] hover:bg-[#111111] border border-white/[0.16] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <span>Explore Intelligence</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200 text-[#78D6E7]" />
            </button>
          </div>
        </div>

        {/* Integrated Luxury Editorial Layout: Asymmetric Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: 4 Capabilities with Elegant Numbering & Subtle Dividers (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-[#91B9C5] mb-2 flex items-center justify-between">
              <span>CORE CAPABILITIES</span>
              <span className="text-[#78D6E7]">SELECT TO INSPECT</span>
            </div>

            <div className="divide-y divide-white/[0.12] border-t border-b border-white/[0.12]">
              {capabilities.map((cap, idx) => {
                const isActive = activeCapability === idx;
                return (
                  <div
                    key={cap.number}
                    onClick={() => setActiveCapability(idx)}
                    className={`py-5 transition-all duration-200 cursor-pointer group flex items-start justify-between gap-4 ${
                      isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className={`font-mono text-xs font-semibold ${isActive ? "text-[#78D6E7]" : "text-[#91B9C5]"}`}>
                          {cap.number}
                        </span>
                        <span className="text-white/20">—</span>
                        <span className="text-[10px] font-mono tracking-wider uppercase text-[#A8C0CA]">
                          {cap.tag}
                        </span>
                      </div>

                      <h3 className={`font-serif text-2xl transition-colors ${
                        isActive ? "text-white" : "text-[#F4F7F8] group-hover:text-white"
                      }`}>
                        {cap.title}
                      </h3>

                      <p className="text-xs text-[#A8C0CA] font-sans leading-relaxed pt-0.5">
                        {cap.summary}
                      </p>

                      {/* Expanded View for Active Item */}
                      {isActive && (
                        <div className="pt-3 space-y-3 animate-in fade-in duration-200">
                          <p className="text-xs text-[#E8F0F1] font-sans leading-relaxed">
                            {cap.description}
                          </p>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {cap.metrics.map((m, i) => (
                              <div key={i} className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                                <div className="text-[10px] font-mono text-[#91B9C5]">{m.label}</div>
                                <div className="text-sm font-semibold text-[#F4F7F8] mt-0.5">{m.val}</div>
                                <div className="text-[9px] font-mono text-[#78D6E7] mt-0.5">{m.state}</div>
                              </div>
                            ))}
                          </div>

                          <div className="text-[10px] font-mono text-[#91B9C5] flex items-center space-x-1.5 pt-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#78D6E7]" />
                            <span>{cap.provenance}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={`p-2 rounded-lg border transition-colors shrink-0 mt-1 ${
                      isActive ? "bg-white/[0.08] border-[#78D6E7]/50 text-[#78D6E7]" : "bg-white/[0.02] border-white/[0.08] text-white/40"
                    }`}>
                      <CurrentIcon className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Integrated Geographic Visualization (7 cols) */}
          <div className="lg:col-span-7 w-full">
            <ExploreSpatialVisual />
          </div>
        </div>

        {/* Minimalist Telemetry Ledger Footer */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.12] flex flex-wrap items-center justify-between gap-6 text-xs font-mono text-[#A8C0CA]">
          <div className="flex items-center space-x-3">
            <Activity className="w-4 h-4 text-[#78D6E7]" />
            <span className="text-[#F4F7F8] font-medium">Deterministic Spatial Stack:</span>
            <span>Sub-meter OSM topology, European CAMS atmospheric stations, and geometric falloff.</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-[#91B9C5]">
            <span>150m MongoDB Cache</span>
            <span>•</span>
            <span>Zero Synthetic Scores</span>
          </div>
        </div>
      </div>
    </section>
  );
};
