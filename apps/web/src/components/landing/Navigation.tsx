import React, { useState } from "react";
import { Menu, X, ArrowUpRight, Crosshair, Moon, BookOpen, Compass } from "lucide-react";
import { useLandingTheme } from "../../context/LandingThemeContext";

interface NavigationProps {
  onStartInvestigation: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onStartInvestigation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useLandingTheme();
  const isLiterary = theme === "literary";

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
    { id: "about", label: isLiterary ? "About" : "SYSTEM" },
    { id: "categories", label: isLiterary ? "Evidence" : "EVIDENCE" },
    { id: "how-it-works", label: isLiterary ? "Method" : "METHOD" },
    { id: "preview", label: isLiterary ? "Telemetry" : "TELEMETRY" },
  ];

  if (isLiterary) {
    // General Intelligence Company — Frosted Navigation Pill (Floating Top Center)
    return (
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="gic-nav-pill w-full max-w-4xl px-5 sm:px-6 py-2.5 flex items-center justify-between gap-4 pointer-events-auto shadow-[0_8px_30px_rgba(40,40,52,0.08)] border border-[#dee2de]">
          
          {/* Brand Wordmark with subtle compass glyph */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer select-none group flex items-center space-x-2.5"
          >
            <div className="w-7 h-7 rounded-full bg-[#f9faf7] border border-[#dee2de] flex items-center justify-center text-[#282834] group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-3.5 h-3.5 text-[#41a1cf]" />
            </div>
            <span className="font-editorial-serif text-xl sm:text-2xl text-[#2c2c2c] tracking-tight leading-none">
              Zonalyze
            </span>
          </div>

          {/* Links: af / Inter 15px weight 500 */}
          <nav className="hidden md:flex items-center space-x-7 text-[14px] font-editorial-sans font-medium">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-[#444141] hover:text-[#171717] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-[#dee2de] text-[#444141] hover:text-[#171717] hover:bg-[#f9faf7] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-editorial-sans px-2.5"
              title="Switch to Dark Telemetry Console"
            >
              <Moon className="w-3.5 h-3.5 text-[#282834]" />
              <span className="hidden sm:inline text-[11px] text-[#646464]">Dark Console</span>
            </button>

            {/* GIC Primary Outlined CTA Button */}
            <button
              onClick={onStartInvestigation}
              className="gic-btn-primary text-xs sm:text-sm py-1.5 px-3 sm:px-4"
            >
              <span>Initiate Survey</span>
              <div className="w-4 h-4 rounded-full border border-[#41a1cf] flex items-center justify-center text-[#41a1cf]">
                <ArrowUpRight className="w-2.5 h-2.5" />
              </div>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 border border-[#dee2de] rounded-lg md:hidden text-[#282834]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-4 right-4 gic-card p-5 text-left space-y-4 shadow-xl pointer-events-auto border border-[#dee2de]">
            <div className="flex flex-col space-y-3 font-editorial-sans text-sm">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-left text-[#444141] hover:text-[#171717] py-1"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#dee2de] flex items-center justify-between">
              <button
                onClick={toggleTheme}
                className="text-xs text-[#646464] flex items-center gap-1.5"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Switch to Dark Console</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartInvestigation();
                }}
                className="gic-btn-primary text-xs py-1.5 px-3"
              >
                <span>Initiate Survey</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </header>
    );
  }

  // Dark Telemetry Console Mode
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#161b13]/65 backdrop-blur-xl border-b border-[#e2ffcc]/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)] px-6 sm:px-12 py-4">
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

        {/* Action cluster with theme toggle */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Theme Switcher to Literary Journal */}
          <button
            onClick={toggleTheme}
            className="px-2.5 py-1.5 border border-[#84907f]/40 bg-[#2d3329]/40 hover:border-[#e2ffcc] hover:text-[#e2ffcc] transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-mono text-[#dde2e4]"
            title="Switch to Literary Journal Style"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#e2ffcc]" />
            <span className="hidden sm:inline uppercase tracking-wider text-[10px]">Literary Mode</span>
          </button>

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
        <div className="md:hidden mt-3 p-5 glass-panel border border-[#e2ffcc]/20 text-left space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-3 font-mono text-xs">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left text-[#84907f] hover:text-[#e2ffcc] uppercase tracking-wider py-1"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#84907f]/30 flex flex-col gap-2">
            <button
              onClick={toggleTheme}
              className="text-left text-xs font-mono text-[#e2ffcc] flex items-center gap-2 py-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>SWITCH TO LITERARY JOURNAL</span>
            </button>

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
