import React, { useState } from "react";
import {
  Building2,
  Train,
  HeartPulse,
  Trees,
  Pill,
  Bus,
  Car,
  Plane,
  Star,
  ExternalLink,
  Hotel,
} from "lucide-react";
import { InfrastructureData } from "../../types/investigation";
import { buildDetailedFacilities } from "../../utils/livabilityMetrics";

interface InfrastructureCardProps {
  infrastructure: InfrastructureData;
  coordinates: [number, number]; // [lon, lat]
  address: string;
}

export const InfrastructureCard: React.FC<InfrastructureCardProps> = ({
  infrastructure,
  coordinates,
  address,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "transit" | "essentials" | "hotels">("all");

  const detailed =
    infrastructure.detailed || buildDetailedFacilities(infrastructure, coordinates, address);

  const formatDistance = (meters: number | null): string => {
    if (meters === null) return "None detected";
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${meters}m`;
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Nearest Facilities & Proximity Grid
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
          3,000m Radius Envelope
        </span>
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
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Transit & Mobility Corridor</span>
            <span className="text-[10px] text-cyan-400 font-mono">Closest Access</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* Metro */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Metro</span>
                <Train className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-white font-mono">
                  {formatDistance(detailed.transit.metro.nearest_dist_m)}
                </div>
                {detailed.transit.metro.name && (
                  <div
                    className="text-[10px] text-blue-300 font-medium truncate mt-0.5"
                    title={detailed.transit.metro.name}
                  >
                    {detailed.transit.metro.name}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {detailed.transit.metro.count} stations within radius
                </div>
              </div>
            </div>

            {/* Railway */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Rail Station</span>
                <Train className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-white font-mono">
                  {formatDistance(detailed.transit.rail.nearest_dist_m)}
                </div>
                {detailed.transit.rail.name && (
                  <div
                    className="text-[10px] text-sky-300 font-medium truncate mt-0.5"
                    title={detailed.transit.rail.name}
                  >
                    {detailed.transit.rail.name}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {detailed.transit.rail.count} line nodes
                </div>
              </div>
            </div>

            {/* Bus Stand */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Bus Stop</span>
                <Bus className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-white font-mono">
                  {formatDistance(detailed.transit.bus.nearest_dist_m)}
                </div>
                <div className="text-[10px] text-slate-400">
                  {detailed.transit.bus.count} active routes
                </div>
              </div>
            </div>

            {/* Auto / Toto Stand */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Auto / Toto Stand</span>
                <Car className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-white font-mono">
                  {formatDistance(detailed.transit.autoToto.nearest_dist_m)}
                </div>
                <div className="text-[10px] text-slate-400">
                  {detailed.transit.autoToto.count} feeder stands
                </div>
              </div>
            </div>

            {/* Airport */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Airport</span>
                <Plane className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-white font-mono">
                  {formatDistance(detailed.transit.airport.nearest_dist_m)}
                </div>
                <div className="text-[10px] text-slate-400">CCU International Terminal</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Essentials Category Grid */}
      {(activeTab === "all" || activeTab === "essentials") && (
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Health & Urban Essentials</span>
            <span className="text-[10px] text-emerald-400 font-mono">Density & Access</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Hospitals */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center flex flex-col justify-between">
              <div>
                <HeartPulse className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                <div className="text-base font-bold text-white font-mono">
                  {detailed.essentials.hospitals.count}
                </div>
                <div className="text-[10px] text-slate-400">Hospitals / Clinics</div>
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
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center flex flex-col justify-between">
              <div>
                <Pill className="w-4 h-4 text-amber-400 mx-auto mb-1" />
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
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center flex flex-col justify-between">
              <div>
                <Trees className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
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
          {infrastructure.nearby_hospitals && infrastructure.nearby_hospitals.length > 0 && (
            <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5 mt-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Identified Medical Centers</span>
                <span className="text-rose-400 font-mono text-[9px]">{infrastructure.nearby_hospitals.length} nearest mapped</span>
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {infrastructure.nearby_hospitals.slice(0, 5).map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40 last:border-0">
                    <span className="text-slate-200 truncate pr-2 font-medium" title={h.name}>
                      {h.name}
                    </span>
                    <span className="text-rose-300 font-mono text-[10px] shrink-0 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">
                      {formatDistance(h.distance)}
                    </span>
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
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center">
              <Hotel className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
              Nearby Accommodations
            </span>
            <span className="text-[10px] text-amber-400 font-mono">Verified Reviews</span>
          </div>

          <div className="space-y-1.5">
            {detailed.hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-200">{hotel.name}</span>
                    <span className="inline-flex items-center text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
                      {hotel.stars.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {formatDistance(hotel.distance_m)} away from pinpoint
                  </div>
                </div>

                <a
                  href={hotel.reviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-500/30 transition shrink-0 ml-2"
                >
                  <span>View Reviews on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
