import React from 'react';
import { RiskLevel } from '../../types';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  statusText?: string;
  supportingMetric?: string;
  severity?: RiskLevel | 'neutral' | 'info';
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  statusText,
  supportingMetric,
  severity = 'neutral',
  icon,
  className = '',
}) => {
  const statusColor = {
    LOW: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
    MODERATE: 'text-amber-400 bg-amber-950/80 border-amber-800',
    HIGH: 'text-orange-400 bg-orange-950/80 border-orange-800',
    CRITICAL: 'text-red-400 bg-red-950/80 border-red-800 font-bold',
    info: 'text-sky-400 bg-sky-950/80 border-sky-800',
    neutral: 'text-slate-300 bg-slate-800 border-slate-700',
  }[severity];

  const borderAccent = {
    LOW: 'border-l-4 border-l-emerald-500',
    MODERATE: 'border-l-4 border-l-amber-500',
    HIGH: 'border-l-4 border-l-orange-500',
    CRITICAL: 'border-l-4 border-l-red-500 bg-red-950/15',
    info: 'border-l-4 border-l-sky-500',
    neutral: 'border-l-4 border-l-slate-700',
  }[severity];

  return (
    <div
      className={`bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm flex flex-col justify-between transition-colors ${borderAccent} ${className}`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            {label}
          </span>
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl lg:text-3xl font-bold font-mono text-white tracking-tight">
            {value}
          </span>
          {subValue && (
            <span className="text-xs text-slate-400 font-mono">
              {subValue}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        {statusText && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${statusColor}`}>
            {statusText}
          </span>
        )}
        {supportingMetric && (
          <span className="text-slate-400 text-[11px] truncate text-right">
            {supportingMetric}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
