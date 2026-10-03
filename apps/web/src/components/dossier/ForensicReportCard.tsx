import React, { useState } from "react";
import { Sparkles, CheckCircle2, ClipboardList, Check, Bot } from "lucide-react";
import { AiReportData } from "../../types/investigation";

interface ForensicReportCardProps {
  aiReport: AiReportData;
}

export const ForensicReportCard: React.FC<ForensicReportCardProps> = ({ aiReport }) => {
  const { summary, empirical_observations, site_inspection_targets } = aiReport;
  const [completedTargets, setCompletedTargets] = useState<Record<number, boolean>>({});

  const toggleTarget = (index: number) => {
    setCompletedTargets((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
            <span className="text-[10px] text-slate-400">Gemini Grounded Telemetry Synthesis</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/30 flex items-center space-x-1">
          <Bot className="w-3 h-3 mr-1" />
          Zero-Hallucination
        </span>
      </div>

      {/* Summary Box */}
      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed font-medium">
        {summary}
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
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                  isDone
                    ? "bg-emerald-950/20 border-emerald-500/40 text-slate-400 line-through"
                    : "bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 text-slate-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isDone
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
