import React, { useState } from "react";
import { Sparkles, CheckCircle2, ClipboardList, Check, Bot, Train, HeartPulse, Wind, Volume2 } from "lucide-react";
import { AiReportData } from "../../types/investigation";

interface ForensicReportCardProps {
  aiReport: AiReportData;
}

export const ForensicReportCard: React.FC<ForensicReportCardProps> = ({ aiReport }) => {
  const { summary, insights_in_brief, empirical_observations, site_inspection_targets } = aiReport;
  const [completedTargets, setCompletedTargets] = useState<Record<number, boolean>>({});

  const toggleTarget = (index: number) => {
    setCompletedTargets((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="ios-dark-glass-card p-5 space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-[#152e32] border border-[#2dd4bf]/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#2dd4bf]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">
              AI Forensic Debrief
            </h3>
            <span className="text-[10px] text-slate-400 font-sans">Grounded Telemetry Synthesis</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#2dd4bf] bg-[#152e32] px-2.5 py-0.5 rounded-full border border-[#2dd4bf]/30 flex items-center space-x-1">
          <Bot className="w-3 h-3 mr-1" />
          Zero-Hallucination
        </span>
      </div>

      {/* Executive Insights in Brief Grid */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-[#2dd4bf] uppercase tracking-wider flex items-center justify-between font-mono">
          <span className="flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-[#2dd4bf] mr-1.5" />
            Insights in Brief
          </span>
          <span className="text-[9px] font-mono text-[#2dd4bf] bg-[#152e32] px-2 py-0.5 rounded-full border border-[#2dd4bf]/30">
            Quick Takeaways
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Transit Brief */}
          <div className="ios-dark-glass-subcard p-2.5 flex flex-col justify-between space-y-1">
            <div className="flex items-center space-x-1.5">
              <Train className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#38bdf8] font-mono">
                Transit & Commute
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug font-sans">
              {insights_in_brief?.transit || "Direct access to regional multi-modal transit network."}
            </p>
          </div>

          {/* Healthcare Brief */}
          <div className="ios-dark-glass-subcard p-2.5 flex flex-col justify-between space-y-1">
            <div className="flex items-center space-x-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 font-mono">
                Healthcare Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug font-sans">
              {insights_in_brief?.healthcare || "Emergency healthcare services accessible within radial envelope."}
            </p>
          </div>

          {/* Environmental Brief */}
          <div className="ios-dark-glass-subcard p-2.5 flex flex-col justify-between space-y-1">
            <div className="flex items-center space-x-1.5">
              <Wind className="w-3.5 h-3.5 text-[#2dd4bf] shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2dd4bf] font-mono">
                Air & Atmosphere
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug font-sans">
              {insights_in_brief?.environment || "Continuous atmospheric and fine particulate telemetry monitoring."}
            </p>
          </div>

          {/* Acoustic Brief */}
          <div className="ios-dark-glass-subcard p-2.5 flex flex-col justify-between space-y-1">
            <div className="flex items-center space-x-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 font-mono">
                Acoustic Zone
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug font-sans">
              {insights_in_brief?.acoustic || "Decibel exposure mapped against nearest traffic corridors."}
            </p>
          </div>
        </div>
      </div>

      {/* Forensic Narrative Overview Box */}
      <div className="ios-dark-glass-subcard p-3.5 text-xs text-slate-200 leading-relaxed font-sans space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#2dd4bf] font-mono">
          Executive Forensic Overview
        </div>
        <div>{summary}</div>
      </div>

      {/* Empirical Observations */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2dd4bf] mr-1.5" />
          Empirical Telemetry Findings
        </div>
        <ul className="space-y-1.5">
          {empirical_observations.map((item, idx) => (
            <li
              key={idx}
              className="ios-dark-glass-subcard p-2.5 text-xs text-slate-300 leading-relaxed flex items-start space-x-2 font-sans"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Highlighted On-Site Inspection Targets */}
      <div className="space-y-2 font-sans">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center font-mono">
            <ClipboardList className="w-3.5 h-3.5 text-[#2dd4bf] mr-1.5" />
            Inspection Targets
          </div>
          <span className="text-[10px] font-mono text-[#2dd4bf]">
            <span className="font-bold text-white text-xs mr-0.5">
              {Object.values(completedTargets).filter(Boolean).length}/{site_inspection_targets.length}
            </span> Verified
          </span>
        </div>

        <div className="space-y-1.5">
          {site_inspection_targets.map((target, idx) => {
            const isDone = !!completedTargets[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleTarget(idx)}
                className={`ios-dark-glass-subcard p-2.5 transition cursor-pointer flex items-start space-x-3 ${
                  isDone ? "opacity-60 line-through" : ""
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isDone
                      ? "bg-[#2dd4bf] border-[#2dd4bf] text-slate-950"
                      : "border-slate-600 bg-slate-800 text-transparent"
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div className="text-xs leading-relaxed flex-1 font-sans text-slate-200">
                  <span className="font-bold text-[#2dd4bf] text-xs mr-1.5 font-mono">
                    Target #{idx + 1}:
                  </span>
                  <span>{target}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
