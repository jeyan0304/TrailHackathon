import React, { useState } from 'react';
import {
  Compass,
  Mountain,
  PlusCircle
} from 'lucide-react';
import { RiskZone, RiskLevel } from '../../types';
import { Card } from '../common/Card';
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
    return zone.riskLevel === selectedFilter;
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-8 w-full">
      {/* View Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gov-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-6 h-6 text-brand-primary" />
              <h2 className="text-lg sm:text-xl font-extrabold text-gov-900">
                Monitored Risk Sectors & Slopes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gov-600">
              Active landslide risk registry across North Eastern Region patrol sectors (Meghalaya, Arunachal, Nagaland, Sikkim).
            </p>
          </div>

          {/* Severity Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar self-start sm:self-auto">
            {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedFilter(lvl)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  selectedFilter === lvl
                    ? 'bg-gov-900 text-white shadow-sm'
                    : 'bg-gov-100 text-gov-700 hover:bg-gov-200'
                }`}
              >
                {lvl === 'ALL' ? 'All Zones' : `${lvl}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Grid of Risk Zone Cards (3-column on Desktop, 2-column on Tablet, 1-column on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredZones.map((zone) => (
          <Card
            key={zone.id}
            padding="md"
            className={`border-2 bg-white flex flex-col justify-between ${
              zone.riskLevel === 'CRITICAL'
                ? 'border-red-400 bg-red-50/20 shadow-sm'
                : zone.riskLevel === 'HIGH'
                ? 'border-orange-300'
                : 'border-gov-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <RiskBadge level={zone.riskLevel} size="sm" />
                    <span className="text-[10px] text-gov-500 font-mono">
                      {zone.district}, {zone.state}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-gov-900 leading-snug">
                    {zone.name}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-mono font-extrabold text-gov-900">
                    {zone.riskScore}
                    <span className="text-xs font-normal text-gov-500">/100</span>
                  </span>
                  <span className="block text-[10px] text-gov-500 font-medium">Risk Score</span>
                </div>
              </div>

              {/* Metric specs */}
              <div className="grid grid-cols-4 gap-1.5 py-2.5 my-2.5 border-y border-gov-200 text-center font-mono text-[11px]">
                <div className="bg-gov-50 rounded-lg p-1.5">
                  <span className="text-[9px] text-gov-500 block uppercase">Slope</span>
                  <span className="font-bold text-gov-900">{zone.slopeAngleDeg}°</span>
                </div>
                <div className="bg-gov-50 rounded-lg p-1.5">
                  <span className="text-[9px] text-gov-500 block uppercase">24h Rain</span>
                  <span className="font-bold text-gov-900">{zone.rainfallAccumulationMm}mm</span>
                </div>
                <div className="bg-gov-50 rounded-lg p-1.5">
                  <span className="text-[9px] text-gov-500 block uppercase">Soil Sat</span>
                  <span className="font-bold text-gov-900">{zone.soilMoisturePercent}%</span>
                </div>
                <div className="bg-gov-50 rounded-lg p-1.5">
                  <span className="text-[9px] text-gov-500 block uppercase">Past Events</span>
                  <span className="font-bold text-gov-900">{zone.historicalEventsCount}</span>
                </div>
              </div>

              {/* AI Risk explanation */}
              <div className="text-xs space-y-1 my-2.5">
                <span className="font-bold text-gov-800 block text-[11px] uppercase tracking-wider">
                  Contributing AI Risk Factors:
                </span>
                <ul className="space-y-1 pl-1">
                  {zone.contributingFactors.map((factor, idx) => (
                    <li key={idx} className="text-gov-700 flex items-start gap-1.5 text-[11px] leading-tight">
                      <span className="text-gov-400 font-bold">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Roads & Settlements */}
              <div className="mt-2 text-[11px] text-gov-600 bg-gov-100/70 p-2.5 rounded-xl space-y-1">
                <div>
                  <strong className="text-gov-800">Affected Roads:</strong> {zone.nearbyRoads.join(', ')}
                </div>
                <div>
                  <strong className="text-gov-800">Settlements:</strong> {zone.nearbyVillages.join(', ')}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 pt-3 border-t border-gov-100">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                leftIcon={<PlusCircle className="w-4 h-4" />}
                onClick={() => onReportForZone(zone)}
              >
                Report Hazard for this Zone
              </Button>
            </div>
          </Card>
        ))}

        {filteredZones.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gov-200 p-6">
            <Mountain className="w-12 h-12 text-gov-300 mx-auto mb-2" />
            <h4 className="text-base font-bold text-gov-700">No zones matching filter</h4>
            <p className="text-xs text-gov-500 mt-1">Try selecting a different risk level.</p>
          </div>
        )}
      </div>
    </div>
  );
};
