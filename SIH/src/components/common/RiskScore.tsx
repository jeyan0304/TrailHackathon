import React from 'react';
import { RiskLevel } from '../../types';
import { RiskBadge } from './RiskBadge';

interface RiskScoreProps {
  score: number; // 0-100
  level: RiskLevel;
  contributingFactors?: string[];
  showFactors?: boolean;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

export const RiskScore: React.FC<RiskScoreProps> = ({
  score,
  level,
  contributingFactors = [],
  showFactors = true,
  size = 'md',
  compact = false,
}) => {
  const meterColor = {
    LOW: 'bg-emerald-500',
    MODERATE: 'bg-amber-500',
    HIGH: 'bg-orange-500',
    CRITICAL: 'bg-red-500',
  }[level] || 'bg-slate-400';

  const scoreTextColor = {
    LOW: 'text-emerald-400',
    MODERATE: 'text-amber-400',
    HIGH: 'text-orange-400',
    CRITICAL: 'text-red-400',
  }[level] || 'text-slate-300';

  const humanMeaning = {
    CRITICAL: 'Very High Risk — Immediate attention needed',
    HIGH: 'High Risk — Heavy rain is increasing landslide risk in this area',
    MODERATE: 'Moderate Risk — Soil moisture rising, monitor slope closely',
    LOW: 'Low Risk — Hillside terrain and drainage currently stable',
  }[level] || 'Assessment pending';

  const normalizedScore = Math.min(Math.max(score, 0), 100);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={`font-mono font-bold text-sm ${scoreTextColor}`}>
          {normalizedScore}
        </span>
        <span className="text-xs text-slate-400">/ 100</span>
        <RiskBadge level={level} size="sm" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            AI Landslide Risk Assessment
          </span>
          <span className={`font-mono font-bold ${size === 'lg' ? 'text-3xl' : 'text-2xl'} ${scoreTextColor}`}>
            {normalizedScore}
          </span>
          <span className="text-xs text-slate-500 font-mono">/ 100</span>
        </div>
        <RiskBadge level={level} size={size === 'lg' ? 'md' : 'sm'} />
      </div>

      {/* Human-friendly summary line */}
      <div className="text-xs font-semibold text-slate-200">
        {humanMeaning}
      </div>

      {/* Progress / Gauge bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${meterColor}`}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>

      {/* Contributing Factors Explanation */}
      {showFactors && contributingFactors.length > 0 && (
        <div className="mt-1 pt-2 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1.5">
            Why is this area at risk?
          </div>
          <ul className="space-y-1.5">
            {contributingFactors.map((factor, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed"
              >
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

export default RiskScore;
