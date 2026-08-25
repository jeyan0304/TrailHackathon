import React from 'react';
import { Road, RoadStatus } from '../../types';
import { Route, AlertOctagon, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

interface RoadStatusWidgetProps {
  roads: Road[];
  onSelectRoad?: (road: Road) => void;
}

export const RoadStatusWidget: React.FC<RoadStatusWidgetProps> = ({
  roads,
  onSelectRoad,
}) => {
  const statusBadge = (status: RoadStatus) => {
    switch (status) {
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-950/80 text-red-300 border border-red-700">
            <AlertOctagon className="w-3 h-3 text-red-400" />
            Blocked
          </span>
        );
      case 'RESTRICTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-700">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Restricted
          </span>
        );
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            Open
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            Unknown
          </span>
        );
    }
  };

  const blockedCount = roads.filter((r) => r.status === 'BLOCKED').length;
  const restrictedCount = roads.filter((r) => r.status === 'RESTRICTED').length;

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Road Connectivity
          </h3>
          <span className="text-xs text-slate-400">
            ({blockedCount} blocked, {restrictedCount} restricted)
          </span>
        </div>
      </div>

      {/* Road Cards List */}
      <div className="divide-y divide-slate-800/80 max-h-[460px] overflow-y-auto">
        {roads.map((road) => (
          <div
            key={road.id}
            onClick={() => onSelectRoad?.(road)}
            className="p-3.5 hover:bg-slate-800/40 transition-colors cursor-pointer space-y-1.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-semibold text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded">
                    {road.code}
                  </span>
                  <span className="text-xs text-slate-400">
                    {road.name}
                  </span>
                </div>
              </div>
              <div className="shrink-0">{statusBadge(road.status)}</div>
            </div>

            {road.affectedSegment && (
              <div className="text-xs bg-slate-950/60 p-2 rounded border border-slate-800/80 space-y-1">
                <div className="text-slate-300 font-medium">
                  {road.affectedSegment}
                </div>
                {road.restrictionReason && (
                  <div className="text-slate-400 text-[11px]">
                    {road.restrictionReason}
                  </div>
                )}
              </div>
            )}

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>{road.startLocation} → {road.endLocation}</span>
              <span>{road.lastInspectionTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
