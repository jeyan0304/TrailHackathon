import React, { useState } from 'react';
import {
  FieldActiveTab,
  ConnectionStatus,
  CitizenReport,
  RiskZone,
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

export const FieldOfficerPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FieldActiveTab>('dashboard');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('ONLINE');
  const [reports, setReports] = useState<CitizenReport[]>(MOCK_REPORTS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Today at 12:15 PM');

  // Count pending offline items
  const pendingReports = reports.filter((r) => r.status === 'PENDING_SYNC');
  const pendingCount = pendingReports.length;

  // Toggle connection state for demoing ONLINE <-> OFFLINE
  const handleToggleConnection = () => {
    if (connectionStatus === 'ONLINE') {
      setConnectionStatus('OFFLINE');
    } else if (connectionStatus === 'OFFLINE') {
      // Simulate reconnect and sync
      setConnectionStatus('SYNCING');
      setIsSyncing(true);
      setTimeout(() => {
        setConnectionStatus('ONLINE');
        setIsSyncing(false);
        setLastSyncedTime('Just now');
        // Auto mark pending reports as synced
        setReports((prev) =>
          prev.map((r) =>
            r.status === 'PENDING_SYNC'
              ? { ...r, status: 'SYNCED', syncStatus: 'ONLINE', verificationStatus: 'VERIFIED' }
              : r
          )
        );
      }, 1500);
    }
  };

  // Manual sync trigger
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setConnectionStatus('SYNCING');
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.status === 'PENDING_SYNC'
            ? { ...r, status: 'SYNCED', syncStatus: 'ONLINE', verificationStatus: 'VERIFIED' }
            : r
        )
      );
      setConnectionStatus('ONLINE');
      setIsSyncing(false);
      setLastSyncedTime('Just now');
    }, 1500);
  };

  const handleReportForZone = (_zone: RiskZone) => {
    setActiveTab('report');
  };

  // Handle new field report submitted from the form
  const handleSubmitReport = (
    reportData: Omit<CitizenReport, 'id' | 'isMockData' | 'syncStatus' | 'reporterName' | 'reporterId' | 'timestamp'>
  ) => {
    const isOnline = connectionStatus === 'ONLINE';
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

    if (isOnline) {
      setTimeout(() => {
        setReports((prev) =>
          prev.map((r) =>
            r.id === newReport.id ? { ...r, status: 'SYNCED', syncStatus: 'ONLINE' } : r
          )
        );
      }, 1000);
    }
  };

  return (
    <FieldMobileLayout
      officer={CURRENT_OFFICER}
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
        <ReportHistoryView reports={reports} />
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
    </FieldMobileLayout>
  );
};

export default FieldOfficerPortal;
