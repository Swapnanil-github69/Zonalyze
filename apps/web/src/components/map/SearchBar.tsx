import React, { useState } from "react";
import { Search, Navigation, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearchCoordinates: (lat: number, lng: number) => void;
  isLoading: boolean;
}

/**
 * Contributor 3: Frontend Map Lead
 * SearchBar: Allows quick coordinate jumping or address resolution.
 */
export const SearchBar: React.FC<SearchBarProps> = ({ onSearchCoordinates, isLoading }) => {
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
    <div className="absolute top-6 left-6 z-30 w-11/12 max-w-md">
      <form
        onSubmit={handleSearch}
        className="glass-panel-elevated rounded-2xl shadow-xl p-2 flex items-center space-x-2 border border-slate-700/60"
      >
        <div className="pl-3 text-blue-400">
          <MapPin className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search coordinates 'lat, lon' or click map..."
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none px-2"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleLocateMe}
          title="Detect Current Location"
          className="p-2 hover:bg-slate-800/80 rounded-xl text-slate-300 hover:text-blue-400 transition"
        >
          <Navigation className="w-4 h-4" />
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition shadow-md disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
