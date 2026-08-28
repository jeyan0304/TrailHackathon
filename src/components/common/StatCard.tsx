import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: string;
  variant?: 'default' | 'critical' | 'highlight';
  subtext?: string;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon,
  variant = 'default',
  subtext,
  onClick,
  className = '',
}) => {
  return (
    <Card
      variant={variant}
      padding="sm"
      className={`relative overflow-hidden ${onClick ? 'cursor-pointer hover:border-gov-400 active:scale-[0.99]' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-semibold text-gov-600 uppercase tracking-wide block truncate">
            {label}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-gov-900 tracking-tight">
              {value}
            </span>
            {unit && <span className="text-xs font-semibold text-gov-500">{unit}</span>}
          </div>
          {subtext && (
            <span className="text-[11px] text-gov-500 block mt-0.5 truncate">{subtext}</span>
          )}
        </div>
        <div className="p-2 rounded-xl bg-gov-100/90 text-gov-700 shrink-0">
          {icon}
        </div>
      </div>
    </Card>
  );
};
