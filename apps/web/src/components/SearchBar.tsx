import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../utils/api";

export interface SearchResultItem {
  displayName: string;
  lat: number;
  lon: number;
  type?: string;
}

export interface SearchBarProps {
  onLocationSelect?: (lat: number, lon: number, displayName?: string) => void;
  onSearchCoordinates?: (lat: number, lon: number) => void;
  currentCoordinates?: [number, number];
  isLoading?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onLocationSelect,
  onSearchCoordinates,
  isLoading = false,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const COORD_REGEX =
    /^\s*[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)[,\s]+[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)\s*$/;

  const triggerAudit = (lat: number, lon: number, displayName?: string) => {
    if (onLocationSelect) {
      onLocationSelect(lat, lon, displayName);
    }
    if (onSearchCoordinates) {
      onSearchCoordinates(lat, lon);
    }
  };

  // 1. Debounced Autocomplete Fetch (300ms)
  useEffect(() => {
    const trimmed = query.trim();

    // Do not suggest if empty or if user is directly typing raw coordinates
    if (!trimmed || trimmed.length < 3 || COORD_REGEX.test(trimmed)) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/geocode/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.results)) {
          setSuggestions(data.results.slice(0, 5));
          setIsOpen(data.results.length > 0);
        } else {
          // Fallback to /api/geocode or OSM if needed
          const fallbackRes = await fetch(`${API_BASE_URL}/api/geocode?q=${encodeURIComponent(trimmed)}`);
          if (fallbackRes.ok) {
            const fbData = await fallbackRes.json();
            if (fbData.success && Array.isArray(fbData.results)) {
              setSuggestions(fbData.results.slice(0, 5));
              setIsOpen(fbData.results.length > 0);
              return;
            }
          }
          setSuggestions([]);
          setIsOpen(false);
        }
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 2. Click outside handler to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Selection handler
  const handleSelect = (item: SearchResultItem) => {
    setQuery(item.displayName.split(",")[0]); // Set readable name
    setIsOpen(false);
    setSuggestions([]);
    triggerAudit(item.lat, item.lon, item.displayName);
  };

  // 4. Form Submit (Enter key or button click)
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    setIsOpen(false);

    // Direct Coordinate check
    if (COORD_REGEX.test(clean)) {
      const parts = clean.split(/[\s,]+/).filter(Boolean);
      if (parts.length >= 2) {
        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lon)) {
          triggerAudit(lat, lon);
          return;
        }
      }
    }

    // If dropdown has matches, pick top match
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
      return;
    }

    // Fallback: immediate single fetch
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/geocode/search?q=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (data.success && data.results && data.results.length > 0) {
        handleSelect(data.results[0]);
      } else {
        const osmRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(clean)}&format=json&limit=1`
        );
        const osmData = await osmRes.json();
        if (osmData && osmData[0]) {
          triggerAudit(parseFloat(osmData[0].lat), parseFloat(osmData[0].lon), clean);
        }
      }
    } catch (err) {
      console.error("Direct search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-72 sm:w-80 md:w-96 z-50 ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsOpen(false);
            }}
            placeholder="Search address, landmark, or coordinates..."
            className="w-full pl-9 pr-8 py-2 bg-slate-900/90 text-xs sm:text-sm text-slate-100 placeholder-slate-400 border border-slate-700/60 rounded-xl focus:outline-none focus:border-cyan-500/80 shadow-md backdrop-blur transition-all"
            disabled={isLoading}
          />
          <span className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>

          {loading && (
            <span className="absolute right-3 top-2.5 w-3.5 h-3.5 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin"></span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || isLoading}
          className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition shadow-md flex items-center justify-center min-w-[40px] cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>

      {/* 5. Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md z-50 divide-y divide-slate-800/60 max-h-72 overflow-y-auto custom-scrollbar">
          {suggestions.map((item, idx) => {
            const parts = item.displayName.split(",");
            const primaryTitle = parts[0]?.trim();
            const secondaryTitle = parts.slice(1).join(",").trim();

            return (
              <li
                key={`${item.lat}_${item.lon}_${idx}`}
                onClick={() => handleSelect(item)}
                className="px-4 py-2.5 hover:bg-slate-800/80 cursor-pointer transition-colors flex items-start gap-3 text-left group"
              >
                <span className="text-cyan-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
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
  );
};

export default SearchBar;
