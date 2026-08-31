import React, { useState, useEffect } from 'react';
import {
  DEMO_RISK_ZONES,
  DEMO_ALERTS,
  DEMO_ROADS,
  DEMO_WEATHER,
  DEMO_EMERGENCY_PRIORITIES,
  DEMO_REGIONAL_KPI_SUMMARY,
  NER_STATES,
} from '../data/mockData';
import {
  RiskZone,
  Alert,
  WeatherData,
  Road,
  Village,
  Infrastructure,
  LandslideEvent,
  CitizenReport,
} from '../types';
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

import { fetchSupabaseRiskZones } from '../services/riskZoneService';
import { fetchSupabaseWeatherData, ZoneWeatherSummary } from '../services/weatherService';
import { fetchSupabaseRoads } from '../services/roadService';
import { fetchSupabaseVillages } from '../services/villageService';
import { fetchSupabaseInfrastructure } from '../services/infrastructureService';
import { fetchSupabaseAlerts } from '../services/alertService';
import { fetchSupabaseLandslideEvents } from '../services/landslideEventService';
import {
  fetchSupabaseCitizenReports,
  getHumanReadableReportType,
  getHumanReadableVerificationStatus,
} from '../services/citizenReportService';

import {
  Activity,
  AlertTriangle,
  Flame,
  Route,
  MapPin,
  X,
  ShieldCheck,
  Users,
  Building2,
  History,
  FileText,
  Clock,
  Database,
  Camera,
  Video,
  RefreshCw,
} from 'lucide-react';

interface AuthorityDashboardProps {
  activeStateCode: string;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  activeStateCode,
}) => {
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(DEMO_ALERTS);

  // 1. Supabase Risk Zones State
  const [supabaseZones, setSupabaseZones] = useState<RiskZone[]>([]);
  const [isLoadingZones, setIsLoadingZones] = useState<boolean>(true);

  // 2. Supabase Weather State
  const [supabaseWeather, setSupabaseWeather] = useState<WeatherData | null>(null);
  const [zoneWeatherMap, setZoneWeatherMap] = useState<Map<string, ZoneWeatherSummary>>(new Map());
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);

  // 3. Supabase Roads State
  const [supabaseRoads, setSupabaseRoads] = useState<Road[]>([]);
  const [isLoadingRoads, setIsLoadingRoads] = useState<boolean>(true);

  // 4. Supabase Villages State
  const [supabaseVillages, setSupabaseVillages] = useState<Village[]>([]);
  const [isLoadingVillages, setIsLoadingVillages] = useState<boolean>(true);

  // 5. Supabase Infrastructure State
  const [supabaseInfra, setSupabaseInfra] = useState<Infrastructure[]>([]);
  const [isLoadingInfra, setIsLoadingInfra] = useState<boolean>(true);

  // 6. Supabase Alerts State
  const [supabaseAlerts, setSupabaseAlerts] = useState<Alert[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState<boolean>(true);

  // 7. Supabase Landslide Events State
  const [supabaseEvents, setSupabaseEvents] = useState<LandslideEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);

  // 8. Supabase Citizen Reports State
  const [supabaseCitizenReports, setSupabaseCitizenReports] = useState<CitizenReport[]>([]);
  const [isLoadingCitizenReports, setIsLoadingCitizenReports] = useState<boolean>(true);
  const [citizenReportsError, setCitizenReportsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoadingZones(true);
      setIsLoadingWeather(true);
      setIsLoadingRoads(true);
      setIsLoadingVillages(true);
      setIsLoadingInfra(true);
      setIsLoadingAlerts(true);
      setIsLoadingEvents(true);
      setIsLoadingCitizenReports(true);

      // 1. Fetch live Risk Zones
      const { data: zonesData, error: zonesError } = await fetchSupabaseRiskZones();
      if (!isMounted) return;

      if (zonesError) {
        console.warn('Supabase risk zones fetch notice:', zonesError);
      } else if (zonesData && zonesData.length > 0) {
        setSupabaseZones(zonesData);
      }
      setIsLoadingZones(false);

      const activeZones = zonesData && zonesData.length > 0 ? zonesData : DEMO_RISK_ZONES;

      // 2. Fetch live Weather Telemetry
      const { weatherList, summaryWeather, error: weatherError } = await fetchSupabaseWeatherData(activeZones);
      if (!isMounted) return;

      if (weatherError) {
        console.warn('Supabase weather fetch notice:', weatherError);
      } else {
        if (summaryWeather) {
          setSupabaseWeather(summaryWeather);
        }
        if (weatherList && weatherList.length > 0) {
          const map = new Map<string, ZoneWeatherSummary>();
          weatherList.forEach((w) => map.set(w.riskZoneId, w));
          setZoneWeatherMap(map);
        }
      }
      setIsLoadingWeather(false);

      // 3. Fetch live Arterial Road Network
      const { data: roadsData, error: roadsError } = await fetchSupabaseRoads(activeZones);
      if (!isMounted) return;

      if (roadsError) {
        console.warn('Supabase roads fetch notice:', roadsError);
      } else if (roadsData && roadsData.length > 0) {
        setSupabaseRoads(roadsData);
      }
      setIsLoadingRoads(false);

      // 4. Fetch live Exposed Villages
      const { data: villagesData, error: villagesError } = await fetchSupabaseVillages(activeZones);
      if (!isMounted) return;

      if (villagesError) {
        console.warn('Supabase villages fetch notice:', villagesError);
      } else if (villagesData && villagesData.length > 0) {
        setSupabaseVillages(villagesData);
      }
      setIsLoadingVillages(false);

      // 5. Fetch live Critical Infrastructure
      const { data: infraData, error: infraError } = await fetchSupabaseInfrastructure(activeZones);
      if (!isMounted) return;

      if (infraError) {
        console.warn('Supabase infrastructure fetch notice:', infraError);
      } else if (infraData && infraData.length > 0) {
        setSupabaseInfra(infraData);
      }
      setIsLoadingInfra(false);

      // 6. Fetch live Multi-Hazard Alerts
      const { data: alertsData, error: alertsError } = await fetchSupabaseAlerts(
        activeZones,
        roadsData && roadsData.length > 0 ? roadsData : DEMO_ROADS,
        villagesData && villagesData.length > 0 ? villagesData : []
      );
      if (!isMounted) return;

      if (alertsError) {
        console.warn('Supabase alerts fetch notice:', alertsError);
      } else if (alertsData && alertsData.length > 0) {
        setSupabaseAlerts(alertsData);
        setAlerts(alertsData);
      }
      setIsLoadingAlerts(false);

      // 7. Fetch live Historical Landslide Events
      const { data: eventsData, error: eventsError } = await fetchSupabaseLandslideEvents(activeZones);
      if (!isMounted) return;

      if (eventsError) {
        console.warn('Supabase landslide events fetch notice:', eventsError);
      } else if (eventsData && eventsData.length > 0) {
        setSupabaseEvents(eventsData);
      }
      setIsLoadingEvents(false);

      // 8. Fetch live Citizen & Field Reports
      const { data: citizenReportsData, error: citizenReportsErr } = await fetchSupabaseCitizenReports();
      if (!isMounted) return;

      if (citizenReportsErr) {
        setCitizenReportsError(citizenReportsErr);
      } else if (citizenReportsData) {
        setSupabaseCitizenReports(citizenReportsData);
      }
      setIsLoadingCitizenReports(false);
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayRiskZones = supabaseZones.length > 0 ? supabaseZones : DEMO_RISK_ZONES;
  const displayRoads = supabaseRoads.length > 0 ? supabaseRoads : DEMO_ROADS;
  const displayAlerts = supabaseAlerts.length > 0 ? alerts : alerts;

  const blockedRoadsCount = displayRoads.filter((r) => r.status === 'BLOCKED').length;
  const restrictedRoadsCount = displayRoads.filter((r) => r.status === 'RESTRICTED').length;

  const activeAlerts = displayAlerts.filter((a) => a.status !== 'RESOLVED');
  const criticalAlertsCount = activeAlerts.filter((a) => a.severity === 'CRITICAL').length;

  const selectedZoneWeather = selectedZone ? zoneWeatherMap.get(selectedZone.id) : null;
  const displayWeather: WeatherData = selectedZoneWeather
    ? {
        id: `weather-${selectedZoneWeather.riskZoneId}`,
        location: `${selectedZoneWeather.zoneName} Telemetry`,
        rainfallMm: selectedZoneWeather.rainfall,
        rainfallCurrentMm: selectedZoneWeather.rainfall,
        rainfallAccumulation24hMm: selectedZoneWeather.rainfallAccumulation,
        rainfallTrend: selectedZoneWeather.rainfall > 10 ? 'RISING' : 'STABLE',
        temperatureC: selectedZoneWeather.temperature,
        humidityPct: selectedZoneWeather.humidity,
        windSpeedKmh: 18,
        timestamp: selectedZoneWeather.timestamp,
        isSimulated: true,
      }
    : supabaseWeather || DEMO_WEATHER;

  const selectedZoneVillages = selectedZone
    ? supabaseVillages.filter((v) => v.riskZoneId === selectedZone.id)
    : [];

  const selectedZoneInfra = selectedZone
    ? supabaseInfra.filter((i) => i.riskZoneId === selectedZone.id)
    : [];

  const selectedZoneEvents = selectedZone
    ? supabaseEvents.filter((e) => e.riskZoneId === selectedZone.id)
    : [];

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
    const matchedZone = displayRiskZones.find((z) => z.id === alert.zoneId) || DEMO_RISK_ZONES.find((z) => z.id === alert.zoneId);
    if (matchedZone) {
      setSelectedZone(matchedZone);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title & Operational Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              COMMAND SYSTEM ACTIVE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Authority Dashboard — {selectedState.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Regional landslide risk monitoring, arterial road connectivity & emergency response coordination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            Active Demonstration Scenario:
          </span>
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-200 font-semibold">
            Northeast Regional Corridor (Live Supabase Sync)
          </span>
        </div>
      </div>

      {/* 1. Executive Decision KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Regional Landslide Risk"
          value={`${DEMO_REGIONAL_KPI_SUMMARY.overallRiskScore}`}
          subValue="/ 100"
          statusText="High Risk"
          supportingMetric="Heavy rain accelerating slope movement"
          severity="HIGH"
          icon={<Flame className="w-5 h-5 text-orange-400" />}
        />

        <StatCard
          label="Active Hazard Warnings"
          value={activeAlerts.length}
          subValue={supabaseAlerts.length > 0 ? `(${criticalAlertsCount} critical)` : `(${criticalAlertsCount} critical)`}
          statusText={criticalAlertsCount > 0 ? `${criticalAlertsCount} Critical Alert${criticalAlertsCount > 1 ? 's' : ''}` : 'Advisories Active'}
          supportingMetric={supabaseAlerts.length > 0 ? 'Live multi-hazard early warning synchronization' : 'Immediate response needed at Sonapur'}
          severity={criticalAlertsCount > 0 ? 'CRITICAL' : 'HIGH'}
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
        />

        <StatCard
          label="Monitored Risk Sectors"
          value={displayRiskZones.length}
          subValue={supabaseZones.length > 0 ? 'Supabase Live' : 'active sectors'}
          statusText={supabaseZones.length > 0 ? '4 Live Sectors' : '4 High / Critical'}
          supportingMetric="Surveillance active across regional corridors"
          severity="info"
          icon={<Activity className="w-5 h-5 text-sky-400" />}
        />

        <StatCard
          label="Highway Passability"
          value={`${blockedRoadsCount} Blocked`}
          subValue={`+ ${restrictedRoadsCount} restricted`}
          statusText={
            blockedRoadsCount > 0
              ? `${blockedRoadsCount} Corridor${blockedRoadsCount > 1 ? 's' : ''} Blocked`
              : restrictedRoadsCount > 0
              ? `${restrictedRoadsCount} Restricted`
              : 'All Corridors Open'
          }
          supportingMetric={
            supabaseRoads.length > 0
              ? `Live surveillance across ${displayRoads.length} arterial routes`
              : 'Sonapur Tunnel northern approach closed'
          }
          severity={blockedRoadsCount > 0 ? 'CRITICAL' : restrictedRoadsCount > 0 ? 'MODERATE' : 'LOW'}
          icon={<Route className="w-5 h-5 text-amber-400" />}
        />
      </div>

      {/* 2. Central Decision Viewport: Dominant GIS Map (8 cols) & Active Warnings Stream (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* GIS Map Viewport (8 cols) - Connected to live Supabase risk zones */}
        <div className="lg:col-span-8">
          <MapContainer
            zones={displayRiskZones}
            selectedZoneId={selectedZone?.id}
            onSelectZone={(zone) => setSelectedZone(zone)}
          />
        </div>

        {/* Active Alerts Feed (4 cols) - Connected to live Supabase alerts table */}
        <div className="lg:col-span-4">
          <ActiveAlertsList
            alerts={displayAlerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onSelectAlert={handleSelectAlert}
            isSupabaseLive={supabaseAlerts.length > 0}
            isLoading={isLoadingAlerts}
          />
        </div>
      </div>

      {/* 3. Lower Section: 3-Column Balanced Command Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1: Monitored Risk Sectors (Connected to real Supabase risk_zones & assessments) */}
        <div>
          <HighRiskZonesList
            zones={displayRiskZones}
            selectedZoneId={selectedZone?.id}
            onSelectZone={(zone) => setSelectedZone(zone)}
            isLoading={isLoadingZones}
            isSupabaseLive={supabaseZones.length > 0}
          />
        </div>

        {/* Column 2: Road Corridor Passability (Connected to Supabase roads table) */}
        <div>
          <RoadStatusWidget
            roads={displayRoads}
            onSelectRoad={(road) => {
              const matched = displayRiskZones.find(
                (z) => z.id === road.linkedRiskZoneId
              ) || DEMO_RISK_ZONES.find((z) => z.id === road.linkedRiskZoneId);
              if (matched) setSelectedZone(matched);
            }}
            isSupabaseLive={supabaseRoads.length > 0}
            isLoading={isLoadingRoads}
          />
        </div>

        {/* Column 3: Weather Telemetry & Emergency Priority Matrix (Connected to Supabase weather_data) */}
        <div className="space-y-6">
          <WeatherSummaryCard
            weather={displayWeather}
            isSupabaseLive={Boolean(supabaseWeather)}
            isLoading={isLoadingWeather}
          />
          
          <EmergencyPrioritiesWidget
            priorities={DEMO_EMERGENCY_PRIORITIES}
            onSelectPriority={(prio) => {
              const matched = displayRiskZones.find((z) => z.id === prio.zoneId) || DEMO_RISK_ZONES.find((z) => z.id === prio.zoneId);
              if (matched) setSelectedZone(matched);
            }}
          />
        </div>
      </div>

      {/* 4. Ground-Level Citizen & Field Reports Stream (Connected to Supabase citizen_reports table) */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Field & Citizen Ground Incidents
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              ({supabaseCitizenReports.length} Reports)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="outline"
              icon={<RefreshCw className={`w-3 h-3 ${isLoadingCitizenReports ? 'animate-spin text-blue-400' : ''}`} />}
              onClick={async () => {
                setIsLoadingCitizenReports(true);
                const { data, error } = await fetchSupabaseCitizenReports();
                if (error) setCitizenReportsError(error);
                else if (data) setSupabaseCitizenReports(data);
                setIsLoadingCitizenReports(false);
              }}
              disabled={isLoadingCitizenReports}
            >
              Refresh
            </Button>

            {supabaseCitizenReports.length > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-[10px] font-mono text-blue-300">
                <Database className="w-3 h-3 text-blue-400" />
                <span>SUPABASE LIVE</span>
              </div>
            )}
          </div>
        </div>

        {isLoadingCitizenReports ? (
          <div className="p-8 text-center space-y-2 text-xs text-slate-400">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Fetching citizen & field incident reports...</p>
          </div>
        ) : citizenReportsError ? (
          <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-800 text-xs text-amber-300 space-y-1">
            <span className="font-bold block">Notice on citizen_reports access:</span>
            <p>{citizenReportsError}</p>
          </div>
        ) : supabaseCitizenReports.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-lg border border-dashed border-slate-800">
            No incident reports registered in this sector.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {supabaseCitizenReports.map((report) => (
              <div
                key={report.id}
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2.5"
              >
                {/* Header: What Happened (Type) + Verification Status */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-800 text-slate-200 border border-slate-700">
                      {getHumanReadableReportType(report.reportType)}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      report.reporterRole === 'FieldOfficer' || report.reporterType === 'FieldOfficer' || report.reporterName?.includes('Officer') || report.reporterName?.includes('Patrol')
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {report.reporterRole === 'FieldOfficer' || report.reporterType === 'FieldOfficer' || report.reporterName?.includes('Officer') || report.reporterName?.includes('Patrol')
                        ? 'FIELD'
                        : 'CITIZEN'}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    report.verificationStatus === 'VERIFIED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : report.verificationStatus === 'REJECTED'
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {getHumanReadableVerificationStatus(report.verificationStatus)}
                  </span>
                </div>

                {/* What Happened: Description */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    What Happened:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed line-clamp-2 mt-0.5">
                    {report.description}
                  </p>
                </div>

                {/* Location, Time Reported & Photo/Video Availability */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="truncate max-w-[130px]" title={report.locationName}>
                    {typeof report.latitude === 'number' && typeof report.longitude === 'number'
                      ? `${report.latitude.toFixed(2)}°N, ${report.longitude.toFixed(2)}°E`
                      : report.locationName || 'Incident Site'}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {report.photoUrl && (
                      <span title="Photo attached">
                        <Camera className="w-3 h-3 text-blue-400" />
                      </span>
                    )}
                    {report.videoUrl && (
                      <span title="Video attached">
                        <Video className="w-3 h-3 text-purple-400" />
                      </span>
                    )}
                    <span>{report.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Detail Modal for Selected Zone */}
      {selectedZone && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedZone(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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
                  {selectedZone.district}, {selectedZone.state} (Lat: {selectedZone.coordinates?.latitude ?? selectedZone.latitude}, Lon: {selectedZone.coordinates?.longitude ?? selectedZone.longitude})
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

            {/* Exposed Communities & Settlements (Supabase villages) */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  Exposed Settlements & Population
                </span>
                {supabaseVillages.length > 0 && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded">
                    SUPABASE LIVE
                  </span>
                )}
              </div>

              {isLoadingVillages ? (
                <div className="p-3 text-center text-xs text-slate-400">Loading settlements...</div>
              ) : selectedZoneVillages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {selectedZoneVillages.map((v) => (
                    <div
                      key={v.id}
                      className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <span className="text-xs font-bold text-slate-200 block truncate">
                          {v.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {v.latitude && v.longitude ? `${v.latitude.toFixed(2)}°N, ${v.longitude.toFixed(2)}°E` : v.district}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {v.populationExposure ?? v.population} residents
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  {selectedZone.nearbyVillages && selectedZone.nearbyVillages.length > 0
                    ? selectedZone.nearbyVillages.join(', ')
                    : 'Surrounding settlements under routine monitoring.'}
                </p>
              )}
            </div>

            {/* Critical Infrastructure Assets (Supabase infrastructure) */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-400" />
                  Critical Infrastructure & Key Assets
                </span>
                {supabaseInfra.length > 0 && (
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800 px-1.5 py-0.5 rounded">
                    SUPABASE LIVE
                  </span>
                )}
              </div>

              {isLoadingInfra ? (
                <div className="p-3 text-center text-xs text-slate-400">Loading infrastructure assets...</div>
              ) : selectedZoneInfra.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {selectedZoneInfra.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <span className="text-xs font-bold text-slate-200 block truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Type: {item.type} • Priority: {item.importanceScore}/100
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] font-mono font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                        {item.vulnerabilityStatus === 'CRITICAL_RISK' ? 'CRITICAL ASSET' : 'MONITORED'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  {selectedZone.criticalInfrastructure && selectedZone.criticalInfrastructure.length > 0
                    ? selectedZone.criticalInfrastructure.join(', ')
                    : 'Regional assets under standard surveillance.'}
                </p>
              )}
            </div>

            {/* Historical Landslide Incidents (Supabase landslide_events) */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-300 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  Historical Landslide Events & Geological Record
                </span>
                {supabaseEvents.length > 0 && (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800 px-1.5 py-0.5 rounded">
                    SUPABASE LIVE
                  </span>
                )}
              </div>

              {isLoadingEvents ? (
                <div className="p-3 text-center text-xs text-slate-400">Loading historical record...</div>
              ) : selectedZoneEvents.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {selectedZoneEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-bold text-slate-200">{ev.date}</span>
                          {ev.latitude && ev.longitude && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({ev.latitude.toFixed(2)}°N, {ev.longitude.toFixed(2)}°E)
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">{ev.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  {typeof selectedZone.historicalEventsCount === 'number'
                    ? `${selectedZone.historicalEventsCount} historical landslide records logged in this sector.`
                    : 'Historical geological survey data verified.'}
                </p>
              )}
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

export default AuthorityDashboard;
