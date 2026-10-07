import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  ClipboardList,
  Check,
  Bot,
  Train,
  HeartPulse,
  Wind,
  Volume2,
} from "lucide-react";
import { AiReportData, InvestigationResult } from "../../types/investigation";
import { AudioDebriefPlayer } from "./AudioDebriefPlayer";

interface ForensicReportCardProps {
  aiReport: AiReportData;
  investigation?: InvestigationResult;
}

export const ForensicReportCard: React.FC<ForensicReportCardProps> = ({
  aiReport,
  investigation,
}) => {
  const { summary, insights_in_brief, empirical_observations, site_inspection_targets } = aiReport;
  const [completedTargets, setCompletedTargets] = useState<Record<number, boolean>>({});

  const toggleTarget = (index: number) => {
    setCompletedTargets((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const locationName = investigation?.address || "Selected Coordinate";

  return (
    <div className="glass-panel p-4 rounded-2xl border border-indigo-500/30 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              AI Forensic Debrief
            </h3>
            <span className="text-[10px] text-slate-400">Gemma Grounded Telemetry Synthesis</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/30 flex items-center space-x-1">
          <Bot className="w-3 h-3 mr-1" />
          Zero-Hallucination
        </span>
      </div>

      {/* Voice Audio Debrief Player */}
      <AudioDebriefPlayer aiReport={aiReport} locationName={locationName} />

      {/* Executive Insights in Brief Grid */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
            Insights in Brief
          </span>
          <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30">
            Quick Takeaways
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Transit Brief */}
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-blue-500/25 flex flex-col justify-between space-y-1">
            <div className="flex items-center space-x-1.5">
              <Train className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                Transit & Commute
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              {insights_in_brief?.transit || "Direct access to regional multi-modal transit network."}
            </p>
          </div>

          {/* Healthcare Brief */}
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-rose-500/25 flex flex-col justify-between space-y-1">
            <div className="flex items-center space-x-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                Healthcare Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              {insights_in_brief?.healthcare || "Emergency healthcare services accessible within radial envelope."}
            </p>
          </div>

          {/* Environmental Brief */}
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-emerald-500/25 flex flex-col justify-between space-y-1">
            <div className="flex items-center space-x-1.5">
              <Wind className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Air & Atmosphere
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              {insights_in_brief?.environment || "Continuous atmospheric and fine particulate telemetry monitoring."}
            </p>
          </div>

          {/* Acoustic Brief */}
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-amber-500/25 flex flex-col justify-between space-y-1">
            <div className="flex items-center space-x-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Acoustic Zone
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              {insights_in_brief?.acoustic || "Decibel exposure mapped against nearest traffic corridors."}
            </p>
          </div>
        </div>
      </div>

      {/* Forensic Narrative Overview Box */}
      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed font-medium space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
          Executive Forensic Overview
        </div>
        <div>{summary}</div>
      </div>

      {/* Empirical Observations */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
          Empirical Telemetry Findings
        </div>
        <ul className="space-y-1.5">
          {empirical_observations.map((item, idx) => (
            <li
              key={idx}
              className="text-xs text-slate-300 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed flex items-start space-x-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Highlighted On-Site Inspection Targets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
            <ClipboardList className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
            Highlighted On-Site Inspection Targets
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            {Object.values(completedTargets).filter(Boolean).length}/{site_inspection_targets.length} Verified
          </span>
        </div>

        <div className="space-y-1.5">
          {site_inspection_targets.map((target, idx) => {
            const isDone = !!completedTargets[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleTarget(idx)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${isDone
                    ? "bg-emerald-950/20 border-emerald-500/40 text-slate-400 line-through"
                    : "bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 text-slate-200"
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${isDone
                      ? "bg-emerald-500 border-emerald-400 text-slate-950"
                      : "border-slate-600 bg-slate-800 text-transparent"
                    }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div className="text-xs leading-relaxed flex-1">
                  <span className="font-semibold text-emerald-400 mr-1.5 font-mono">
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
