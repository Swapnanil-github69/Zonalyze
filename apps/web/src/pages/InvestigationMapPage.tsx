import React from "react";
import { MapView } from "../components/map/MapView";
import { SearchBar } from "../components/map/SearchBar";
import { RadarScanner } from "../components/common/RadarScanner";
import { DossierPanel } from "../components/dossier/DossierPanel";
import { useInvestigation } from "../hooks/useInvestigation";
import { FileText, ShieldAlert, Sparkles, ArrowLeft } from "lucide-react";

interface InvestigationMapPageProps {
  onBackToHome: () => void;
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

  const isLoading =
    stage === "checking_cache" ||
    stage === "ingesting_telemetry" ||
    stage === "computing_heuristics" ||
    stage === "synthesizing_ai";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans antialiased">
      {/* 1. Interactive Map Surface (MapLibre GL + Carto Voyager / OSM + Presets) */}
      <MapView
        onCoordinateClick={(lat, lng) => triggerInvestigation(lat, lng)}
        selectedCoords={selectedCoords}
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
        onSearchCoordinates={(lat, lng) => triggerInvestigation(lat, lng)}
        isLoading={isLoading}
      />

      {/* Brand Watermark Overlay */}
      <div className="absolute top-6 right-6 z-20 pointer-events-none hidden md:flex items-center space-x-2.5 glass-panel px-3.5 py-2 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur-md">
        <div className="relative flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
          <div className="w-2 h-2 rounded-full bg-emerald-400 relative" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-black tracking-wider text-white uppercase font-mono">
              ZONALYZE
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/40 font-mono">
              v1.0
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono">Civic Intelligence Engine</span>
        </div>
      </div>

      {/* 3. Real-time Telemetry Radar Scanner (Loading Pill at Bottom) */}
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

      {/* 4. Slide-out Location Audit Dossier Panel / Drawer */}
      <DossierPanel
        investigation={investigation}
        isOpen={isDossierOpen}
        isLoading={isLoading}
        stage={stage}
        selectedCoords={selectedCoords}
        onClose={closeDossier}
      />
    </div>
  );
};

export default InvestigationMapPage;
