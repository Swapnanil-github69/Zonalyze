import React from "react";
import { Compass } from "lucide-react";

export const CinematicFooter: React.FC = () => {
  const scrollTo = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#0B1316] text-[#94A3B8] py-14 sm:py-16 border-t border-[#1F353B] text-left font-sans">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 space-y-8">
        
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#1F353B]">
          {/* Brand */}
          <div
            onClick={() => scrollTo("top")}
            className="flex items-center space-x-2.5 cursor-pointer select-none group"
          >
            <div className="w-6 h-6 rounded-full border border-[#1F353B] bg-[#132226] flex items-center justify-center text-[#34D399] group-hover:border-[#34D399] transition-colors">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span
              style={{ fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif" }}
              className="text-xl sm:text-2xl font-normal tracking-tight text-white"
            >
              ZONALYZE
            </span>
          </div>

          {/* Links: About, Method, Explore */}
          <nav className="flex items-center space-x-6 text-sm text-[#94A3B8]">
            <button
              onClick={() => scrollTo("about")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Method
            </button>
            <button
              onClick={() => scrollTo("preview")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Explore
            </button>
          </nav>
        </div>

        {/* Bottom Footer Note & Dynamic Copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#64748B] font-sans">
          <p className="max-w-xl leading-relaxed">
            A field guide to environmental and civic context. Data availability, resolution, and freshness vary by source and location.
          </p>

          <div className="font-mono text-[11px] text-[#64748B] whitespace-nowrap">
            © {new Date().getFullYear()} ZONALYZE. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
