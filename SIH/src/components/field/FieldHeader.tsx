import React from 'react';
import { Shield, MapPin, Radio, Compass, PlusCircle, FileText, RefreshCcw, ArrowLeft, LogOut } from 'lucide-react';
import { ConnectionStatus, FieldOfficer, FieldActiveTab } from '../../types';
import { ConnectionBadge } from '../common/ConnectionBadge';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems: Array<{ id: FieldActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }> = [
    { id: 'dashboard', label: 'Overview / Risk', icon: Compass },
    { id: 'report', label: 'Report Hazard', icon: PlusCircle },
    { id: 'history', label: 'My Reports', icon: FileText },
    { id: 'offline', label: 'Sync Queue', icon: RefreshCcw, badge: pendingSyncCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800 w-full">
      {/* Top Branding & Connection status bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
            title="Return to Role Selection"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-sm shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white truncate">
                NER-SafeSlope
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-slate-800 text-slate-300 border border-slate-700">
                FIELD OFFICER
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate hidden sm:block">
              {officer.name} • {officer.rank} ({officer.badgeNumber || officer.officerId})
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        {onTabChange && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'nearby');
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 flex items-center gap-2 relative cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded-full text-[10px] font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Info: Connection status badge, Switch Role, Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="hidden md:flex flex-col text-right text-xs">
            <span className="font-semibold text-slate-200">{officer.assignedRegion}</span>
            <span className="text-[11px] text-slate-400 font-mono">{officer.currentSector}</span>
          </div>

          <ConnectionBadge
            status={connectionStatus}
            pendingCount={pendingSyncCount}
            interactive={true}
            onToggleStatus={onToggleConnection}
            size="md"
          />

          <Link
            to="/"
            className="text-xs px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors hidden sm:inline-block"
          >
            Switch Role
          </Link>

          <button
            onClick={handleLogout}
            className="text-xs px-2.5 py-1.5 rounded bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Log Out of Field Portal"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">Log Out</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: GPS and Sector location info */}
      <div className="bg-slate-950 px-4 sm:px-6 lg:px-8 py-2 border-t border-slate-800 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200 font-medium truncate">
              {gpsCoordinates.locationName}
            </span>
            <span className="hidden sm:inline text-slate-500 font-mono text-[11px]">
              (Lat: {gpsCoordinates.lat.toFixed(4)}, Lng: {gpsCoordinates.lng.toFixed(4)})
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>GPS ±{gpsCoordinates.accuracy}m</span>
          </div>
        </div>
      </div>

      {/* Offline Alert Banner if currently offline */}
      {connectionStatus === 'OFFLINE' && (
        <div className="bg-amber-950 border-b border-amber-800 text-amber-200 px-4 sm:px-6 lg:px-8 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>OFFLINE MODE ACTIVE: All incident reports, photos, and GPS logs are saved to local device queue.</span>
            </div>
            <button
              type="button"
              className="underline cursor-pointer text-xs font-bold text-amber-300 hover:text-white ml-4 shrink-0"
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

export default FieldHeader;
