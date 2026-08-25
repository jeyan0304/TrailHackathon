import React from 'react';
import { RiskZone } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import {
  MapPin,
  CloudRain,
  Mountain,
  Droplets,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../common/Button';

interface HighRiskZonesListProps {
  zones: RiskZone[];
  selectedZoneId?: string;
  onSelectZone?: (zone: RiskZone) => void;
}

export const HighRiskZonesList: React.FC<HighRiskZonesListProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
}) => {
  const sortedZones = [...zones].sort(
    (a, b) => b.assessment.riskScore - a.assessment.riskScore
  );

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Monitored Risk Zones
          </h3>
          <span className="text-xs text-slate-400">
            ({zones.length} monitored)
          </span>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-800/80 max-h-[460px] overflow-y-auto">
        {sortedZones.map((zone, index) => {
          const isSelected = selectedZoneId === zone.id;
          const assessment = zone.assessment;

          return (
            <div
              key={zone.id}
              onClick={() => onSelectZone?.(zone)}
              className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-800/40 ${
                isSelected ? 'bg-blue-950/30 border-l-2 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                      #{index + 1} {zone.code}
                    </span>
                    <RiskBadge level={assessment.riskLevel} size="sm" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 mt-1">
                    {zone.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{zone.district}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1 font-mono">
                    <span className="text-xl font-bold text-slate-100">
                      {assessment.riskScore}
                    </span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Telemetry Metrics */}
              <div className="mt-2.5 grid grid-cols-3 gap-2 text-xs">
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800/80 flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="text-slate-300 font-mono font-medium">
                    {assessment.rainfallAccumulation24hMm} mm
                  </span>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800/80 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-slate-300 font-mono font-medium">
                    {assessment.slopeAngleDeg}° slope
                  </span>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800/80 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-300 font-mono font-medium">
                    {assessment.soilMoisturePct}% sat
                  </span>
                </div>
              </div>

              {/* Factors */}
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 truncate max-w-[240px]">
                  {assessment.contributingFactors[0]}
                </span>
                <Button
                  size="xs"
                  variant="ghost"
                  icon={<ArrowUpRight className="w-3 h-3 text-slate-400" />}
                  iconPosition="right"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectZone?.(zone);
                  }}
                >
                  Factors
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
