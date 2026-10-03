import React from "react";
import { Database, FileText, ShieldAlert, CheckCircle2, ShieldCheck } from "lucide-react";

export const EvidenceSection: React.FC = () => {
  const tiers = [
    {
      tier: "TIER 01",
      name: "Verified Information",
      badge: "GROUND TRUTH TELEMETRY",
      badgeColor: "text-[#78D6E7] border-[#78D6E7]/30 bg-[#78D6E7]/10",
      lead: "Raw sensor and geodetic measurements cited directly without synthetic blending.",
      items: [
        {
          source: "Open-Meteo European Station Feeds",
          detail: "Real-time measurements of PM2.5, PM10, AQI index, temperature, and wind vectors cited directly from official meteorological surface stations.",
        },
        {
          source: "OpenStreetMap Geodetic Graph",
          detail: "Verifiable geographic nodes for hospitals, pharmacies, emergency facilities, transit hubs, and public greenery within a 3,000m radius.",
        },
      ],
      icon: Database,
    },
    {
      tier: "TIER 02",
      name: "Spatial Calculations & Estimates",
      badge: "DETERMINISTIC PHYSICS",
      badgeColor: "text-[#91B9C5] border-[#91B9C5]/30 bg-[#91B9C5]/10",
      lead: "Mathematical physics approximations clearly labeled with explicit limitations.",
      items: [
        {
          source: "Geometric Noise Falloff Estimates",
          detail: "Calculated using the inverse-square law formula (L = L₀ - 20·log₁₀(d/d₀)) from road and rail axes. Explicitly identified as proximity approximations, not physical sound meter sensors.",
        },
        {
          source: "150m Geospatial Tile Cache",
          detail: "High-performance MongoDB tile caching with a 7-day TTL and explicit freshness timestamps on every investigation query.",
        },
      ],
      icon: FileText,
    },
    {
      tier: "TIER 03",
      name: "AI-Generated Explanations",
      badge: "EVIDENCE-BOUND AI",
      badgeColor: "text-[#A8C8B5] border-[#A8C8B5]/30 bg-[#A8C8B5]/10",
      lead: "Grounded contextual observations bound strictly by verified data.",
      items: [
        {
          source: "Data Availability & Gap Disclosures",
          detail: "Transparent gap indicators when rural or suburban amenity tagging is sparse, eliminating false confidence in sparse regions.",
        },
        {
          source: "Boundaries of AI Synthesis",
          detail: "Evidence-grounded observations and suggested on-site inspection targets with zero speculative hallucination or black-box composite scores.",
        },
      ],
      icon: ShieldAlert,
    },
  ];

  return (
    <section
      id="evidence"
      className="py-28 lg:py-36 bg-[#0B1D2A] text-[#F4F7F8] relative border-b border-white/[0.16] scroll-mt-24 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/4 w-[900px] h-[550px] bg-gradient-to-r from-[#123747]/30 via-[#0D3442]/20 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Coordinate Grid Texture matching Home */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 text-left relative z-10 space-y-16 lg:space-y-20">
        {/* Section Header */}
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/[0.16] bg-white/[0.04] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#78D6E7] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[#E8F0F1] uppercase font-medium">
              EVIDENCE & TRANSPARENCY
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-[44px] sm:text-[58px] lg:text-[72px] font-normal text-[#F4F7F8] leading-[0.95] tracking-[-2px]">
              Clarity Begins With <br />
              <em className="italic font-normal text-[#78D6E7]">Evidence.</em>
            </h2>
          </div>

          <p className="text-base sm:text-lg text-[#A8C0CA] leading-relaxed font-sans font-normal">
            ZONALYZE clearly separates verified information, derived spatial estimates, and AI-generated explanations. Every coordinate inquiry exposes full data provenance, cache freshness, and physical limitations.
          </p>
        </div>

        {/* 3-Tier Traceability Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.tier}
                className="p-8 sm:p-10 rounded-2xl bg-white/[0.025] hover:bg-white/[0.04] border border-white/[0.12] hover:border-white/[0.22] transition-all duration-300 flex flex-col justify-between space-y-8 group shadow-xl"
              >
                <div className="space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#91B9C5] block font-semibold">
                        {tier.tier}
                      </span>
                      <h3 className="font-serif text-2xl font-normal text-white">
                        {tier.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.12] flex items-center justify-center text-[#78D6E7]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <span className={`inline-block text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full border font-semibold ${tier.badgeColor}`}>
                    {tier.badge}
                  </span>

                  <p className="text-xs text-[#A8C0CA] font-sans leading-relaxed">
                    {tier.lead}
                  </p>

                  {/* Items */}
                  <div className="space-y-4 pt-2">
                    {tier.items.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                        <div className="text-xs font-semibold text-[#F4F7F8] flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#78D6E7] shrink-0" />
                          <span>{item.source}</span>
                        </div>
                        <p className="text-[11px] text-[#A8C0CA] font-sans leading-relaxed pl-5">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#91B9C5]">
                  <div className="flex items-center space-x-1.5 text-[#78D6E7]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verifiable Lineage</span>
                  </div>
                  <span>100% Audit Ready</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Partners Banner */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.12] flex flex-wrap items-center justify-between gap-6 text-xs font-mono text-[#A8C0CA]">
          <span className="uppercase tracking-widest text-[#78D6E7] font-bold">Verified Data Sources:</span>
          <div className="flex flex-wrap items-center gap-6 text-[#E8F0F1]">
            <span>OpenStreetMap Contributors</span>
            <span>•</span>
            <span>Open-Meteo European CAMS</span>
            <span>•</span>
            <span>WHO Air Quality Guidelines (2021)</span>
            <span>•</span>
            <span>Gemini 1.5 Flash Grounded Debrief</span>
          </div>
        </div>
      </div>
    </section>
  );
};
