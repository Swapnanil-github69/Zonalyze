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

      const sectionIds = ["home", "layers", "process", "workspace"];
      const sections = sectionIds.map((id) => ({
        id,
        el: document.getElementById(id),
      }));

      let current = "home";
      const scrollMarker = scrollPos + 240;
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
    { id: "layers", label: "Explore" },
    { id: "process", label: "About" },
    { id: "workspace", label: "Technology" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B1719]/92 backdrop-blur-xl border-b border-[rgba(190,210,202,0.13)] py-3.5 shadow-2xl text-[#F1F0E9]"
          : "bg-transparent border-b border-transparent py-6 text-white"
      }`}
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LEFT: Custom Geographic Logo & Refined Editorial Serif Wordmark */}
        <div
          onClick={() => scrollTo("home")}
          className="flex items-center space-x-3 cursor-pointer select-none group"
        >
          {/* Geographic Reticle Icon (Unchanged) */}
          <div
            className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition duration-300 ${
              scrolled
                ? "border-[rgba(190,210,202,0.18)] bg-[#102124] text-[#F1F0E9] group-hover:border-[#B6C6A3]/60"
                : "border-white/25 bg-white/5 backdrop-blur-sm group-hover:border-[#B6C6A3]/60 text-[#F1F0E9]"
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.6]">
              <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="2 2" strokeOpacity="0.45" />
              <line x1="2" y1="12" x2="22" y2="12" strokeDasharray="2 2" strokeOpacity="0.45" />
              <circle cx="12" cy="12" r="3" fill="#B6C6A3" />
            </svg>
          </div>

          {/* Refined Editorial Serif Wordmark */}
          <span className="font-serif text-[26px] sm:text-[28px] font-normal tracking-tight leading-none text-[#F1EFE8]">
            ZONALYZE
          </span>
        </div>

        {/* CENTER: Simplified 4-item Navigation (Home, Explore, About, Technology) */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-[13px] font-sans">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`group relative px-4 py-1.5 rounded-full font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-[#F1EFE8] bg-white/[0.08]"
                    : "text-[#899693] hover:text-[#F1EFE8] hover:bg-white/[0.04]"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                <span
                  className={`absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-[#F1EFE8] opacity-100 scale-x-100"
                      : "opacity-0 scale-x-50 group-hover:opacity-100 group-hover:scale-x-100 bg-[#536B70]"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Pill-shaped CTA Button in Warm Ivory #F1EFE8 with Deep Charcoal #111416 text */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onStartInvestigation}
            className="group inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-[13px] font-medium tracking-wide text-[#111416] bg-[#F1EFE8] hover:bg-[#FAF9F5] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Investigate Location</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition duration-200 text-[#111416]" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl md:hidden transition text-[#F1EFE8] hover:bg-white/10"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 py-5 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200 text-left border-b bg-[#0B1719]/98 text-[#F1F0E9] border-[rgba(190,210,202,0.13)] backdrop-blur-2xl">
          <div className="flex flex-col space-y-1 text-[14px] font-sans">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-[#F1EFE8] bg-white/[0.08] font-semibold"
                      : "text-[#899693] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[rgba(220,235,230,0.12)]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartInvestigation();
              }}
              className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-sm font-medium text-[#111416] bg-[#F1EFE8] hover:bg-[#FAF9F5] transition shadow-md font-sans"
            >
              <span>Investigate Location</span>
              <ArrowRight className="w-4 h-4 text-[#111416]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
