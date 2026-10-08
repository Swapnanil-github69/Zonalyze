import React, { useState } from "react";
import {
  HeartPulse,
  Trees,
  Pill,
  Star,
  ExternalLink,
  Navigation,
} from "lucide-react";
import { InfrastructureData, FacilitiesData } from "../../types/investigation";
import { buildDetailedFacilities } from "../../utils/livabilityMetrics";
import { FacilitiesGrid, RouteTarget } from "../FacilitiesGrid";

export type SelectedFacility = RouteTarget;

interface InfrastructureCardProps {
  infrastructure: InfrastructureData;
  coordinates: [number, number]; // [lon, lat]
  address: string;
  facilities?: FacilitiesData;
  selectedFacility?: SelectedFacility | null;
  onSelectFacility?: (facility: SelectedFacility) => void;
}

export const InfrastructureCard: React.FC<InfrastructureCardProps> = ({
  infrastructure,
  coordinates,
  address,
  facilities,
  selectedFacility,
  onSelectFacility,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "transit" | "essentials" | "hotels">("all");

  const detailed =
    infrastructure.detailed || buildDetailedFacilities(infrastructure, coordinates, address, facilities);

  const formatDistance = (meters: number | null): string => {
    if (meters === null) return "None detected";
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${meters}m`;
  };

  const isSelected = (name?: string | null) => {
    return selectedFacility && name && selectedFacility.name.toLowerCase() === name.toLowerCase();
  };

  const handleCardClick = (
    targetOrName: RouteTarget | string | null | undefined,
    coords?: [number, number] | undefined,
    dist?: number | null,
    type?: string
  ) => {
    if (!onSelectFacility) return;

    if (typeof targetOrName === "object" && targetOrName !== null) {
      const target = targetOrName as RouteTarget;
      if (!target.coordinates) return;
      onSelectFacility({
        name: target.name || "Selected Facility",
        type: target.type || "facility",
        coordinates: target.coordinates,
        distanceMeters: target.distanceMeters ?? target.distance_m ?? null,
        distance_m: target.distanceMeters ?? target.distance_m ?? null,
      });
      return;
    }

    if (!coords) return;
    onSelectFacility({
      name: (targetOrName as string) || "Selected Facility",
      type: type || "facility",
      coordinates: coords,
      distanceMeters: dist ?? null,
      distance_m: dist ?? null,
    });
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-[15px] font-semibold text-slate-200 tracking-[-0.01em]" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
            Nearest Facilities & Proximity Grid
          </h3>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
            <Navigation className="w-2.5 h-2.5" />
            Click card to route
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 hidden sm:inline">
            3,000m Envelope
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-1 rounded-lg transition font-medium ${activeTab === "all" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("transit")}
          className={`flex-1 py-1 rounded-lg transition font-medium ${activeTab === "transit" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
        >
          Transit
        </button>
        <button
          onClick={() => setActiveTab("essentials")}
          className={`flex-1 py-1 rounded-lg transition font-medium ${activeTab === "essentials" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
        >
          Essentials
        </button>
        <button
          onClick={() => setActiveTab("hotels")}
          className={`flex-1 py-1 rounded-lg transition font-medium ${activeTab === "hotels" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
        >
          Hotels
        </button>
      </div>

      {/* 1. Transit Category Grid */}
      {(activeTab === "all" || activeTab === "transit") && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300 tracking-[-0.01em] flex items-center justify-between" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
            <span>Transit & Mobility Corridor</span>
            <span className="text-[10px] text-cyan-400 font-mono font-normal">Closest Access</span>
          </div>

          <FacilitiesGrid
            detailed={detailed}
            selectedFacilityName={selectedFacility?.name}
            onSelectFacility={handleCardClick}
            setSelectedRouteTarget={onSelectFacility}
          />
        </div>
      )}

      {/* 2. Essentials Category Grid */}
      {(activeTab === "all" || activeTab === "essentials") && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300 tracking-[-0.01em] flex items-center justify-between" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
            <span>Health & Urban Essentials</span>
            <span className="text-[10px] text-emerald-400 font-mono font-normal">Density & Access</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Hospitals */}
            <div
              onClick={() =>
                handleCardClick(
                  detailed.essentials.hospitals.name || "Hospital",
                  detailed.essentials.hospitals.coordinates,
                  detailed.essentials.hospitals.nearest_dist_m,
                  "hospital"
                )
              }
              className={`p-2.5 rounded-xl border text-center flex flex-col justify-between cursor-pointer transition-all duration-200 group active:scale-[0.98] ${isSelected(detailed.essentials.hospitals.name || "Hospital")
                  ? "bg-rose-950/40 border-rose-400 ring-1 ring-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                  : "bg-slate-900/80 border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/80"
                }`}
            >
              <div>
                <HeartPulse className="w-4 h-4 text-rose-400 mx-auto mb-1 group-hover:scale-110 transition" />
                <div className="text-base font-bold text-white font-mono">
                  {detailed.essentials.hospitals.count}
                </div>
                <div className="text-[10px] text-slate-400">
                  {detailed.essentials.hospitals.count > 0 ? "Hospitals / Clinics" : "No clinics in 1.2km"}
                </div>
              </div>
              <div className="mt-1">
                <div className="text-[10px] text-rose-400 font-mono font-semibold">
                  {formatDistance(detailed.essentials.hospitals.nearest_dist_m)}
                </div>
                {detailed.essentials.hospitals.name && (
                  <div
                    className="text-[9px] text-rose-300 font-medium truncate mt-0.5 px-1 py-0.5 bg-rose-500/10 rounded border border-rose-500/20"
                    title={detailed.essentials.hospitals.name}
                  >
                    {detailed.essentials.hospitals.name}
                  </div>
                )}
              </div>
            </div>

            {/* Convenience Stores / Pharmacies */}
            <div
              onClick={() =>
                handleCardClick(
                  detailed.essentials.convenienceStores.name || "Pharmacy & Store",
                  detailed.essentials.convenienceStores.coordinates,
                  detailed.essentials.convenienceStores.nearest_dist_m,
                  "store"
                )
              }
              className={`p-2.5 rounded-xl border text-center flex flex-col justify-between cursor-pointer transition-all duration-200 group active:scale-[0.98] ${isSelected(detailed.essentials.convenienceStores.name || "Pharmacy & Store")
                  ? "bg-amber-950/40 border-amber-400 ring-1 ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "bg-slate-900/80 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80"
                }`}
            >
              <div>
                <Pill className="w-4 h-4 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition" />
                <div className="text-base font-bold text-white font-mono">
                  {detailed.essentials.convenienceStores.count}
                </div>
                <div className="text-[10px] text-slate-400">Stores / Pharm</div>
              </div>
              <div className="mt-1">
                <div className="text-[10px] text-amber-400 font-mono font-semibold">
                  {formatDistance(detailed.essentials.convenienceStores.nearest_dist_m)}
                </div>
              </div>
            </div>

            {/* Parks */}
            <div
              onClick={() =>
                handleCardClick(
                  detailed.essentials.parks.name || "Park / Green Space",
                  detailed.essentials.parks.coordinates,
                  detailed.essentials.parks.nearest_dist_m,
                  "park"
                )
              }
              className={`p-2.5 rounded-xl border text-center flex flex-col justify-between cursor-pointer transition-all duration-200 group active:scale-[0.98] ${isSelected(detailed.essentials.parks.name || "Park / Green Space")
                  ? "bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80"
                }`}
            >
              <div>
                <Trees className="w-4 h-4 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition" />
                <div className="text-base font-bold text-white font-mono">
                  {detailed.essentials.parks.count}
                </div>
                <div className="text-[10px] text-slate-400">Parks & Green</div>
              </div>
              <div className="mt-1">
                <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                  {formatDistance(detailed.essentials.parks.nearest_dist_m)}
                </div>
              </div>
            </div>
          </div>

          {/* Detected Healthcare Facilities Breakdown */}
          {detailed.essentials.hospitals.nearby && detailed.essentials.hospitals.nearby.length > 0 && (
            <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5 mt-2">
              <div className="text-xs font-semibold text-slate-300 tracking-[-0.01em] flex items-center justify-between" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                <span>Identified Medical Centers</span>
                <span className="text-rose-400 font-mono text-[9px] font-normal">
                  {detailed.essentials.hospitals.nearby.length} nearest mapped • Click to route
                </span>
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {detailed.essentials.hospitals.nearby.slice(0, 5).map((h, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      handleCardClick(h.name, h.coordinates, h.distance, "hospital")
                    }
                    className={`flex items-center justify-between text-xs py-1.5 px-2 rounded-lg cursor-pointer transition border ${isSelected(h.name)
                        ? "bg-rose-950/50 border-rose-400/80 text-rose-200"
                        : "border-transparent hover:bg-slate-800/80 text-slate-200"
                      }`}
                  >
                    <span className="truncate pr-2 font-medium" title={h.name}>
                      {h.name}
                    </span>
                    <div className="flex items-center space-x-1 shrink-0">
                      <span className="text-rose-300 font-mono text-[10px] font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">
                        {formatDistance(h.distance)}
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.name} ${h.coordinates ? `${h.coordinates[1]},${h.coordinates[0]}` : ''}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-cyan-400 hover:text-cyan-300 p-1 hover:bg-cyan-500/20 rounded transition"
                        title={`View reviews for ${h.name} on Google Maps`}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Hotels Section */}
      {(activeTab === "all" || activeTab === "hotels") && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300 tracking-[-0.01em] flex items-center justify-between" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
            <span>Nearby Accommodations</span>
            <span className="text-[10px] text-amber-400 font-mono font-normal">Click to Trace Route</span>
          </div>

          {detailed.hotels.length === 0 ? (
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 font-mono">
              No hospitality venues detected within 3,000m envelope.
            </div>
          ) : (
            <div className="space-y-1.5">
              {detailed.hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  onClick={() =>
                    handleCardClick(hotel.name, hotel.coordinates, hotel.distance_m, "hotel")
                  }
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer group active:scale-[0.99] ${isSelected(hotel.name)
                      ? "bg-amber-950/40 border-amber-400 ring-1 ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                      : "bg-slate-900/80 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80"
                    }`}
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition truncate max-w-[180px] sm:max-w-xs">
                        {hotel.name}
                      </span>
                      {hotel.stars !== null && hotel.stars !== undefined && hotel.stars > 0 && (
                        <span className="inline-flex items-center text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
                          {Number(hotel.stars).toFixed(1)}
                        </span>
                      )}
                      {hotel.type && (
                        <span className="text-[9px] font-mono capitalize px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {hotel.type.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {formatDistance(hotel.distance_m)} away from pinpoint
                    </div>
                  </div>

                  <a
                    href={hotel.reviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center space-x-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition shrink-0 ml-2"
                    title={`View reviews for ${hotel.name} on Google Maps`}
                  >
                    <span>Reviews</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
