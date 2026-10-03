import React, { useState, useEffect } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

interface NavigationProps {
  onStartInvestigation: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onStartInvestigation }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setScrolled(scrollPos > 30);

      // Dynamically determine active section based on actual DOM element offsets
      const sections = [
        { id: "home", el: document.getElementById("home") },
        { id: "explore", el: document.getElementById("explore") },
        { id: "about", el: document.getElementById("about") },
        { id: "technology", el: document.getElementById("technology") },
      ];

      let current = "home";
      const scrollMarker = scrollPos + 180;
      for (const sec of sections) {
        if (sec.el && scrollMarker >= sec.el.offsetTop) {
          current = sec.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "explore", label: "Explore" },
    { id: "about", label: "About" },
    { id: "technology", label: "Technology" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(0,31,42,0.85)] backdrop-blur-md border-b border-white/10 py-4 shadow-lg"
          : "bg-transparent border-b border-transparent py-6"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* LEFT: Custom Geographic Logo & Brand Name */}
        <div
          onClick={() => scrollTo("home")}
          className="flex items-center space-x-3 cursor-pointer select-none group"
        >
          {/* Minimal Custom Geographic Logo: Coordinate Grid + Pin */}
          <div className="relative w-8 h-8 rounded-full border border-white/25 flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover:border-white/50 transition duration-200">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F8FAFC] fill-none stroke-current stroke-[1.6]">
              {/* Subtle coordinate crosshair */}
              <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="2 2" strokeOpacity="0.45" />
              <line x1="2" y1="12" x2="22" y2="12" strokeDasharray="2 2" strokeOpacity="0.45" />
              {/* Centered focal pinpoint */}
              <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
            </svg>
          </div>

          <span className="font-serif text-[30px] font-normal tracking-tight text-[#F8FAFC] leading-none">
            ZONALYZE
          </span>
        </div>

        {/* CENTER: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-10 text-[14px]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`group relative px-3 py-1.5 rounded-lg font-medium transition-all duration-250 ease-in-out cursor-pointer ${
                  isActive
                    ? "text-white bg-white/[0.06]"
                    : "text-white/75 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {/* Subtle delicate underline indicator */}
                <span
                  className={`absolute bottom-0.5 left-3 right-3 h-[1.5px] rounded-full transition-all duration-250 ease-in-out ${
                    isActive
                      ? "bg-white/90 opacity-100 scale-x-100"
                      : "bg-white/40 opacity-0 scale-x-50 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Pill-shaped Black CTA Button */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={onStartInvestigation}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-[13px] font-medium text-white bg-[#000000] hover:bg-[#111111] border border-white/20 shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>Investigate Location</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-[#F8FAFC] md:hidden hover:bg-white/10 transition"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#001F2A]/95 backdrop-blur-xl border-b border-white/10 px-8 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 text-left">
          <div className="flex flex-col space-y-2 text-[15px] font-medium">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-white bg-white/10 font-semibold"
                      : "text-white/75 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartInvestigation();
              }}
              className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-[14px] font-medium text-white bg-[#000000] border border-white/20 shadow-md"
            >
              <span>Investigate Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


