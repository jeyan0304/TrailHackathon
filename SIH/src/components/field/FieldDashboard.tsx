import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileText,
  Radio,
  PlusCircle,
  ChevronRight,
  Droplets,
  ShieldCheck,
  Eye,
  Camera,
  Video,
  X,
} from 'lucide-react';
import {
  RiskZone,
  Alert,
  CitizenReport,
  WeatherData,
  FieldActiveTab,
} from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { RiskScoreMeter } from '../common/RiskScoreMeter';
import { Button } from '../common/Button';
import {
  getHumanReadableReportType,
  getHumanReadableVerificationStatus,
} from '../../services/citizenReportService';

export interface FieldDashboardProps {
  riskZones: RiskZone[];
  alerts: Alert[];
  recentReports: CitizenReport[];
  weather: WeatherData;
  onNavigateTab: (tab: FieldActiveTab) => void;
  onSelectRiskZone: (zone: RiskZone) => void;
  onInspectReport: (report: CitizenReport) => void;
  onInspectAlert?: (alert: Alert) => void;
}

export const FieldDashboard: React.FC<FieldDashboardProps> = ({
  riskZones,
  alerts,
  recentReports,
  weather,
  onNavigateTab,
  onSelectRiskZone,
  onInspectReport,
}) => {
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);
  const [inspectedAlert, setInspectedAlert] = useState<Alert | null>(null);

  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL');
  const pendingReportsCount = recentReports.filter(
    (r) => r.status === 'PENDING_SYNC' || r.verificationStatus === 'PENDING'
  ).length;

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onNavigateTab('report')}
          className="p-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex flex-col items-center justify-center gap-2 shadow transition-all duration-150 active:scale-98 cursor-pointer"
        >
          <PlusCircle className="w-6 h-6" />
          <span>Report Incident</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('nearby')}
          className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs flex flex-col items-center justify-center gap-2 transition-all duration-150 active:scale-98 cursor-pointer"
        >
          <ShieldAlert className="w-6 h-6 text-orange-400" />
          <span>Nearby Risk Zones</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('history')}
          className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs flex flex-col items-center justify-center gap-2 transition-all duration-150 active:scale-98 cursor-pointer"
        >
          <FileText className="w-6 h-6 text-blue-400" />
          <span>Report History ({recentReports.length})</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('offline')}
          className={`p-4 rounded-xl border font-semibold text-xs flex flex-col items-center justify-center gap-2 transition-all duration-150 active:scale-98 cursor-pointer ${
            pendingReportsCount > 0
              ? 'bg-amber-950/60 border-amber-800 text-amber-200'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
          }`}
        >
          <Radio className={`w-6 h-6 ${pendingReportsCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
          <span>Pending Review ({pendingReportsCount})</span>
        </button>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-950/80 border border-red-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-red-300 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Active Critical Landslide Warning</span>
          </div>
          {criticalAlerts.map((alert) => (
            <div key={alert.id} className="text-xs text-slate-200 flex items-start justify-between gap-3 bg-red-900/30 p-3 rounded-lg border border-red-800/60">
              <div className="space-y-1">
                <div>
                  <strong className="text-white">{alert.title}: </strong>
                  <span>{alert.reason}</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Location: {alert.location} • Road: {alert.affectedRoad || (alert.affectedRoads && alert.affectedRoads[0]) || 'Monitored Highway'}
                </div>
              </div>
              <Button
                variant="danger"
                size="xs"
                icon={<Eye className="w-3 h-3" />}
                onClick={() => setInspectedAlert(alert)}
              >
                Inspect
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Nearby Monitored Risk Zones */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              Monitored Risk Sectors ({riskZones.length})
            </h3>
            <button
              onClick={() => onNavigateTab('nearby')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {riskZones.map((zone) => {
              const isExpanded = expandedZoneId === zone.id;
              const assessment = zone.assessment || {
                riskScore: zone.riskScore || 50,
                riskLevel: zone.riskLevel || 'MODERATE',
                contributingFactors: zone.contributingFactors || [],
              };

              return (
                <div
                  key={zone.id}
                  className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3 transition-colors hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                          {zone.code || zone.name.slice(0, 8)}
                        </span>
                        <RiskBadge level={assessment.riskLevel} size="sm" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 mt-1">
                        {zone.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {zone.district}, {zone.state}
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-xl font-bold text-slate-100">
                        {assessment.riskScore}
                      </span>
                      <span className="text-xs text-slate-500">/100</span>
                    </div>
                  </div>

                  {/* Telemetry Chips */}
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Slope</span>
                      <span className="text-slate-200 font-bold">{zone.slopeAngleDeg || zone.assessment?.slopeAngleDeg || 30}°</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">24h Rain</span>
                      <span className="text-slate-200 font-bold">{zone.rainfallAccumulationMm || zone.assessment?.rainfallAccumulation24hMm || 0}mm</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Soil Sat.</span>
                      <span className="text-slate-200 font-bold">{zone.soilMoisturePercent || zone.assessment?.soilMoisturePct || 0}%</span>
                    </div>
                  </div>

                  {/* Expandable Explanation */}
                  {isExpanded ? (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <RiskScoreMeter
                        score={assessment.riskScore}
                        level={assessment.riskLevel}
                        contributingFactors={assessment.contributingFactors}
                        compact={true}
                      />
                      <div className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                        <div>
                          <strong className="text-slate-300">Monitored Roads: </strong>
                          {zone.nearbyRoads?.join(', ') || 'Arterial Links'}
                        </div>
                        <div>
                          <strong className="text-slate-300">Settlements: </strong>
                          {zone.nearbyVillages?.join(', ') || 'Settlements'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 truncate">
                      {assessment.contributingFactors?.[0] || 'Continuous monitoring active.'}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedZoneId(isExpanded ? null : zone.id)}
                      className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {isExpanded ? 'Less details' : 'AI Explanation'}
                    </button>
                    <Button
                      variant="primary"
                      size="xs"
                      icon={<PlusCircle className="w-3.5 h-3.5" />}
                      onClick={() => onSelectRiskZone(zone)}
                    >
                      Report for Sector
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Weather + Recent Reports Feed */}
        <div className="space-y-6">
          {/* Weather Card */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  Patrol Weather (DEMO)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{weather.timestamp}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-slate-950 rounded p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Rain Rate</span>
                <span className="text-sm font-bold text-blue-400">{weather.rainfallCurrentMm || weather.rainfallMm} mm/h</span>
              </div>
              <div className="bg-slate-950 rounded p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">24h Accum</span>
                <span className="text-sm font-bold text-sky-400">{weather.rainfallAccumulation24hMm} mm</span>
              </div>
              <div className="bg-slate-950 rounded p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Humidity</span>
                <span className="text-sm font-bold text-cyan-400">{weather.humidityPercent || weather.humidityPct}%</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Station: {weather.location} • Wind: {weather.windSpeedKmh} km/h
            </p>
          </div>

          {/* Recent Reports Feed with Direct Inspect Action */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Field Reports Feed
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('history')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                All ({recentReports.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {recentReports.slice(0, 4).map((report) => {
                const isCitizen = report.reporterRole === 'Citizen' || report.reporterType === 'Citizen' || !report.reporterRole || report.reporterName?.includes('Citizen') || report.reporterName?.includes('Wanda');
                return (
                <div
                  key={report.id}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900 text-[10px]">
                        {getHumanReadableReportType(report.reportType)}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isCitizen
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      }`}>
                        {isCitizen ? 'CITIZEN' : 'FIELD PATROL'}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      report.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : report.verificationStatus === 'REJECTED'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {getHumanReadableVerificationStatus(report.verificationStatus)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      {report.photoUrl && <Camera className="w-3 h-3 text-blue-400" />}
                      {report.videoUrl && <Video className="w-3 h-3 text-purple-400" />}
                      <span>{report.reporterName || (isCitizen ? 'Citizen Sentinel' : 'Insp. Thendup Sangma')} • {report.timestamp}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="xs"
                      icon={<Eye className="w-3 h-3" />}
                      onClick={() => onInspectReport(report)}
                    >
                      Inspect
                    </Button>
                  </div>
                </div>
              );
              })}
            </div>
          </div>

          {/* Offline Resilience Guarantee */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Offline Resilience Guarantee
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If mountain network drops, incident reports and photos are securely cached in local device storage and automatically uploaded when connectivity returns.
            </p>
          </div>
        </div>
      </div>

      {/* Warning Inspection Modal */}
      {inspectedAlert && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setInspectedAlert(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold font-mono text-red-400 uppercase">
                    Critical Landslide Advisory
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {inspectedAlert.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedAlert(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Trigger Reason:</span>
                <p className="text-slate-200 mt-0.5">{inspectedAlert.reason}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Recommended Patrol Response:</span>
                <p className="text-amber-300 mt-0.5">{inspectedAlert.recommendedAction || 'Dispatch patrol and verify slope stability.'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Location</span>
                <span className="text-slate-200 font-bold">{inspectedAlert.location}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Road Corridor</span>
                <span className="text-slate-200 font-bold">{inspectedAlert.affectedRoad || 'Arterial Link'}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectedAlert(null)}
              >
                Dismiss
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setInspectedAlert(null);
                  onNavigateTab('report');
                }}
              >
                File Field Report for this Hazard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldDashboard;
