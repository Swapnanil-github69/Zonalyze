import React from "react";

export const CinematicFooter: React.FC = () => {
  const scrollTo = (id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#0B1719] text-[#F1F0E9] py-12 border-t border-[rgba(190,210,202,0.13)] text-left">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left: Brand Wordmark with Muted Sage Dot */}
          <div
            onClick={() => scrollTo("home")}
            className="flex items-center space-x-2.5 cursor-pointer select-none group"
          >
            <span className="w-2 h-2 rounded-full bg-[#B6C6A3] shadow-[0_0_8px_#B6C6A3]" />
            <span className="font-serif text-2xl font-normal tracking-tight text-[#F1F0E9]">
              ZONALYZE
            </span>
          </div>

          {/* Center/Right: Clean navigation links */}
          <nav className="flex items-center space-x-6 sm:space-x-8 text-xs font-sans text-[#829492]">
            <button
              onClick={() => scrollTo("home")}
              className="hover:text-[#F1F0E9] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo("layers")}
              className="hover:text-[#F1F0E9] transition-colors cursor-pointer"
            >
              Explore
            </button>
            <button
              onClick={() => scrollTo("process")}
              className="hover:text-[#F1F0E9] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollTo("workspace")}
              className="hover:text-[#F1F0E9] transition-colors cursor-pointer"
            >
              Technology
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};
