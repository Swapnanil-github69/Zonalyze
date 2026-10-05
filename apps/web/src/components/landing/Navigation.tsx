import React, { useState } from "react";
import { Menu, X, ArrowUpRight, Crosshair } from "lucide-react";

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
    { id: "about", label: "SYSTEM" },
    { id: "categories", label: "EVIDENCE" },
    { id: "how-it-works", label: "METHOD" },
    { id: "preview", label: "TELEMETRY" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#161b13]/90 backdrop-blur-sm border-b border-[#84907f]/30 px-6 sm:px-12 py-4">
      <div className="w-full flex items-center justify-between">
        
        {/* Brand Wordmark Stamp with Crosshair Symbol */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer select-none group flex items-center space-x-2.5 sm:space-x-3"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#e2ffcc] flex items-center justify-center text-[#e2ffcc] group-hover:scale-105 transition-transform duration-200">
            <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e2ffcc]" />
          </div>
          <span className="font-display-stout text-3xl sm:text-4xl text-[#e2ffcc] tracking-wider leading-none">
            ZONALYZE
          </span>
        </div>

        {/* Links: mono caps, clean and spaced */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-wider">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-[#84907f] hover:text-[#e2ffcc] transition-colors uppercase text-[11px] cursor-pointer font-medium tracking-widest"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Enhanced High-Impact Initiate Survey Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onStartInvestigation}
            className="group relative inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#e2ffcc] text-[#161b13] font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-[#d5fca8] hover:shadow-[0_0_20px_rgba(226,255,204,0.35)] active:scale-95 cursor-pointer border border-[#e2ffcc]"
          >
            <span>INITIATE SURVEY</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-[#e2ffcc] text-[#161b13] font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-[#d5fca8]"
            >
              <span>INITIATE SURVEY</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
