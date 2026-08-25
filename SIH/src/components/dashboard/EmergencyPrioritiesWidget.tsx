import React from 'react';
import { EmergencyPriority } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import {
  ListOrdered,
  Users,
  Route,
  ShieldCheck,
} from 'lucide-react';

interface EmergencyPrioritiesWidgetProps {
  priorities: EmergencyPriority[];
  onSelectPriority?: (priority: EmergencyPriority) => void;
}

export const EmergencyPrioritiesWidget: React.FC<EmergencyPrioritiesWidgetProps> = ({
  priorities,
  onSelectPriority,
}) => {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-slate-300" />
          <h3 className="text-sm font-semibold text-slate-100">
            Emergency Priorities
          </h3>
          <span className="text-xs text-slate-400">
            ({priorities.length} ranked)
          </span>
        </div>
      </div>

      {/* Priorities List */}
      <div className="divide-y divide-slate-800/80 max-h-[460px] overflow-y-auto">
        {priorities.map((item) => {
          const isP1 = item.rank === 1;

          return (
            <div
              key={item.id}
              onClick={() => onSelectPriority?.(item)}
              className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-800/40 space-y-2 ${
                isP1 ? 'bg-red-950/10 border-l-2 border-l-red-500' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-200 shrink-0">
                    P{item.rank}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <RiskBadge level={item.riskLevel} size="sm" />
                      <span className="text-xs text-slate-400 font-mono">
                        Score: {item.riskScore}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100 mt-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {item.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Road & Population Impact */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800/80 flex items-center gap-1.5 truncate">
                  <Route className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-slate-300 truncate">{item.roadImpact}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800/80 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="text-slate-300 font-medium">{item.populationExposed.toLocaleString()} people</span>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="text-xs text-slate-300 bg-slate-950/40 p-2 rounded border border-slate-800/80">
                <span className="text-slate-400 font-medium">Action: </span>
                {item.recommendedAction}
              </div>

              {item.assignedUnit && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Assigned: {item.assignedUnit}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
