import React, { useEffect, useRef } from "react";
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

  if (!isOpen) return null;

  // Compute livability score if investigation available
  const livabilityScore = investigation
    ? investigation.livabilityScore ||
    calculateLivabilityScore(
      investigation.environment,
      investigation.infrastructure,
      investigation.noiseProfile
    )
    : null;

  return (
    <aside
      className="fixed top-0 right-0 h-full w-full sm:w-[480px] z-30 flex flex-col glass-panel-elevated border-l border-slate-700/60 shadow-2xl transition-all duration-300 ease-out"
      aria-label="Location Audit Dossier"
    >
      {isLoading ? (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between bg-slate-900/80">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Location Audit in Progress
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <DossierSkeleton
            stage={stage}
            lat={selectedCoords?.lat}
            lng={selectedCoords?.lng}
          />
        </div>
      ) : investigation ? (
        <>
          {/* 1. Top Header */}
          <DossierHeader investigation={investigation} onClose={onClose} />

          {/* Scrollable Dossier Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto p-5 space-y-4">
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
        </>
      ) : null}
    </aside>
  );
};
