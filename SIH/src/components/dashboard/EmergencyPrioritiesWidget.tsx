import React from 'react';
import { EmergencyPriority } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import {
  ListOrdered,
  Users,
  Route,
  ShieldAlert,
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
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Emergency Priority Matrix
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            (Ranked P1–P{priorities.length})
          </span>
        </div>
      </div>

      {/* Priorities List */}
      <div className="divide-y divide-slate-800/80 max-h-[520px] overflow-y-auto">
        {priorities.map((item) => {
          const isP1 = item.rank === 1;

          return (
            <div
              key={item.id}
              onClick={() => onSelectPriority?.(item)}
              className={`p-4 transition-all duration-150 cursor-pointer hover:bg-slate-800/50 space-y-3 ${
                isP1
                  ? 'bg-red-950/25 border-l-4 border-l-red-500 shadow-inner'
                  : 'hover:border-l-2 hover:border-l-orange-500/80'
              }`}
            >
              {/* Header: Priority Rank + Severity + Title */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                      isP1
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                  >
                    P{item.rank}
                  </span>
                  <RiskBadge level={item.riskLevel} size="sm" />
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Score: {item.riskScore}/100
                </span>
              </div>

              {/* Problem & Location */}
              <div>
                <h4 className="text-sm font-bold text-slate-100 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {item.location}
                </p>
              </div>

              {/* People & Infrastructure Impact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Route className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{item.roadImpact}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{item.populationExposed.toLocaleString()} people exposed</span>
                </div>
              </div>

              {/* Recommended Action */}
              <div
                className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                  isP1
                    ? 'bg-red-950/60 border-red-800/80 text-red-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-200'
                }`}
              >
                <span
                  className={`font-bold block text-[10px] uppercase tracking-wider mb-0.5 flex items-center gap-1 ${
                    isP1 ? 'text-red-300' : 'text-slate-400'
                  }`}
                >
                  <ShieldAlert className="w-3 h-3" />
                  Immediate Response Action:
                </span>
                <p>{item.recommendedAction}</p>
              </div>

              {item.assignedUnit && (
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Assigned: <strong className="text-slate-300">{item.assignedUnit}</strong></span>
                  <span className="font-mono text-slate-500">{item.lastUpdated}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyPrioritiesWidget;
