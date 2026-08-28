import React from 'react';
import { RiskLevel } from '../../types';
import { RiskBadge } from './RiskBadge';
import { Info } from 'lucide-react';

export interface RiskScoreMeterProps {
  score: number; // 0–100
  level: RiskLevel;
  contributingFactors?: string[];
  compact?: boolean;
  showExplanation?: boolean;
  className?: string;
}

export const RiskScoreMeter: React.FC<RiskScoreMeterProps> = ({
  score,
  level,
  contributingFactors = [],
  compact = false,
  showExplanation = true,
  className = '',
}) => {
  const getProgressColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'LOW':
        return 'bg-emerald-500';
      case 'MODERATE':
        return 'bg-amber-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'CRITICAL':
        return 'bg-red-600 animate-pulse';
    }
  };

  const getBorderColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'LOW':
        return 'border-emerald-200 bg-emerald-50/40';
      case 'MODERATE':
        return 'border-amber-200 bg-amber-50/40';
      case 'HIGH':
        return 'border-orange-200 bg-orange-50/40';
      case 'CRITICAL':
        return 'border-red-300 bg-red-50/60';
    }
  };

  return (
    <div className={`rounded-xl border p-3.5 ${getBorderColor(level)} ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-gov-600 uppercase tracking-wider">
            Risk Assessment
          </span>
          <span className="text-xl font-extrabold font-mono text-gov-900 tracking-tight">
            {score}<span className="text-xs font-normal text-gov-500">/100</span>
          </span>
        </div>
        <RiskBadge level={level} size={compact ? 'sm' : 'md'} />
      </div>

      {/* Visual meter bar */}
      <div className="w-full bg-gov-200/80 rounded-full h-2.5 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(level)}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>

      {/* Score brackets indicator */}
      <div className="flex justify-between text-[10px] font-mono text-gov-500 px-0.5">
        <span>0 (Low)</span>
        <span>30</span>
        <span>60</span>
        <span>80</span>
        <span>100 (Crit)</span>
      </div>

      {/* Explainable AI contributing factors */}
      {showExplanation && contributingFactors.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-gov-200/80 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-gov-800 mb-1.5">
            <Info className="w-3.5 h-3.5 text-gov-600 shrink-0" />
            <span>AI Risk Factors ({contributingFactors.length}):</span>
          </div>
          <ul className="space-y-1 pl-1">
            {contributingFactors.map((factor, idx) => (
              <li key={idx} className="text-gov-700 flex items-start gap-1.5 leading-tight">
                <span className="text-gov-400 font-bold">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
