import React, { useState, useEffect, useRef } from "react";
import { Search, Navigation, MapPin, Loader2, X } from "lucide-react";
import { forwardGeocode, GeocodeResult } from "../../api/client";

interface SearchBarProps {
  onSearchCoordinates: (lat: number, lng: number) => void;
  isLoading: boolean;
  className?: string;
}

/**
 * Quick fallback coordinates for popular metropolitan centers
 */
const CITY_PRESETS: Record<string, [number, number]> = {
  delhi: [28.6139, 77.2090],
  mumbai: [19.0760, 72.8777],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  kolkata: [22.5726, 88.3639],
  calcutta: [22.5726, 88.3639],
  chennai: [13.0827, 80.2707],
  hyderabad: [17.3850, 78.4867],
  pune: [18.5204, 73.8567],
  london: [51.5074, -0.1278],
  "new york": [40.7128, -74.0060],
};

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchCoordinates,
  isLoading,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch live autocomplete suggestions as user types
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = query.trim();
    // Do not suggest if input is pure numbers or coordinates
    const isCoordinatePattern = /^[-+]?[0-9]*\.?[0-9]+([, ]+[-+]?[0-9]*\.?[0-9]+)?$/.test(trimmed);
    if (!trimmed || trimmed.length < 3 || isCoordinatePattern) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await forwardGeocode(trimmed);
        if (results.length > 0) {
          setSuggestions(results.slice(0, 5));
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch {
        setSuggestions([]);
      }
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  const selectLocation = (lat: number, lon: number, displayName?: string) => {
    setShowDropdown(false);
    setStatusMessage(null);
    if (displayName) {
      setQuery(displayName.split(",")[0]);
    }
    onSearchCoordinates(lat, lon);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isLoading || isGeocoding) return;

    setShowDropdown(false);
    setStatusMessage(null);

    // Invariant 1: Check if user input is "lat, lng" coordinates
    const coordParts = trimmed.split(/[, ]+/).filter(Boolean);
    if (coordParts.length === 2) {
      const lat = parseFloat(coordParts[0]);
      const lng = parseFloat(coordParts[1]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        onSearchCoordinates(lat, lng);
        return;
      }
    }

    // Automated Forward Geocoding via Nominatim
    setIsGeocoding(true);
    try {
      const results = await forwardGeocode(trimmed);
      if (results && results.length > 0) {
        const top = results[0];
        selectLocation(top.lat, top.lon, top.displayName);
        return;
      }

      // Check quick city presets as zero-network fallback
      const lower = trimmed.toLowerCase();
      const matchedPreset = Object.entries(CITY_PRESETS).find(([city]) => lower.includes(city));
      if (matchedPreset) {
        const [lat, lng] = matchedPreset[1];
        selectLocation(lat, lng, trimmed);
        return;
      }

      // Non-blocking status notification instead of alert()
      setStatusMessage("Location not found. Try coordinates (e.g. 22.5694, 88.3509) or click map.");
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      setStatusMessage("Geocoding service unavailable. Try coordinates or click map.");
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setStatusMessage("Geolocation is not supported by your browser.");
      setTimeout(() => setStatusMessage(null), 4000);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onSearchCoordinates(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setStatusMessage(`Location permission denied: ${err.message}`);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    );
  };

  const isBusy = isLoading || isGeocoding;

  return (
    <div ref={containerRef} className={`relative w-72 sm:w-80 md:w-96 ${className}`}>
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-950/75 p-1.5 shadow-[0_20px_45px_rgba(2,6,23,0.55)] backdrop-blur-md transition-all focus-within:border-cyan-500/60 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.25)]"
      >
        <div className="pl-2.5 text-cyan-400">
          {isBusy ? (
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          ) : (
            <MapPin className="w-4 h-4 animate-pulse" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Coordinates 'lat, lon' or city/place..."
          className="flex-1 bg-transparent px-2 py-1.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none font-mono"
          disabled={isLoading}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setShowDropdown(false);
              setStatusMessage(null);
            }}
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={handleLocateMe}
          title="Detect Current Location"
          className="rounded-xl border border-slate-700/70 bg-slate-900/80 p-2 text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-300 hover:scale-105 active:scale-95"
        >
          <Navigation className="w-3.5 h-3.5" />
        </button>
        <button
          type="submit"
          disabled={isBusy}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isBusy ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="py-1">
            {suggestions.map((item, idx) => {
              const parts = item.displayName.split(",");
              const mainName = parts[0]?.trim();
              const secondaryName = parts.slice(1, 3).join(",").trim();

              return (
                <button
                  key={`${item.lat}-${item.lon}-${idx}`}
                  type="button"
                  onClick={() => selectLocation(item.lat, item.lon, item.displayName)}
                  className="w-full flex items-start gap-2.5 px-3 py-2 text-left hover:bg-slate-800/70 transition group"
                >
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0 group-hover:scale-110 transition" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-slate-100 truncate group-hover:text-cyan-300 transition">
                      {mainName}
                    </div>
                    {secondaryName && (
                      <div className="text-[10px] text-slate-400 truncate">
                        {secondaryName}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Non-blocking feedback status toast */}
      {statusMessage && (
        <div className="absolute left-0 right-0 top-full mt-2 z-40 rounded-xl border border-amber-500/40 bg-slate-950/90 px-3 py-2 text-[11px] text-amber-300 shadow-xl backdrop-blur-md animate-in fade-in">
          {statusMessage}
        </div>
      )}
    </div>
  );
};
