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
        return 'bg-red-500';
    }
  };

  const getBorderColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'LOW':
        return 'border-emerald-800/60 bg-emerald-950/20';
      case 'MODERATE':
        return 'border-amber-800/60 bg-amber-950/20';
      case 'HIGH':
        return 'border-orange-800/60 bg-orange-950/20';
      case 'CRITICAL':
        return 'border-red-800/70 bg-red-950/30';
    }
  };

  const humanMeaning = {
    CRITICAL: 'Very High Risk — Immediate attention needed',
    HIGH: 'High Risk — Heavy rain increasing landslide likelihood',
    MODERATE: 'Moderate Risk — Soil moisture rising, monitor closely',
    LOW: 'Low Risk — Hillside slope and drainage stable',
  }[level] || 'Assessment pending';

  return (
    <div className={`rounded-lg border p-3.5 ${getBorderColor(level)} ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Risk Assessment
          </span>
          <span className="text-xl font-bold font-mono text-slate-100 tracking-tight">
            {score}<span className="text-xs font-normal text-slate-500">/100</span>
          </span>
        </div>
        <RiskBadge level={level} size={compact ? 'sm' : 'md'} />
      </div>

      <div className="text-xs font-semibold text-slate-200 mb-2">
        {humanMeaning}
      </div>

      {/* Visual meter bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(level)}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>

      {/* Score brackets indicator */}
      <div className="flex justify-between text-[10px] font-mono text-slate-500 px-0.5">
        <span>0 (Low)</span>
        <span>30</span>
        <span>60</span>
        <span>80</span>
        <span>100 (Crit)</span>
      </div>

      {/* Explainable AI contributing factors */}
      {showExplanation && contributingFactors.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-300 mb-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Why is this sector at risk?</span>
          </div>
          <ul className="space-y-1.5 pl-1">
            {contributingFactors.map((factor, idx) => (
              <li key={idx} className="text-slate-300 flex items-start gap-1.5 leading-relaxed text-xs">
                <span className="text-blue-400 font-bold">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RiskScoreMeter;
