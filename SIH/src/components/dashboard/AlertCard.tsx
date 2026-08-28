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
  AlertTriangle,
  ShieldAlert,
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

  const isCritical = alert.severity === 'CRITICAL';

  const cardStyle = {
    CRITICAL: 'border-l-4 border-l-red-500 bg-red-950/20 border-red-900/60 shadow-md',
    HIGH: 'border-l-4 border-l-orange-500 bg-slate-900 border-slate-800',
    MODERATE: 'border-l-4 border-l-amber-500 bg-slate-900 border-slate-800',
    LOW: 'border-l-4 border-l-emerald-500 bg-slate-900 border-slate-800',
  }[alert.severity];

  const affectedRoad = alert.affectedRoad || (alert.affectedRoads && alert.affectedRoads[0]) || 'Local Transit Corridor';
  const affectedVillage = alert.affectedVillage || (alert.affectedVillages && alert.affectedVillages[0]) || 'Nearby Settlement';

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-150 ${cardStyle} ${className} space-y-3`}
    >
      {/* Header: Severity, Title, Timestamp */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <RiskBadge level={alert.severity} size="sm" />
          <h4 className="text-sm font-bold text-slate-100 leading-snug">
            {alert.title}
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{alert.timestamp}</span>
        </div>
      </div>

      {/* 4-Point Decision Support Structure */}
      <div className="space-y-2 text-xs">
        {/* 1. What Happened */}
        <p className="text-slate-200 leading-relaxed">
          {alert.reason}
        </p>

        {/* 2. Where & What is Affected */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Where</span>
              <span className="text-slate-200">{alert.location}</span>
            </div>
          </div>

          <div className="flex items-start gap-1.5">
            <Route className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">What is Affected</span>
              <span className="text-slate-200">{affectedRoad} • {affectedVillage}</span>
            </div>
          </div>
        </div>

        {/* 3. Action Needed */}
        <div className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
          isCritical
            ? 'bg-red-950/50 border-red-800/80 text-red-100'
            : 'bg-slate-950/70 border-slate-800 text-slate-200'
        }`}>
          <span className={`font-bold block text-[10px] uppercase tracking-wider mb-0.5 flex items-center gap-1 ${
            isCritical ? 'text-red-300' : 'text-blue-300'
          }`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            Required Action
          </span>
          <p>{alert.recommendedAction}</p>
        </div>
      </div>

      {/* Expandable Technical AI Details */}
      {isExpanded && (
        <div className="pt-2.5 border-t border-slate-800/80 space-y-2 text-xs">
          {alert.contributingFactors && alert.contributingFactors.length > 0 && (
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                AI Risk Factors & Observations:
              </span>
              <ul className="space-y-1 text-slate-300 pl-1">
                {alert.contributingFactors.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed text-xs">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Card Footer Actions */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
        >
          {isExpanded ? (
            <>
              <span>Hide details</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>Technical details</span>
              <ChevronDown className="w-3.5 h-3.5" />
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
            Inspect Sector
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
