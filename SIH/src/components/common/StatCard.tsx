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
    LOW: 'text-emerald-400',
    MODERATE: 'text-amber-400',
    HIGH: 'text-orange-400',
    CRITICAL: 'text-red-400',
    info: 'text-sky-400',
    neutral: 'text-slate-300',
  }[severity];

  const borderAccent = {
    LOW: 'border-l-2 border-l-emerald-500',
    MODERATE: 'border-l-2 border-l-amber-500',
    HIGH: 'border-l-2 border-l-orange-500',
    CRITICAL: 'border-l-2 border-l-red-500',
    info: 'border-l-2 border-l-sky-500',
    neutral: 'border-l-2 border-l-slate-700',
  }[severity];

  return (
    <div
      className={`bg-slate-900/90 rounded-lg p-4 border border-slate-800 shadow-sm flex flex-col justify-between ${borderAccent} ${className}`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-wider uppercase text-slate-400">
            {label}
          </span>
          {icon && <span className="text-slate-500 shrink-0">{icon}</span>}
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl lg:text-3xl font-bold font-mono text-slate-100 tracking-tight">
            {value}
          </span>
          {subValue && (
            <span className="text-xs text-slate-400 font-mono">
              {subValue}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {statusText && (
          <span className={`font-semibold uppercase text-[11px] tracking-wide ${statusColor}`}>
            {statusText}
          </span>
        )}
        {supportingMetric && (
          <span className="text-slate-400 text-[11px]">
            {supportingMetric}
          </span>
        )}
      </div>
    </div>
  );
};
