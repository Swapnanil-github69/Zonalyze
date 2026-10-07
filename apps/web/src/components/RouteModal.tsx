import React from "react";
import {
  Navigation,
  ExternalLink,
  X,
  Loader2,
  Footprints,
  Bike as BicycleIcon,
  Zap,
  Car,
} from "lucide-react";
import { RouteResult, TravelMode } from "../services/routeService";
import { RouteTarget } from "./FacilitiesGrid";

export interface RouteModalProps {
  selectedFacility: RouteTarget | null;
  activeRoute: RouteResult | null;
  travelMode: TravelMode;
  isLoadingRoute: boolean;
  routeNotice: string | null;
  originCoords?: [number, number] | null; // [lon, lat]
  onModeChange: (mode: TravelMode) => void;
  onClose: () => void;
}

const TRAVEL_MODES: { mode: TravelMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { mode: "walk", label: "Walk", icon: Footprints },
  { mode: "bicycle", label: "Cycle", icon: BicycleIcon },
  { mode: "bike", label: "Bike", icon: Zap },
  { mode: "car", label: "Drive", icon: Car },
];

export const RouteModal: React.FC<RouteModalProps> = ({
  selectedFacility,
  activeRoute,
  travelMode,
  isLoadingRoute,
  routeNotice,
  originCoords,
  onModeChange,
  onClose,
}) => {
  if (!selectedFacility && !activeRoute && !isLoadingRoute && !routeNotice) {
    return null;
  }

  const facilityName = selectedFacility?.name || activeRoute?.targetName || "Target Facility";
  const targetCoordinates = selectedFacility?.coordinates || activeRoute?.targetCoordinates;

  const getModeIcon = (mode: TravelMode) => {
    switch (mode) {
      case "car":
        return <Car className="w-4 h-4 text-purple-400" />;
      case "bike":
        return <Zap className="w-4 h-4 text-amber-400" />;
      case "bicycle":
        return <BicycleIcon className="w-4 h-4 text-emerald-400" />;
      case "walk":
      default:
        return <Footprints className="w-4 h-4 text-cyan-400" />;
    }
  };

  const originLat = originCoords ? originCoords[1] : 0;
  const originLon = originCoords ? originCoords[0] : 0;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-xl animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="glass-panel-elevated p-3 sm:p-3.5 rounded-2xl border border-cyan-500/50 shadow-2xl bg-slate-950/95 backdrop-blur-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
              {isLoadingRoute ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              ) : (
                getModeIcon(travelMode)
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span
                  key={facilityName}
                  className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs transition-colors duration-200"
                  title={facilityName}
                >
                  {facilityName}
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                  OSRM {travelMode.toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono flex items-center gap-2 mt-0.5">
                {isLoadingRoute ? (
                  <span className="text-cyan-300 animate-pulse">
                    Calculating {travelMode} route to {facilityName}...
                  </span>
                ) : activeRoute ? (
                  <>
                    <span className="text-cyan-400 font-bold">{activeRoute.formattedDistance}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-400 font-medium">
                      {activeRoute.modeLabel || travelMode.toUpperCase()}: {activeRoute.formattedDuration}
                    </span>
                  </>
                ) : routeNotice ? (
                  <span className="text-amber-300">{routeNotice}</span>
                ) : null}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
            title="Clear Route"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Travel Mode Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
          {TRAVEL_MODES.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              disabled={isLoadingRoute}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium transition ${
                travelMode === mode
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
              title={`${label} mode`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">{label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Google Maps Navigation & Review Deep-links */}
        {targetCoordinates && (
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLon}&destination=${targetCoordinates[1]},${targetCoordinates[0]}&travelmode=${
                travelMode === "bike"
                  ? "two_wheeler"
                  : travelMode === "bicycle"
                  ? "bicycling"
                  : travelMode === "car"
                  ? "driving"
                  : "walking"
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 transition"
              title="Open turnkey GPS navigation on Google Maps"
            >
              <Navigation className="w-3 h-3" />
              <span>Google Maps Route</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${facilityName} ${targetCoordinates[1]},${targetCoordinates[0]}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg text-[11px] font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition"
              title="Check reviews, ratings, and photos on Google Maps"
            >
              <span>Google Reviews & Photos</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteModal;
