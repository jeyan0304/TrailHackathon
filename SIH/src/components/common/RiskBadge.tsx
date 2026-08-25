import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  pulsing?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const config = {
    LOW: {
      label: 'Low',
      bgClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
    },
    MODERATE: {
      label: 'Moderate',
      bgClass: 'bg-amber-950/70 text-amber-300 border-amber-700/60',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
    },
    HIGH: {
      label: 'High',
      bgClass: 'bg-orange-950/70 text-orange-300 border-orange-700/60',
      icon: <AlertOctagon className="w-3.5 h-3.5 text-orange-400" />,
    },
    CRITICAL: {
      label: 'Critical',
      bgClass: 'bg-red-950/80 text-red-200 border-red-600/70',
      icon: <Flame className="w-3.5 h-3.5 text-red-400" />,
    },
  }[level] || {
    label: 'Unknown',
    bgClass: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />,
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1 font-semibold',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-semibold',
    lg: 'px-3 py-1.5 text-sm gap-2 font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded border font-sans uppercase tracking-wider ${config.bgClass} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`Risk Level: ${level}`}
    >
      {showIcon && <span className="shrink-0">{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
};
