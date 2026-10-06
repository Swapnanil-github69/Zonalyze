import React, { useState } from "react";
import { Search, Navigation, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearchCoordinates: (lat: number, lng: number) => void;
  isLoading: boolean;
  className?: string;
}

/**
 * Contributor 3: Frontend Map Lead
 * SearchBar: Allows quick coordinate jumping or address resolution.
 */
export const SearchBar: React.FC<SearchBarProps> = ({ onSearchCoordinates, isLoading, className = "" }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if user input is "lat, lng" coordinates
    const coordParts = query.split(/[, ]+/).filter(Boolean);
    if (coordParts.length === 2) {
      const lat = parseFloat(coordParts[0]);
      const lng = parseFloat(coordParts[1]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        onSearchCoordinates(lat, lng);
        return;
      }
    }

    // Default predefined quick jump for testing if name is entered
    if (query.toLowerCase().includes("delhi")) {
      onSearchCoordinates(28.6139, 77.2090);
    } else if (query.toLowerCase().includes("mumbai")) {
      onSearchCoordinates(19.0760, 72.8777);
    } else if (query.toLowerCase().includes("bangalore") || query.toLowerCase().includes("bengaluru")) {
      onSearchCoordinates(12.9716, 77.5946);
    } else if (query.toLowerCase().includes("london")) {
      onSearchCoordinates(51.5074, -0.1278);
    } else if (query.toLowerCase().includes("new york")) {
      onSearchCoordinates(40.7128, -74.0060);
    } else {
      // Fallback coordinate parse
      alert("Please enter coordinates as: 'latitude, longitude' (e.g. 28.6139, 77.2090) or click anywhere on the map.");
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onSearchCoordinates(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        alert(`Location permission denied or unavailable: ${err.message}`);
      }
    );
  };

  return (
    <div className={`w-72 sm:w-80 md:w-96 ${className}`}>
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-950/75 p-1.5 shadow-[0_20px_45px_rgba(2,6,23,0.55)] backdrop-blur-md transition-all focus-within:border-cyan-500/60 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.25)]"
      >
        <div className="pl-2.5 text-cyan-400">
          <MapPin className="w-4 h-4 animate-pulse" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Coordinates 'lat, lon' or city..."
          className="flex-1 bg-transparent px-2 py-1.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none font-mono"
          disabled={isLoading}
        />
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
          disabled={isLoading}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
