import React, { useState } from 'react';
import {
  DEMO_RISK_ZONES,
  DEMO_ALERTS,
  DEMO_ROADS,
  DEMO_WEATHER,
  DEMO_EMERGENCY_PRIORITIES,
  DEMO_REGIONAL_KPI_SUMMARY,
  NER_STATES,
} from '../data/mockData';
import { RiskZone, Alert } from '../types';
import { StatCard } from '../components/common/StatCard';
import { MapContainer } from '../components/dashboard/MapContainer';
import { ActiveAlertsList } from '../components/dashboard/ActiveAlertsList';
import { HighRiskZonesList } from '../components/dashboard/HighRiskZonesList';
import { RoadStatusWidget } from '../components/dashboard/RoadStatusWidget';
import { WeatherSummaryCard } from '../components/dashboard/WeatherSummaryCard';
import { EmergencyPrioritiesWidget } from '../components/dashboard/EmergencyPrioritiesWidget';
import { RiskScore } from '../components/common/RiskScore';
import { RiskBadge } from '../components/common/RiskBadge';
import { Button } from '../components/common/Button';
import {
  Activity,
  AlertTriangle,
  Flame,
  Route,
  MapPin,
  X,
} from 'lucide-react';

interface AuthorityDashboardProps {
  activeStateCode: string;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  activeStateCode,
}) => {
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(DEMO_ALERTS);

  const selectedState =
    NER_STATES.find((s) => s.code === activeStateCode) || NER_STATES[0];

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((a) =>
        a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a
      )
    );
  };

  const handleSelectAlert = (alert: Alert) => {
    const matchedZone = DEMO_RISK_ZONES.find((z) => z.id === alert.zoneId);
    if (matchedZone) {
      setSelectedZone(matchedZone);
    }
  };

  const activeAlerts = alerts.filter((a) => a.status !== 'RESOLVED');
  const criticalAlertsCount = alerts.filter(
    (a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE'
  ).length;

  return (
    <div className="space-y-6 pb-8">
      {/* Page Title & Region Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight font-sans">
            Authority Dashboard — {selectedState.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Landslide risk monitoring, road connectivity & emergency response
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            Active Dataset:
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
            Meghalaya Corridor Scenario
          </span>
        </div>
      </div>

      {/* 1. Simplified KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Regional Risk Index"
          value={`${DEMO_REGIONAL_KPI_SUMMARY.overallRiskScore}`}
          subValue="/ 100"
          statusText="High Risk"
          supportingMetric="↑ 14 points in 6h"
          severity="HIGH"
          icon={<Flame className="w-4 h-4 text-orange-400" />}
        />

        <StatCard
          label="Active Warnings"
          value={activeAlerts.length}
          subValue={`(${criticalAlertsCount} critical)`}
          statusText={criticalAlertsCount > 0 ? '1 Critical Alert' : 'Advisory Active'}
          supportingMetric="Action required"
          severity={criticalAlertsCount > 0 ? 'CRITICAL' : 'HIGH'}
          icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
        />

        <StatCard
          label="Monitored Risk Zones"
          value={DEMO_RISK_ZONES.length}
          subValue="active zones"
          statusText="4 High / Critical"
          supportingMetric="6 total monitored"
          severity="info"
          icon={<Activity className="w-4 h-4 text-sky-400" />}
        />

        <StatCard
          label="Road Passability"
          value={`${DEMO_REGIONAL_KPI_SUMMARY.blockedRoadsCount} Blocked`}
          subValue={`+ ${DEMO_REGIONAL_KPI_SUMMARY.restrictedRoadsCount} restricted`}
          statusText="NH-06 Obstructed"
          supportingMetric="Sonapur Tunnel area"
          severity="MODERATE"
          icon={<Route className="w-4 h-4 text-amber-400" />}
        />
      </div>

      {/* 2. Central Section: GIS Risk Map Centerpiece (8 cols) & Active Alerts Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* GIS Map Viewport (8 cols) */}
        <div className="lg:col-span-8">
          <MapContainer
            zones={DEMO_RISK_ZONES}
            selectedZoneId={selectedZone?.id}
            onSelectZone={(zone) => setSelectedZone(zone)}
          />
        </div>

        {/* Active Alerts Feed (4 cols) */}
        <div className="lg:col-span-4">
          <ActiveAlertsList
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onSelectAlert={handleSelectAlert}
          />
        </div>
      </div>

      {/* 3. Lower Section: 3-Column Balanced Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1: Monitored High-Risk Zones */}
        <div>
          <HighRiskZonesList
            zones={DEMO_RISK_ZONES}
            selectedZoneId={selectedZone?.id}
            onSelectZone={(zone) => setSelectedZone(zone)}
          />
        </div>

        {/* Column 2: Road Connectivity Status */}
        <div>
          <RoadStatusWidget
            roads={DEMO_ROADS}
            onSelectRoad={(road) => {
              const matched = DEMO_RISK_ZONES.find(
                (z) => z.id === road.linkedRiskZoneId
              );
              if (matched) setSelectedZone(matched);
            }}
          />
        </div>

        {/* Column 3: Weather Telemetry & Emergency Priorities */}
        <div className="space-y-6">
          <WeatherSummaryCard weather={DEMO_WEATHER} />
          
          <EmergencyPrioritiesWidget
            priorities={DEMO_EMERGENCY_PRIORITIES}
            onSelectPriority={(prio) => {
              const matched = DEMO_RISK_ZONES.find((z) => z.id === prio.zoneId);
              if (matched) setSelectedZone(matched);
            }}
          />
        </div>
      </div>

      {/* Interactive Detail Modal for Selected Zone */}
      {selectedZone && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedZone(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                    {selectedZone.code}
                  </span>
                  <RiskBadge level={selectedZone.assessment.riskLevel} size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-1">
                  {selectedZone.name}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {selectedZone.district}, {selectedZone.state} (Lat: {selectedZone.coordinates.latitude}, Lon: {selectedZone.coordinates.longitude})
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
            <div className="bg-slate-950/80 p-3.5 rounded border border-slate-800">
              <RiskScore
                score={selectedZone.assessment.riskScore}
                level={selectedZone.assessment.riskLevel}
                contributingFactors={selectedZone.assessment.contributingFactors}
                size="md"
              />
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">24h Rainfall</span>
                <span className="text-sm font-semibold text-slate-200">
                  {selectedZone.assessment.rainfallAccumulation24hMm} mm
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Slope Angle</span>
                <span className="text-sm font-semibold text-slate-200">
                  {selectedZone.assessment.slopeAngleDeg}°
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Soil Saturation</span>
                <span className="text-sm font-semibold text-slate-200">
                  {selectedZone.assessment.soilMoisturePct}%
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Past Landslides</span>
                <span className="text-sm font-semibold text-slate-200">
                  {selectedZone.assessment.historicalLandslideCount} recorded
                </span>
              </div>
            </div>

            {/* Nearby Infrastructure & Roads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded bg-slate-950/50 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium block">
                  Connected Roads:
                </span>
                <ul className="space-y-0.5 text-slate-300">
                  {selectedZone.nearbyRoads.map((road, i) => (
                    <li key={i}>• {road}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded bg-slate-950/50 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium block">
                  Nearby Settlements:
                </span>
                <ul className="space-y-0.5 text-slate-300">
                  {selectedZone.nearbyVillages.map((vil, i) => (
                    <li key={i}>• {vil}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Sync: {selectedZone.lastUpdated}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedZone(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
