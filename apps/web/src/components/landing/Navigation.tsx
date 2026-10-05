import React, { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  onStartInvestigation: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onStartInvestigation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (id === "explore") {
      onStartInvestigation();
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { id: "about", label: "01 // SYSTEM" },
    { id: "categories", label: "02 // EVIDENCE" },
    { id: "how-it-works", label: "03 // METHOD" },
    { id: "preview", label: "04 // TELEMETRY" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#161b13]/90 backdrop-blur-sm border-b border-[#84907f]/30 px-6 sm:px-12 py-4">
      <div className="w-full flex items-center justify-between">
        
        {/* Brand Wordmark Stamp: F37stout condensed style at ~40px */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer select-none group flex items-baseline space-x-3"
        >
          <span className="font-display-stout text-3xl sm:text-4xl text-[#e2ffcc] tracking-wider leading-none">
            ZONALYZE
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-[#84907f]">
            [GEO.INTEL // 22.60°N]
          </span>
        </div>

        {/* Links: mono caps at 11px, -0.01em tracking */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-tight">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-[#84907f] hover:text-[#e2ffcc] transition-colors uppercase tracking-wider text-[11px] cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Outlined Nav Button: 1px solid #e2ffcc border, transparent fill, 0px radius */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onStartInvestigation}
            className="sr-btn-mint"
          >
            <span>[ INITIATE SURVEY ]</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-[#84907f]/40 md:hidden text-[#e2ffcc]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 bg-[#161b13] border border-[#84907f]/40 text-left space-y-4">
          <div className="flex flex-col space-y-3 font-mono text-xs">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left text-[#84907f] hover:text-[#e2ffcc] uppercase tracking-wider"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#84907f]/30">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartInvestigation();
              }}
              className="w-full sr-btn-mint justify-center"
            >
              <span>[ INITIATE SURVEY ]</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
