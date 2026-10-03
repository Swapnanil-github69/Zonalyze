import React from "react";
import { InvestigationResult } from "../../types/investigation";
import { DossierHeader } from "./DossierHeader";
import { AirQualityCard } from "./AirQualityCard";
import { InfrastructureCard } from "./InfrastructureCard";
import { NoiseProfileCard } from "./NoiseProfileCard";
import { ForensicReportCard } from "./ForensicReportCard";

interface DossierPanelProps {
  investigation: InvestigationResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DossierPanel: React.FC<DossierPanelProps> = ({
  investigation,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !investigation) return null;

  return (
    <aside className="fixed top-0 right-0 h-full w-full sm:w-[460px] z-30 flex flex-col glass-panel-elevated border-l border-slate-700/60 shadow-2xl transition-transform duration-300 ease-out">
      <DossierHeader investigation={investigation} onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Air Quality Telemetry Card */}
        <AirQualityCard environment={investigation.environment} />

        {/* Infrastructure Density Card */}
        <InfrastructureCard infrastructure={investigation.infrastructure} />

        {/* Acoustic Noise Model Card */}
        <NoiseProfileCard noiseProfile={investigation.noiseProfile} />

        {/* Grounded AI Forensic Debrief Card */}
        <ForensicReportCard aiReport={investigation.aiReport} />
      </div>
    </aside>
  );
};
