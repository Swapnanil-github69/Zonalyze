import React, { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { Train, Navigation, Trees, Layers, MapPin } from "lucide-react";

export interface MapPreset {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  zoom: number;
  icon: React.ComponentType<{ className?: string }>;
}

export const MAP_PRESETS: MapPreset[] = [
  {
    id: "metro-hub",
    name: "City Center Metro Hub",
    description: "Esplanade & Park St Interchange",
    lat: 22.5645,
    lng: 88.3516,
    zoom: 14.5,
    icon: Train,
  },
  {
    id: "highway-corridor",
    name: "Highway Corridor",
    description: "EM Bypass Arterial Transit",
    lat: 22.5186,
    lng: 88.398,
    zoom: 14.2,
    icon: Navigation,
  },
  {
    id: "green-belt",
    name: "Suburban Green Belt",
    description: "New Town Eco Park Area",
    lat: 22.602,
    lng: 88.465,
    zoom: 14.0,
    icon: Trees,
  },
];

interface MapViewProps {
  onCoordinateClick: (lat: number, lng: number) => void;
  selectedCoords: { lat: number; lng: number } | null;
  className?: string;
}

const TILE_STYLES = {
  voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  osm: {
    version: 8 as const,
    sources: {
      "osm-tiles": {
        type: "raster" as const,
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "&copy; OpenStreetMap Contributors",
      },
    },
    layers: [
      {
        id: "osm-tiles-layer",
        type: "raster" as const,
        source: "osm-tiles",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
};

export const MapView: React.FC<MapViewProps> = ({
  onCoordinateClick,
  selectedCoords,
  className = "",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [activeTileStyle, setActiveTileStyle] = useState<"voyager" | "osm">("voyager");
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: TILE_STYLES[activeTileStyle],
      center: [88.3516, 22.5645], // Default Hotspot: Kolkata Central
      zoom: 13,
      pitch: 35,
      bearing: 0,
      attributionControl: false,
    });

    // Custom attribution
    mapInstance.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: "Zonalyze Telemetry Engine",
      }),
      "bottom-left"
    );

    // Navigation Controls
    mapInstance.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showCompass: true,
        showZoom: true,
      }),
      "bottom-right"
    );

    mapInstance.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

    // Click handler: drop pin and trigger audit
    mapInstance.on("click", (e) => {
      const { lat, lng } = e.lngLat;
      setActivePresetId(null);
      onCoordinateClick(lat, lng);
    });

    mapRef.current = mapInstance;

    return () => {
      mapInstance.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle style toggling
  const toggleTileStyle = useCallback(() => {
    if (!mapRef.current) return;
    const nextStyle = activeTileStyle === "voyager" ? "osm" : "voyager";
    setActiveTileStyle(nextStyle);
    mapRef.current.setStyle(TILE_STYLES[nextStyle]);
  }, [activeTileStyle]);

  // Update target marker pin whenever selected coordinates change
  useEffect(() => {
    if (!mapRef.current || !selectedCoords) return;

    const { lat, lng } = selectedCoords;

    // Smoothly fly camera to clicked coordinate
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 14.5,
      pitch: 35,
      essential: true,
      duration: 1600,
    });

    // Create or position the pulsing animated marker
    if (!markerRef.current) {
      const el = document.createElement("div");
      el.className = "relative flex items-center justify-center cursor-pointer pointer-events-none";
      el.innerHTML = `
        <div class="absolute w-12 h-12 rounded-full bg-blue-500/25 animate-ping"></div>
        <div class="absolute w-8 h-8 rounded-full bg-cyan-400/40 animate-pulse"></div>
        <div class="relative w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 border-2 border-white shadow-2xl flex items-center justify-center">
          <div class="w-2 h-2 rounded-full bg-white shadow-sm"></div>
        </div>
      `;

      markerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }
  }, [selectedCoords]);

  // Handler for preset quick buttons
  const handleSelectPreset = (preset: MapPreset) => {
    setActivePresetId(preset.id);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [preset.lng, preset.lat],
        zoom: preset.zoom,
        pitch: 40,
        essential: true,
        duration: 1800,
      });
    }
    onCoordinateClick(preset.lat, preset.lng);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* MapLibre DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Floating Quick Preset Buttons */}
      <div className="absolute top-20 left-4 sm:left-6 z-20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-[calc(100vw-2rem)] overflow-x-auto pb-1 scrollbar-none">
        <div className="glass-panel px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg flex items-center space-x-2 text-[11px] font-mono text-slate-300 backdrop-blur-md hidden md:flex shrink-0">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>Hotspot Presets:</span>
        </div>

        {MAP_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`group flex items-center space-x-2.5 px-3 py-2 rounded-xl border shadow-xl transition-all duration-200 text-left shrink-0 backdrop-blur-md ${
                isActive
                  ? "bg-blue-600/90 text-white border-blue-400 shadow-blue-500/20 scale-[1.02]"
                  : "glass-panel hover:bg-slate-800/90 text-slate-200 border-slate-700/70 hover:border-blue-500/40"
              }`}
              title={`${preset.name} (${preset.lat.toFixed(4)}, ${preset.lng.toFixed(4)})`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isActive ? "bg-white/20 text-white" : "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-tight">{preset.name}</span>
                <span
                  className={`text-[10px] leading-none mt-0.5 ${
                    isActive ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  {preset.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Layer Tile Switcher Floating Button */}
      <div className="absolute bottom-6 left-6 z-20 hidden sm:flex items-center space-x-2">
        <button
          onClick={toggleTileStyle}
          className="glass-panel hover:bg-slate-800/90 text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-700/60 shadow-xl flex items-center space-x-2 text-xs font-mono transition"
          title="Toggle between Carto Voyager and OpenStreetMap base tiles"
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Layer: {activeTileStyle === "voyager" ? "Carto Voyager" : "OpenStreetMap"}</span>
        </button>
      </div>
    </div>
  );
};

export default MapView;
