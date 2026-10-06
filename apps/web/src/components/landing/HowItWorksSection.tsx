import React from "react";
import { Search, Database, FileCheck, BookOpen } from "lucide-react";
import { useLandingTheme } from "../../context/LandingThemeContext";

export const HowItWorksSection: React.FC = () => {
  const { theme } = useLandingTheme();
  const isLiterary = theme === "literary";

  const steps = [
    {
      number: "01",
      title: isLiterary ? "Coordinate Entry" : "COORDINATE ENTRY",
      icon: Search,
      description: "Input exact decimal degrees, search a municipal locality, or select a pinpoint directly on the cartographic canvas.",
      clarification: "[GLOBAL COVERAGE // ACCEPTS DUAL-PRECISION EPSG:4326]",
    },
    {
      number: "02",
      title: isLiterary ? "Observation Harvest" : "OBSERVATION HARVEST",
      icon: Database,
      description: "Query open-access atmospheric arrays, regional digital elevation profiles, and mapped urban infrastructure nodes.",
      clarification: "[REST API // SENSOR FRESHNESS TIMESTAMPED IN-SITU]",
    },
    {
      number: "03",
      title: isLiterary ? "Limitation Preservation" : "LIMITATION PRESERVATION",
      icon: FileCheck,
      description: "Inspect measured values, sensor radii, and spatial gaps. Missing provider measurements are preserved rather than invented.",
      clarification: "[UNCERTAINTY EXPLICIT // NO SYNTHETIC RATINGS]",
    },
    {
      number: "04",
      title: isLiterary ? "Grounded Dossier" : "GROUNDED DOSSIER",
      icon: BookOpen,
      description: "Review a deterministic synthesis and narrative debrief derived strictly from verified retrieval records.",
      clarification: "[ZERO HALLUCINATION // FIELD EVIDENCE ONLY]",
    },
  ];

  return (
    <section
      id="how-it-works"
      className={`relative w-full py-20 overflow-hidden transition-colors duration-500 ${
        isLiterary
          ? "bg-[#fefffc] border-b border-[#dee2de] text-[#444141]"
          : "bg-[#161b13] text-[#dde2e4] border-b border-[#84907f]/30"
      }`}
    >
      {/* Ambient background light & grid */}
      {isLiterary ? (
        <div className="absolute inset-0 topographic-grid-dark opacity-10 pointer-events-none" />
      ) : (
        <>
          <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-[#e2ffcc]/5 rounded-full liquid-caustic-blob pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#84907f]/8 rounded-full liquid-caustic-blob pointer-events-none" style={{ animationDelay: "-7s" }} />
          <div className="absolute inset-0 topographic-grid opacity-30 pointer-events-none" />
        </>
      )}

      <div className="relative w-full px-6 sm:px-12 space-y-12">
        
        {/* Section Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 pb-4 text-xs tracking-wider uppercase border-b ${
            isLiterary
              ? "border-[#dee2de] font-editorial-sans text-[#646464]"
              : "border-[#84907f]/30 font-editorial-sans text-[11px] text-[#84907f]"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 inline-block ${isLiterary ? "bg-[#41a1cf] rounded-full" : "bg-[#e2ffcc] animate-pulse"}`} />
            <span className={`font-bold ${isLiterary ? "text-[#2c2c2c]" : "text-[#e2ffcc]"}`}>
              {isLiterary ? "Pipeline Specification" : "PIPELINE SPECIFICATION"}
            </span>
          </div>
          <div
            className={`px-3 py-1 font-medium font-editorial-sans ${
              isLiterary
                ? "gic-card bg-[#ffffff] border border-[#dee2de] text-[11px] text-[#444141] rounded-full shadow-none"
                : "px-2.5 py-1 glass-badge text-[10px] text-[#e2ffcc]"
            }`}
          >
            <span>
              {isLiterary ? "Deterministic retrieval protocol" : "DETERMINISTIC RETRIEVAL PROTOCOL"}
            </span>
          </div>
        </div>

        <div className="max-w-4xl space-y-4 text-left">
          <h2 className={`font-editorial-serif font-normal text-3xl sm:text-5xl lg:text-[54px] tracking-[-0.03em] leading-[1.1] ${
            isLiterary ? "text-[#2c2c2c]" : "text-[#e2ffcc]"
          }`}>
            Methodology.
          </h2>

          <p
            className={`text-sm sm:text-[15px] leading-relaxed max-w-2xl font-editorial-sans font-normal ${
              isLiterary ? "text-[#444141]" : "text-[#84907f]"
            }`}
          >
            Our pipeline prioritizes verifiable physical observations prior to analytical synthesis. Missing signals are left visible as spatial gaps.
          </p>
        </div>

        {/* 4 Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.number}
                className={`p-6 flex flex-col justify-between space-y-5 text-left transition-all duration-300 ${
                  isLiterary
                    ? "gic-card bg-[#ffffff] border border-[#dee2de] rounded-xl hover:border-[#b4b8b4]"
                    : "glass-card border border-[#84907f]/30 hover:border-[#e2ffcc]/40"
                }`}
              >
                <div className="space-y-3.5">
                  <div
                    className={`w-8 h-8 flex items-center justify-center ${
                      isLiterary
                        ? "rounded-full bg-[#f9faf7] border border-[#dee2de] text-[#282834]"
                        : "glass-badge text-[#e2ffcc] border border-[#e2ffcc]/40"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <h3
                    className={`text-xl sm:text-2xl tracking-tight font-editorial-serif font-normal ${
                      isLiterary
                        ? "text-[#2c2c2c]"
                        : "text-[#dde2e4]"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed font-editorial-sans ${
                      isLiterary ? "text-[#444141] text-[13px]" : "text-[#dde2e4]/90"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>

                <div
                  className={`pt-4 border-t text-xs leading-relaxed font-editorial-sans ${
                    isLiterary
                      ? "border-[#dee2de] text-[#646464] text-[10px]"
                      : "border-[#84907f]/20 text-[11px] text-[#84907f]"
                  }`}
                >
                  {step.clarification}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
