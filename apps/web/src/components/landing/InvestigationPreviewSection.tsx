import React from "react";
import { ArrowRight, Compass, Wind, Building2, Sparkles } from "lucide-react";

interface InvestigationPreviewSectionProps {
  onLaunchInvestigation?: () => void;
}

export const InvestigationPreviewSection: React.FC<InvestigationPreviewSectionProps> = ({
  onLaunchInvestigation,
}) => {
  return (
    <section id="preview" className="relative w-full py-20 sm:py-28 bg-[#ffffff] border-b border-[#dee2de]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 space-y-12 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#646464]">
            <Compass className="w-3.5 h-3.5 text-[#282834]" />
            <span>INTERFACE PREVIEW</span>
          </div>

          <h2
            style={{
              fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
            className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#2c2c2c]"
          >
            How evidence appears in the field.
          </h2>

          <p className="text-base text-[#444141] font-sans leading-relaxed">
            When you select a location, ZONALYZE opens a structured investigation record. Direct sensor observations, mapped infrastructure points, and AI interpretations are displayed in distinct, transparent layers.
          </p>
        </div>

        {/* Small Editorial Preview Card */}
        <div className="rounded-2xl border border-[#dee2de] bg-[#fefffc] shadow-[0_1px_12px_rgba(0,0,0,0.03)] overflow-hidden">
          
          {/* Card Top Utility Bar */}
          <div className="px-6 py-4 bg-[#f9faf7] border-b border-[#dee2de] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full border border-[#282834] bg-[#282834]" />
              <span className="font-mono text-xs text-[#2c2c2c] font-medium">
                SAMPLE RECORD: KOLKATA METROPOLITAN REGION
              </span>
              <span className="text-xs text-[#646464] font-mono">• 22.5726° N, 88.3639° E</span>
            </div>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#ffffff] border border-[#dee2de] text-xs font-mono text-[#646464]">
              <span>Illustrative interface preview</span>
            </div>
          </div>

          {/* Split Preview Grid: Map Illustration Crop + 3 Evidence Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#dee2de]">
            
            {/* Left: Map Crop / Cartographic Crop */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#ffffff]">
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-[#dee2de] bg-[#f9faf7]">
                <img
                  src="/observatory_sketch.jpg"
                  alt="Cartographic field sketch of research catchment area"
                  className="w-full h-full object-cover object-center filter contrast-[1.01]"
                />
                
                {/* Selected Point Reticle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full border border-[#282834]/40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-[#41a1cf]/60 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#171717]" />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#ffffff]/90 backdrop-blur-sm border border-[#dee2de] text-[11px] font-mono text-[#2c2c2c]">
                  POINT OF INQUIRY: BUFFER RADIUS 3,000M
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#646464] font-mono">
                <span>DATUM: WGS 84</span>
                <span>GEOJSON FORMAT: [88.3639, 22.5726]</span>
              </div>
            </div>

            {/* Right: Three Compact Evidence Rows */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#fefffc]">
              
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#646464] block">
                  LAYERED OBSERVATION RECORD
                </span>

                {/* Row 1: Air Observations */}
                <div className="p-4 rounded-xl bg-[#ffffff] border border-[#dee2de] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-medium text-[#171717]">
                      <Wind className="w-4 h-4 text-[#41a1cf]" />
                      <span>Air Observations</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#646464]">Open-Meteo API</span>
                  </div>
                  <p className="text-xs text-[#646464] leading-relaxed font-sans">
                    Observed PM2.5 (32 µg/m³) and PM10 (56 µg/m³). European AQI 82 (Moderate). Historical window tracks rolling 72-hour trajectory. Freshness subject to regional station availability.
                  </p>
                </div>

                {/* Row 2: Nearby Infrastructure */}
                <div className="p-4 rounded-xl bg-[#ffffff] border border-[#dee2de] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-medium text-[#171717]">
                      <Building2 className="w-4 h-4 text-[#282834]" />
                      <span>Nearby Infrastructure</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#646464]">OpenStreetMap</span>
                  </div>
                  <p className="text-xs text-[#646464] leading-relaxed font-sans">
                    Mapped civic nodes: 3 tertiary hospitals, 5 pharmacies, 1 major railway terminal, 6 bus transit stops within 3,000m. Registry completeness represents mapped features.
                  </p>
                </div>

                {/* Row 3: Interpretation */}
                <div className="p-4 rounded-xl bg-[#ffffff] border border-[#dee2de] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-medium text-[#171717]">
                      <Sparkles className="w-4 h-4 text-[#282834]" />
                      <span>Interpretation</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#41a1cf]">Evidence-Grounded AI</span>
                  </div>
                  <p className="text-xs text-[#646464] leading-relaxed font-sans">
                    "The area exhibits moderate particulate readings alongside high civic accessibility. Proximity to arterial transit correlates with elevated modeled acoustic exposure. No direct health judgment is inferred."
                  </p>
                </div>
              </div>

              {/* Bottom Action inside preview */}
              <div className="pt-4 border-t border-[#dee2de] flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-[#646464] font-sans">
                  Ready to test a real geographical coordinate?
                </span>

                <button
                  onClick={onLaunchInvestigation}
                  className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg text-sm font-medium text-[#171717] border border-[#41a1cf] hover:bg-[#41a1cf]/10 hover:text-[#0081c0] transition-colors cursor-pointer font-sans"
                >
                  <span>Open the Investigation Workspace</span>
                  <ArrowRight className="w-4 h-4 text-[#41a1cf]" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
