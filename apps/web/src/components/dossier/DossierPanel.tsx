import React, { useState, useEffect, useRef } from "react";
import { InvestigationResult, AuditStage } from "../../types/investigation";
import { DossierHeader } from "./DossierHeader";
import { LivabilityGauge } from "./LivabilityGauge";
import { AirQualityCard } from "./AirQualityCard";
import { InfrastructureCard } from "./InfrastructureCard";
import { NoiseProfileCard } from "./NoiseProfileCard";
import { AiChatWidget } from "./AiChatWidget";
import { ForensicReportCard } from "./ForensicReportCard";
import { DossierSkeleton } from "./DossierSkeleton";
import { calculateLivabilityScore } from "../../utils/livabilityMetrics";
import { X } from "lucide-react";

import { SelectedFacility } from "./InfrastructureCard";

interface DossierPanelProps {
  investigation: InvestigationResult | null;
  isOpen: boolean;
  isLoading?: boolean;
  stage?: AuditStage;
  selectedCoords?: { lat: number; lng: number } | null;
  selectedFacility?: SelectedFacility | null;
  onSelectFacility?: (facility: SelectedFacility) => void;
  onClose: () => void;
}

export type SheetSnapState = "closed" | "partial" | "full";

export const DossierPanel: React.FC<DossierPanelProps> = ({
  investigation,
  isOpen,
  isLoading = false,
  stage = "idle",
  selectedCoords,
  selectedFacility,
  onSelectFacility,
  onClose,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const environmentRef = useRef<HTMLDivElement | null>(null);
  const [panelHeight, setPanelHeight] = useState<number>(75);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(75);

  // Reset to default 75% height whenever dossier opens
  useEffect(() => {
    if (isOpen) {
      setPanelHeight(75);
      setIsDragging(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isLoading || !investigation) return;

    const content = contentRef.current;
    const environment = environmentRef.current;
    if (!content || !environment) return;

    content.scrollTo({
      top: content.scrollTop + environment.getBoundingClientRect().top - content.getBoundingClientRect().top,
      behavior: "smooth",
    });
  }, [investigation, isLoading, isOpen]);

  // Start real-time drag interaction
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startYRef.current = clientY;
    startHeightRef.current = panelHeight;
    setIsDragging(true);
  };

  // 1:1 Real-time finger tracking between 50% and 100% dvh
  useEffect(() => {
    const handleMove = (e: TouchEvent | MouseEvent) => {
      if (!isDragging) return;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - startYRef.current;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || 800;

      // Inverted: moving up decreases clientY, increasing height
      const deltaPercent = -(deltaY / windowHeight) * 100;
      let newHeight = startHeightRef.current + deltaPercent;

      // Clamp between 30% (threshold for drag-down dismissal) and 100%
      newHeight = Math.max(30, Math.min(100, newHeight));
      setPanelHeight(newHeight);
    };

    const handleEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);

      setPanelHeight((current) => {
        if (current < 42) {
          onClose();
          return 75;
        }
        if (current > 88) return 100; // Snap to full screen
        if (current < 60) return 50;  // Snap to half screen
        return 75;                    // Settle at comfortable 75% default
      });
    };

    if (isDragging) {
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleEnd);
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
    }

    return () => {
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
    };
  }, [isDragging, onClose]);

  const handleScrollTouchStart = (e: React.TouchEvent) => {
    if (contentRef.current && contentRef.current.scrollTop <= 0) {
      const clientY = e.touches[0].clientY;
      startYRef.current = clientY;
      startHeightRef.current = panelHeight;
    }
  };

  const handleScrollTouchMove = (e: React.TouchEvent) => {
    if (!contentRef.current || contentRef.current.scrollTop > 0) return;
    const clientY = e.touches[0].clientY;
    const deltaY = clientY - startYRef.current;
    // If pulling downwards while at top of scroll
    if (deltaY > 12) {
      if (!isDragging) {
        setIsDragging(true);
      }
    }
  };

  const handleToggleSnap = () => {
    setPanelHeight((prev) => (prev >= 90 ? 75 : 100));
  };

  // Compute livability score if investigation available
  const livabilityScore = investigation
    ? investigation.livabilityScore ||
      calculateLivabilityScore(
        investigation.environment,
        investigation.infrastructure,
        investigation.noiseProfile
      )
    : null;

  if (!investigation && !isLoading) return null;

  const snapState: SheetSnapState = !isOpen ? "closed" : panelHeight >= 90 ? "full" : "partial";

  return (
    <>
      {/* 1. Backdrop Overlay (Mobile only - smooth fade) */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 2. Responsive Continuous Drag Sheet */}
      <aside
        style={{
          height: isOpen ? `${panelHeight}dvh` : "0dvh",
        }}
        className={`fixed z-50 glass-panel-elevated bg-[#0c101a]/95 border-slate-700/60 shadow-2xl flex flex-col overflow-hidden will-change-[height,transform]
          /* Mobile styles: dynamic height bottom-sheet */
          inset-x-0 bottom-0 rounded-t-[28px] border-t
          ${isDragging ? "transition-none" : "transition-[height,transform] duration-300 ease-out"}
          ${
            !isOpen
              ? "translate-y-full md:translate-x-full pointer-events-none border-transparent"
              : "translate-y-0 md:translate-x-0 pointer-events-auto"
          }
          /* Desktop constraints: resets to standard fixed right sidebar */
          md:!h-full md:inset-y-0 md:right-0 md:left-auto md:w-[480px] md:rounded-none md:border-l md:border-t-0 md:!translate-y-0
        `}
        aria-label="Location Audit Dossier"
      >
        {/* DRAG HANDLE BAR (1:1 Real-time touch tracking surface) */}
        <div 
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className="flex flex-col items-center justify-center pt-2.5 pb-1 md:hidden shrink-0 cursor-grab active:cursor-grabbing select-none touch-none bg-[#0c101a]"
          title="Drag to resize (50% - 100%) or tap to toggle fullscreen"
        >
          <div className="h-1.5 w-14 rounded-full bg-slate-700/80 active:bg-cyan-400 transition-colors" />
          <span className="text-[9px] text-slate-400 font-mono mt-0.5 tracking-wider uppercase">
            {panelHeight >= 90 ? "▼ Drag down to resize" : "▲ Drag up for fullscreen"}
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            <div 
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              className="p-4 border-b border-slate-700/60 flex items-center justify-between bg-slate-900/80 shrink-0 sticky top-0 z-20 select-none cursor-grab active:cursor-grabbing"
            >
              <span className="text-[15px] font-semibold text-slate-200 tracking-[-0.01em]" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                Location Audit in Progress
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleToggleSnap}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition md:hidden"
                  aria-label={panelHeight >= 90 ? "Minimize sheet" : "Fullscreen sheet"}
                >
                  {panelHeight >= 90 ? "🗗" : "🗖"}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  aria-label="Close dossier"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y custom-dossier-scroll p-4 pb-16">
              <DossierSkeleton
                stage={stage}
                lat={selectedCoords?.lat}
                lng={selectedCoords?.lng}
              />
            </div>
          </div>
        ) : investigation ? (
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            {/* 1. Top Header with Drag Tracking and Snap Controls */}
            <div 
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              className="shrink-0 sticky top-0 z-20 select-none cursor-grab active:cursor-grabbing"
            >
              <DossierHeader
                investigation={investigation}
                onClose={onClose}
                snapState={snapState}
                onToggleSnap={handleToggleSnap}
              />
            </div>

            {/* Scrollable Dossier Content with Scroll-Down Handoff */}
            <div 
              ref={contentRef} 
              onTouchStart={handleScrollTouchStart}
              onTouchMove={handleScrollTouchMove}
              className={`flex-1 min-h-0 overscroll-contain touch-pan-y custom-dossier-scroll p-5 space-y-4 pb-20 md:pb-12 ${
                panelHeight < 55 ? "overflow-hidden" : "overflow-y-auto"
              }`}
            >
              {/* 2. Livability Score Ring/Gauge */}
              {livabilityScore && <LivabilityGauge livability={livabilityScore} />}

              {/* 3. Environment Telemetry Card */}
              <div ref={environmentRef}>
                <AirQualityCard
                  environment={investigation.environment}
                  coordinates={investigation.location.coordinates}
                />
              </div>

              {/* AI Assistant / Gemma Chatbox */}
              <AiChatWidget investigation={investigation} />

              {/* 4. Acoustic Noise Profile Card */}
              <NoiseProfileCard noiseProfile={investigation.noiseProfile} />

              {/* 5. Nearest Facilities & Proximity Grid */}
              <InfrastructureCard
                infrastructure={investigation.infrastructure}
                coordinates={investigation.location.coordinates}
                address={investigation.address}
                facilities={investigation.facilities}
                selectedFacility={selectedFacility}
                onSelectFacility={onSelectFacility}
              />

              {/* 6. AI Forensic Debrief & Inspection Targets */}
              <ForensicReportCard
                aiReport={investigation.aiReport}
                investigation={investigation}
              />
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
};
