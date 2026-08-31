import React, { useState, useEffect, useCallback } from 'react';
import {
  FieldActiveTab,
  ConnectionStatus,
  CitizenReport,
  RiskZone,
  FieldOfficer,
} from '../types';
import {
  CURRENT_OFFICER,
  DEMO_LOCATION,
  MOCK_RISK_ZONES,
  MOCK_ALERTS,
  MOCK_REPORTS,
  MOCK_WEATHER,
} from '../data/mockData';
import { FieldMobileLayout } from '../components/field/FieldMobileLayout';
import { FieldDashboard } from '../components/field/FieldDashboard';
import { NearbyRiskZonesView } from '../components/field/NearbyRiskZonesView';
import { ReportIncidentPreview } from '../components/field/ReportIncidentPreview';
import { ReportHistoryView } from '../components/field/ReportHistoryView';
import { OfflineSyncManager } from '../components/field/OfflineSyncManager';
import {
  submitSupabaseCitizenReport,
  fetchSupabaseCitizenReports,
  updateSupabaseCitizenReportStatus,
  getHumanReadableReportType,
  getHumanReadableVerificationStatus,
} from '../services/citizenReportService';
import { Button } from '../components/common/Button';
import {
  X,
  Camera,
  Video,
  ShieldCheck,
  AlertOctagon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const FieldOfficerPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FieldActiveTab>('dashboard');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('ONLINE');
  const [reports, setReports] = useState<CitizenReport[]>(MOCK_REPORTS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [inspectedReport, setInspectedReport] = useState<CitizenReport | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);

  const activeOfficer = (user && user.role === 'FieldOfficer' ? (user as FieldOfficer) : CURRENT_OFFICER);

  // Load live reports from Supabase on mount
  const loadReports = useCallback(async () => {
    const { data: supabaseReports, error } = await fetchSupabaseCitizenReports();
    if (!error && supabaseReports && supabaseReports.length > 0) {
      setReports(supabaseReports);
      setLastSyncedTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Count pending offline items
  const pendingReports = reports.filter((r) => r.status === 'PENDING_SYNC' || r.verificationStatus === 'PENDING');
  const pendingCount = pendingReports.length;

  // Toggle connection state for demoing ONLINE <-> OFFLINE
  const handleToggleConnection = () => {
    if (connectionStatus === 'ONLINE') {
      setConnectionStatus('OFFLINE');
    } else if (connectionStatus === 'OFFLINE') {
      // Simulate reconnect and sync
      setConnectionStatus('SYNCING');
      setIsSyncing(true);
      setTimeout(async () => {
        setConnectionStatus('ONLINE');
        setIsSyncing(false);
        setLastSyncedTime('Just now');
        await loadReports();
      }, 1500);
    }
  };

  // Manual sync trigger
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setConnectionStatus('SYNCING');
    await loadReports();
    setIsSyncing(false);
    setConnectionStatus('ONLINE');
    setLastSyncedTime('Just now');
  };

  const handleReportForZone = (_zone: RiskZone) => {
    setActiveTab('report');
  };

  // Handle Inspect action from dashboard feed or history
  const handleInspectReport = (report: CitizenReport) => {
    setInspectedReport(report);
  };

  // Handle Field Officer Verification action
  const handleVerifyReport = async (reportId: string) => {
    setIsProcessingAction(true);
    // Call Supabase update
    await updateSupabaseCitizenReportStatus(reportId, 'VERIFIED');

    // Update local state
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, verificationStatus: 'VERIFIED', status: 'SYNCED', syncStatus: 'ONLINE' }
          : r
      )
    );

    if (inspectedReport && inspectedReport.id === reportId) {
      setInspectedReport((prev) =>
        prev ? { ...prev, verificationStatus: 'VERIFIED', status: 'SYNCED' } : null
      );
    }
    setIsProcessingAction(false);
  };

  // Handle Field Officer Dismiss / Reject action
  const handleRejectReport = async (reportId: string) => {
    setIsProcessingAction(true);
    // Call Supabase update
    await updateSupabaseCitizenReportStatus(reportId, 'REJECTED');

    // Update local state
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, verificationStatus: 'REJECTED', status: 'SYNCED', syncStatus: 'ONLINE' }
          : r
      )
    );

    if (inspectedReport && inspectedReport.id === reportId) {
      setInspectedReport((prev) =>
        prev ? { ...prev, verificationStatus: 'REJECTED', status: 'SYNCED' } : null
      );
    }
    setIsProcessingAction(false);
  };

  // Handle new field report submitted from the form
  const handleSubmitReport = async (
    reportData: Omit<CitizenReport, 'id' | 'isMockData' | 'syncStatus' | 'reporterName' | 'reporterId' | 'timestamp'>
  ) => {
    const isOnline = connectionStatus === 'ONLINE';
    
    if (isOnline) {
      const { data: createdReport } = await submitSupabaseCitizenReport({
        reportType: reportData.reportType,
        latitude: reportData.latitude ?? DEMO_LOCATION.latitude,
        longitude: reportData.longitude ?? DEMO_LOCATION.longitude,
        description: reportData.description,
        photoUrl: reportData.photoUrl,
        videoUrl: reportData.videoUrl,
        locationName: reportData.locationName,
        reporterRole: 'FieldOfficer',
      });

      if (createdReport) {
        setReports((prev) => [createdReport, ...prev]);
        return;
      }
    }

    const newReport: CitizenReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: 'numeric',
        month: 'short',
      }),
      reporterName: CURRENT_OFFICER.name,
      reporterId: CURRENT_OFFICER.officerId || CURRENT_OFFICER.id,
      syncStatus: isOnline ? 'ONLINE' : 'OFFLINE',
      status: isOnline ? 'SYNCED' : 'PENDING_SYNC',
      isMockData: false,
    };

    setReports((prev) => [newReport, ...prev]);
  };

  return (
    <FieldMobileLayout
      officer={activeOfficer}
      connectionStatus={connectionStatus}
      pendingSyncCount={pendingCount}
      onToggleConnection={handleToggleConnection}
      gpsCoordinates={{
        lat: DEMO_LOCATION.latitude,
        lng: DEMO_LOCATION.longitude,
        locationName: DEMO_LOCATION.locationName,
        accuracy: DEMO_LOCATION.accuracyMeters,
      }}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab)}
    >
      {activeTab === 'dashboard' && (
        <FieldDashboard
          riskZones={MOCK_RISK_ZONES}
          alerts={MOCK_ALERTS}
          recentReports={reports}
          weather={MOCK_WEATHER}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSelectRiskZone={handleReportForZone}
          onInspectReport={handleInspectReport}
        />
      )}

      {activeTab === 'nearby' && (
        <NearbyRiskZonesView
          riskZones={MOCK_RISK_ZONES}
          onReportForZone={handleReportForZone}
        />
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
        <ReportHistoryView
          reports={reports}
          onVerifyReport={handleVerifyReport}
          onRejectReport={handleRejectReport}
        />
      )}

      {activeTab === 'offline' && (
        <OfflineSyncManager
          connectionStatus={connectionStatus}
          pendingReports={pendingReports}
          onTriggerSync={handleTriggerSync}
          onToggleConnection={handleToggleConnection}
          isSyncing={isSyncing}
          lastSyncedTime={lastSyncedTime}
        />
      )}

      {/* Global Inspect Modal for Field Officer */}
      {inspectedReport && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setInspectedReport(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                    {getHumanReadableReportType(inspectedReport.reportType)}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      inspectedReport.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : inspectedReport.verificationStatus === 'REJECTED'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {getHumanReadableVerificationStatus(inspectedReport.verificationStatus)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Report Inspection: #{inspectedReport.id.slice(0, 8)}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setInspectedReport(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description: What Happened */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
              <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                What Happened (Incident Observation):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {inspectedReport.description}
              </p>
            </div>

            {/* Location & Time Reported */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block">Location & GPS</span>
                <span className="text-slate-200 font-bold text-xs truncate block">
                  {typeof inspectedReport.latitude === 'number' && typeof inspectedReport.longitude === 'number'
                    ? `${inspectedReport.latitude.toFixed(4)}°N, ${inspectedReport.longitude.toFixed(4)}°E`
                    : inspectedReport.locationName || 'GPS Verified'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block">Time Reported</span>
                <span className="text-slate-200 font-bold text-xs block">
                  {inspectedReport.timestamp}
                </span>
              </div>
            </div>

            {/* Evidence & Reporter Details */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Reporter Classification:</span>
                <span className="font-mono font-bold text-emerald-300">
                  {inspectedReport.reporterName || 'Citizen Sentinel'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800/60">
                <span className="text-slate-400">Attached Evidence:</span>
                <div className="flex items-center gap-2">
                  {inspectedReport.photoUrl && (
                    <span className="flex items-center gap-1 text-sky-400 font-mono text-[11px]">
                      <Camera className="w-3.5 h-3.5" /> Photo Available
                    </span>
                  )}
                  {inspectedReport.videoUrl && (
                    <span className="flex items-center gap-1 text-purple-400 font-mono text-[11px]">
                      <Video className="w-3.5 h-3.5" /> Video Available
                    </span>
                  )}
                  {!inspectedReport.photoUrl && !inspectedReport.videoUrl && (
                    <span className="text-slate-500 font-mono text-[11px]">No Media Attached</span>
                  )}
                </div>
              </div>

              {/* Photo Evidence View */}
              {inspectedReport.photoUrl && (
                <div className="rounded-lg overflow-hidden border border-slate-800 bg-black mt-2">
                  <img
                    src={inspectedReport.photoUrl}
                    alt="Ground Evidence Preview"
                    className="w-full max-h-48 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Field Officer Action Controls */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectedReport(null)}
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  loading={isProcessingAction}
                  icon={<AlertOctagon className="w-3.5 h-3.5 text-red-400" />}
                  onClick={() => handleRejectReport(inspectedReport.id)}
                >
                  Dismiss Report
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  loading={isProcessingAction}
                  icon={<ShieldCheck className="w-3.5 h-3.5" />}
                  onClick={() => handleVerifyReport(inspectedReport.id)}
                >
                  Verify Incident
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FieldMobileLayout>
  );
};

export default FieldOfficerPortal;
