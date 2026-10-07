import React, { useState, useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, Search, MapPin, Radio, ShieldCheck } from "lucide-react";
import { useLandingTheme } from "../../context/LandingThemeContext";

interface HeroSectionProps {
  onStartInvestigation?: (lat?: number, lon?: number) => void;
}

const COORD_REGEX =
  /^\s*[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)[,\s]+[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)\s*$/;

export function parseCoordinates(input: string): { lat: number; lon: number } | null {
  if (!input) return null;
  const clean = input.replace(/[°NSEWnsew]/g, "").trim();
  const parts = clean.split(/[\s,]+/).filter(Boolean);
  if (parts.length >= 2) {
    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      return { lat, lon };
    }
  }
  return null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartInvestigation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ displayName: string; lat: number; lon: number }[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useLandingTheme();
  const isLiterary = theme === "literary";

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navigateToMap = (lat: number, lon: number) => {
    window.location.hash = `investigate?lat=${lat}&lon=${lon}`;
    if (onStartInvestigation) {
      onStartInvestigation(lat, lon);
    }
  };

  const handleAudit = async (targetQuery?: string) => {
    const query = (targetQuery || searchQuery).trim();
    if (!query) {
      if (onStartInvestigation) onStartInvestigation();
      return;
    }

    // 1. Direct coordinate format match
    const coords = parseCoordinates(query);
    if (coords) {
      navigateToMap(coords.lat, coords.lon);
      return;
    }

    // 2. Text Place Name Geocoding
    setLoading(true);
    try {
      // First try backend forward geocode endpoint
      const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.results) && data.results.length > 0) {
          const top = data.results[0];
          navigateToMap(top.lat, top.lon);
          return;
        }
      }

      // Try fallback backend /api/geocode endpoint
      const res2 = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2.success && Array.isArray(data2.results) && data2.results.length > 0) {
          const top2 = data2.results[0];
          navigateToMap(top2.lat, top2.lon);
          return;
        }
      }

      // Direct OSM fallback if backend route is unavailable
      const osmRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      if (osmRes.ok) {
        const osmData = await osmRes.json();
        if (osmData && osmData[0]) {
          navigateToMap(parseFloat(osmData[0].lat), parseFloat(osmData[0].lon));
          return;
        }
      }

      alert(`Location "${query}" not found. Please try specifying a city (e.g. "${query}, Kolkata").`);
    } catch (err) {
      console.error("Geocode redirect failed:", err);
      // Secondary fallback
      try {
        const osmRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
        );
        const osmData = await osmRes.json();
        if (osmData && osmData[0]) {
          navigateToMap(parseFloat(osmData[0].lat), parseFloat(osmData[0].lon));
          return;
        }
      } catch (osmErr) {
        console.error("OSM fallback failed:", osmErr);
      }
      alert("Failed to resolve location. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Click outside to dismiss suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Debounced Autocomplete Fetch (300ms)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 3 || COORD_REGEX.test(trimmed)) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.results)) {
            setSuggestions(data.results.slice(0, 5));
            setIsDropdownOpen(data.results.length > 0);
            return;
          }
        }
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSuggestion = (item: { displayName: string; lat: number; lon: number }) => {
    setSearchQuery(item.displayName.split(",")[0]);
    setIsDropdownOpen(false);
    setSuggestions([]);
    navigateToMap(item.lat, item.lon);
  };

  const handleQuickAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    handleAudit();
  };

  const presetCoordinates = [
    { label: "Tiretta, Kolkata", query: "22.57617, 88.35801" },
    { label: "Lake Town, Bangur", query: "22.60995, 88.41794" },
    { label: "Connaught Place, Delhi", query: "28.6315, 77.2167" },
  ];

  const trustSources = [
    "OPEN-METEO WMO ARRAYS",
    "OPENSTREETMAP SPATIAL REGISTRY",
    "WHO 2021 AIR QUALITY GUIDELINE",
    "NASA SRTM ELEVATION MODEL",
    "OVERPASS IN-SITU RETRIEVAL",
  ];

  return (
    <section
      id="hero"
      className={`relative w-full min-h-[90vh] pt-28 sm:pt-32 pb-16 overflow-hidden flex flex-col justify-between transition-colors duration-500 ${
        isLiterary
          ? "bg-[#fefffc] border-b border-[#dee2de] text-[#444141]"
          : "bg-[#161b13] border-b border-[#84907f]/30 text-[#dde2e4]"
      }`}
    >
      {/* Background Lighting Layers */}
      {isLiterary ? (
        <>
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[650px] h-[650px] bg-[#41a1cf]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-[#dee2de]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 topographic-grid-dark opacity-15 pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-[#e2ffcc]/5 rounded-full liquid-caustic-blob pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[600px] h-[500px] bg-[#84907f]/8 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-6s" }} />
          <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-emerald-500/5 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-12s" }} />
          <div className="absolute inset-0 topographic-grid opacity-40 pointer-events-none" />
        </>
      )}

      {/* Main Hero Container */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-8 sm:py-10 space-y-8">
        
        {/* Headline & Mission Lead */}
        <div className="space-y-4 text-left max-w-4xl">
          <h1 className={`font-editorial-serif font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[62px] tracking-[-0.035em] leading-[1.08] ${
            isLiterary ? "text-[#2c2c2c]" : "text-[#e2ffcc]"
          }`}>
            Geospatial evidence. <br />
            Grounded telemetry.
          </h1>

          <p
            className={`text-xs sm:text-[15px] leading-relaxed max-w-2xl font-editorial-sans font-normal ${
              isLiterary ? "text-[#444141]" : "text-[#dde2e4]"
            }`}
          >
            Zonalyze reads the ground truth beneath municipal coordinates. Atmospheric particulate measurements, acoustic transit corridor decay, and open infrastructure layers synthesized into an unembellished environmental field dossier.
          </p>

          {/* 1. Interactive Quick-Audit Coordinate Input Bar */}
          <div ref={searchContainerRef} className="pt-2 max-w-3xl space-y-3 relative z-30">
            <form onSubmit={handleQuickAudit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1 flex items-center">
                <Search
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 pointer-events-none ${
                    isLiterary ? "text-[#8a7f77]" : "text-[#e2ffcc]"
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setIsDropdownOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setIsDropdownOpen(false);
                  }}
                  placeholder="Enter coordinates or locality (e.g. 22.57617, 88.35801)..."
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 text-xs sm:text-sm transition-all font-editorial-sans ${
                    isLiterary
                      ? "rounded-[11px] border border-[#d8cfc7] bg-[#fbf9f6] text-[#2c2c2c] placeholder-[#8a7f77] focus:outline-none focus:border-[#b87c67] focus:bg-[#ffffff] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                      : "glass-input text-[#dde2e4] placeholder-[#84907f] focus:outline-none focus:border-[#e2ffcc] rounded-lg border border-[#84907f]/40"
                  }`}
                />

                {/* Autocomplete Dropdown List */}
                {isDropdownOpen && suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full mt-2 bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 divide-y divide-slate-800/60 max-h-72 overflow-y-auto custom-scrollbar">
                    {suggestions.map((item, idx) => {
                      const parts = item.displayName.split(",");
                      const primaryTitle = parts[0]?.trim();
                      const secondaryTitle = parts.slice(1).join(",").trim();

                      return (
                        <li
                          key={`${item.lat}_${item.lon}_${idx}`}
                          onClick={() => handleSelectSuggestion(item)}
                          className="px-4 py-2.5 hover:bg-slate-800/80 cursor-pointer transition-colors flex items-start gap-3 text-left group"
                        >
                          <span className="text-cyan-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                          </span>
                          <div className="overflow-hidden min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                              {primaryTitle}
                            </p>
                            {secondaryTitle && (
                              <p className="text-xs text-slate-400 truncate">{secondaryTitle}</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {isLiterary ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center justify-center gap-2 py-3 px-5 sm:px-6 rounded-[11px] border border-[#b87c67] bg-[#fdfbf9] text-[#8a4f38] font-editorial-sans font-medium text-xs sm:text-[13px] tracking-normal shrink-0 transition-all duration-200 hover:bg-[#faeee7] hover:border-[#7c442f] hover:text-[#5c2a1a] active:scale-[0.99] cursor-pointer shadow-[0_1px_2px_rgba(138,79,56,0.05)] disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-[#8a4f38]/30 border-t-[#8a4f38] rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Initiate Audit</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#8a4f38] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#5c2a1a] shrink-0" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center justify-center px-6 py-3.5 bg-[#e2ffcc] text-[#161b13] font-editorial-sans font-medium text-xs sm:text-sm tracking-normal transition-all duration-200 hover:bg-[#d5fca8] hover:shadow-[0_0_25px_rgba(226,255,204,0.4)] active:scale-95 cursor-pointer border border-[#e2ffcc] shrink-0 rounded-lg disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-[#161b13]/30 border-t-[#161b13] rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Initiate Audit</span>
                      <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              )}
            </form>

            {/* Quick Coordinate Chips */}
            <div className={`flex flex-wrap items-center gap-2 text-[11px] font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[#84907f]"}`}>
              <span className={`font-medium ${isLiterary ? "text-[#444141]" : "text-[#dde2e4]"}`}>
                Preset observations:
              </span>
              {presetCoordinates.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAudit(chip.query)}
                  disabled={loading}
                  className={`px-3 py-1 transition-all cursor-pointer font-editorial-sans text-xs disabled:opacity-50 ${
                    isLiterary
                      ? "gic-card bg-[#ffffff] border border-[#dee2de] hover:border-[#b87c67] text-[#444141] hover:text-[#8a4f38] rounded-md shadow-none"
                      : "border border-[#84907f]/30 bg-[#2d3329]/40 backdrop-blur-md hover:border-[#e2ffcc] hover:text-[#e2ffcc] hover:bg-[#e2ffcc]/10 text-[#dde2e4] rounded-md"
                  }`}
                >
                  <MapPin className={`w-3 h-3 inline mr-1.5 ${isLiterary ? "text-[#9c583e]" : "text-[#e2ffcc]"}`} />
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. High-Fidelity Workstation OS Window Console Frame */}
        <div className="w-full pt-2">
          <div
            className={`relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 ${
              isLiterary
                ? "gic-card bg-[#ffffff] border border-[#dee2de] shadow-[0_12px_45px_-10px_rgba(40,40,52,0.08)]"
                : "glass-panel border border-[#e2ffcc]/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(226,255,204,0.25)]"
            }`}
          >
            {/* Geodetic Corner Crosshair Ticks (Dark Mode) */}
            {!isLiterary && (
              <>
                <span className="absolute top-1.5 left-2 text-[10px] font-mono text-[#84907f]/60 select-none pointer-events-none z-10">+</span>
                <span className="absolute top-1.5 right-2 text-[10px] font-mono text-[#84907f]/60 select-none pointer-events-none z-10">+</span>
                <span className="absolute bottom-1.5 left-2 text-[10px] font-mono text-[#84907f]/60 select-none pointer-events-none z-10">+</span>
                <span className="absolute bottom-1.5 right-2 text-[10px] font-mono text-[#84907f]/60 select-none pointer-events-none z-10">+</span>
              </>
            )}

            {/* Workstation Window Chrome Bar */}
            <div
              className={`px-4 sm:px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-editorial-sans ${
                isLiterary
                  ? "border-[#dee2de] bg-[#f9faf7] text-[#444141]"
                  : "border-[#84907f]/30 bg-[#161b13]/70 backdrop-blur-md text-[11px]"
              }`}
            >
              {/* Window Controls & Live Stream Badge */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${isLiterary ? "bg-[#dee2de]" : "bg-[#e2ffcc]"}`} />
                  <div className={`w-2.5 h-2.5 rounded-full ${isLiterary ? "bg-[#b4b8b4]" : "bg-[#84907f]"}`} />
                  <div className={`w-2.5 h-2.5 rounded-full ${isLiterary ? "bg-[#646464]" : "bg-[#2d3329] border border-[#84907f]/40"}`} />
                </div>
                <div className={`h-3 w-px ${isLiterary ? "bg-[#dee2de]" : "bg-[#84907f]/40"}`} />
                <div className={`flex items-center space-x-1.5 text-[11px] font-medium tracking-wide ${isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc]"}`}>
                  <span className={`w-2 h-2 rounded-full inline-block animate-pulse ${isLiterary ? "bg-[#41a1cf]" : "bg-[#e2ffcc]"}`} />
                  <span>{isLiterary ? "Live telemetry channel" : "Live sensory stream"}</span>
                </div>
              </div>

              {/* Terminal Address Capsule */}
              <div
                className={`hidden md:flex items-center space-x-2 px-3 py-1 text-[11px] font-editorial-sans ${
                  isLiterary
                    ? "border border-[#dee2de] bg-[#ffffff] rounded-full text-[#646464]"
                    : "border border-[#84907f]/30 bg-[#2d3329]/60 backdrop-blur-sm text-[#84907f] rounded-full"
                }`}
              >
                <Radio className={`w-3 h-3 ${isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc]"}`} />
                <span>zonalyze.gis/telemetry?lat=22.57617&lon=88.35801&datum=WGS84</span>
              </div>

              {/* Location Tag */}
              <span className={`text-[11px] font-editorial-sans ${isLiterary ? "text-[#2c2c2c] font-medium" : "text-[#dde2e4]"}`}>
                Tiretta Bazaar, Central Kolkata
              </span>
            </div>

            {/* Field Image Canvas */}
            <div
              className={`relative w-full overflow-hidden transition-colors duration-500 ${
                isLiterary ? "bg-[#fcfaf7]" : "bg-[#0c1a1f]"
              }`}
              style={{ aspectRatio: "1376 / 768" }}
            >
              <img
                src={isLiterary ? "/zonalyze_literary_paper_console.jpg" : "/zonalyze_tactical_dark_console.jpg"}
                alt="ZONALYZE live audit console"
                width={1376}
                height={768}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover block select-none pointer-events-none transition-opacity duration-300"
              />
            </div>

            {/* Bottom Telemetry Status Bar */}
            <div
              className={`px-5 py-3.5 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-editorial-sans ${
                isLiterary
                  ? "border-[#dee2de] bg-[#f9faf7] text-[#646464]"
                  : "border-[#84907f]/30 bg-[#161b13]/70 backdrop-blur-md text-[11px] text-[#84907f]"
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={isLiterary ? "text-[#2c2c2c] font-medium" : "text-[#dde2e4]"}>[CACHE HIT: 150M]</span>
                <span className={`font-semibold ${isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc]"}`}>AQI 101 (VERY POOR)</span>
                <span>PM2.5: 143 µg/m³</span>
                <span>TEMP: 26.9°C</span>
              </div>
              <span className={isLiterary ? "text-[#2c2c2c]" : "text-[#dde2e4]"}>
                {isLiterary ? "Zero fabricated estimates — field evidence only" : "Zero fabricated estimates — grounded evidence only"}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Verified Ground-Truth Data Source Trust Ticker */}
        <div
          className={`w-full py-3.5 px-5 flex flex-wrap items-center justify-between gap-3 text-xs tracking-wide font-editorial-sans ${
            isLiterary
              ? "gic-card bg-[#ffffff] border border-[#dee2de] text-[#646464] rounded-xl shadow-none"
              : "glass-card border border-[#84907f]/25 text-[11px] text-[#84907f]"
          }`}
        >
          <div className={`flex items-center space-x-2 font-medium ${isLiterary ? "text-[#2c2c2c]" : "text-[#e2ffcc]"}`}>
            <ShieldCheck className={`w-4 h-4 ${isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc]"}`} />
            <span>{isLiterary ? "Verified observation feeds:" : "Verified observation feeds:"}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {trustSources.map((source, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span>{source}</span>
                {index < trustSources.length - 1 && <span className={isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc]"}>◇</span>}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Scroll Cue Indicator */}
      <div className={`w-full max-w-7xl mx-auto px-6 sm:px-12 flex justify-end items-center text-xs font-editorial-sans ${isLiterary ? "text-[#646464]" : "text-[11px] text-[#84907f]"}`}>
        <button
          onClick={scrollToHowItWorks}
          className={`flex items-center space-x-2 transition-colors cursor-pointer ${
            isLiterary ? "hover:text-[#171717] text-[#444141]" : "hover:text-[#e2ffcc]"
          }`}
        >
          <span>{isLiterary ? "Methodology" : "METHODOLOGY"}</span>
          <ArrowDown className={`w-3.5 h-3.5 ${isLiterary ? "text-[#41a1cf]" : "text-[#e2ffcc]"}`} />
        </button>
      </div>

    </section>
  );
};

export const LandingHeroSearch: React.FC<{
  onNavigateToInvestigation?: (lat?: number, lon?: number) => void;
}> = ({ onNavigateToInvestigation }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateToMap = (lat: number, lon: number) => {
    window.location.hash = `investigate?lat=${lat}&lon=${lon}`;
    if (onNavigateToInvestigation) {
      onNavigateToInvestigation(lat, lon);
    }
  };

  const handleAudit = async (targetQuery?: string) => {
    const searchQuery = (targetQuery || query).trim();
    if (!searchQuery) return;

    if (COORD_REGEX.test(searchQuery)) {
      const parts = searchQuery.split(/[\s,]+/).filter(Boolean);
      if (parts.length >= 2) {
        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lon)) {
          navigateToMap(lat, lon);
          return;
        }
      }
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.results) && data.results.length > 0) {
          const top = data.results[0];
          navigateToMap(top.lat, top.lon);
          return;
        }
      }

      const osmRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
      );
      if (osmRes.ok) {
        const osmData = await osmRes.json();
        if (osmData && osmData[0]) {
          navigateToMap(parseFloat(osmData[0].lat), parseFloat(osmData[0].lon));
          return;
        }
      }

      alert(`Location "${searchQuery}" not found. Please try specifying a city (e.g. "${searchQuery}, Kolkata").`);
    } catch (err) {
      console.error("Geocode redirect failed:", err);
      alert("Failed to resolve location. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAudit();
    }
  };

  return (
    <div className="w-full max-w-2xl mt-8">
      {/* Search Input Box */}
      <div className="flex items-center gap-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-2 pl-4 shadow-2xl backdrop-blur-md focus-within:border-lime-500/50 transition">
        <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter coordinates or locality (e.g. 22.57617, 88.35801 or Park Street)..."
          className="bg-transparent w-full text-zinc-200 placeholder-zinc-500 text-sm focus:outline-none"
        />

        <button
          onClick={() => handleAudit()}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#d9f99d] hover:bg-[#bef264] text-zinc-950 font-semibold text-sm rounded-xl transition shadow-md shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-950 rounded-full animate-spin"></span>
          ) : (
            <>
              <span>Initiate Audit</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Preset Observation Buttons */}
      <div className="flex items-center gap-2 mt-4 text-xs text-zinc-400 flex-wrap">
        <span className="text-zinc-500">Preset observations:</span>
        <button
          type="button"
          onClick={() => handleAudit("Tiretta, Kolkata")}
          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-300 transition"
        >
          Tiretta, Kolkata
        </button>
        <button
          type="button"
          onClick={() => handleAudit("Lake Town, Bangur")}
          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-300 transition"
        >
          Lake Town, Bangur
        </button>
        <button
          type="button"
          onClick={() => handleAudit("Connaught Place, Delhi")}
          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-300 transition"
        >
          Connaught Place, Delhi
        </button>
      </div>
    </div>
  );
};
