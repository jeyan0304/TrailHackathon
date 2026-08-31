import React, { useState, useEffect } from 'react';
import { Alert, RiskLevel, AlertStatus, RiskZone } from '../types';
import { DEMO_ALERTS, DEMO_ROADS, DEMO_RISK_ZONES } from '../data/mockData';
import { fetchSupabaseAlerts } from '../services/alertService';
import { fetchSupabaseRiskZones } from '../services/riskZoneService';
import { fetchSupabaseRoads } from '../services/roadService';
import { fetchSupabaseVillages } from '../services/villageService';
import { AlertCard } from '../components/dashboard/AlertCard';
import { StatCard } from '../components/common/StatCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskScore } from '../components/common/RiskScore';
import { Button } from '../components/common/Button';
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Filter,
  Search,
  Database,
  MapPin,
  X,
  ShieldCheck,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [zones, setZones] = useState<RiskZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<RiskLevel | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadAlertsData() {
      setIsLoading(true);
      setErrorMessage(null);

      // Load supporting context
      const { data: zonesData } = await fetchSupabaseRiskZones();
      const { data: roadsData } = await fetchSupabaseRoads(zonesData);
      const { data: villagesData } = await fetchSupabaseVillages(zonesData);

      if (zonesData && zonesData.length > 0) {
        setZones(zonesData);
      } else {
        setZones(DEMO_RISK_ZONES);
      }

      // Load Alerts
      const { data: alertsData, error: alertsErr } = await fetchSupabaseAlerts(
        zonesData && zonesData.length > 0 ? zonesData : DEMO_RISK_ZONES,
        roadsData && roadsData.length > 0 ? roadsData : DEMO_ROADS,
        villagesData || []
      );

      if (!isMounted) return;

      if (alertsErr) {
        setErrorMessage(alertsErr);
        setAlerts(DEMO_ALERTS);
      } else if (alertsData && alertsData.length > 0) {
        setAlerts(alertsData);
        setIsSupabaseLive(true);
      } else {
        setAlerts(DEMO_ALERTS);
      }
      setIsLoading(false);
    }

    loadAlertsData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a
      )
    );
  };

  const handleSelectAlert = (alert: Alert) => {
    const matched = zones.find((z) => z.id === alert.zoneId) || DEMO_RISK_ZONES.find((z) => z.id === alert.zoneId);
    if (matched) setSelectedZone(matched);
  };

  // Filter and search
  const filteredAlerts = alerts.filter((alert) => {
    if (selectedSeverity !== 'ALL' && alert.severity !== selectedSeverity) {
      return false;
    }
    if (selectedStatus !== 'ALL' && alert.status !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = alert.title.toLowerCase().includes(q);
      const matchesReason = alert.reason.toLowerCase().includes(q);
      const matchesLoc = alert.location.toLowerCase().includes(q);
      const matchesAction = alert.recommendedAction.toLowerCase().includes(q);
      if (!matchesTitle && !matchesReason && !matchesLoc && !matchesAction) {
        return false;
      }
    }
    return true;
  });

  const totalActive = alerts.filter((a) => a.status === 'ACTIVE').length;
  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
  const highCount = alerts.filter((a) => a.severity === 'HIGH' && a.status === 'ACTIVE').length;
  const acknowledgedCount = alerts.filter((a) => a.status === 'ACKNOWLEDGED').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              MULTI-HAZARD EARLY WARNING SYSTEM
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Active Alerts & Hazard Advisories
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational alerts generated from rainfall accumulation thresholds, slope movement sensors, and AI terrain evaluations.
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
          <span className="font-bold">Notice:</span> {errorMessage}. Showing baseline warning feeds.
        </div>
      )}

      {/* Alerts Decision KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Active Warnings"
          value={totalActive}
          subValue="in regional network"
          statusText={totalActive > 0 ? `${totalActive} Require Attention` : 'All Clear'}
          supportingMetric="Surveillance synced across all sectors"
          severity={criticalCount > 0 ? 'CRITICAL' : totalActive > 0 ? 'HIGH' : 'LOW'}
          icon={<BellRing className="w-5 h-5 text-red-400" />}
        />

        <StatCard
          label="Critical Warnings"
          value={criticalCount}
          subValue="high impact hazard"
          statusText={criticalCount > 0 ? 'Immediate Action Needed' : 'No Critical Events'}
          supportingMetric="Triggered by threshold exceedance"
          severity={criticalCount > 0 ? 'CRITICAL' : 'info'}
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        />

        <StatCard
          label="High Severity Warnings"
          value={highCount}
          subValue="escalated advisory"
          statusText={highCount > 0 ? 'Precautionary Patrol' : 'Normal Conditions'}
          supportingMetric="Heavy rain accelerating saturation"
          severity="HIGH"
          icon={<AlertTriangle className="w-5 h-5 text-orange-400" />}
        />

        <StatCard
          label="Acknowledged by Command"
          value={acknowledgedCount}
          subValue="under active response"
          statusText="Response Mobilized"
          supportingMetric="Field teams dispatched to affected sites"
          severity="MODERATE"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Severity Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Severity:
            </span>
            {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  selectedSeverity === sev
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase text-slate-400 mr-1">
              Status:
            </span>
            {(['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-slate-700 text-white font-semibold border border-slate-600'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by sector, reason, highway corridor, or recommended response..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Alert Feed Stream */}
      {isLoading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Fetching multi-hazard early warning advisories...</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-12 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
          <h3 className="text-sm font-bold text-slate-200">No alerts matching current filters</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your severity or status filters, or clear your search keyword to view all regional warnings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledgeAlert}
              onViewDetails={handleSelectAlert}
            />
          ))}
        </div>
      )}

      {/* Sector Inspection Modal for Selected Alert */}
      {selectedZone && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedZone(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
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

            {/* Geological Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400">Slope Angle</span>
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
                <span className="text-slate-400">Rain Rate</span>
                <div className="text-base font-bold text-blue-300 font-mono">
                  {selectedZone.currentRainfallMmH ?? selectedZone.assessment?.rainfallIntensityMm ?? 0} mm/h
                </div>
              </div>
            </div>

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

export default AlertsPage;
