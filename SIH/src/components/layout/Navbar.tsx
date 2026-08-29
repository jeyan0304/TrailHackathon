import React, { useState } from 'react';
import {
  ShieldAlert,
  Bell,
  Clock,
  User,
  ChevronDown,
  Info,
  MapPin,
  LogOut,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { NER_STATES } from '../../data/mockData';
import { ConnectionStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activeStateCode?: string;
  onStateChange?: (stateCode: string) => void;
  activeAlertsCount?: number;
  criticalAlertsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeStateCode = 'NER',
  onStateChange,
  activeAlertsCount = 4,
  criticalAlertsCount = 1,
}) => {
  const [connectionStatus] = useState<ConnectionStatus>('ONLINE');
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const selectedState =
    NER_STATES.find((s) => s.code === activeStateCode) || NER_STATES[0];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-sm">
      {/* Top Advisory Disclaimer Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold text-slate-300">
            DEMO DATA:
          </span>
          <span className="hidden sm:inline">
            Telemetry, rainfall, risk scores, and alert items are simulated demonstration data for the North Eastern Region.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-medium">
            Simulated Feed
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight font-sans">
                NER-SafeSlope
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                Authority
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              Landslide risk monitoring, road connectivity & emergency response
            </p>
          </div>
        </div>

        {/* Center: Geographic Region Selector (Consistent NER Default) */}
        <div className="relative">
          <button
            onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs transition-colors cursor-pointer"
            title="Switch Monitored NER Region / State"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                Region
              </div>
              <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                <span>{selectedState.name}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {isStateDropdownOpen && (
            <div className="absolute top-full mt-1.5 left-0 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Select Monitored Area
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {NER_STATES.map((state) => (
                  <button
                    key={state.code}
                    onClick={() => {
                      onStateChange?.(state.code);
                      setIsStateDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      state.code === activeStateCode
                        ? 'bg-blue-950/60 text-blue-300 font-semibold'
                        : 'text-slate-300'
                    }`}
                  >
                    <span>{state.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {state.totalZones} zones
                    </span>
                  </button>
                ))}
              </div>
              <div className="px-3 py-1.5 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-400">
                * Meghalaya active demo corridor.
              </div>
            </div>
          )}
        </div>

        {/* Right: Operational Status, Alerts, Profile, Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Simulated Clock */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>18:45 IST</span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-emerald-400 font-medium">
              {connectionStatus}
            </span>
          </div>

          {/* Alert Notification Bell */}
          <button
            className="relative p-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
            title={`${activeAlertsCount} Active Alerts (${criticalAlertsCount} Critical)`}
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Switch Role Link */}
          <Link
            to="/"
            className="text-xs px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors hidden sm:inline-block"
            title="Return to Role Selection"
          >
            Switch Role
          </Link>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="text-xs px-2.5 py-1.5 rounded bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Log Out of Authority Portal"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">Log Out</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs">
              <User className="w-4 h-4 text-slate-400" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-200">
                {user?.name || 'District Administration'}
              </div>
              <div className="text-[10px] text-slate-400">
                {user?.district || 'Disaster Management Unit'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
