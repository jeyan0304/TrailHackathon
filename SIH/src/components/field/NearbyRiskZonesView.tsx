import React, { useState } from 'react';
import {
  Compass,
  Mountain,
  PlusCircle,
} from 'lucide-react';
import { RiskZone, RiskLevel } from '../../types';
import { Button } from '../common/Button';
import { RiskBadge } from '../common/RiskBadge';

export interface NearbyRiskZonesViewProps {
  riskZones: RiskZone[];
  onReportForZone: (zone: RiskZone) => void;
}

export const NearbyRiskZonesView: React.FC<NearbyRiskZonesViewProps> = ({
  riskZones,
  onReportForZone,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | RiskLevel>('ALL');

  const filteredZones = riskZones.filter((zone) => {
    if (selectedFilter === 'ALL') return true;
    const level = zone.riskLevel || zone.assessment?.riskLevel;
    return level === selectedFilter;
  });

  return (
    <div className="space-y-6 w-full">
      {/* View Header */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-slate-100">
                Monitored Risk Sectors & Slopes
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Active landslide surveillance sectors across the North Eastern Region.
            </p>
          </div>

          {/* Severity Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto self-start sm:self-auto">
            {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedFilter(lvl)}
                className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFilter === lvl
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'ALL' ? 'All Zones' : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Risk Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredZones.map((zone) => {
          const score = zone.riskScore || zone.assessment?.riskScore || 50;
          const level = zone.riskLevel || zone.assessment?.riskLevel || 'MODERATE';
          const slope = zone.slopeAngleDeg || zone.assessment?.slopeAngleDeg || 30;
          const rain = zone.rainfallAccumulationMm || zone.assessment?.rainfallAccumulation24hMm || 0;
          const soil = zone.soilMoisturePercent || zone.assessment?.soilMoisturePct || 0;
          const factors = zone.contributingFactors || zone.assessment?.contributingFactors || [];

          return (
            <div
              key={zone.id}
              className={`rounded-xl border p-4 bg-slate-900 flex flex-col justify-between space-y-4 ${
                level === 'CRITICAL'
                  ? 'border-red-600/80'
                  : level === 'HIGH'
                  ? 'border-orange-500/70'
                  : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <RiskBadge level={level} size="sm" />
                      <span className="text-[10px] text-slate-400 font-mono">
                        {zone.district}, {zone.state}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100">
                      {zone.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span className="text-xl font-bold text-slate-100">
                      {score}
                    </span>
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>

                {/* Metric specs */}
                <div className="grid grid-cols-3 gap-1.5 py-2 border-y border-slate-800 text-center font-mono text-[11px]">
                  <div className="bg-slate-950 rounded p-1.5 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block uppercase">Slope</span>
                    <span className="font-bold text-slate-200">{slope}°</span>
                  </div>
                  <div className="bg-slate-950 rounded p-1.5 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block uppercase">24h Rain</span>
                    <span className="font-bold text-slate-200">{rain}mm</span>
                  </div>
                  <div className="bg-slate-950 rounded p-1.5 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block uppercase">Soil Sat</span>
                    <span className="font-bold text-slate-200">{soil}%</span>
                  </div>
                </div>

                {/* AI Risk explanation */}
                {factors.length > 0 && (
                  <div className="text-xs space-y-1">
                    <span className="font-semibold text-slate-400 block text-[11px] uppercase tracking-wider">
                      Key Risk Factors:
                    </span>
                    <ul className="space-y-0.5 text-slate-300 pl-2">
                      {factors.slice(0, 3).map((factor, idx) => (
                        <li key={idx} className="text-[11px] leading-tight">
                          • {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Roads & Settlements */}
                <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                  <div>
                    <strong className="text-slate-300">Connected Roads: </strong>
                    {zone.nearbyRoads.join(', ')}
                  </div>
                  <div>
                    <strong className="text-slate-300">Settlements: </strong>
                    {zone.nearbyVillages.join(', ')}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-800">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  icon={<PlusCircle className="w-4 h-4" />}
                  onClick={() => onReportForZone(zone)}
                >
                  Report Hazard for this Sector
                </Button>
              </div>
            </div>
          );
        })}

        {filteredZones.length === 0 && (
          <div className="col-span-full text-center py-12 bg-slate-900 rounded-xl border border-slate-800 p-6">
            <Mountain className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-300">No sectors match this filter</h4>
            <p className="text-xs text-slate-500 mt-1">Select another risk category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyRiskZonesView;
