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
import { useLandingTheme } from "../context/LandingThemeContext";

interface LandingPageProps {
  onNavigateToInvestigation: (lat?: number, lon?: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToInvestigation }) => {
  const { theme } = useLandingTheme();
  const isLiterary = theme === "literary";

  return (
    <div
      className={`relative min-h-screen w-full overflow-x-hidden antialiased transition-colors duration-500 ${
        isLiterary
          ? "bg-[#fefffc] text-[#444141] font-editorial-sans selection:bg-[#41a1cf]/20 selection:text-[#171717]"
          : "bg-[#161b13] text-[#dde2e4] font-mono selection:bg-[#e2ffcc] selection:text-[#161b13]"
      }`}
    >
      {/* 1. Navigation Header with Theme Toggle */}
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

export { LandingHeroSearch } from "../components/landing/HeroSection";
export default LandingPage;
