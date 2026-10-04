import React, { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { Layers } from "lucide-react";

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

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* MapLibre DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

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
