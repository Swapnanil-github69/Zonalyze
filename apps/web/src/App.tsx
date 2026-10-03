import { MapContainer } from "./components/map/MapContainer";
import { SearchBar } from "./components/map/SearchBar";
import { RadarScanner } from "./components/common/RadarScanner";
import { DossierPanel } from "./components/dossier/DossierPanel";
import { useInvestigation } from "./hooks/useInvestigation";
import { FileText, ShieldAlert } from "lucide-react";

export function App() {
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
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* 1. Interactive Map Surface (MapLibre GL + Carto Voyager) */}
      <MapContainer
        onCoordinateClick={(lat, lng) => triggerInvestigation(lat, lng)}
        selectedCoords={selectedCoords}
      />

      {/* 2. Top Navigation & Search Bar */}
      <SearchBar
        onSearchCoordinates={(lat, lng) => triggerInvestigation(lat, lng)}
        isLoading={isLoading}
      />

      {/* Brand Watermark Overlay */}
      <div className="absolute top-6 right-6 z-20 pointer-events-none hidden md:flex items-center space-x-2 glass-panel px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
          Zonalyze
        </span>
        <span className="text-[10px] text-slate-400 font-mono">v1.0 (Zero-Cost GIS)</span>
      </div>

      {/* 3. Real-time Telemetry Radar Scanner (Loading State) */}
      {isLoading && selectedCoords && (
        <RadarScanner stage={stage} lat={selectedCoords.lat} lng={selectedCoords.lng} />
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md">
          <div className="glass-panel p-4 rounded-2xl border border-red-500/40 shadow-2xl flex items-center space-x-3 bg-red-950/80">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-xs text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Re-open Dossier Quick Button if Closed */}
      {!isDossierOpen && investigation && !isLoading && (
        <button
          onClick={openDossier}
          className="fixed bottom-6 right-6 z-20 glass-panel-elevated hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 border border-blue-500/40 hover:scale-105 transition duration-200"
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold">View Dossier</span>
        </button>
      )}

      {/* 4. Slide-out Location Audit Dossier Panel */}
      <DossierPanel
        investigation={investigation}
        isOpen={isDossierOpen}
        onClose={closeDossier}
      />
    </div>
  );
}

export default App;
