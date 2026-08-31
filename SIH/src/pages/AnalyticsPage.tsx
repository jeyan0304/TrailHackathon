import React, { useState, useEffect } from 'react';
import { RiskZone, Road, Alert, LandslideEvent, Village } from '../types';
import {
  DEMO_RISK_ZONES,
  DEMO_ROADS,
  DEMO_ALERTS,
} from '../data/mockData';
import { fetchSupabaseRiskZones } from '../services/riskZoneService';
import { fetchSupabaseRoads } from '../services/roadService';
import { fetchSupabaseAlerts } from '../services/alertService';
import { fetchSupabaseLandslideEvents } from '../services/landslideEventService';
import { fetchSupabaseVillages } from '../services/villageService';
import { StatCard } from '../components/common/StatCard';
import { RiskBadge } from '../components/common/RiskBadge';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Route,
  History,
  CloudRain,
  Database,
  Users,
  BellRing,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [zones, setZones] = useState<RiskZone[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [events, setEvents] = useState<LandslideEvent[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadAnalyticsData() {
      setIsLoading(true);
      setErrorMessage(null);

      // 1. Risk Zones
      const { data: zonesData, error: zonesErr } = await fetchSupabaseRiskZones();
      const activeZones = zonesData && zonesData.length > 0 ? zonesData : DEMO_RISK_ZONES;

      // 2. Roads
      const { data: roadsData } = await fetchSupabaseRoads(activeZones);

      // 3. Villages
      const { data: villagesData } = await fetchSupabaseVillages(activeZones);

      // 4. Alerts
      const { data: alertsData } = await fetchSupabaseAlerts(
        activeZones,
        roadsData && roadsData.length > 0 ? roadsData : DEMO_ROADS,
        villagesData || []
      );

      // 5. Landslide Events
      const { data: eventsData } = await fetchSupabaseLandslideEvents(activeZones);

      if (!isMounted) return;

      if (zonesErr) {
        setErrorMessage(zonesErr);
      }

      setZones(activeZones);
      setRoads(roadsData && roadsData.length > 0 ? roadsData : DEMO_ROADS);
      setAlerts(alertsData && alertsData.length > 0 ? alertsData : DEMO_ALERTS);
      setEvents(eventsData || []);
      setVillages(villagesData || []);

      if (zonesData && zonesData.length > 0) {
        setIsSupabaseLive(true);
      }

      setIsLoading(false);
    }

    loadAnalyticsData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute Analytics Metrics
  const avgRiskScore = Math.round(
    zones.reduce((acc, z) => acc + (z.riskScore ?? z.assessment?.riskScore ?? 50), 0) / (zones.length || 1)
  );

  const criticalCount = zones.filter((z) => (z.riskLevel || z.assessment?.riskLevel) === 'CRITICAL').length;
  const highCount = zones.filter((z) => (z.riskLevel || z.assessment?.riskLevel) === 'HIGH').length;
  const moderateCount = zones.filter((z) => (z.riskLevel || z.assessment?.riskLevel) === 'MODERATE').length;
  const lowCount = zones.filter((z) => (z.riskLevel || z.assessment?.riskLevel) === 'LOW').length;

  const blockedRoads = roads.filter((r) => r.status === 'BLOCKED').length;
  const restrictedRoads = roads.filter((r) => r.status === 'RESTRICTED').length;
  const openRoads = roads.filter((r) => r.status === 'OPEN').length;

  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const highAlerts = alerts.filter((a) => a.severity === 'HIGH').length;
  const moderateAlerts = alerts.filter((a) => a.severity === 'MODERATE').length;

  const totalExposedPop = villages.reduce((acc, v) => acc + (v.populationExposure ?? v.population ?? 0), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              PREDICTIVE RISK ENGINE & ANALYTICS INTELLIGENCE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Terrain Hazard & Vulnerability Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Regional cross-sector correlations, slope risk indices, precipitation impact modeling, and passability health metrics.
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
          <span className="font-bold">Notice:</span> {errorMessage}. Showing baseline predictive analytics.
        </div>
      )}

      {/* Executive Decision KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Regional Average Risk Index"
          value={`${avgRiskScore}`}
          subValue="/ 100"
          statusText={avgRiskScore > 60 ? 'High Risk Average' : 'Moderate Baseline'}
          supportingMetric="Weighted across all monitored terrain"
          severity={avgRiskScore > 80 ? 'CRITICAL' : avgRiskScore > 60 ? 'HIGH' : 'MODERATE'}
          icon={<TrendingUp className="w-5 h-5 text-orange-400" />}
        />

        <StatCard
          label="Elevated Risk Sectors"
          value={`${criticalCount + highCount}`}
          subValue={`of ${zones.length} sectors`}
          statusText="Critical + High Exposure"
          supportingMetric="Slope angles exceeding 30°"
          severity={criticalCount > 0 ? 'CRITICAL' : 'HIGH'}
          icon={<Activity className="w-5 h-5 text-red-400" />}
        />

        <StatCard
          label="Corridor Passability Index"
          value={`${Math.round((openRoads / (roads.length || 1)) * 100)}%`}
          subValue="passable roads"
          statusText={`${blockedRoads} Blocked / ${restrictedRoads} Restr.`}
          supportingMetric="Arterial highway connectivity"
          severity={blockedRoads > 0 ? 'HIGH' : 'LOW'}
          icon={<Route className="w-5 h-5 text-amber-400" />}
        />

        <StatCard
          label="Exposed Population"
          value={totalExposedPop > 0 ? totalExposedPop.toLocaleString() : '5,400'}
          subValue="residents in hazard zones"
          statusText="Settlements Monitored"
          supportingMetric="Evacuation advisories prepared"
          severity="info"
          icon={<Users className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      {isLoading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Synthesizing multi-hazard analytics metrics and terrain models...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Sector Risk Index Comparative Visualizer */}
          <div className="lg:col-span-7 space-y-6">
            {/* Sector by Sector Risk Score Comparison */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                    Sector Risk Score Comparison (0–100)
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {zones.length} Sectors Synced
                </span>
              </div>

              <div className="space-y-4 pt-1">
                {zones.map((zone) => {
                  const score = zone.riskScore ?? zone.assessment?.riskScore ?? 50;
                  const level = zone.riskLevel || zone.assessment?.riskLevel || 'MODERATE';

                  const barColor =
                    level === 'CRITICAL'
                      ? 'bg-red-500'
                      : level === 'HIGH'
                      ? 'bg-orange-500'
                      : level === 'MODERATE'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500';

                  return (
                    <div key={zone.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-200">
                            {zone.name}
                          </span>
                          <RiskBadge level={level} size="sm" />
                        </div>
                        <span className="font-mono font-bold text-slate-100">
                          {score} <span className="text-slate-500 font-normal">/ 100</span>
                        </span>
                      </div>

                      {/* Native HTML/CSS Progress Bar */}
                      <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${Math.min(score, 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Slope: {zone.slopeAngleDeg ?? zone.assessment?.slopeAngleDeg}°</span>
                        <span>Soil Moisture: {zone.soilMoisturePercent ?? zone.assessment?.soilMoisturePct}%</span>
                        <span>Rainfall: {zone.rainfallAccumulationMm ?? zone.assessment?.rainfallAccumulation24hMm ?? 0}mm</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Environmental Telemetry Comparison */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                    Precipitation & Soil Moisture Correlation
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  24h Telemetry Matrix
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-200">
                        {zone.code}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {zone.district}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase block font-mono">24h Rain</span>
                        <span className="text-blue-400 font-bold text-sm font-mono block mt-0.5">
                          {zone.rainfallAccumulationMm ?? zone.assessment?.rainfallAccumulation24hMm ?? 0} mm
                        </span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase block font-mono">Saturation</span>
                        <span className="text-amber-400 font-bold text-sm font-mono block mt-0.5">
                          {zone.soilMoisturePercent ?? zone.assessment?.soilMoisturePct ?? 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Distribution Breakdowns */}
          <div className="lg:col-span-5 space-y-6">
            {/* Risk Severity Distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                    Hazard Severity Distribution
                  </h3>
                </div>
              </div>

              {/* Segment Proportional Visual Bar */}
              <div className="w-full h-4 rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex">
                <div style={{ width: `${(criticalCount / (zones.length || 1)) * 100}%` }} className="bg-red-500 h-full" title="Critical" />
                <div style={{ width: `${(highCount / (zones.length || 1)) * 100}%` }} className="bg-orange-500 h-full" title="High" />
                <div style={{ width: `${(moderateCount / (zones.length || 1)) * 100}%` }} className="bg-amber-500 h-full" title="Moderate" />
                <div style={{ width: `${(lowCount / (zones.length || 1)) * 100}%` }} className="bg-emerald-500 h-full" title="Low" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Critical
                  </span>
                  <span className="text-slate-100 font-bold">{criticalCount}</span>
                </div>

                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-orange-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-orange-500" /> High
                  </span>
                  <span className="text-slate-100 font-bold">{highCount}</span>
                </div>

                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Moderate
                  </span>
                  <span className="text-slate-100 font-bold">{moderateCount}</span>
                </div>

                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low
                  </span>
                  <span className="text-slate-100 font-bold">{lowCount}</span>
                </div>
              </div>
            </div>

            {/* Road Corridor Health Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                    Arterial Highway Passability
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {roads.length} Routes
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Open & Passable Routes</span>
                  <span className="font-mono font-bold text-emerald-400">{openRoads} / {roads.length}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(openRoads / (roads.length || 1)) * 100}%` }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-300">Restricted Routes</span>
                  <span className="font-mono font-bold text-amber-400">{restrictedRoads} / {roads.length}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(restrictedRoads / (roads.length || 1)) * 100}%` }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-300">Blocked Corridors</span>
                  <span className="font-mono font-bold text-red-400">{blockedRoads} / {roads.length}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${(blockedRoads / (roads.length || 1)) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Multi-Hazard Alert Distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                    Multi-Hazard Alert Distribution
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {alerts.length} Alerts
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-red-400 font-bold text-sm block">{criticalAlerts}</span>
                  <span className="text-[10px] text-slate-400 uppercase block font-sans">Critical</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-orange-400 font-bold text-sm block">{highAlerts}</span>
                  <span className="text-[10px] text-slate-400 uppercase block font-sans">High</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-bold text-sm block">{moderateAlerts}</span>
                  <span className="text-[10px] text-slate-400 uppercase block font-sans">Moderate</span>
                </div>
              </div>
            </div>

            {/* Historical Landslide Incidents & Geological Frequency */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                    Geological Events & History
                  </h3>
                </div>
                <span className="text-xs font-mono text-purple-300">
                  {events.length} Historical Logs
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {events.length > 0 ? (
                  events.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]"
                    >
                      <div className="flex items-center justify-between text-slate-200">
                        <span className="font-bold">{ev.location}</span>
                        <span className="text-slate-400">{ev.date}</span>
                      </div>
                      <p className="text-slate-400 font-sans text-xs truncate">{ev.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">
                    Historical slope records integrated into the baseline AI terrain evaluation engine.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
