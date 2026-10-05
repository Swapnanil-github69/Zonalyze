import React from "react";
import { Navigation } from "../components/landing/Navigation";
import { HeroSection } from "../components/landing/HeroSection";
import { IntroEditorialSection } from "../components/landing/IntroEditorialSection";
import { EvidenceCategoriesSection } from "../components/landing/EvidenceCategoriesSection";
import { InvestigationPreviewSection } from "../components/landing/InvestigationPreviewSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { ResponsibleIntelligenceSection } from "../components/landing/ResponsibleIntelligenceSection";
import { FinalCTASection } from "../components/landing/FinalCTASection";
import { CinematicFooter } from "../components/landing/CinematicFooter";

interface LandingPageProps {
  onNavigateToInvestigation: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToInvestigation }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#161b13] text-[#dde2e4] selection:bg-[#e2ffcc] selection:text-[#161b13] overflow-x-hidden font-mono antialiased">
      {/* 1. San Rita Minimal Navigation Header */}
      <Navigation onStartInvestigation={onNavigateToInvestigation} />

      {/* Main Editorial Flow */}
      <main>
        {/* 2. Illustrated hero */}
        <HeroSection onStartInvestigation={onNavigateToInvestigation} />

        {/* 3. Short "what ZONALYZE investigates" introduction */}
        <IntroEditorialSection />

        {/* 4. Four evidence categories */}
        <EvidenceCategoriesSection />

        {/* 5. A small, clearly labeled investigation preview */}
        <InvestigationPreviewSection onLaunchInvestigation={onNavigateToInvestigation} />

        {/* 6. How it works */}
        <HowItWorksSection />

        {/* 7. Evidence and responsible interpretation section */}
        <ResponsibleIntelligenceSection />

        {/* 8. Final invitation to investigate a location */}
        <FinalCTASection onStartInvestigation={onNavigateToInvestigation} />
      </main>

      {/* 9. Editorial footer */}
      <CinematicFooter />
    </div>
  );
};

export default LandingPage;
