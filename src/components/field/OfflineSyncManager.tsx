import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCcw,
  CheckCircle2,
  HardDrive,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { CitizenReport, ConnectionStatus } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export interface OfflineSyncManagerProps {
  connectionStatus: ConnectionStatus;
  pendingReports: CitizenReport[];
  onTriggerSync: () => void;
  onToggleConnection: () => void;
  isSyncing: boolean;
  lastSyncedTime: string;
}

export const OfflineSyncManager: React.FC<OfflineSyncManagerProps> = ({
  connectionStatus,
  pendingReports,
  onTriggerSync,
  onToggleConnection,
  isSyncing,
  lastSyncedTime,
}) => {
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  const handleSyncClick = () => {
    onTriggerSync();
    setSyncSuccessMessage('Sync process initiated. Uploading queued records...');
    setTimeout(() => {
      setSyncSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-8 w-full">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gov-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <RefreshCcw className="w-6 h-6 text-brand-primary" />
          <h2 className="text-lg sm:text-xl font-extrabold text-gov-900">
            Offline Storage & Cloud Sync Center
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gov-600">
          Designed for remote hill sectors with zero or intermittent network coverage across the North Eastern Region.
        </p>
      </div>

      {/* 2-Column Responsive Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Network State + Pending Queue */}
        <div className="space-y-6">
          {/* Network Status & Simulator Control */}
          <Card padding="md" className="bg-white border-2 border-gov-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-bold text-gov-500 uppercase tracking-wider block">
                  Current Network Link State
                </span>
                <div className="flex items-center gap-2.5 mt-1">
                  {connectionStatus === 'ONLINE' ? (
                    <Wifi className="w-6 h-6 text-emerald-600" />
                  ) : connectionStatus === 'SYNCING' ? (
                    <RefreshCcw className="w-6 h-6 text-sky-600 animate-spin" />
                  ) : (
                    <WifiOff className="w-6 h-6 text-amber-600" />
                  )}
                  <span className="text-lg font-extrabold text-gov-900 font-mono">
                    {connectionStatus}
                  </span>
                </div>
              </div>

              <Button
                variant={connectionStatus === 'OFFLINE' ? 'success' : 'outline'}
                size="md"
                className="self-start sm:self-auto font-bold"
                onClick={onToggleConnection}
              >
                {connectionStatus === 'OFFLINE' ? 'Simulate Reconnect' : 'Simulate Offline Mode'}
              </Button>
            </div>

            <div className="pt-3 border-t border-gov-200 text-xs text-gov-600 flex items-center justify-between">
              <span>Last Supabase HQ Sync:</span>
              <span className="font-mono font-bold text-gov-800">{lastSyncedTime}</span>
            </div>
          </Card>

          {/* Sync Trigger Card */}
          <Card padding="md" className="bg-white border border-gov-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-gov-700" />
                <h3 className="text-base font-extrabold text-gov-900">
                  Pending Sync Actions
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                {pendingReports.length} Queued Records
              </span>
            </div>

            <p className="text-xs text-gov-600 mb-4 leading-relaxed">
              When online, you can manually force an immediate batch synchronization or allow the background worker to sync automatically.
            </p>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSyncing}
              disabled={pendingReports.length === 0 || connectionStatus === 'OFFLINE'}
              leftIcon={<RefreshCcw className="w-5 h-5" />}
              onClick={handleSyncClick}
            >
              {connectionStatus === 'OFFLINE'
                ? 'Reconnect to Network to Enable Sync'
                : isSyncing
                ? 'Uploading Queued Records...'
                : `Sync ${pendingReports.length} Queued Reports to HQ`}
            </Button>

            {syncSuccessMessage && (
              <p className="text-xs text-center text-emerald-700 font-bold mt-3 animate-fade-in bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                {syncSuccessMessage}
              </p>
            )}
          </Card>
        </div>

        {/* Right Column: Queued Items List & Resilience Guarantee */}
        <div className="space-y-6">
          {/* Queued Records Detail */}
          <Card padding="md" className="bg-white border-2 border-gov-200">
            <h3 className="text-sm font-extrabold text-gov-900 uppercase tracking-wider mb-3">
              Queued Reports Breakdown
            </h3>

            {pendingReports.length > 0 ? (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {pendingReports.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 font-bold text-amber-950">
                        <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                        <span className="truncate">{item.reportType.replace('_', ' ')}</span>
                      </div>
                      <p className="text-xs text-amber-900 truncate mt-1">
                        {item.locationName}
                      </p>
                      <span className="text-[11px] font-mono text-amber-700 block mt-0.5">
                        {item.timestamp}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs font-bold font-mono px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md">
                      Queued
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gov-50 rounded-xl border border-gov-200/80">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-gov-800">All field reports are synchronized</p>
                <p className="text-xs text-gov-500 mt-1">Offline queue is currently empty.</p>
              </div>
            )}
          </Card>

          {/* Resilience Guarantee Card */}
          <Card padding="md" className="bg-gov-50 border border-gov-200 text-xs text-gov-700 space-y-2.5">
            <h4 className="font-bold text-gov-900 flex items-center gap-2 text-sm uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Field Resilience Guarantee
            </h4>
            <ul className="space-y-1.5 pl-1 text-xs text-gov-700 leading-relaxed">
              <li>• Incident reports with GPS & photos are immediately written to local storage.</li>
              <li>• Zero data loss if connectivity drops during transit across mountain valleys.</li>
              <li>• Automatic background synchronization resumes once 4G/LTE or satellite uplink is detected.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
