import React from "react";
import { Navigation } from "../components/landing/Navigation";
import { HeroSection } from "../components/landing/HeroSection";
import { StorySection } from "../components/landing/StorySection";
import { IntelligenceDimensions } from "../components/landing/IntelligenceDimensions";
import { GeographicModel } from "../components/landing/GeographicModel";
import { HowItWorks } from "../components/landing/HowItWorks";
import { EvidenceSection } from "../components/landing/EvidenceSection";
import { FinalCTA } from "../components/landing/FinalCTA";
import { Footer } from "../components/landing/Footer";

interface LandingPageProps {
  onNavigateToInvestigation: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToInvestigation }) => {
  const scrollToExplore = () => {
    const el = document.getElementById("explore");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B1D2A] text-[#F4F7F8] selection:bg-[#123747] selection:text-white overflow-x-hidden font-sans">
      {/* 01. Navigation */}
      <Navigation onStartInvestigation={onNavigateToInvestigation} />

      {/* Main Editorial Flow */}
      <main>
        {/* 01. Hero: Existing cinematic mountain background with dark teal overlay */}
        <HeroSection
          onStartInvestigation={onNavigateToInvestigation}
          onExploreCapabilities={scrollToExplore}
        />

        {/* 02. Explore: Warm editorial surface with geographic intelligence visualization */}
        <IntelligenceDimensions onExplore={onNavigateToInvestigation} />

        {/* 03. About Zonalyze: Natural architectural surface with 3D context model */}
        <StorySection onExplore={onNavigateToInvestigation} />

        {/* 04. Technology / Spatial Engine: Architectural 3D model */}
        <GeographicModel onStartExploring={onNavigateToInvestigation} />

        {/* 05. How It Works: Light neutral architectural background */}
        <HowItWorks />

        {/* 06. Evidence & Transparency: Solid dark surfaces */}
        <EvidenceSection />

        {/* 07. Final Call To Action: Cinematic dark landscape */}
        <FinalCTA onInvestigateLocation={onNavigateToInvestigation} />
      </main>

      {/* 08. Footer: Multi-column professional footer */}
      <Footer onStartInvestigation={onNavigateToInvestigation} />
    </div>
  );
};

export default LandingPage;

