import React, { useState } from 'react';
import { Alert, RiskLevel } from '../../types';
import { AlertCard } from './AlertCard';
import { BellRing, CheckCircle2 } from 'lucide-react';

interface ActiveAlertsListProps {
  alerts: Alert[];
  onAcknowledgeAlert?: (alertId: string) => void;
  onSelectAlert?: (alert: Alert) => void;
}

export const ActiveAlertsList: React.FC<ActiveAlertsListProps> = ({
  alerts,
  onAcknowledgeAlert,
  onSelectAlert,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<RiskLevel | 'ALL'>('ALL');

  // Severity rank comparator: CRITICAL (1), HIGH (2), MODERATE (3), LOW (4)
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
    <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Active Alerts
          </h3>
          <span className="text-xs text-slate-400">
            ({criticalCount} Critical, {highCount} High)
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedSeverity('ALL')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              selectedSeverity === 'ALL'
                ? 'bg-slate-700 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setSelectedSeverity('CRITICAL')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              selectedSeverity === 'CRITICAL'
                ? 'bg-red-900/60 text-red-200 font-semibold border border-red-700'
                : 'text-slate-400 hover:text-red-300'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setSelectedSeverity('HIGH')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              selectedSeverity === 'HIGH'
                ? 'bg-orange-900/60 text-orange-200 font-semibold border border-orange-700'
                : 'text-slate-400 hover:text-orange-300'
            }`}
          >
            High ({highCount})
          </button>
        </div>
      </div>

      {/* Alert Cards Stream */}
      <div className="p-3.5 space-y-3 max-h-[500px] overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded border border-dashed border-slate-800">
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
