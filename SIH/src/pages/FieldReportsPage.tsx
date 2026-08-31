import React, { useState, useEffect, useCallback } from 'react';
import { CitizenReport, ReportType } from '../types';
import {
  fetchSupabaseCitizenReports,
  getHumanReadableReportType,
  getHumanReadableVerificationStatus,
} from '../services/citizenReportService';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Camera,
  Video,
  Search,
  Filter,
  X,
  Database,
  MapPin,
  ShieldCheck,
  AlertOctagon,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const FieldReportsPage: React.FC = () => {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [selectedType, setSelectedType] = useState<ReportType | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');

  const loadReportsData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    const { data, error } = await fetchSupabaseCitizenReports();

    if (error) {
      setErrorMessage(error);
      setReports([]);
    } else if (data) {
      setReports(data);
      setIsSupabaseLive(true);
      setLastUpdatedTime(new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));
    }
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    loadReportsData();

    // Auto-refresh when tab/window gains focus
    const handleFocus = () => {
      loadReportsData(true);
    };
    window.addEventListener('focus', handleFocus);

    // Periodic sync interval (every 20 seconds)
    const intervalId = setInterval(() => {
      loadReportsData(true);
    }, 20000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [loadReportsData]);

  const verificationBadge = (status?: string) => {
    const label = getHumanReadableVerificationStatus(status);
    const upper = (status || '').toUpperCase();

    switch (upper) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {label}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-red-950 text-red-300 border border-red-800">
            <X className="w-3.5 h-3.5 text-red-400" />
            {label}
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {label}
          </span>
        );
    }
  };

  const reportTypeBadge = (type: ReportType | string) => {
    const label = getHumanReadableReportType(type);
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-200 border border-slate-700">
        {label}
      </span>
    );
  };

  const filteredReports = reports.filter((report) => {
    if (selectedType !== 'ALL' && report.reportType !== selectedType) {
      return false;
    }
    if (selectedStatus !== 'ALL' && (report.verificationStatus || 'PENDING') !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesDesc = report.description.toLowerCase().includes(q);
      const matchesType = getHumanReadableReportType(report.reportType).toLowerCase().includes(q);
      const matchesReporter = (report.reporterName || '').toLowerCase().includes(q);
      const matchesLoc = (report.locationName || '').toLowerCase().includes(q);
      if (!matchesDesc && !matchesType && !matchesReporter && !matchesLoc) {
        return false;
      }
    }
    return true;
  });

  const totalReports = reports.length;
  const verifiedCount = reports.filter((r) => r.verificationStatus === 'VERIFIED').length;
  const pendingCount = reports.filter((r) => !r.verificationStatus || r.verificationStatus === 'PENDING').length;
  const blockageCount = reports.filter((r) => r.reportType === 'ROAD_BLOCKAGE' || r.reportType === 'LANDSLIDE').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              GROUND-LEVEL SURVEILLANCE & INCIDENT DISPATCH
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-emerald-400" />
            Field & Citizen Ground Incident Reports
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Geotagged ground intelligence submitted by patrolling field officers and local communities for validation and response.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="xs"
            variant="outline"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />}
            onClick={() => loadReportsData(true)}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Syncing...' : 'Refresh Feed'}
          </Button>

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

      {/* Sync Status Banner */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-lg">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Live synchronization active with Supabase `citizen_reports` table
        </span>
        <span>Last synced: {lastUpdatedTime}</span>
      </div>

      {/* Error State Banner */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-800 text-xs text-amber-300 space-y-1">
          <span className="font-bold block">Notice on citizen_reports database access:</span>
          <p>{errorMessage}</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Incident Reports"
          value={totalReports}
          subValue="ground submissions"
          statusText="Active Surveillance"
          supportingMetric="Real-time incident stream"
          severity="info"
          icon={<ClipboardList className="w-5 h-5 text-sky-400" />}
        />

        <StatCard
          label="Awaiting Verification"
          value={pendingCount}
          subValue="awaiting field review"
          statusText={pendingCount > 0 ? `${pendingCount} Needs Ground Check` : 'All Verified'}
          supportingMetric="Requires patrol verification"
          severity={pendingCount > 0 ? 'HIGH' : 'LOW'}
          icon={<Clock className="w-5 h-5 text-amber-400" />}
        />

        <StatCard
          label="Verified by Field Team"
          value={verifiedCount}
          subValue="confirmed on ground"
          statusText="Actionable Intelligence"
          supportingMetric="Validated by field teams"
          severity="LOW"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        />

        <StatCard
          label="Blockage & Slide Reports"
          value={blockageCount}
          subValue="road / slope impact"
          statusText={blockageCount > 0 ? `${blockageCount} Major Incidents` : 'Zero Slide Reports'}
          supportingMetric="Debris obstructing access"
          severity={blockageCount > 0 ? 'CRITICAL' : 'LOW'}
          icon={<AlertOctagon className="w-5 h-5 text-red-400" />}
        />
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Verification Status:
            </span>
            {[
              { code: 'ALL', label: 'All' },
              { code: 'PENDING', label: 'Awaiting verification' },
              { code: 'VERIFIED', label: 'Verified by field team' },
              { code: 'REJECTED', label: 'Unverified / dismissed' },
            ].map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setSelectedStatus(code)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  selectedStatus === code
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase text-slate-400 mr-1">
              Incident Type:
            </span>
            {[
              { code: 'ALL' as const, label: 'All' },
              { code: 'CRACK' as const, label: 'Crack' },
              { code: 'SLOPE_MOVEMENT' as const, label: 'Slope movement' },
              { code: 'ROAD_BLOCKAGE' as const, label: 'Road blockage' },
              { code: 'LANDSLIDE' as const, label: 'Landslide' },
              { code: 'INFRASTRUCTURE_DAMAGE' as const, label: 'Infrastructure' },
            ].map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setSelectedType(code)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  selectedType === code
                    ? 'bg-slate-700 text-white font-semibold border border-slate-600'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by observation description, incident type, or location coordinates..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Fetching ground incident reports and media attachments...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-12 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
          <h3 className="text-sm font-bold text-slate-200">No incident reports matching filters</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your verification status or incident type filters to view all ground submissions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 hover:bg-slate-800/60 transition-all cursor-pointer shadow-sm"
            >
              {/* Header: What Happened (Type) + Verification Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {reportTypeBadge(report.reportType)}
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    report.reporterRole === 'FieldOfficer' || report.reporterType === 'FieldOfficer' || report.reporterName?.includes('Officer') || report.reporterName?.includes('Patrol')
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {report.reporterRole === 'FieldOfficer' || report.reporterType === 'FieldOfficer' || report.reporterName?.includes('Officer') || report.reporterName?.includes('Patrol')
                      ? 'FIELD OFFICER'
                      : 'CITIZEN'}
                  </span>
                </div>
                <div className="shrink-0">
                  {verificationBadge(report.verificationStatus)}
                </div>
              </div>

              {/* What Happened: Description */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Observation:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed line-clamp-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                  {report.description}
                </p>
              </div>

              {/* Location & Time Reported */}
              <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>
                    {typeof report.latitude === 'number' && typeof report.longitude === 'number'
                      ? `${report.latitude.toFixed(2)}°N, ${report.longitude.toFixed(2)}°E`
                      : report.locationName || 'Monitored Sector'}
                  </span>
                </div>

                {/* Photo / Video Availability & Timestamp */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
                  <div className="flex items-center gap-2">
                    {report.photoUrl && (
                      <span className="flex items-center gap-1 text-sky-400">
                        <Camera className="w-3 h-3" /> Photo
                      </span>
                    )}
                    {report.videoUrl && (
                      <span className="flex items-center gap-1 text-purple-400">
                        <Video className="w-3 h-3" /> Video
                      </span>
                    )}
                  </div>
                  <span>{report.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Inspection Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  {reportTypeBadge(selectedReport.reportType)}
                  {verificationBadge(selectedReport.verificationStatus)}
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-1">
                  Ground Incident #{selectedReport.id.slice(0, 8)}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Reported at {selectedReport.timestamp}
                </p>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description: What Happened */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                What Happened (Field Observation):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedReport.description}
              </p>
            </div>

            {/* Coordinates & Location */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400">GPS Location</span>
                <div className="text-xs font-bold text-slate-200 font-mono">
                  {typeof selectedReport.latitude === 'number' && typeof selectedReport.longitude === 'number'
                    ? `${selectedReport.latitude.toFixed(4)}°N, ${selectedReport.longitude.toFixed(4)}°E`
                    : selectedReport.locationName || 'Coordinates Logged'}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400">Reporter Classification</span>
                <div className="text-xs font-bold text-emerald-300 font-mono truncate">
                  {selectedReport.reporterName || 'Citizen Sentinel'}
                </div>
              </div>
            </div>

            {/* Media Availability */}
            {(selectedReport.photoUrl || selectedReport.videoUrl) && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs flex items-center gap-3">
                <Eye className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-300">
                  Media verification attachment registered in secure evidence store.
                </span>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                variant="primary"
                icon={<ShieldCheck className="w-4 h-4" />}
                onClick={() => setSelectedReport(null)}
              >
                Verify & Dispatch Patrol
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldReportsPage;
