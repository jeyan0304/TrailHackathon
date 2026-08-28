import React from 'react';
import { Shield, MapPin, Radio, Compass, PlusCircle, FileText, RefreshCcw } from 'lucide-react';
import { ConnectionStatus, FieldOfficer, FieldActiveTab } from '../../types';
import { ConnectionBadge } from '../common/ConnectionBadge';

export interface FieldHeaderProps {
  officer: FieldOfficer;
  connectionStatus: ConnectionStatus;
  pendingSyncCount: number;
  onToggleConnection: () => void;
  gpsCoordinates: {
    lat: number;
    lng: number;
    locationName: string;
    accuracy: number;
  };
  activeTab?: FieldActiveTab;
  onTabChange?: (tab: FieldActiveTab) => void;
}

export const FieldHeader: React.FC<FieldHeaderProps> = ({
  officer,
  connectionStatus,
  pendingSyncCount,
  onToggleConnection,
  gpsCoordinates,
  activeTab = 'dashboard',
  onTabChange,
}) => {
  const navItems: Array<{ id: FieldActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }> = [
    { id: 'dashboard', label: 'Dashboard / Risk', icon: Compass },
    { id: 'report', label: 'Report Hazard', icon: PlusCircle },
    { id: 'history', label: 'My Reports', icon: FileText },
    { id: 'offline', label: 'Sync Queue', icon: RefreshCcw, badge: pendingSyncCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-gov-900 text-white shadow-md border-b border-gov-800 w-full">
      {/* Top Branding & Connection status bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white truncate">
                NER-SafeSlope
              </span>
              <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[10px] font-mono uppercase tracking-wider font-extrabold border border-sky-500/30">
                FIELD OFFICER PORTAL
              </span>
            </div>
            <p className="text-xs text-gov-300 truncate hidden sm:block">
              {officer.name} • {officer.rank} ({officer.officerId})
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links (hidden on mobile, visible on lg+) */}
        {onTabChange && (
          <nav className="hidden lg:flex items-center gap-1 bg-gov-950/60 p-1.5 rounded-xl border border-gov-800">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'nearby');
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-2 relative ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-gov-300 hover:text-white hover:bg-gov-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Info: Officer details & Connection status badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex flex-col text-right text-xs">
            <span className="font-bold text-gov-200">{officer.assignedRegion}</span>
            <span className="text-[11px] text-gov-400 font-mono">{officer.currentSector}</span>
          </div>

          <ConnectionBadge
            status={connectionStatus}
            pendingCount={pendingSyncCount}
            interactive={true}
            onToggleStatus={onToggleConnection}
            size="md"
          />
        </div>
      </div>

      {/* Sub-bar: GPS and Sector location info */}
      <div className="bg-gov-950/90 px-4 sm:px-6 lg:px-8 py-2 border-t border-gov-800 text-xs text-gov-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-gov-200 font-semibold truncate">
              {gpsCoordinates.locationName}
            </span>
            <span className="hidden sm:inline text-gov-500 font-mono text-[11px]">
              (Lat: {gpsCoordinates.lat.toFixed(4)}, Lng: {gpsCoordinates.lng.toFixed(4)})
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-800/70">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>GPS Locked ±{gpsCoordinates.accuracy}m</span>
          </div>
        </div>
      </div>

      {/* Offline Alert Banner if currently offline */}
      {connectionStatus === 'OFFLINE' && (
        <div className="bg-amber-500 text-amber-950 px-4 sm:px-6 lg:px-8 py-1.5 text-xs font-extrabold flex items-center justify-between animate-pulse">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4" />
              <span>OFFLINE MODE ACTIVE: All incident reports, photos, and GPS logs are securely cached locally.</span>
            </div>
            <button
              type="button"
              className="underline cursor-pointer text-xs uppercase tracking-wider font-black hover:text-black ml-4 shrink-0"
              onClick={onToggleConnection}
            >
              Simulate Network Reconnect
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
