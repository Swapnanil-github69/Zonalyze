import React, { useState, useEffect } from "react";
import { ArrowRight, Menu, X, Compass } from "lucide-react";

interface NavigationProps {
  onStartInvestigation: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onStartInvestigation }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("about");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setScrolled(scrollPos > 20);

      const sectionIds = ["about", "categories", "how-it-works", "preview"];
      const sections = sectionIds.map((id) => ({
        id,
        el: document.getElementById(id),
      }));

      let current = "about";
      const scrollMarker = scrollPos + 200;
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
    { id: "about", label: "About" },
    { id: "categories", label: "What We Examine" },
    { id: "how-it-works", label: "Method" },
    { id: "preview", label: "Explore" },
  ];

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-[#ffffff]/95 backdrop-blur-md border border-[#dee2de] shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            : "bg-[#ffffff]/85 backdrop-blur-sm border border-[#dee2de] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        }`}
      >
        {/* Brand: ZONALYZE with small restrained location mark */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center space-x-2 cursor-pointer select-none group"
        >
          <div className="w-5 h-5 rounded-full border border-[#282834] flex items-center justify-center text-[#282834] group-hover:border-[#41a1cf] group-hover:text-[#41a1cf] transition-colors">
            <Compass className="w-3 h-3" />
          </div>
          <span
            style={{ fontFamily: "'Fraunces', 'Cormorant Garamond', 'Instrument Serif', Georgia, serif" }}
            className="text-lg sm:text-xl font-normal tracking-tight text-[#171717] group-hover:text-[#2c2c2c] transition-colors leading-none"
          >
            ZONALYZE
          </span>
        </div>

        {/* Links: About | What We Examine | Method | Explore */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-sans">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-3 py-1 rounded-full text-xs lg:text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "text-[#171717] bg-[#f9faf7]"
                    : "text-[#646464] hover:text-[#171717] hover:bg-[#f9faf7]"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Primary Action: Outlined Signal Blue Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onStartInvestigation}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#171717] border border-[#282834] hover:border-[#41a1cf] hover:text-[#0081c0] hover:bg-[#41a1cf]/5 transition-all duration-200 cursor-pointer font-sans"
          >
            <span>Investigate a Location</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full md:hidden text-[#444141] hover:text-[#171717] hover:bg-[#f9faf7]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-16 left-4 right-4 md:hidden p-4 rounded-2xl bg-[#ffffff]/98 backdrop-blur-xl border border-[#dee2de] shadow-lg text-left space-y-2 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-1 text-sm font-sans">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left px-3 py-2 rounded-lg text-[#444141] hover:text-[#171717] hover:bg-[#f9faf7] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#dee2de]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartInvestigation();
              }}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#171717] border border-[#41a1cf] hover:bg-[#41a1cf]/10 transition font-sans"
            >
              <span>Investigate a Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
