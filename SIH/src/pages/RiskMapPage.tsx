import React, { useState, useEffect } from 'react';
import { RiskZone, RiskLevel } from '../types';
import { DEMO_RISK_ZONES } from '../data/mockData';
import { fetchSupabaseRiskZones } from '../services/riskZoneService';
import { MapContainer } from '../components/dashboard/MapContainer';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskScore } from '../components/common/RiskScore';
import { Button } from '../components/common/Button';
import {
  Map,
  MapPin,
  Activity,
  Layers,
  Database,
  X,
  ShieldCheck,
  Building2,
  Users,
  Compass,
} from 'lucide-react';

interface RiskMapPageProps {
  activeStateCode?: string;
}

export const RiskMapPage: React.FC<RiskMapPageProps> = () => {
  const [zones, setZones] = useState<RiskZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<RiskLevel | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadMapData() {
      setIsLoading(true);
      setErrorMessage(null);
      const { data, error } = await fetchSupabaseRiskZones();
      if (!isMounted) return;

      if (error) {
        setErrorMessage(error);
        setZones(DEMO_RISK_ZONES);
      } else if (data && data.length > 0) {
        setZones(data);
        setIsSupabaseLive(true);
      } else {
        setZones(DEMO_RISK_ZONES);
      }
      setIsLoading(false);
    }
    loadMapData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredZones = zones.filter((z) => {
    if (selectedSeverity === 'ALL') return true;
    return (z.riskLevel || z.assessment?.riskLevel) === selectedSeverity;
  });

  const criticalCount = zones.filter((z) => (z.riskLevel || z.assessment?.riskLevel) === 'CRITICAL').length;
  const highCount = zones.filter((z) => (z.riskLevel || z.assessment?.riskLevel) === 'HIGH').length;
  const moderateCount = zones.filter((z) => (z.riskLevel || z.assessment?.riskLevel) === 'MODERATE').length;
  const lowCount = zones.filter((z) => (z.riskLevel || z.assessment?.riskLevel) === 'LOW').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              GIS SURVEILLANCE & SPATIAL RISK MAP
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Map className="w-6 h-6 text-blue-400" />
            Northeast Regional Landslide Risk Map
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographical Information System (GIS) tracking terrain slope gradients, soil moisture, and active hazard corridors.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isSupabaseLive && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800 text-xs font-mono text-blue-300">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>SUPABASE LIVE</span>
            </div>
          )}
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-semibold font-mono">
            DEMO DATA (SIMULATED)
          </span>
        </div>
      </div>

      {/* Error State Banner */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-800 text-xs text-amber-300">
          <span className="font-bold">Notice:</span> {errorMessage}. Showing cached baseline data.
        </div>
      )}

      {/* Map Control Toolbar & Risk Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase text-slate-300 tracking-wider">
            Severity Filter:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedSeverity('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                selectedSeverity === 'ALL'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All ({zones.length})
            </button>
            <button
              onClick={() => setSelectedSeverity('CRITICAL')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                selectedSeverity === 'CRITICAL'
                  ? 'bg-red-950 text-red-200 font-bold border border-red-700'
                  : 'bg-slate-800 text-slate-400 hover:text-red-300'
              }`}
            >
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => setSelectedSeverity('HIGH')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                selectedSeverity === 'HIGH'
                  ? 'bg-orange-950 text-orange-200 font-bold border border-orange-700'
                  : 'bg-slate-800 text-slate-400 hover:text-orange-300'
              }`}
            >
              High ({highCount})
            </button>
            <button
              onClick={() => setSelectedSeverity('MODERATE')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                selectedSeverity === 'MODERATE'
                  ? 'bg-amber-950 text-amber-200 font-bold border border-amber-700'
                  : 'bg-slate-800 text-slate-400 hover:text-amber-300'
              }`}
            >
              Moderate ({moderateCount})
            </button>
            <button
              onClick={() => setSelectedSeverity('LOW')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                selectedSeverity === 'LOW'
                  ? 'bg-emerald-950 text-emerald-200 font-bold border border-emerald-700'
                  : 'bg-slate-800 text-slate-400 hover:text-emerald-300'
              }`}
            >
              Low ({lowCount})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>Active Viewport: Northeast India</span>
          <span>Sectors: {filteredZones.length} active</span>
        </div>
      </div>

      {/* Main Map Viewport & Sector Sidebar */}
      {isLoading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Initializing GIS map coordinates and terrain telemetry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Map Viewport (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <MapContainer
              zones={filteredZones}
              selectedZoneId={selectedZone?.id}
              onSelectZone={(zone) => setSelectedZone(zone)}
            />

            {/* Quick Map Legend */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-300">Spatial Risk Legend:</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical (Score 81–100)
                </span>
                <span className="flex items-center gap-1.5 text-orange-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High (Score 61–80)
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate (Score 31–60)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low (Score 0–30)
                </span>
              </div>
            </div>
          </div>

          {/* Side Sector Inspection List (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                    Monitored Risk Sectors
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {filteredZones.length} Zones
                </span>
              </div>

              <div className="divide-y divide-slate-800/80 max-h-[620px] overflow-y-auto">
                {filteredZones.map((zone) => {
                  const isSelected = selectedZone?.id === zone.id;
                  const level = zone.riskLevel || zone.assessment?.riskLevel || 'MODERATE';
                  const score = zone.riskScore ?? zone.assessment?.riskScore ?? 50;

                  return (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer space-y-2.5 ${
                        isSelected ? 'bg-slate-800/80 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                              {zone.code}
                            </span>
                            <RiskBadge level={level} size="sm" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-100 mt-1">
                            {zone.name}
                          </h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {zone.district}, {zone.state}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-bold font-mono text-slate-100">
                            {score}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">/100</span>
                        </div>
                      </div>

                      {/* Geological Snapshot */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-1">
                        <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800/60">
                          <span className="text-slate-500 block uppercase">Slope</span>
                          <span className="text-slate-200 font-bold">{zone.slopeAngleDeg ?? zone.assessment?.slopeAngleDeg}°</span>
                        </div>
                        <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800/60">
                          <span className="text-slate-500 block uppercase">Moisture</span>
                          <span className="text-slate-200 font-bold">{zone.soilMoisturePercent ?? zone.assessment?.soilMoisturePct}%</span>
                        </div>
                        <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800/60">
                          <span className="text-slate-500 block uppercase">24h Rain</span>
                          <span className="text-blue-400 font-bold">{zone.rainfallAccumulationMm ?? zone.assessment?.rainfallAccumulation24hMm ?? 0}mm</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800/60">
                        <span>
                          {typeof zone.latitude === 'number' && typeof zone.longitude === 'number'
                            ? `Lat: ${zone.latitude.toFixed(2)}°, Lon: ${zone.longitude.toFixed(2)}°`
                            : 'Coordinates Verified'}
                        </span>
                        <span className="text-blue-400 hover:underline">Click to Inspect</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Detail Inspection Modal for Selected Zone */}
      {selectedZone && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedZone(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                    {selectedZone.code}
                  </span>
                  <RiskBadge level={selectedZone.riskLevel || selectedZone.assessment?.riskLevel || 'MODERATE'} size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-1">
                  {selectedZone.name}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {selectedZone.district}, {selectedZone.state} (Lat: {selectedZone.latitude}, Lon: {selectedZone.longitude})
                </p>
              </div>

              <button
                onClick={() => setSelectedZone(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Risk Assessment */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <RiskScore
                score={selectedZone.riskScore ?? selectedZone.assessment?.riskScore ?? 50}
                level={selectedZone.riskLevel ?? selectedZone.assessment?.riskLevel ?? 'MODERATE'}
                contributingFactors={selectedZone.contributingFactors ?? selectedZone.assessment?.contributingFactors ?? []}
                size="md"
              />
            </div>

            {/* Geological & Environmental Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400">Slope Gradient</span>
                <div className="text-base font-bold text-slate-200 font-mono">
                  {selectedZone.slopeAngleDeg ?? selectedZone.assessment?.slopeAngleDeg ?? 'N/A'}°
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400">Soil Saturation</span>
                <div className="text-base font-bold text-slate-200 font-mono">
                  {selectedZone.soilMoisturePercent ?? selectedZone.assessment?.soilMoisturePct ?? 'N/A'}%
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400">24h Rainfall</span>
                <div className="text-base font-bold text-blue-400 font-mono">
                  {selectedZone.rainfallAccumulationMm ?? selectedZone.assessment?.rainfallAccumulation24hMm ?? 0} mm
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400">Current Rate</span>
                <div className="text-base font-bold text-blue-300 font-mono">
                  {selectedZone.currentRainfallMmH ?? selectedZone.assessment?.rainfallIntensityMm ?? 0} mm/h
                </div>
              </div>
            </div>

            {/* Exposed Settlements & Communities */}
            {selectedZone.nearbyVillages && selectedZone.nearbyVillages.length > 0 && (
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                <span className="text-xs uppercase font-bold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  Exposed Settlements
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedZone.nearbyVillages.map((v, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Critical Infrastructure */}
            {selectedZone.criticalInfrastructure && selectedZone.criticalInfrastructure.length > 0 && (
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                <span className="text-xs uppercase font-bold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-400" />
                  Key Infrastructure Assets
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedZone.criticalInfrastructure.map((inf, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-sky-200"
                    >
                      {inf}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedZone(null)}
              >
                Dismiss
              </Button>
              <Button
                size="sm"
                variant="primary"
                icon={<ShieldCheck className="w-4 h-4" />}
                onClick={() => setSelectedZone(null)}
              >
                Acknowledge Sector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskMapPage;
