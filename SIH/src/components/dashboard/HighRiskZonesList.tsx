import React from 'react';
import { RiskZone } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import {
  MapPin,
  ArrowUpRight,
  ShieldAlert,
  Database,
} from 'lucide-react';
import { Button } from '../common/Button';

interface HighRiskZonesListProps {
  zones: RiskZone[];
  selectedZoneId?: string;
  onSelectZone?: (zone: RiskZone) => void;
  isLoading?: boolean;
  isSupabaseLive?: boolean;
}

export const HighRiskZonesList: React.FC<HighRiskZonesListProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
  isLoading = false,
  isSupabaseLive = false,
}) => {
  const sortedZones = [...zones].sort((a, b) => {
    const scoreA = a.riskScore ?? a.assessment?.riskScore ?? 0;
    const scoreB = b.riskScore ?? b.assessment?.riskScore ?? 0;
    return scoreB - scoreA;
  });

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Monitored Risk Sectors
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            ({zones.length} active)
          </span>
        </div>

        {isSupabaseLive && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-[10px] font-mono text-blue-300">
            <Database className="w-3 h-3 text-blue-400" />
            <span>SUPABASE LIVE (DEMO)</span>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-6 text-center space-y-2 text-xs text-slate-400">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Fetching Supabase risk zones...</p>
        </div>
      )}

      {/* List */}
      {!isLoading && (
        <div className="divide-y divide-slate-800/80 max-h-[520px] overflow-y-auto">
          {sortedZones.map((zone, index) => {
            const isSelected = selectedZoneId === zone.id;
            const score = zone.riskScore ?? zone.assessment?.riskScore ?? 50;
            const level = zone.riskLevel ?? zone.assessment?.riskLevel ?? 'MODERATE';
            const rain = zone.rainfallAccumulationMm ?? zone.assessment?.rainfallAccumulation24hMm ?? 0;
            const slope = zone.slopeAngleDeg ?? zone.assessment?.slopeAngleDeg ?? 30;
            const soil = zone.soilMoisturePercent ?? zone.assessment?.soilMoisturePct ?? 0;
            const factor = (zone.contributingFactors && zone.contributingFactors[0]) || (zone.assessment?.contributingFactors && zone.assessment.contributingFactors[0]) || 'Heavy rain is increasing landslide risk in this area.';

            const isCritical = level === 'CRITICAL';

            return (
              <div
                key={zone.id}
                onClick={() => onSelectZone?.(zone)}
                className={`p-4 transition-colors cursor-pointer hover:bg-slate-800/50 space-y-2.5 ${
                  isSelected
                    ? 'bg-blue-950/40 border-l-4 border-l-blue-500'
                    : isCritical
                    ? 'border-l-2 border-l-red-500/80'
                    : ''
                }`}
              >
                {/* Header: Rank, Code, Badge, Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                        #{index + 1} {zone.code || zone.name.slice(0, 8)}
                      </span>
                      <RiskBadge level={level} size="sm" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-100 truncate">
                      {zone.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{zone.district}, {zone.state}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono">
                    <div className="text-xl font-bold text-slate-100 leading-none">
                      {score}
                    </div>
                    <span className="text-[10px] text-slate-500">/ 100</span>
                  </div>
                </div>

                {/* Main Reason / Risk Explanation */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {factor}
                </p>

                {/* Visually Quieter Secondary Technical Details Area */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-3 font-mono">
                    {rain > 0 && (
                      <>
                        <span>Rain: <strong className="text-slate-300 font-semibold">{rain}mm</strong></span>
                        <span>•</span>
                      </>
                    )}
                    <span>Slope: <strong className="text-slate-300 font-semibold">{slope}°</strong></span>
                    <span>•</span>
                    <span>Soil Moisture: <strong className="text-slate-300 font-semibold">{soil}%</strong></span>
                  </div>

                  <Button
                    size="xs"
                    variant="ghost"
                    icon={<ArrowUpRight className="w-3 h-3 text-blue-400" />}
                    iconPosition="right"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectZone?.(zone);
                    }}
                  >
                    Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HighRiskZonesList;
