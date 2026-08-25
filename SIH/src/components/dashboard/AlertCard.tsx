import React, { useState } from 'react';
import { Alert } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import {
  Clock,
  MapPin,
  Route,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../common/Button';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge?: (alertId: string) => void;
  onViewDetails?: (alert: Alert) => void;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onAcknowledge,
  onViewDetails,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cardBorder = {
    CRITICAL: 'border-l-4 border-l-red-500 border-slate-800 bg-slate-900',
    HIGH: 'border-l-4 border-l-orange-500 border-slate-800 bg-slate-900',
    MODERATE: 'border-l-4 border-l-amber-500 border-slate-800 bg-slate-900',
    LOW: 'border-l-4 border-l-emerald-500 border-slate-800 bg-slate-900',
  }[alert.severity];

  return (
    <div
      className={`rounded-lg border p-3.5 transition-colors ${cardBorder} ${className}`}
    >
      {/* Header: Severity, Location, Time */}
      <div className="flex items-start justify-between gap-2 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <RiskBadge level={alert.severity} size="sm" />
          <span className="text-xs font-semibold text-slate-100">
            {alert.title}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{alert.timestamp}</span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 text-xs text-slate-300 mt-1">
        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-medium">{alert.location}</span>
      </div>

      {/* Main Reason */}
      <div className="text-xs text-slate-300 mt-1.5 leading-relaxed">
        <span className="text-slate-400 font-medium">Reason: </span>
        {alert.reason}
      </div>

      {/* Affected Road / Village */}
      <div className="flex items-center gap-1 text-xs text-slate-400 mt-1.5 truncate">
        <Route className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-slate-300">
          {alert.affectedRoads[0]}
          {alert.affectedVillages[0] ? ` • ${alert.affectedVillages[0]}` : ''}
        </span>
      </div>

      {/* Secondary Information (Expandable) */}
      {isExpanded && (
        <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-2 text-xs">
          {alert.contributingFactors.length > 0 && (
            <div>
              <span className="text-slate-400 font-medium block mb-1">
                Contributing Factors:
              </span>
              <ul className="space-y-0.5 text-slate-300 pl-3 border-l border-slate-800">
                {alert.contributingFactors.map((f, idx) => (
                  <li key={idx}>• {f}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-medium block text-[11px]">
              Recommended Response:
            </span>
            <p className="text-slate-200 mt-0.5 leading-normal">
              {alert.recommendedAction}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
        >
          {isExpanded ? (
            <>
              <span>Less info</span>
              <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              <span>More details</span>
              <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          {alert.status === 'ACTIVE' && (
            <Button
              size="xs"
              variant="secondary"
              icon={<CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              onClick={() => onAcknowledge?.(alert.id)}
            >
              Acknowledge
            </Button>
          )}
          <Button
            size="xs"
            variant="outline"
            onClick={() => onViewDetails?.(alert)}
          >
            Zone Factors
          </Button>
        </div>
      </div>
    </div>
  );
};
