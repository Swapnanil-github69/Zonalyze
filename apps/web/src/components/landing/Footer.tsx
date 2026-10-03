import React from "react";

interface FooterProps {
  onStartInvestigation?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onStartInvestigation }) => {
  const scrollTo = (id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0B1D2A] text-[#F4F7F8] pt-20 pb-12 border-t border-white/[0.16] text-left relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start pb-16 border-b border-white/[0.12]">
          {/* BRAND AREA (5 cols) */}
          <div className="md:col-span-12 lg:col-span-5 space-y-4">
            <span className="font-serif text-[34px] font-normal tracking-tight text-white block leading-none">
              ZONALYZE
            </span>
            <p className="font-serif italic text-lg text-[#78D6E7]">
              See Beyond the Map.
            </p>
            <p className="text-sm text-[#A8C0CA] leading-relaxed max-w-sm font-sans">
              A geographic intelligence platform for exploring environmental conditions, nearby
              infrastructure, and spatial context.
            </p>
          </div>

          {/* COLUMN 1 — EXPLORE (2 cols) */}
          <div className="md:col-span-4 lg:col-span-2 space-y-4">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#78D6E7] font-semibold">
              Explore
            </div>
            <ul className="flex flex-col space-y-2.5 text-sm text-[#A8C0CA] font-sans">
              <li>
                <button onClick={() => scrollTo("explore")} className="hover:text-white transition cursor-pointer">
                  Explore Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("about")} className="hover:text-white transition cursor-pointer">
                  About ZONALYZE
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("technology")} className="hover:text-white transition cursor-pointer">
                  Technology
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 2 — INVESTIGATION (3 cols) */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#78D6E7] font-semibold">
              Investigation
            </div>
            <ul className="flex flex-col space-y-2.5 text-sm text-[#A8C0CA] font-sans">
              <li>
                <button
                  onClick={() => (onStartInvestigation ? onStartInvestigation() : scrollTo("home"))}
                  className="hover:text-white text-white font-medium transition cursor-pointer"
                >
                  Investigate Location →
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("how-it-works")} className="hover:text-white transition cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("evidence")} className="hover:text-white transition cursor-pointer">
                  Evidence & Transparency
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — RESOURCES (2 cols) */}
          <div className="md:col-span-4 lg:col-span-2 space-y-4">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#78D6E7] font-semibold">
              Resources
            </div>
            <ul className="flex flex-col space-y-2.5 text-sm text-[#A8C0CA] font-sans">
              <li>
                <button onClick={() => scrollTo("evidence")} className="hover:text-white transition cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => (onStartInvestigation ? onStartInvestigation() : scrollTo("home"))}
                  className="hover:text-white transition cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#91B9C5] gap-4 font-sans">
          <div>
            © 2026 ZONALYZE. All rights reserved.
          </div>
          <div>
            Civic & Location Intelligence Engine • Free Open Telemetry Architecture
          </div>
        </div>
      </div>
    </footer>
  );
};
