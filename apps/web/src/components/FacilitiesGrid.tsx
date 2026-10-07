import React from "react";
import { Train, Bus, Plane, HeartPulse } from "lucide-react";
import { DetailedFacilities } from "../types/investigation";

import {
  NON_COMMERCIAL_AIRPORT_BLACKLIST,
  resolveClientNearestAirport,
} from "../data/indianAirports";

export interface RouteTarget {
  name: string;
  type: "metro" | "railway" | "bus" | "airport" | "hospital" | "store" | "park" | string;
  coordinates: [number, number]; // [lon, lat]
  distanceMeters?: number | null;
  distance_m?: number | null;
}

export interface FacilitiesGridProps {
  detailed: DetailedFacilities;
  selectedFacilityName?: string | null;
  onSelectFacility?: (
    facilityOrTarget: RouteTarget | string | null | undefined,
    coords?: [number, number] | undefined,
    dist?: number | null,
    type?: string
  ) => void;
  setSelectedRouteTarget?: (target: RouteTarget) => void;
  showHospital?: boolean;
}

export interface HospitalCardProps {
  hospital: DetailedFacilities["essentials"]["hospitals"];
  selectedFacilityName?: string | null;
  onSelectFacility?: (
    facilityOrTarget: RouteTarget | string | null | undefined,
    coords?: [number, number] | undefined,
    dist?: number | null,
    type?: string
  ) => void;
  setSelectedRouteTarget?: (target: RouteTarget) => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  selectedFacilityName,
  onSelectFacility,
  setSelectedRouteTarget,
}) => {
  const formatDistance = (meters: number | null | undefined): string => {
    if (meters === null || meters === undefined) return "None detected";
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)}m`;
  };

  const displayName =
    hospital?.name ||
    (hospital?.count && hospital.count > 0
      ? "Local Medical Facility"
      : "Closest Regional Hospital");
  const hasLocal = (hospital?.count || 0) > 0;

  const isSelected = (name?: string | null) => {
    return (
      selectedFacilityName &&
      name &&
      selectedFacilityName.toLowerCase() === name.toLowerCase()
    );
  };

  const handleCardClick = () => {
    if (!hospital?.coordinates) return;

    const target: RouteTarget = {
      name: displayName,
      type: "hospital",
      coordinates: hospital.coordinates,
      distanceMeters: hospital.nearest_dist_m ?? null,
      distance_m: hospital.nearest_dist_m ?? null,
    };

    if (setSelectedRouteTarget) {
      setSelectedRouteTarget(target);
    }
    if (onSelectFacility) {
      onSelectFacility(target, hospital.coordinates, hospital.nearest_dist_m ?? null, "hospital");
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`p-2.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-200 group active:scale-[0.98] ${
        isSelected(displayName)
          ? "bg-rose-950/50 border-rose-400 ring-1 ring-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
          : "bg-slate-900/80 border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/80"
      } ${hospital?.nearest_dist_m === null ? "opacity-70 cursor-default" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-300 font-medium group-hover:text-rose-300 transition">
          Hospitals
        </span>
        <HeartPulse className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition" />
      </div>
      <div className="mt-2">
        <div className="text-sm font-bold text-white font-mono">
          {formatDistance(hospital?.nearest_dist_m)}
        </div>
        {displayName && (
          <div
            className="text-[10px] text-rose-300 font-medium truncate mt-0.5"
            title={displayName}
          >
            {displayName}
          </div>
        )}
        <div className="text-[10px] text-slate-400 mt-0.5">
          {hasLocal
            ? `${hospital.count} medical center${hospital.count !== 1 ? "s" : ""} in corridor`
            : hospital?.nearest_dist_m !== null
            ? "Closest medical facility"
            : "No medical facility detected"}
        </div>
      </div>
    </div>
  );
};

export const FacilitiesGrid: React.FC<FacilitiesGridProps> = ({
  detailed,
  selectedFacilityName,
  onSelectFacility,
  setSelectedRouteTarget,
  showHospital = false,
}) => {
  const formatDistance = (meters: number | null | undefined): string => {
    if (meters === null || meters === undefined) return "None detected";
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)}m`;
  };

  const isSelected = (name?: string | null) => {
    return (
      selectedFacilityName &&
      name &&
      selectedFacilityName.toLowerCase() === name.toLowerCase()
    );
  };

  const handleSelectFacility = (
    type: RouteTarget["type"],
    facility: any,
    fallbackName?: string
  ) => {
    if (!facility || !facility.coordinates) return;

    const dist = facility.nearest_dist_m ?? facility.distanceMeters ?? null;
    const target: RouteTarget = {
      name: facility.name || fallbackName || `${type.toUpperCase()} Station`,
      type,
      coordinates: facility.coordinates,
      distanceMeters: dist,
      distance_m: dist,
    };

    // Pass complete, fresh target to map and state handlers
    if (setSelectedRouteTarget) {
      setSelectedRouteTarget(target);
    }
    if (onSelectFacility) {
      onSelectFacility(target, facility.coordinates, dist, type);
    }
  };

  const { metro, rail, bus } = detailed.transit;
  let airport = detailed.transit.airport;

  // Ultimate render-level safeguard: If airport is blacklisted (e.g. Behala), dynamically substitute
  if (
    airport.name &&
    NON_COMMERCIAL_AIRPORT_BLACKLIST.some((term) => airport.name!.toLowerCase().includes(term))
  ) {
    const coords = airport.coordinates || [88.3506, 22.5503]; // [lon, lat]
    const commercialAp = resolveClientNearestAirport(coords[1], coords[0]);
    if (commercialAp) {
      airport = {
        ...airport,
        name: commercialAp.name,
        nearest_dist_m: commercialAp.distanceMeters,
        coordinates: commercialAp.coordinates,
      };
    } else {
      airport = {
        ...airport,
        name: null,
        nearest_dist_m: null,
      };
    }
  }

  return (
    <div className={`grid ${showHospital ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-4"} gap-2`}>
      {/* Metro Card */}
      <div
        onClick={() =>
          handleSelectFacility(
            "metro",
            metro,
            "Metro Station"
          )
        }
        className={`p-2.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-200 group active:scale-[0.98] ${
          isSelected(metro.name || "Metro Station")
            ? "bg-cyan-950/50 border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80"
        } ${metro.nearest_dist_m === null ? "opacity-70 cursor-default" : ""}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300 font-medium group-hover:text-cyan-300 transition">
            Metro
          </span>
          <Train className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition" />
        </div>
        <div className="mt-2">
          <div className="text-sm font-bold text-white font-mono">
            {formatDistance(metro.nearest_dist_m)}
          </div>
          {metro.name && (
            <div
              className="text-[10px] text-blue-300 font-medium truncate mt-0.5"
              title={metro.name}
            >
              {metro.name}
            </div>
          )}
          <div className="text-[10px] text-slate-400 mt-0.5">
            {metro.nearest_dist_m !== null
              ? `${metro.count} station${metro.count !== 1 ? "s" : ""} within radius`
              : "No metro within 2,500m"}
          </div>
        </div>
      </div>

      {/* Heavy Railway Card */}
      <div
        onClick={() =>
          handleSelectFacility(
            "railway",
            rail,
            "Railway Station"
          )
        }
        className={`p-2.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-200 group active:scale-[0.98] ${
          isSelected(rail.name || "Railway Station")
            ? "bg-cyan-950/50 border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80"
        } ${rail.nearest_dist_m === null ? "opacity-70 cursor-default" : ""}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300 font-medium group-hover:text-sky-300 transition">
            Rail Station
          </span>
          <Train className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition" />
        </div>
        <div className="mt-2">
          <div className="text-sm font-bold text-white font-mono">
            {formatDistance(rail.nearest_dist_m)}
          </div>
          {rail.name && (
            <div
              className="text-[10px] text-sky-300 font-medium truncate mt-0.5"
              title={rail.name}
            >
              {rail.name}
            </div>
          )}
          <div className="text-[10px] text-slate-400 mt-0.5">
            {rail.nearest_dist_m !== null
              ? `${rail.count} station platform${rail.count !== 1 ? "s" : ""}`
              : "No heavy rail within 2,500m"}
          </div>
        </div>
      </div>

      {/* Bus Stop Card */}
      <div
        onClick={() =>
          handleSelectFacility(
            "bus",
            bus,
            "Bus Stop"
          )
        }
        className={`p-2.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-200 group active:scale-[0.98] ${
          isSelected(bus.name || "Bus Stop")
            ? "bg-cyan-950/50 border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80"
        } ${bus.nearest_dist_m === null ? "opacity-70 cursor-default" : ""}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300 font-medium group-hover:text-indigo-300 transition">
            Bus Stop
          </span>
          <Bus className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition" />
        </div>
        <div className="mt-2">
          <div className="text-sm font-bold text-white font-mono">
            {formatDistance(bus.nearest_dist_m)}
          </div>
          {bus.name && (
            <div
              className="text-[10px] text-indigo-300 font-medium truncate mt-0.5"
              title={bus.name}
            >
              {bus.name}
            </div>
          )}
          <div className="text-[10px] text-slate-400 mt-0.5">
            {bus.nearest_dist_m !== null
              ? bus.count > 0
                ? `${bus.count} active route${bus.count !== 1 ? "s" : ""}`
                : "Active transit stop"
              : "No stops within 1,000m"}
          </div>
        </div>
      </div>

      {/* Airport Card */}
      <div
        onClick={() =>
          handleSelectFacility(
            "airport",
            airport,
            "Airport"
          )
        }
        className={`p-2.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-200 group active:scale-[0.98] ${
          isSelected(airport.name || "Airport")
            ? "bg-cyan-950/50 border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80"
        } ${airport.nearest_dist_m === null ? "opacity-70 cursor-default" : ""}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300 font-medium group-hover:text-purple-300 transition">
            Airport
          </span>
          <Plane className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition" />
        </div>
        <div className="mt-2">
          <div className="text-sm font-bold text-white font-mono">
            {formatDistance(airport.nearest_dist_m)}
          </div>
          {airport.name && (
            <div
              className="text-[10px] text-purple-300 font-medium truncate mt-0.5"
              title={airport.name}
            >
              {airport.name}
            </div>
          )}
          <div className="text-[10px] text-slate-400 mt-0.5">
            {airport.nearest_dist_m !== null
              ? "Commercial / Regional terminal"
              : "No airport within 70km"}
          </div>
        </div>
      </div>

      {/* Optional Hospital Card */}
      {showHospital && detailed.essentials?.hospitals && (
        <HospitalCard
          hospital={detailed.essentials.hospitals}
          selectedFacilityName={selectedFacilityName}
          onSelectFacility={onSelectFacility}
          setSelectedRouteTarget={setSelectedRouteTarget}
        />
      )}
    </div>
  );
};

export default FacilitiesGrid;
