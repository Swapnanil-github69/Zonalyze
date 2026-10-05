import React, { useState } from "react";
import { MapView } from "../components/map/MapView";
import { SearchBar } from "../components/map/SearchBar";
import { RadarScanner } from "../components/common/RadarScanner";
import { DossierPanel } from "../components/dossier/DossierPanel";
import { useInvestigation } from "../hooks/useInvestigation";
import {
  FileText,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  Footprints,
  X,
  Loader2,
  Car,
  Bike,
  Zap,
} from "lucide-react";
import { fetchFacilityRoute, RouteResult, TravelMode } from "../services/routeService";
import { SelectedFacility } from "../components/dossier/InfrastructureCard";

interface InvestigationMapPageProps {
  onBackToHome: () => void;
}

const TRAVEL_MODES: Array<{ mode: TravelMode; label: string; icon: React.FC<{ className?: string }> }> = [
  { mode: "walk", label: "Walk", icon: Footprints },
  { mode: "bicycle", label: "Cycling", icon: Bike },
  { mode: "bike", label: "Motorcycle", icon: Zap },
  { mode: "car", label: "Car", icon: Car },
];

export const InvestigationMapPage: React.FC<InvestigationMapPageProps> = ({ onBackToHome }) => {
  const {
    selectedCoords,
    stage,
    investigation,
    error,
    isDossierOpen,
    triggerInvestigation,
    closeDossier,
    openDossier,
  } = useInvestigation();

  const [selectedFacility, setSelectedFacility] = useState<SelectedFacility | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>("walk");
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);
  const [routeNotice, setRouteNotice] = useState<string | null>(null);

  const isLoading =
    stage === "checking_cache" ||
    stage === "ingesting_telemetry" ||
    stage === "computing_heuristics" ||
    stage === "synthesizing_ai";

  const handleCoordinateClick = (lat: number, lng: number) => {
    // Clear any active route when initiating a new pinpoint audit
    setSelectedFacility(null);
    setActiveRoute(null);
    setRouteNotice(null);
    triggerInvestigation(lat, lng);
  };

  const fetchRouteForFacility = async (facility: SelectedFacility, mode: TravelMode) => {
    const originLon = investigation?.location?.coordinates?.[0] ?? selectedCoords?.lng;
    const originLat = investigation?.location?.coordinates?.[1] ?? selectedCoords?.lat;

    if (originLon === undefined || originLat === undefined) {
      setRouteNotice("No origin location specified.");
      return;
    }

    setIsLoadingRoute(true);
    setRouteNotice(null);
    try {
      const route = await fetchFacilityRoute([originLon, originLat], facility.coordinates, mode);
      if (route) {
        setActiveRoute(route);
      } else {
        setRouteNotice(`Could not resolve real-world ${mode} route to ${facility.name}.`);
      }
    } catch (err) {
      console.error("Failed to fetch route:", err);
      setRouteNotice("Failed to calculate street route.");
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const handleSelectFacility = async (facility: SelectedFacility) => {
    setSelectedFacility(facility);
    await fetchRouteForFacility(facility, travelMode);
  };

  const handleModeChange = async (mode: TravelMode) => {
    setTravelMode(mode);
    if (selectedFacility) {
      await fetchRouteForFacility(selectedFacility, mode);
    }
  };

  const clearActiveRoute = () => {
    setSelectedFacility(null);
    setActiveRoute(null);
    setRouteNotice(null);
  };

  const getModeIcon = (mode: TravelMode) => {
    switch (mode) {
      case "car":
        return <Car className="w-4 h-4 text-purple-400" />;
      case "bike":
        return <Zap className="w-4 h-4 text-amber-400" />;
      case "bicycle":
        return <Bike className="w-4 h-4 text-emerald-400" />;
      case "walk":
      default:
        return <Footprints className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans antialiased">
      {/* 1. Interactive Map Surface (MapLibre GL + Carto Voyager / OSM + Presets) */}
      <MapView
        onCoordinateClick={handleCoordinateClick}
        selectedCoords={selectedCoords}
        activeRoute={activeRoute}
        selectedFacility={selectedFacility}
        isDossierOpen={isDossierOpen}
      />

      {/* 2. Top Navigation Bar: Back to Home + Search Bar */}
      <div className="fixed top-6 left-6 z-30 flex items-center space-x-3">
        <button
          onClick={onBackToHome}
          className="group glass-panel-elevated hover:bg-[#081426] text-white px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 border border-slate-700/60 hover:border-slate-500 hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-md"
          title="Back to ZONALYZE Landing Page"
        >
          <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:-translate-x-1 transition duration-200" />
          <span className="text-xs font-bold font-mono tracking-wider hidden sm:inline text-white">
            ZONALYZE
          </span>
        </button>
      </div>

      {/* Geocoding Search Bar */}
      <SearchBar
        onSearchCoordinates={handleCoordinateClick}
        isLoading={isLoading}
      />

      {/* Brand Watermark Overlay */}
      <div className="absolute top-6 right-6 z-20 pointer-events-none hidden md:flex">
        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-700/70 bg-slate-950/55 px-3.5 py-2 shadow-[0_0_0_1px_rgba(148,163,184,0.08),0_20px_50px_rgba(2,6,23,0.55)] backdrop-blur-md">
          <div className="relative flex h-4 w-4 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-emerald-400/40 bg-emerald-400/10" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold tracking-[0.22em] text-slate-100 uppercase font-mono">
                ZONALYZE
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-medium tracking-[0.18em] text-emerald-300 uppercase font-mono">
                LIVE
              </span>
            </div>
            <span className="mt-1 text-[8px] tracking-[0.18em] text-slate-400 uppercase font-mono">
              Civic Intelligence Engine
            </span>
          </div>
        </div>
      </div>

      {/* 3. Multi-Modal Street Pathway Floating HUD overlay */}
      {(selectedFacility || activeRoute || isLoadingRoute || routeNotice) && (
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
                    <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                      {selectedFacility?.name || "Street Route"}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                      OSRM {travelMode.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono flex items-center gap-2 mt-0.5">
                    {isLoadingRoute ? (
                      <span className="text-cyan-300 animate-pulse">Calculating {travelMode} route...</span>
                    ) : activeRoute ? (
                      <>
                        <span className="text-cyan-400 font-bold">{activeRoute.formattedDistance}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-emerald-400 font-medium">{activeRoute.formattedDuration}</span>
                      </>
                    ) : routeNotice ? (
                      <span className="text-amber-300">{routeNotice}</span>
                    ) : null}
                  </div>
                </div>
              </div>

              <button
                onClick={clearActiveRoute}
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
                  onClick={() => handleModeChange(mode)}
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
          </div>
        </div>
      )}

      {/* 4. Real-time Telemetry Radar Scanner (Loading Pill at Bottom) */}
      {isLoading && selectedCoords && (
        <RadarScanner stage={stage} lat={selectedCoords.lat} lng={selectedCoords.lng} />
      )}

      {/* Error Toast Notification */}
      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="glass-panel p-4 rounded-2xl border border-red-500/40 shadow-2xl flex items-center space-x-3 bg-red-950/90 backdrop-blur-md">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-xs text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Re-open Dossier Quick Floating Button if Closed */}
      {!isDossierOpen && (investigation || isLoading) && (
        <button
          onClick={openDossier}
          className="fixed bottom-6 right-6 z-20 glass-panel-elevated hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 border border-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-md"
        >
          {isLoading ? (
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          ) : (
            <FileText className="w-4 h-4 text-blue-400" />
          )}
          <span className="text-xs font-bold tracking-wide">
            {isLoading ? "Auditing Location..." : "View Dossier"}
          </span>
        </button>
      )}

      {/* 5. Slide-out Location Audit Dossier Panel / Drawer */}
      <DossierPanel
        investigation={investigation}
        isOpen={isDossierOpen}
        isLoading={isLoading}
        stage={stage}
        selectedCoords={selectedCoords}
        selectedFacility={selectedFacility}
        onSelectFacility={handleSelectFacility}
        onClose={closeDossier}
      />
    </div>
  );
};

export default InvestigationMapPage;
