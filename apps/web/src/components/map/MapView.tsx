import React, { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { Layers } from "lucide-react";
import { RouteResult } from "../../services/routeService";
import { SelectedFacility } from "../dossier/InfrastructureCard";

interface MapViewProps {
  onCoordinateClick: (lat: number, lng: number) => void;
  selectedCoords: { lat: number; lng: number } | null;
  activeRoute?: RouteResult | null;
  selectedFacility?: SelectedFacility | null;
  isDossierOpen?: boolean;
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
  activeRoute,
  selectedFacility,
  isDossierOpen = false,
  className = "",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const destinationMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [activeTileStyle, setActiveTileStyle] = useState<"voyager" | "osm">("voyager");

  // Renders or removes pedestrian route polyline and destination marker
  const renderRouteOnMap = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const sourceId = "pedestrian-route-source";
    const glowLayerId = "pedestrian-route-glow";
    const coreLayerId = "pedestrian-route-core";
    const pulseLayerId = "pedestrian-route-pulse";

    // Clean up existing layers if present
    if (map.getLayer(pulseLayerId)) map.removeLayer(pulseLayerId);
    if (map.getLayer(coreLayerId)) map.removeLayer(coreLayerId);
    if (map.getLayer(glowLayerId)) map.removeLayer(glowLayerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    // If no active route, clean up destination marker and return
    if (!activeRoute || !activeRoute.coordinates || activeRoute.coordinates.length === 0) {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
        destinationMarkerRef.current = null;
      }
      return;
    }

    // Add GeoJSON source
    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: activeRoute.coordinates,
        },
        properties: {},
      },
    });

    // 1. Outer Glowing Line Layer
    map.addLayer({
      id: glowLayerId,
      type: "line",
      source: sourceId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#06b6d4", // Cyan glow
        "line-width": 8,
        "line-opacity": 0.65,
        "line-blur": 3.5,
      },
    });

    // 2. Core Street Route Line Layer
    map.addLayer({
      id: coreLayerId,
      type: "line",
      source: sourceId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#38bdf8", // Sky blue core
        "line-width": 4,
        "line-opacity": 0.95,
      },
    });

    // 3. Dashed Walking Flow Accent
    map.addLayer({
      id: pulseLayerId,
      type: "line",
      source: sourceId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#ffffff",
        "line-width": 2,
        "line-dasharray": [1, 2.5],
        "line-opacity": 0.85,
      },
    });

    // 4. Destination Pin Marker
    if (selectedFacility && selectedFacility.coordinates) {
      const [dLon, dLat] = selectedFacility.coordinates;

      if (!destinationMarkerRef.current) {
        const destEl = document.createElement("div");
        destEl.className = "relative flex items-center justify-center cursor-pointer pointer-events-none";
        destEl.innerHTML = `
          <div class="relative flex flex-col items-center">
            <div class="px-2 py-0.5 mb-1 rounded-full bg-slate-950/90 border border-cyan-400/80 text-[10px] font-mono font-bold text-cyan-300 shadow-xl whitespace-nowrap backdrop-blur-md">
              ${selectedFacility.name}
            </div>
            <div class="relative flex items-center justify-center">
              <div class="absolute h-8 w-8 rounded-full border border-emerald-400/60 bg-emerald-400/20 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-ping"></div>
              <div class="relative h-5 w-5 rounded-full border-2 border-white bg-gradient-to-tr from-emerald-500 to-teal-300 shadow-[0_0_15px_rgba(16,185,129,0.8)] flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
              <div class="absolute left-1/2 top-[calc(100%-0.3rem)] -translate-x-1/2 h-3 w-1.5 rounded-b-full bg-gradient-to-b from-teal-400 to-emerald-700 shadow-md"></div>
            </div>
          </div>
        `;
        destinationMarkerRef.current = new maplibregl.Marker({ element: destEl, anchor: "bottom" })
          .setLngLat([dLon, dLat])
          .addTo(map);
      } else {
        destinationMarkerRef.current.setLngLat([dLon, dLat]);
      }
    }

    // 5. Fit Camera Bounds around the entire walking corridor
    const bounds = new maplibregl.LngLatBounds();
    activeRoute.coordinates.forEach(([lon, lat]) => bounds.extend([lon, lat]));

    map.fitBounds(bounds, {
      padding: {
        top: 90,
        bottom: 90,
        left: 90,
        right: isDossierOpen ? 520 : 90,
      },
      duration: 1200,
      maxZoom: 16.5,
    });
  }, [activeRoute, selectedFacility, isDossierOpen]);

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

    mapInstance.on("style.load", () => {
      renderRouteOnMap();
    });

    mapRef.current = mapInstance;

    return () => {
      mapInstance.remove();
      mapRef.current = null;
    };
  }, []);

  // Update route on map when activeRoute or selectedFacility changes
  useEffect(() => {
    renderRouteOnMap();
  }, [renderRouteOnMap]);

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

    // Only fly to origin coordinate if we don't have an active route being rendered
    if (!activeRoute) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 14.5,
        pitch: 35,
        essential: true,
        duration: 1600,
      });
    }

    // Create or position the pulsing animated marker
    if (!markerRef.current) {
      const el = document.createElement("div");
      el.className = "relative flex items-center justify-center cursor-pointer pointer-events-none";
      el.innerHTML = `
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="h-10 w-10 rounded-full border border-cyan-300/50 bg-cyan-400/10 shadow-[0_0_22px_rgba(34,211,238,0.35)] animate-pulse"></div>
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="h-5 w-5 rounded-full border-2 border-white bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-600 shadow-[0_0_18px_rgba(59,130,246,0.6)]"></div>
        </div>
        <div class="absolute left-1/2 top-[calc(100%-0.8rem)] -translate-x-1/2 h-4 w-2 rounded-b-full bg-gradient-to-b from-cyan-400 to-blue-700 shadow-[0_0_18px_rgba(59,130,246,0.4)]"></div>
      `;

      markerRef.current = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }
  }, [selectedCoords, activeRoute]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* MapLibre DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Layer Tile Switcher Floating Button */}
      <div className="absolute bottom-6 left-6 z-20 hidden sm:flex items-center space-x-2">
        <button
          onClick={toggleTileStyle}
          className="flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs font-mono text-slate-200 shadow-[0_20px_40px_rgba(2,6,23,0.35)] backdrop-blur-md transition hover:border-cyan-500/40 hover:text-white"
          title="Toggle between Carto Voyager and OpenStreetMap base tiles"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Layer: {activeTileStyle === "voyager" ? "Carto Voyager" : "OpenStreetMap"}</span>
        </button>
      </div>
    </div>
  );
};

export default MapView;
