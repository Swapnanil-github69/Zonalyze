import React from "react";
import { Navigation } from "../components/landing/Navigation";
import { HeroSection } from "../components/landing/HeroSection";
import { IntelligenceLayersSection } from "../components/landing/IntelligenceLayersSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { InvestigationPreviewSection } from "../components/landing/InvestigationPreviewSection";
import { FinalCTASection } from "../components/landing/FinalCTASection";
import { CinematicFooter } from "../components/landing/CinematicFooter";

interface LandingPageProps {
  onNavigateToInvestigation: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToInvestigation }) => {
  const scrollToExplore = () => {
    const el = document.getElementById("layers");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B1719] text-[#F1F0E9] selection:bg-[#B6C6A3] selection:text-[#0B1719] overflow-x-hidden font-sans">
      {/* 01. Fixed Minimal Dark Editorial Navigation */}
      <Navigation onStartInvestigation={onNavigateToInvestigation} />

      {/* Main Editorial Experience */}
      <main>
        {/* EXISTING HOMEPAGE HERO SECTION — 100% PRESERVED & UNMODIFIED */}
        <HeroSection
          onStartInvestigation={onNavigateToInvestigation}
          onExploreCapabilities={scrollToExplore}
        />

        {/* Intelligence Capabilities: "Understand What Surrounds You." */}
        <IntelligenceLayersSection />

        {/* Investigation Pipeline: "From a Point on the Map to a Deeper Understanding." */}
        <HowItWorksSection />

        {/* Location Investigation Workspace: "Your Window Into Any Location." */}
        <InvestigationPreviewSection onLaunchInvestigation={onNavigateToInvestigation} />

        {/* Final CTA: "Every Coordinate Has a Story Waiting to Be Understood." */}
        <FinalCTASection onStartInvestigation={onNavigateToInvestigation} />
      </main>

      {/* FOOTER matching Reference Screenshot */}
      <CinematicFooter />
    </div>
  );
};

export default LandingPage;
