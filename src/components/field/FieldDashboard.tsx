import React, { useState } from 'react';
import {
  Flame,
  PlusCircle,
  Compass,
  FileText,
  RefreshCcw,
  Droplets,
  Mountain,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ShieldCheck,
  Radio,
  MapPin,
  Clock
} from 'lucide-react';
import {
  RiskZone,
  CitizenReport,
  Alert,
  WeatherData,
  FieldActiveTab
} from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { RiskBadge } from '../common/RiskBadge';
import { RiskScoreMeter } from '../common/RiskScoreMeter';
import { StatCard } from '../common/StatCard';

export interface FieldDashboardProps {
  riskZones: RiskZone[];
  alerts: Alert[];
  recentReports: CitizenReport[];
  weather: WeatherData;
  onNavigateTab: (tab: FieldActiveTab) => void;
  onSelectRiskZone?: (zone: RiskZone) => void;
}

export const FieldDashboard: React.FC<FieldDashboardProps> = ({
  riskZones,
  alerts,
  recentReports,
  weather,
  onNavigateTab,
  onSelectRiskZone,
}) => {
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(riskZones[0]?.id || null);

  const criticalAlert = alerts.find((a) => a.severity === 'CRITICAL');
  const pendingCount = recentReports.filter((r) => r.status === 'PENDING_SYNC').length;
  const syncedCount = recentReports.filter((r) => r.status === 'SYNCED').length;

  return (
    <div className="space-y-6 pb-24 lg:pb-8 w-full">
      {/* 1. Critical Alert Banner (Spans Full Width) */}
      {criticalAlert && (
        <Card variant="critical" padding="md" className="w-full border-red-400 bg-red-50/95 shadow-sm animate-pulse-subtle">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0 shadow-sm">
                <Flame className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-red-200 text-red-900 text-[10px] font-mono uppercase tracking-wider font-extrabold">
                    HIGH PRIORITY DISASTER ALERT
                  </span>
                  <span className="text-xs font-mono text-red-800 font-bold">{criticalAlert.timestamp}</span>
                </div>
                <h3 className="text-base font-extrabold text-red-950 leading-snug">
                  {criticalAlert.title}
                </h3>
                <p className="text-xs sm:text-sm text-red-900 mt-1 font-medium leading-relaxed">
                  {criticalAlert.reason}
                </p>
                <div className="mt-2.5 pt-2 border-t border-red-200 text-xs font-bold text-red-900 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span><strong>Affected Route:</strong> {criticalAlert.affectedRoad}</span>
                  <span><strong>Village:</strong> {criticalAlert.affectedVillage}</span>
                  <span className="text-red-950"><strong>Recommended Response:</strong> {criticalAlert.recommendedAction}</span>
                </div>
              </div>
            </div>

            <Button
              variant="danger"
              size="md"
              className="shrink-0 self-start font-extrabold shadow-md mt-2 sm:mt-0"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => onNavigateTab('report')}
            >
              Dispatch Field Verification
            </Button>
          </div>
        </Card>
      )}

      {/* 2. Responsive KPI Metric Grid (4 columns on Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard
          label="Nearby Monitored Zones"
          value={riskZones.length}
          unit="zones"
          icon={<Mountain className="w-5 h-5 text-brand-primary" />}
          subtext={`${riskZones.filter((z) => z.riskLevel === 'CRITICAL' || z.riskLevel === 'HIGH').length} High / Critical Risk`}
          onClick={() => onNavigateTab('nearby')}
        />
        <StatCard
          label="Active Disaster Alerts"
          value={alerts.length}
          unit="alerts"
          variant={alerts.some((a) => a.severity === 'CRITICAL') ? 'critical' : 'default'}
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          subtext="1 Critical Priority Notice"
        />
        <StatCard
          label="Verified HQ Submissions"
          value={syncedCount}
          unit="uploaded"
          icon={<FileText className="w-5 h-5 text-emerald-600" />}
          subtext="Available in Authority DB"
          onClick={() => onNavigateTab('history')}
        />
        <StatCard
          label="Local Offline Queue"
          value={pendingCount}
          unit="pending"
          variant={pendingCount > 0 ? 'highlight' : 'default'}
          icon={<RefreshCcw className="w-5 h-5 text-amber-600" />}
          subtext={pendingCount > 0 ? 'Queued for auto-upload' : 'Local storage clear'}
          onClick={() => onNavigateTab('offline')}
        />
      </div>

      {/* 3. Main Content Split: Desktop 2/3 + 1/3 Grid | Mobile Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        {/* Left Column (2-Column span on Desktop): CTA + Monitored Zones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Action Hero Card */}
          <Card padding="lg" className="bg-gradient-to-br from-brand-primary via-sky-700 to-brand-dark text-white shadow-md border-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Field Officer Incident Stream</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold leading-tight">
                  Observe slope cracks, debris flow, or road blocks?
                </h2>
                <p className="text-xs sm:text-sm text-sky-100 mt-1 leading-relaxed">
                  Fast camera capture, photo preview, and GPS coordinates are stored locally even with zero mobile network reception.
                </p>
              </div>
              <Button
                variant="warning"
                size="lg"
                className="shrink-0 font-black text-amber-950 shadow-lg"
                leftIcon={<PlusCircle className="w-5 h-5 text-amber-950" />}
                onClick={() => onNavigateTab('report')}
              >
                Create Field Report
              </Button>
            </div>
          </Card>

          {/* Monitored Risk Zones Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-gov-800" />
                <h3 className="text-base font-extrabold text-gov-900">
                  Monitored Risk Sectors & Slopes
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('nearby')}
                className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>View Full Registry ({riskZones.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop 2-column grid for risk zone cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskZones.map((zone) => {
                const isExpanded = expandedZoneId === zone.id;
                return (
                  <Card
                    key={zone.id}
                    padding="md"
                    className={`transition-all duration-200 border-2 bg-white flex flex-col justify-between ${
                      zone.riskLevel === 'CRITICAL'
                        ? 'border-red-300 shadow-sm'
                        : zone.riskLevel === 'HIGH'
                        ? 'border-orange-300'
                        : 'border-gov-200'
                    }`}
                  >
                    <div>
                      {/* Zone Header */}
                      <div
                        className="flex items-start justify-between gap-2 cursor-pointer select-none mb-2"
                        onClick={() => setExpandedZoneId(isExpanded ? null : zone.id)}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <RiskBadge level={zone.riskLevel} size="sm" />
                            <span className="text-[10px] text-gov-500 font-mono">
                              {zone.district}
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-gov-900 leading-snug">
                            {zone.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-lg font-extrabold font-mono text-gov-900">
                            {zone.riskScore}<span className="text-xs font-normal text-gov-500">/100</span>
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gov-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gov-400" />
                          )}
                        </div>
                      </div>

                      {/* Key metric pills */}
                      <div className="grid grid-cols-3 gap-1.5 my-2.5 text-[11px] font-mono text-gov-700 bg-gov-50 p-2 rounded-xl border border-gov-200 text-center">
                        <div>
                          <span className="text-[9px] text-gov-500 block uppercase">Slope</span>
                          <span className="font-bold">{zone.slopeAngleDeg}°</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gov-500 block uppercase">24h Rain</span>
                          <span className="font-bold">{zone.rainfallAccumulationMm}mm</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gov-500 block uppercase">Soil Sat.</span>
                          <span className="font-bold">{zone.soilMoisturePercent}%</span>
                        </div>
                      </div>

                      {/* Expandable details & AI explanation */}
                      {isExpanded ? (
                        <div className="mt-3 pt-3 border-t border-gov-200 space-y-3">
                          <RiskScoreMeter
                            score={zone.riskScore}
                            level={zone.riskLevel}
                            contributingFactors={zone.contributingFactors}
                            compact={true}
                          />

                          <div className="text-xs text-gov-600 space-y-1 bg-gov-50 p-2.5 rounded-xl border border-gov-200">
                            <div>
                              <strong className="text-gov-800">Monitored Roads:</strong>{' '}
                              {zone.nearbyRoads.join(', ')}
                            </div>
                            <div>
                              <strong className="text-gov-800">Settlements:</strong>{' '}
                              {zone.nearbyVillages.join(', ')}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gov-600 line-clamp-2 mt-1">
                          {zone.contributingFactors[0]}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gov-100 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
                        onClick={() => onNavigateTab('report')}
                      >
                        Report for this Sector
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1-Column on Desktop): Weather + Recent Submissions Feed + Offline Storage */}
        <div className="lg:col-span-1 space-y-6">
          {/* Weather Conditions Card */}
          <Card padding="md" className="bg-white border border-gov-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-gov-800">
                  Patrol Weather (DEMO)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-gov-500">{weather.timestamp}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-sky-50 rounded-xl p-2.5 border border-sky-100">
                <span className="text-[10px] font-bold text-gov-600 uppercase block">Rain Intensity</span>
                <span className="text-base font-extrabold font-mono text-sky-900">{weather.rainfallMm} mm/h</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-2.5 border border-blue-100">
                <span className="text-[10px] font-bold text-gov-600 uppercase block">24h Accum.</span>
                <span className="text-base font-extrabold font-mono text-blue-900">{weather.rainfallAccumulation24hMm} mm</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                <span className="text-[10px] font-bold text-gov-600 uppercase block">Humidity</span>
                <span className="text-base font-extrabold font-mono text-emerald-900">{weather.humidityPercent}%</span>
              </div>
            </div>

            <p className="text-[11px] text-gov-500 mt-2.5 text-center font-medium">
              Station: {weather.location} (Wind: {weather.windSpeedKmh} km/h)
            </p>
          </Card>

          {/* Recent Field Submissions Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gov-800" />
                <h3 className="text-sm font-extrabold text-gov-900">
                  Recent Field Reports Feed
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('history')}
                className="text-xs font-bold text-brand-primary flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                <span>All ({recentReports.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentReports.slice(0, 4).map((report) => (
                <Card key={report.id} padding="sm" className="bg-white border border-gov-200 hover:border-gov-300">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-gov-800 text-white text-[10px] font-mono font-bold uppercase">
                        {report.reportType.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-gov-500 font-mono">{report.timestamp}</span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase font-mono border ${
                        report.status === 'SYNCED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : report.status === 'PENDING_SYNC'
                          ? 'bg-amber-50 text-amber-900 border-amber-300 animate-pulse'
                          : 'bg-gov-100 text-gov-700 border-gov-300'
                      }`}
                    >
                      {report.status === 'PENDING_SYNC' ? 'Pending' : report.status}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-gov-900 truncate">
                    {report.locationName}
                  </h5>
                  <p className="text-[11px] text-gov-600 line-clamp-2 mt-0.5 leading-relaxed">
                    {report.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Offline Resilience Guarantee Card */}
          <Card padding="md" className="bg-gov-50 border border-gov-200 text-xs text-gov-700 space-y-2">
            <h4 className="font-bold text-gov-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Field Offline Resilience
            </h4>
            <p className="text-[11px] text-gov-600 leading-relaxed">
              If mobile coverage fails along mountain passes, incident reports with GPS coordinates and images remain securely stored on device storage and synchronize automatically upon network resumption.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
