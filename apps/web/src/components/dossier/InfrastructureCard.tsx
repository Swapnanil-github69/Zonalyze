import React from "react";
import { Building2, HeartPulse, Train, Trees, Pill } from "lucide-react";
import { InfrastructureData } from "../../types/investigation";

interface InfrastructureCardProps {
  infrastructure: InfrastructureData;
}

export const InfrastructureCard: React.FC<InfrastructureCardProps> = ({ infrastructure }) => {
  const { hospitals, pharmacies, railway_stations, parks, nearest_hospital_dist_m } =
    infrastructure;

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            3000m Infrastructure Envelope
          </h3>
        </div>
        {nearest_hospital_dist_m !== null && (
          <span className="text-[11px] font-mono text-emerald-400">
            Emergency: {nearest_hospital_dist_m}m
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
          <HeartPulse className="w-4 h-4 text-rose-400 mx-auto mb-1" />
          <div className="text-base font-bold text-white">{hospitals}</div>
          <div className="text-[10px] text-slate-400">Hospitals</div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
          <Pill className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <div className="text-base font-bold text-white">{pharmacies}</div>
          <div className="text-[10px] text-slate-400">Pharmacies</div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
          <Train className="w-4 h-4 text-sky-400 mx-auto mb-1" />
          <div className="text-base font-bold text-white">{railway_stations}</div>
          <div className="text-[10px] text-slate-400">Transit</div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
          <Trees className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <div className="text-base font-bold text-white">{parks}</div>
          <div className="text-[10px] text-slate-400">Parks</div>
        </div>
      </div>
    </div>
  );
};
