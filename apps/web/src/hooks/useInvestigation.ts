import { useState, useCallback } from "react";
import { InvestigationResult, AuditStage } from "../types/investigation";
import { investigateCoordinates } from "../api/client";

export function useInvestigation() {
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [stage, setStage] = useState<AuditStage>("idle");
  const [investigation, setInvestigation] = useState<InvestigationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  const triggerInvestigation = useCallback(async (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
    setError(null);
    setInvestigation(null);
    setIsDossierOpen(true);
    setStage("checking_cache");

    // Simulate stage updates for clear UX feedback while awaiting backend response
    const stageTimer1 = setTimeout(() => setStage("ingesting_telemetry"), 350);
    const stageTimer2 = setTimeout(() => setStage("computing_heuristics"), 1200);
    const stageTimer3 = setTimeout(() => setStage("synthesizing_ai"), 2200);

    try {
      const result = await investigateCoordinates(lat, lng);
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      setInvestigation(result);
      setStage("completed");
      setIsDossierOpen(true);
    } catch (err: any) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      console.error("Audit failed:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to complete location investigation. Please try again."
      );
      setStage("error");
    }
  }, []);

  const closeDossier = useCallback(() => {
    setIsDossierOpen(false);
  }, []);

  const openDossier = useCallback(() => {
    if (investigation) {
      setIsDossierOpen(true);
    }
  }, [investigation]);

  return {
    selectedCoords,
    stage,
    investigation,
    error,
    isDossierOpen,
    triggerInvestigation,
    closeDossier,
    openDossier,
  };
}
