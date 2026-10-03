import React from "react";
import { Sparkles, CheckCircle2, ClipboardList } from "lucide-react";
import { AiReportData } from "../../types/investigation.js";

interface ForensicReportCardProps {
  aiReport: AiReportData;
}

export const ForensicReportCard: React.FC<ForensicReportCardProps> = ({ aiReport }) => {
  const { summary, empirical_observations, site_inspection_targets } = aiReport;

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-4 border border-indigo-500/20">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Forensic AI Debrief (Grounded Telemetry)
        </h3>
      </div>

      {/* Summary Box */}
      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed font-medium">
        {summary}
      </div>

      {/* Empirical Observations */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
          Empirical Observations
        </div>
        <ul className="space-y-1.5">
          {empirical_observations.map((item, idx) => (
            <li
              key={idx}
              className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 leading-snug"
            >
              • {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Physical Site Inspection Targets */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
          <ClipboardList className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
          On-Site Physical Inspection Checklist
        </div>
        <ul className="space-y-1.5">
          {site_inspection_targets.map((target, idx) => (
            <li
              key={idx}
              className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 flex items-start space-x-2"
            >
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{target}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
