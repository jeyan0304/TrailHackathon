import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';
import { RiskLevel } from '../../types';

export interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  score?: number;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
  score,
  className = '',
}) => {
  const config = {
    LOW: {
      label: 'LOW RISK',
      icon: ShieldCheck,
      classes: 'bg-emerald-100 text-emerald-950 border-emerald-400',
      iconClass: 'text-emerald-700',
    },
    MODERATE: {
      label: 'MODERATE RISK',
      icon: AlertTriangle,
      classes: 'bg-amber-100 text-amber-950 border-amber-400',
      iconClass: 'text-amber-700',
    },
    HIGH: {
      label: 'HIGH RISK',
      icon: AlertOctagon,
      classes: 'bg-orange-100 text-orange-950 border-orange-400',
      iconClass: 'text-orange-700',
    },
    CRITICAL: {
      label: 'CRITICAL RISK',
      icon: Flame,
      classes: 'bg-red-100 text-red-950 border-red-500 font-extrabold',
      iconClass: 'text-red-700',
    },
  }[level];

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] gap-1 border',
    md: 'px-2.5 py-1 text-xs gap-1.5 border-2',
    lg: 'px-3.5 py-1.5 text-sm gap-2 border-2',
  };

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center font-bold rounded-lg uppercase tracking-wide select-none ${sizeStyles[size]} ${config.classes} ${className}`}
      role="status"
      aria-label={`Risk Level: ${config.label}${score !== undefined ? `, Score: ${score}` : ''}`}
    >
      {showIcon && <IconComponent className={`w-3.5 h-3.5 shrink-0 ${config.iconClass}`} />}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="ml-1 pl-1 border-l border-current/30 font-mono">
          {score}/100
        </span>
      )}
    </span>
  );
};
