import React, { useState } from 'react';
import { Alert, RiskLevel } from '../../types';
import { AlertCard } from './AlertCard';
import { BellRing, CheckCircle2, Database } from 'lucide-react';

interface ActiveAlertsListProps {
  alerts: Alert[];
  onAcknowledgeAlert?: (alertId: string) => void;
  onSelectAlert?: (alert: Alert) => void;
  isSupabaseLive?: boolean;
  isLoading?: boolean;
}

export const ActiveAlertsList: React.FC<ActiveAlertsListProps> = ({
  alerts,
  onAcknowledgeAlert,
  onSelectAlert,
  isSupabaseLive = false,
  isLoading = false,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<RiskLevel | 'ALL'>('ALL');

  const severityRank: Record<RiskLevel, number> = {
    CRITICAL: 1,
    HIGH: 2,
    MODERATE: 3,
    LOW: 4,
  };

  const sortedAlerts = [...alerts].sort(
    (a, b) => severityRank[a.severity] - severityRank[b.severity]
  );

  const filteredAlerts = sortedAlerts.filter((alert) => {
    if (selectedSeverity === 'ALL') return true;
    return alert.severity === selectedSeverity;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter((a) => a.severity === 'HIGH').length;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Active Multi-Hazard Warnings
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            ({criticalCount} Critical)
          </span>
          {isSupabaseLive && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-400 bg-blue-950/80 border border-blue-800 px-1.5 py-0.5 rounded">
              <Database className="w-3 h-3 text-blue-400" />
              LIVE
            </span>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedSeverity('ALL')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              selectedSeverity === 'ALL'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setSelectedSeverity('CRITICAL')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              selectedSeverity === 'CRITICAL'
                ? 'bg-red-950 text-red-200 font-bold border border-red-700'
                : 'text-slate-400 hover:text-red-300'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setSelectedSeverity('HIGH')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              selectedSeverity === 'HIGH'
                ? 'bg-orange-950 text-orange-200 font-bold border border-orange-700'
                : 'text-slate-400 hover:text-orange-300'
            }`}
          >
            High ({highCount})
          </button>
        </div>
      </div>

      {/* Alert Cards Stream */}
      <div className="p-4 space-y-3.5 max-h-[540px] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center space-y-2 text-xs text-slate-400">
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Fetching multi-hazard warnings...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded-lg border border-dashed border-slate-800">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5 opacity-80" />
            <p className="text-xs font-medium text-slate-300">
              No active alerts matching this filter
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={onAcknowledgeAlert}
              onViewDetails={onSelectAlert}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveAlertsList;
