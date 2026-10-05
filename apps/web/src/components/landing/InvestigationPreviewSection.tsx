import React from "react";
import { ArrowRight, Compass, Wind, Building2, Sparkles } from "lucide-react";

interface InvestigationPreviewSectionProps {
  onLaunchInvestigation?: () => void;
}

export const InvestigationPreviewSection: React.FC<InvestigationPreviewSectionProps> = ({
  onLaunchInvestigation,
}) => {
  return (
    <section id="preview" className="relative w-full py-20 sm:py-28 bg-[#0B1719] border-b border-[#192E31]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 space-y-12 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#B6C6A3]">
            <Compass className="w-3.5 h-3.5 text-[#B6C6A3]" />
            <span>INTERFACE PREVIEW</span>
          </div>

          <h2
            style={{
              fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
            className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#F1F0E9]"
          >
            How evidence appears in the field.
          </h2>

          <p className="text-base text-[#B8C5C2] font-sans leading-relaxed">
            When you select a location, ZONALYZE opens a structured investigation record. Direct sensor observations, mapped infrastructure points, and AI interpretations are displayed in distinct, transparent layers.
          </p>
        </div>

        {/* Liquid Glass Editorial Preview Card */}
        <div className="relative">
          {/* Animated Liquid Caustic Backlight Blob */}
          <div className="absolute -inset-6 bg-gradient-to-tr from-[#142629]/50 via-emerald-500/10 to-[#41a1cf]/10 blur-3xl rounded-[36px] liquid-caustic-blob pointer-events-none" />

          <div className="relative rounded-[28px] liquid-glass-card overflow-hidden">
            {/* Top Specular Edge Line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />
            
            {/* Card Top Utility Bar */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#142629]/80 via-[#102124]/70 to-[#142629]/80 backdrop-blur-2xl border-b border-white/[0.1] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B6C6A3] shadow-[0_0_10px_rgba(182,198,163,0.9)] animate-pulse" />
                <span className="font-mono text-xs text-[#F1F0E9] font-medium tracking-wide">
                  LIVE AUDIT RECORD: BANGUR, KOLKATA METROPOLITAN AREA
                </span>
                <span className="text-xs text-[#829492] font-mono">• 22.60995° N, 88.41794° E</span>
              </div>

              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0B1719]/70 border border-white/[0.1] text-xs font-mono text-[#D1C6A5] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <span>Real Location Telemetry</span>
              </div>
            </div>

            {/* Split Preview Grid: Map Illustration Crop + 3 Evidence Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
              
              {/* Left: Map Crop */}
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-transparent">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/[0.12] bg-[#142629]/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                  <img
                    src="/zonalyze_liquid_glass_crop.jpg"
                    alt="Real interactive map view with dropped pin at Bangur, Lake Town, Kolkata"
                    className="w-full h-full object-cover object-center filter contrast-[1.04]"
                  />
                  
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#102124]/90 backdrop-blur-md border border-white/[0.12] text-[11px] font-mono text-[#F1F0E9] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                    POINT OF INQUIRY: 22.60995° N, 88.41794° E
                  </div>
                </div>

              <div className="flex items-center justify-between text-xs text-[#829492] font-mono">
                <span>DATUM: WGS 84</span>
                <span>GEOJSON: [88.41794, 22.60995]</span>
              </div>
            </div>

            {/* Right: Three Compact Evidence Rows */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#102124]">
              
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#D1C6A5] block">
                  LAYERED OBSERVATION RECORD
                </span>

                {/* Row 1: Air Observations */}
                <div className="p-4 rounded-xl bg-[#142629] border border-[#192E31] space-y-1.5 hover:border-[#B6C6A3]/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-medium text-[#F1F0E9]">
                      <Wind className="w-4 h-4 text-[#B6C6A3]" />
                      <span>Atmospheric & Environmental Telemetry</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#E06C75] font-semibold">AQI 83 • Very Poor</span>
                  </div>
                  <p className="text-xs text-[#B8C5C2] leading-relaxed font-sans">
                    Observed PM2.5 (97.6 µg/m³) and PM10 (111.8 µg/m³). Surface temperature 29.4°C. Current live sensor reading 71 µg/m³ (4.7× higher than WHO guideline). 72h continuous telemetry profile.
                  </p>
                </div>

                {/* Row 2: Nearby Infrastructure */}
                <div className="glass-3d-card p-4 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-medium text-[#F1F0E9]">
                      <Building2 className="w-4 h-4 text-[#D1C6A5]" />
                      <span>Nearby Infrastructure</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#829492]">OpenStreetMap</span>
                  </div>
                  <p className="text-xs text-[#B8C5C2] leading-relaxed font-sans">
                    Mapped civic nodes: 3 tertiary hospitals, 5 pharmacies, 1 major railway terminal, 6 bus transit stops within 3,000m. Registry completeness represents mapped features.
                  </p>
                </div>

                {/* Row 3: Interpretation */}
                <div className="glass-3d-card p-4 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-medium text-[#F1F0E9]">
                      <Sparkles className="w-4 h-4 text-[#B6C6A3]" />
                      <span>Interpretation</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#B6C6A3]">Evidence-Grounded AI</span>
                  </div>
                  <p className="text-xs text-[#B8C5C2] leading-relaxed font-sans">
                    "The area exhibits moderate particulate readings alongside high civic accessibility. Proximity to arterial transit correlates with elevated modeled acoustic exposure. No direct health judgment is inferred."
                  </p>
                </div>
              </div>

              {/* Bottom Action inside preview */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-[#829492] font-sans">
                  Ready to test a real geographical coordinate?
                </span>

                <button
                  onClick={onLaunchInvestigation}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold text-[#0B1719] bg-[#B6C6A3] hover:bg-[#DCE7CD] shadow-[0_0_20px_rgba(182,198,163,0.3)] transition-all cursor-pointer font-sans"
                >
                  <span>Open Investigation Workspace</span>
                  <ArrowRight className="w-4 h-4 text-[#0B1719]" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      </div>
    </section>
  );
};
