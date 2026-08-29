import React, { useState } from 'react';
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
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CitizenReport } from '../types';
import { DEMO_LOCATION, MOCK_ALERTS, MOCK_REPORTS } from '../data/mockData';
import { ReportIncidentPreview } from '../components/field/ReportIncidentPreview';
import { ReportHistoryView } from '../components/field/ReportHistoryView';
import { RiskBadge } from '../components/common/RiskBadge';
import { useAuth } from '../context/AuthContext';

export const CitizenPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'advisory' | 'report' | 'history'>('advisory');
  const [reports, setReports] = useState<CitizenReport[]>(MOCK_REPORTS);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmitReport = (
    reportData: Omit<CitizenReport, 'id' | 'isMockData' | 'syncStatus' | 'reporterName' | 'reporterId' | 'timestamp'>
  ) => {
    const newReport: CitizenReport = {
      ...reportData,
      id: `cit-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: 'numeric',
        month: 'short',
      }),
      reporterName: user?.name || 'Local Citizen (Verified)',
      reporterRole: 'Citizen',
      reporterType: 'Citizen',
      syncStatus: 'ONLINE',
      status: 'SYNCED',
      verificationStatus: 'PENDING',
      isMockData: false,
    };
    setReports((prev) => [newReport, ...prev]);
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
                {user?.name ? `Logged in: ${user.name}` : 'Public Landslide Early Warning & Community Hazard Reporting'}
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

        {/* Tab Navigation */}
        <div className="bg-slate-950 px-4 sm:px-6 lg:px-8 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('advisory')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'advisory'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Public Safety & Warnings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'report'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Slope Hazard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Community Reports</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'advisory' && (
          <div className="space-y-6">
            {/* Current Area Status Banner */}
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400 font-mono">
                      Your Detected Region: {DEMO_LOCATION.locationName}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-100 mt-1">
                    Monsoon Slope Advisory: High Precaution Advised
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge level="HIGH" size="md" />
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Continuous torrential rainfall observed along highway corridors. Stay alert for signs of ground movement, falling rocks, or sudden muddy water seepage along hill roads.
              </p>

              {/* Emergency Helpline Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
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
                      <span>Affected: {alert.affectedRoad || alert.location}</span>
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
                    <li>Listen to local authority weather alerts before traveling.</li>
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
          <ReportHistoryView reports={reports} />
        )}
      </main>
    </div>
  );
};

export default CitizenPortal;
