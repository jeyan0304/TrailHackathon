import React from 'react';
import { Road, RoadStatus } from '../../types';
import {
  Route,
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Database,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface RoadStatusWidgetProps {
  roads: Road[];
  onSelectRoad?: (road: Road) => void;
  isSupabaseLive?: boolean;
  isLoading?: boolean;
}

export const RoadStatusWidget: React.FC<RoadStatusWidgetProps> = ({
  roads,
  onSelectRoad,
  isSupabaseLive = false,
  isLoading = false,
}) => {
  const statusBadge = (status: RoadStatus) => {
    switch (status) {
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-950 text-red-300 border border-red-700">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            BLOCKED
          </span>
        );
      case 'RESTRICTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-700">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            RESTRICTED
          </span>
        );
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            OPEN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            UNKNOWN
          </span>
        );
    }
  };

  const blockedCount = roads.filter((r) => r.status === 'BLOCKED').length;
  const restrictedCount = roads.filter((r) => r.status === 'RESTRICTED').length;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Road Corridor Passability
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            ({blockedCount} blocked, {restrictedCount} restricted)
          </span>
        </div>

        {isSupabaseLive && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-[10px] font-mono text-blue-300">
            <Database className="w-3 h-3 text-blue-400" />
            <span>SUPABASE LIVE</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="p-8 text-center space-y-2 text-xs text-slate-400">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Fetching arterial road network...</p>
        </div>
      ) : (
        /* Road Cards List */
        <div className="divide-y divide-slate-800/80 max-h-[520px] overflow-y-auto">
          {roads.map((road) => {
            const isBlocked = road.status === 'BLOCKED';

            return (
              <div
                key={road.id}
                onClick={() => onSelectRoad?.(road)}
                className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer space-y-2 ${
                  isBlocked ? 'bg-red-950/15 border-l-4 border-l-red-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {road.code}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100 truncate">
                        {road.name}
                      </h4>
                    </div>

                    {road.riskZoneName && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">Sector: {road.riskZoneName}</span>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">{statusBadge(road.status)}</div>
                </div>

                {/* Status explanation */}
                {road.restrictionReason && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {road.restrictionReason}
                  </p>
                )}

                {/* Segment, Importance & Coordinates */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 font-mono border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    {typeof road.importanceScore === 'number' && (
                      <span className="flex items-center gap-1 text-amber-300 font-semibold">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Priority: {road.importanceScore}/100
                      </span>
                    )}
                  </div>
                  {road.latitude && road.longitude ? (
                    <span>
                      {road.latitude.toFixed(2)}°N, {road.longitude.toFixed(2)}°E
                    </span>
                  ) : (
                    <span>{road.lastInspectionTime}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoadStatusWidget;
