import React, { useState } from "react";

interface CinematicBackgroundProps {
  videoUrl?: string;
  className?: string;
  children?: React.ReactNode;
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  videoUrl = "https://designerstephen.github.io/public-assets/videos/serene-art-hero.mp4",
  className = "",
  children,
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <div className={`relative w-full overflow-hidden bg-[#001B22] ${className}`}>
      {/* Deep Navy / Atmospheric Fallback Canvas */}
      <div className="absolute inset-0 bg-[#001B22] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#001B22] via-[#062630] to-[#001B22]" />
        {/* Subtle radial aerial warmth */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-tr from-[#91B9C5]/12 via-[#0A3038]/30 to-transparent rounded-full blur-[140px]" />
      </div>

      {/* Full-bleed Background Video */}
      {!videoError && (
        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${
            videoLoaded ? "opacity-60" : "opacity-0"
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Static Atmospheric Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001B22]/75 via-[#001B22]/45 to-[#001B22]/95 pointer-events-none" />

      {/* Subtle Fine Grain / Coordinate Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Content slot */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
