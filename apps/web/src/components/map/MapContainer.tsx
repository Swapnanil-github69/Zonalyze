import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

interface MapContainerProps {
  onCoordinateClick: (lat: number, lng: number) => void;
  selectedCoords: { lat: number; lng: number } | null;
}

/**
 * Contributor 3: Frontend Map Lead
 * MapLibre GL JS Container:
 * Renders full-screen vector basemap using Carto Voyager (Zero Mapbox API key requirement).
 */
export const MapContainer: React.FC<MapContainerProps> = ({
  onCoordinateClick,
  selectedCoords,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize MapLibre GL map with Carto Voyager style
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      center: [77.209, 28.6139], // Default: New Delhi
      zoom: 12,
      pitch: 30,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "bottom-right");

    // Handle map clicks
    map.current.on("click", (e) => {
      const { lat, lng } = e.lngLat;
      onCoordinateClick(lat, lng);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [onCoordinateClick]);

  // Update target marker pin whenever selected coordinates change
  useEffect(() => {
    if (!map.current || !selectedCoords) return;

    const { lat, lng } = selectedCoords;

    // Fly map camera to coordinate
    map.current.flyTo({
      center: [lng, lat],
      zoom: 14,
      essential: true,
      duration: 1500,
    });

    // Create or move animated pin marker
    if (!marker.current) {
      const el = document.createElement("div");
      el.className = "relative flex items-center justify-center cursor-pointer";
      el.innerHTML = `
        <div class="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-ping"></div>
        <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      `;

      marker.current = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map.current);
    } else {
      marker.current.setLngLat([lng, lat]);
    }
  }, [selectedCoords]);

  return <div ref={mapContainer} className="w-full h-full absolute inset-0 z-0" />;
};
