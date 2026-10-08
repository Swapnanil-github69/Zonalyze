import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Crosshair,
} from "lucide-react";
import { fetchFacilityRoute, RouteResult, TravelMode } from "../services/routeService";
import { SelectedFacility } from "../components/dossier/InfrastructureCard";
import { RouteModal } from "../components/RouteModal";

interface InvestigationMapPageProps {
  onBackToHome: () => void;
}

export function parseCoordinatesFromUrl(): { lat: number; lng: number } | null {
  if (typeof window === "undefined") return null;

  // 1. Check window.location.search (?lat=...&lon=...)
  const searchParams = new URLSearchParams(window.location.search);
  let latStr = searchParams.get("lat");
  let lonStr = searchParams.get("lon") || searchParams.get("lng");

  // 2. Check window.location.hash (#investigate?lat=...&lon=...)
  if (!latStr || !lonStr) {
    const hash = window.location.hash;
    const queryIdx = hash.indexOf("?");
    if (queryIdx !== -1) {
      const hashParams = new URLSearchParams(hash.substring(queryIdx + 1));
      latStr = latStr || hashParams.get("lat");
      lonStr = lonStr || hashParams.get("lon") || hashParams.get("lng");
    }
  }

  if (latStr && lonStr) {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lonStr);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }
  return null;
}

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
  const routeRequestIdRef = useRef<number>(0);
  const lastAuditedCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  const isLoading =
    stage === "checking_cache" ||
    stage === "ingesting_telemetry" ||
    stage === "computing_heuristics" ||
    stage === "synthesizing_ai";

  const handleCoordinateClick = useCallback((lat: number, lng: number) => {
    lastAuditedCoordsRef.current = { lat, lng };
    // Clear any active route when initiating a new pinpoint audit
    routeRequestIdRef.current++;
    setSelectedFacility(null);
    setActiveRoute(null);
    setRouteNotice(null);
    triggerInvestigation(lat, lng);

    if (typeof window !== "undefined" && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", `#investigate?lat=${lat}&lon=${lng}`);
    }
  }, [triggerInvestigation]);

  // Read lat and lon from URL parameters on mount and initiate audit telemetry immediately
  useEffect(() => {
    const syncFromUrl = () => {
      const coords = parseCoordinatesFromUrl();
      if (coords) {
        const last = lastAuditedCoordsRef.current;
        if (!last || Math.abs(last.lat - coords.lat) > 0.00001 || Math.abs(last.lng - coords.lng) > 0.00001) {
          handleCoordinateClick(coords.lat, coords.lng);
        }
      }
    };

    syncFromUrl();

    window.addEventListener("hashchange", syncFromUrl);
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("hashchange", syncFromUrl);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, [handleCoordinateClick]);

  const fetchRouteForFacility = async (facility: SelectedFacility, mode: TravelMode) => {
    const originLon = investigation?.location?.coordinates?.[0] ?? selectedCoords?.lng;
    const originLat = investigation?.location?.coordinates?.[1] ?? selectedCoords?.lat;

    if (originLon === undefined || originLat === undefined) {
      setRouteNotice("No origin location specified.");
      return;
    }

    const currentReqId = ++routeRequestIdRef.current;
    setIsLoadingRoute(true);
    setRouteNotice(null);
    try {
      const route = await fetchFacilityRoute([originLon, originLat], facility.coordinates, mode, facility.name);
      if (currentReqId !== routeRequestIdRef.current) return;
      if (route) {
        route.targetName = facility.name;
        route.targetCoordinates = facility.coordinates;
        setActiveRoute(route);
      } else {
        setRouteNotice(`Could not resolve real-world ${mode} route to ${facility.name}.`);
      }
    } catch (err) {
      if (currentReqId !== routeRequestIdRef.current) return;
      console.error("Failed to fetch route:", err);
      setRouteNotice("Failed to calculate street route.");
    } finally {
      if (currentReqId === routeRequestIdRef.current) {
        setIsLoadingRoute(false);
      }
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
    routeRequestIdRef.current++;
    setSelectedFacility(null);
    setActiveRoute(null);
    setRouteNotice(null);
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
      <div className="fixed top-5 left-5 z-30 flex items-center gap-2.5 max-w-[calc(100vw-2.5rem)]">
        <button
          onClick={onBackToHome}
          className="group glass-panel-elevated hover:bg-[#161b13]/90 text-white px-3 py-2 rounded-2xl shadow-xl flex items-center space-x-2.5 border border-[#e2ffcc]/20 hover:border-[#e2ffcc]/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 backdrop-blur-md shrink-0 bg-slate-950/80"
          title="Back to Zonalyze Landing Page"
        >
          <ArrowLeft className="w-4 h-4 text-[#e2ffcc]/80 group-hover:-translate-x-1 transition duration-200" />
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border border-[#e2ffcc] flex items-center justify-center text-[#e2ffcc] group-hover:scale-105 transition-transform duration-200">
              <Crosshair className="w-3.5 h-3.5 text-[#e2ffcc]" />
            </div>
            <span className="font-sans text-sm sm:text-base font-medium text-[#e2ffcc] tracking-wide leading-none hidden sm:inline">
              Zonalyze
            </span>
          </div>
        </button>

        {/* Geocoding Search Bar */}
        <SearchBar
          onSearchCoordinates={handleCoordinateClick}
          isLoading={isLoading}
        />
      </div>

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
      <RouteModal
        selectedFacility={selectedFacility}
        activeRoute={activeRoute}
        travelMode={travelMode}
        isLoadingRoute={isLoadingRoute}
        routeNotice={routeNotice}
        originCoords={
          investigation?.location?.coordinates
            ? [investigation.location.coordinates[0], investigation.location.coordinates[1]]
            : selectedCoords
            ? [selectedCoords.lng, selectedCoords.lat]
            : null
        }
        onModeChange={handleModeChange}
        onClose={clearActiveRoute}
      />

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
