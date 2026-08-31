import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  AlertTriangle,
  PhoneCall,
  PlusCircle,
  FileText,
  Shield,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  LogOut,
  Clock,
  Check,
  X,
  Camera,
  Video,
  Info,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CitizenReport } from '../types';
import { DEMO_LOCATION, MOCK_ALERTS, MOCK_REPORTS } from '../data/mockData';
import { ReportIncidentPreview } from '../components/field/ReportIncidentPreview';
import { RiskBadge } from '../components/common/RiskBadge';
import { useAuth } from '../context/AuthContext';
import {
  submitSupabaseCitizenReport,
  fetchSupabaseCitizenReports,
  getHumanReadableReportType,
  getHumanReadableVerificationStatus,
} from '../services/citizenReportService';

export const CitizenPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'advisory' | 'report' | 'history'>('advisory');
  const [reports, setReports] = useState<CitizenReport[]>(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const loadReports = useCallback(async () => {
    const { data } = await fetchSupabaseCitizenReports();
    if (data && data.length > 0) {
      setReports(data);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmitReport = async (
    reportData: Omit<CitizenReport, 'id' | 'isMockData' | 'syncStatus' | 'reporterName' | 'reporterId' | 'timestamp'>
  ) => {
    const { data: createdReport } = await submitSupabaseCitizenReport({
      reportType: reportData.reportType,
      latitude: reportData.latitude ?? DEMO_LOCATION.latitude,
      longitude: reportData.longitude ?? DEMO_LOCATION.longitude,
      description: reportData.description,
      photoUrl: reportData.photoUrl,
      videoUrl: reportData.videoUrl,
      locationName: reportData.locationName,
      reporterRole: 'Citizen',
      reporterName: user?.name || 'Citizen Sentinel',
    });

    if (createdReport) {
      setReports((prev) => [createdReport, ...prev.filter((r) => r.id !== createdReport.id)]);
    }
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white pb-16 lg:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
              title="Return to Role Selection"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white truncate">
                  NER-SafeSlope
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                  CITIZEN PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate hidden sm:block">
                {user?.name ? `Community Member: ${user.name}` : 'Public Landslide Early Warning & Hazard Reporting'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/"
              className="text-xs px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors hidden sm:inline-block"
            >
              Switch Role
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs px-2.5 py-1.5 rounded bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Log Out of Citizen Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <div className="bg-slate-900/60 border-b border-slate-800 sticky top-[57px] z-30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('advisory')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'advisory'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Safety Advisory & Warnings</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('report')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'report'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report a Hazard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('history');
                loadReports();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Submitted Reports ({reports.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {activeTab === 'advisory' && (
          <div className="space-y-6">
            {/* Quick Action Banner */}
            <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/40 border border-emerald-800/60 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                    PUBLIC ASSISTANCE ACTIVE
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Spotted Ground Cracks or Highway Rockfalls?
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Your geotagged hazard reports alert local District Disaster Management teams and patrol officers in real time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 shrink-0 transition-all duration-150 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Road or Slope Hazard</span>
              </button>
            </div>

            {/* Emergency Hotline Numbers */}
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                Emergency Control Room Contacts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="tel:1070"
                  className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 flex items-center gap-3 hover:bg-red-900/80 transition-colors"
                >
                  <PhoneCall className="w-5 h-5 text-red-400" />
                  <div>
                    <div className="text-xs font-bold">State Disaster Helpline</div>
                    <div className="text-sm font-mono font-bold text-white">Call 1070</div>
                  </div>
                </a>

                <a
                  href="tel:112"
                  className="p-3 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-200 flex items-center gap-3 hover:bg-blue-900/80 transition-colors"
                >
                  <PhoneCall className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-xs font-bold">National Emergency</div>
                    <div className="text-sm font-mono font-bold text-white">Call 112</div>
                  </div>
                </a>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold">Local DDMA Control</div>
                    <div className="text-xs text-slate-400">East Khasi Hills EOC</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Public Warnings */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                Active Regional Landslide Warnings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <RiskBadge level={alert.severity} size="sm" />
                      <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{alert.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{alert.reason}</p>
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                      <span>Affected Corridor: {alert.affectedRoad || alert.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Safety Guidelines */}
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Safety Guidelines During Heavy Rain
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <strong className="text-emerald-400 block font-semibold">Do's:</strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                    <li>Check official road corridor passability before traveling.</li>
                    <li>Look out for small rockfalls or cracks on road shoulders.</li>
                    <li>Move immediately to higher, stable ground if slope shifts.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <strong className="text-red-400 block font-semibold">Don'ts:</strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                    <li>Do not drive past active mudflow or debris on highways.</li>
                    <li>Avoid sheltering under steep, exposed slope cuts.</li>
                    <li>Do not cross swelling mountain stream bridges.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <ReportIncidentPreview
            gpsLocation={{
              lat: DEMO_LOCATION.latitude,
              lng: DEMO_LOCATION.longitude,
              locationName: DEMO_LOCATION.locationName,
              accuracy: DEMO_LOCATION.accuracyMeters,
            }}
            onSwitchToHistory={() => setActiveTab('history')}
            onSubmitReport={handleSubmitReport}
          />
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-slate-100">
                    My Submitted Hazard Reports
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track the verification status of your reported landslide hazards.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit New Report</span>
              </button>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report) => {
                const isVerified = report.verificationStatus === 'VERIFIED';
                const isRejected = report.verificationStatus === 'REJECTED';

                return (
                  <div
                    key={report.id}
                    className={`rounded-xl border p-4 bg-slate-900 space-y-3 transition-colors ${
                      isVerified
                        ? 'border-emerald-800/80 bg-emerald-950/10'
                        : isRejected
                        ? 'border-red-900/60 bg-red-950/10'
                        : 'border-amber-700/60 bg-amber-950/15'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold uppercase">
                        {getHumanReadableReportType(report.reportType)}
                      </span>

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          isVerified
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : isRejected
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-amber-900/60 text-amber-300 border border-amber-700'
                        }`}
                      >
                        {isVerified ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : isRejected ? (
                          <X className="w-3 h-3 text-red-400" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-400" />
                        )}
                        {getHumanReadableVerificationStatus(report.verificationStatus)}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        {report.locationName || (report.location && report.location.name) || 'GPS Verified'}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-3">
                        {report.description}
                      </p>
                    </div>

                    {report.photoUrl && (
                      <div className="relative rounded-lg overflow-hidden border border-slate-800 max-h-36 bg-slate-950">
                        <img
                          src={report.photoUrl}
                          alt="Hazard evidence"
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-2">
                        {report.photoUrl && <Camera className="w-3 h-3 text-sky-400" />}
                        {report.videoUrl && <Video className="w-3 h-3 text-purple-400" />}
                        <span>{report.timestamp}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}

              {reports.length === 0 && (
                <div className="col-span-full text-center py-12 bg-slate-900 rounded-xl border border-slate-800 p-6">
                  <Info className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-slate-300">No reports submitted yet</h4>
                  <p className="text-xs text-slate-500 mt-1">Submit your first hazard report to alert local teams.</p>
                </div>
              )}
            </div>

            {/* Citizen View Details Modal */}
            {selectedReport && (
              <div
                className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setSelectedReport(null)}
              >
                <div
                  className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                        {getHumanReadableReportType(selectedReport.reportType)}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">
                        Report #{selectedReport.id.slice(0, 8)}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedReport(null)}
                      className="text-slate-400 hover:text-white p-1 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Observation:</span>
                    <p className="text-xs text-slate-200 leading-relaxed">{selectedReport.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Location</span>
                      <span className="text-slate-200 font-bold block truncate">{selectedReport.locationName || 'GPS Location'}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Verification Status</span>
                      <span className="text-slate-200 font-bold block">{getHumanReadableVerificationStatus(selectedReport.verificationStatus)}</span>
                    </div>
                  </div>

                  {selectedReport.photoUrl && (
                    <div className="rounded-lg overflow-hidden border border-slate-800 bg-black mt-2">
                      <img src={selectedReport.photoUrl} alt="Hazard preview" className="w-full max-h-48 object-cover" />
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(null)}
                      className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CitizenPortal;
