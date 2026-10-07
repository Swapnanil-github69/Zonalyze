import React, { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Compass, Globe, Moon, Sun, Crosshair, Radio } from "lucide-react";
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

export type MapStyleKey = "dark" | "satellite" | "voyager";

const TILE_STYLES: Record<MapStyleKey, string | maplibregl.StyleSpecification> = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  satellite: {
    version: 8 as const,
    sources: {
      "esri-satellite": {
        type: "raster" as const,
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "&copy; Esri, Maxar, Earthstar Geographics",
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: "esri-satellite-layer",
        type: "raster" as const,
        source: "esri-satellite",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
  voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
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
  const [activeTileStyle, setActiveTileStyle] = useState<MapStyleKey>("dark");
  const [is3D, setIs3D] = useState<boolean>(true);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);

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

    const mode = activeRoute.mode || "walk";
    let glowColor = "#06b6d4";
    let coreColor = "#38bdf8";

    if (mode === "car") {
      glowColor = "#8b5cf6"; // Purple / Indigo
      coreColor = "#a78bfa";
    } else if (mode === "bike") {
      glowColor = "#f59e0b"; // Amber / Orange
      coreColor = "#fbbf24";
    } else if (mode === "bicycle") {
      glowColor = "#10b981"; // Emerald
      coreColor = "#34d399";
    } else {
      glowColor = "#06b6d4"; // Cyan
      coreColor = "#38bdf8";
    }

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
        "line-color": glowColor,
        "line-width": 8,
        "line-opacity": 0.75,
        "line-blur": 3.5,
      },
    });

    // 2. Core Route Line Layer
    map.addLayer({
      id: coreLayerId,
      type: "line",
      source: sourceId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": coreColor,
        "line-width": 4,
        "line-opacity": 0.95,
      },
    });

    // 3. Flow Accent (dashed for walk/bicycle, subtle solid inner highlight for car/bike)
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
        "line-width": mode === "walk" || mode === "bicycle" ? 2 : 1.5,
        ...(mode === "walk" || mode === "bicycle"
          ? { "line-dasharray": [1, 2.5] }
          : {}),
        "line-opacity": 0.85,
      },
    });

    // 4. Destination Pin Marker
    if (selectedFacility && selectedFacility.coordinates) {
      const [dLon, dLat] = selectedFacility.coordinates;

      // Always remove prior destination marker so the label text and pin DOM are freshly re-rendered
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
        destinationMarkerRef.current = null;
      }

      const destEl = document.createElement("div");
      destEl.className = "cursor-pointer pointer-events-none";
      destEl.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="px-2.5 py-0.5 mb-1.5 rounded-full bg-slate-950/90 border border-emerald-400/90 text-[10px] font-mono font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] whitespace-nowrap backdrop-blur-md flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>${selectedFacility.name}</span>
          </div>
          <div class="relative flex items-center justify-center w-10 h-10">
            <div class="absolute h-9 w-9 rounded-full border border-emerald-400/60 bg-emerald-400/20 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-ping"></div>
            <div class="relative h-5 w-5 rounded-full border-2 border-white bg-gradient-to-tr from-emerald-500 to-teal-300 shadow-[0_0_15px_rgba(16,185,129,0.8)] flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <div class="absolute left-1/2 top-[calc(100%-0.3rem)] -translate-x-1/2 h-3.5 w-1.5 rounded-b-full bg-gradient-to-b from-teal-400 to-emerald-700 shadow-md"></div>
          </div>
        </div>
      `;
      destinationMarkerRef.current = new maplibregl.Marker({ element: destEl, anchor: "bottom" })
        .setLngLat([dLon, dLat])
        .addTo(map);
    } else {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
        destinationMarkerRef.current = null;
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

  // Renders high-tech 500m civic inspection catchment perimeter circle
  const renderRadarZone = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const sourceId = "audit-zone-source";
    const glowLayerId = "audit-zone-glow";
    const fillLayerId = "audit-zone-fill";
    const lineLayerId = "audit-zone-line";

    if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
    if (map.getLayer(glowLayerId)) map.removeLayer(glowLayerId);
    if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    if (!selectedCoords) return;

    // Generate 64-vertex circle polygon (0.55 km radius)
    const radiusKm = 0.55;
    const points = 64;
    const coords: [number, number][] = [];
    const kmLat = radiusKm / 110.574;
    const kmLng = radiusKm / (111.32 * Math.cos((selectedCoords.lat * Math.PI) / 180));

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * (2 * Math.PI);
      const lng = selectedCoords.lng + kmLng * Math.cos(angle);
      const lat = selectedCoords.lat + kmLat * Math.sin(angle);
      coords.push([lng, lat]);
    }
    coords.push(coords[0]);

    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [coords],
        },
        properties: {},
      },
    });

    map.addLayer({
      id: fillLayerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": "#06b6d4",
        "fill-opacity": activeTileStyle === "satellite" ? 0.22 : 0.12,
      },
    });

    map.addLayer({
      id: glowLayerId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": "#00f0ff",
        "line-width": 6,
        "line-opacity": 0.45,
        "line-blur": 3,
      },
    });

    map.addLayer({
      id: lineLayerId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": "#38bdf8",
        "line-width": 1.75,
        "line-dasharray": [2.5, 2],
        "line-opacity": 0.85,
      },
    });
  }, [selectedCoords, activeTileStyle]);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: TILE_STYLES[activeTileStyle],
      center: [88.3516, 22.5645], // Default Hotspot: Kolkata Central
      zoom: 13.5,
      pitch: 42,
      bearing: -12,
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

    mapInstance.on("mousemove", (e) => {
      setCursorCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    });

    mapInstance.on("style.load", () => {
      renderRouteOnMap();
      renderRadarZone();
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

  // Update radar catchment circle when selected coordinates change
  useEffect(() => {
    renderRadarZone();
  }, [renderRadarZone]);

  // Handle switching map styles
  const handleSelectStyle = useCallback((styleKey: MapStyleKey) => {
    if (!mapRef.current || styleKey === activeTileStyle) return;
    setActiveTileStyle(styleKey);
    mapRef.current.setStyle(TILE_STYLES[styleKey]);
  }, [activeTileStyle]);

  // Toggle 3D perspective pitch
  const handleToggle3D = useCallback(() => {
    if (!mapRef.current) return;
    const next3D = !is3D;
    setIs3D(next3D);
    mapRef.current.easeTo({
      pitch: next3D ? 45 : 0,
      bearing: next3D ? -15 : 0,
      duration: 700,
    });
  }, [is3D]);

  // Update target marker pin whenever selected coordinates change
  useEffect(() => {
    if (!mapRef.current || !selectedCoords) return;

    const { lat, lng } = selectedCoords;

    // Only fly to origin coordinate if we don't have an active route being rendered
    if (!activeRoute) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 14.5,
        pitch: is3D ? 42 : 0,
        essential: true,
        duration: 1600,
      });
    }

    // Create or position the high-tech tactical animated marker
    if (!markerRef.current) {
      const el = document.createElement("div");
      el.className = "pointer-events-none select-none";
      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="px-2.5 py-1 mb-1 rounded-full bg-slate-950/90 border border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.5)] backdrop-blur-md flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-300">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
          <span class="tracking-wider">AUDIT TARGET</span>
          <span class="text-slate-500">|</span>
          <span class="text-cyan-200 text-[9px] font-mono">${lat.toFixed(4)}°, ${lng.toFixed(4)}°</span>
        </div>
        <div class="relative flex items-center justify-center w-12 h-12">
          <div class="absolute h-12 w-12 rounded-full border-2 border-cyan-400/80 bg-cyan-400/20 shadow-[0_0_30px_rgba(34,211,238,0.6)] animate-ping"></div>
          <div class="absolute h-8 w-8 rounded-full border border-sky-300/50 bg-sky-500/10 animate-pulse"></div>
          <div class="absolute h-6 w-6 rounded-full border border-dashed border-cyan-300/70 animate-[spin_8s_linear_infinite]"></div>
          <div class="relative h-4 w-4 rounded-full border-2 border-white bg-gradient-to-tr from-cyan-400 via-sky-300 to-emerald-300 shadow-[0_0_20px_rgba(56,189,248,1)] flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
          </div>
          <div class="absolute left-1/2 top-[calc(100%-0.55rem)] -translate-x-1/2 h-3.5 w-1.5 rounded-b-full bg-gradient-to-b from-cyan-400 to-blue-600 shadow-md"></div>
        </div>
      </div>
    `;

      markerRef.current = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
    } else {
      markerRef.current.setLngLat([lng, lat]);
      // Update badge coordinates dynamically
      const badgeSpan = markerRef.current.getElement().querySelector(".font-mono:last-child");
      if (badgeSpan) {
        badgeSpan.textContent = `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
      }
    }
  }, [selectedCoords, activeRoute, is3D]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* MapLibre Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Cinematic Map Vignette and Tactical Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_120px_rgba(2,6,23,0.7)]" />

      {/* Floating Tactical Layer & Camera HUD Dock (Bottom-Left) */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        {/* Style Selector Pill */}
        <div className="flex items-center gap-1 rounded-2xl border border-slate-700/80 bg-slate-950/80 p-1 shadow-[0_20px_50px_rgba(2,6,23,0.7)] backdrop-blur-md">
          <button
            onClick={() => handleSelectStyle("dark")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all ${
              activeTileStyle === "dark"
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
            title="Tactical Dark Mode (Carto Dark Matter)"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Tactical Dark</span>
          </button>

          <button
            onClick={() => handleSelectStyle("satellite")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all ${
              activeTileStyle === "satellite"
                ? "bg-gradient-to-r from-emerald-500/25 to-teal-600/30 text-emerald-300 border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
            title="High-Resolution Satellite Picture (ESRI World Imagery)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Satellite Photo</span>
          </button>

          <button
            onClick={() => handleSelectStyle("voyager")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all ${
              activeTileStyle === "voyager"
                ? "bg-gradient-to-r from-amber-500/20 to-orange-600/30 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
            title="Daylight Streets (Carto Voyager)"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Streets</span>
          </button>
        </div>

        {/* 3D Perspective Toggle Button */}
        <button
          onClick={handleToggle3D}
          className={`flex items-center gap-1.5 rounded-2xl border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-xs font-mono font-medium shadow-[0_20px_50px_rgba(2,6,23,0.7)] backdrop-blur-md transition-all hover:border-cyan-500/50 ${
            is3D
              ? "text-cyan-300 border-cyan-500/40 bg-cyan-950/20"
              : "text-slate-400 hover:text-white"
          }`}
          title="Toggle 3D Perspective / 2D Flat View"
        >
          <Compass className={`w-3.5 h-3.5 ${is3D ? "text-cyan-400 animate-spin" : ""}`} />
          <span>{is3D ? "3D Tilt (42°)" : "2D Flat"}</span>
        </button>

        {/* Active Catchment Radius Chip */}
        {selectedCoords && (
          <div className="hidden lg:flex items-center gap-1.5 rounded-2xl border border-cyan-500/30 bg-slate-950/80 px-3 py-2 text-xs font-mono text-cyan-300 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>550m Telemetry Zone</span>
          </div>
        )}
      </div>

      {/* Coordinates HUD Cursor Tracker (Bottom-Right, before navigation controls) */}
      {cursorCoords && (
        <div className="absolute bottom-6 right-20 z-20 hidden md:flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 px-3 py-1.5 text-[10px] font-mono text-slate-400 backdrop-blur-md">
          <Crosshair className="w-3 h-3 text-cyan-400/80" />
          <span>
            {cursorCoords.lat.toFixed(4)}°N, {cursorCoords.lng.toFixed(4)}°E
          </span>
        </div>
      )}
    </div>
  );
};

export default MapView;
