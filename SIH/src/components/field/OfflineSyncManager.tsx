import React from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';
import { ConnectionStatus, CitizenReport } from '../../types';
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
  const isOnline = connectionStatus === 'ONLINE';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            Field Offline Storage & Sync Queue
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Local browser storage cache for mountainous low-connectivity sectors.
          </p>
        </div>
      </div>

      {/* Network Simulator Card */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                isOnline
                  ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                  : 'bg-amber-950/80 border-amber-700 text-amber-400'
              }`}
            >
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  Network Link: {connectionStatus}
                </h3>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                  }`}
                />
              </div>
              <p className="text-xs text-slate-400">
                Last Successful Sync: <span className="font-mono text-slate-300">{lastSyncedTime}</span>
              </p>
            </div>
          </div>

          <Button
            variant={isOnline ? 'outline' : 'warning'}
            size="sm"
            onClick={onToggleConnection}
          >
            {isOnline ? 'Simulate Offline' : 'Simulate Reconnect'}
          </Button>
        </div>

        {/* Sync Trigger button */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-mono">
            {pendingReports.length} pending report(s) waiting for server sync
          </span>

          <Button
            variant="primary"
            size="sm"
            loading={isSyncing}
            disabled={pendingReports.length === 0 || !isOnline}
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={onTriggerSync}
          >
            {isSyncing ? 'Synchronizing...' : 'Sync Queue Now'}
          </Button>
        </div>
      </div>

      {/* Pending Items Queue */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-amber-400" />
          Offline Device Cache ({pendingReports.length})
        </h3>

        {pendingReports.length > 0 ? (
          <div className="space-y-2.5">
            {pendingReports.map((report) => (
              <div
                key={report.id}
                className="p-3 rounded-lg bg-slate-950 border border-amber-900/60 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold uppercase">
                      {report.reportType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{report.timestamp}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200">
                    {report.locationName || (report.location && report.location.name)}
                  </h5>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {report.description}
                  </p>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 shrink-0">
                  QUEUED
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
            <h4 className="text-xs font-bold text-slate-200">All local reports are synced</h4>
            <p className="text-[11px] text-slate-500">
              No pending uploads remaining in browser storage.
            </p>
          </div>
        )}
      </div>

      {/* Resilience info banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
        <h4 className="font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Field Resilience Specifications
        </h4>
        <ul className="space-y-1 text-slate-400 pl-4 list-disc text-[11px] leading-relaxed">
          <li>All GPS-tagged hazard photos and telemetry records are held in localStorage / IndexedDB.</li>
          <li>Upon cellular or Wi-Fi reconnect, queued items automatically sync with Authority Command.</li>
          <li>Conflict resolution preserves local timestamps and accurate field telemetry stamps.</li>
        </ul>
      </div>
    </div>
  );
};

export default OfflineSyncManager;
