import React from 'react';
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  Route,
  ClipboardList,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  activeAlertsCount?: number;
  blockedRoadsCount?: number;
  unverifiedReportsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'overview',
  onTabChange,
  activeAlertsCount = 4,
  blockedRoadsCount = 1,
  unverifiedReportsCount = 3,
}) => {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: undefined,
    },
    {
      id: 'risk-map',
      label: 'Risk Map',
      icon: <Map className="w-4 h-4" />,
      badge: undefined,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: activeAlertsCount.toString(),
      badgeColor: 'bg-red-950 text-red-300 border-red-800',
    },
    {
      id: 'roads',
      label: 'Roads',
      icon: <Route className="w-4 h-4" />,
      badge: blockedRoadsCount > 0 ? `${blockedRoadsCount} Blocked` : undefined,
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    },
    {
      id: 'field-reports',
      label: 'Field Reports',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: unverifiedReportsCount > 0 ? `${unverifiedReportsCount} New` : undefined,
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: undefined,
    },
  ];

  return (
    <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      {/* Navigation Section */}
      <div className="p-3 space-y-4">
        <div>
          <div className="px-3 mb-2 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange?.(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                        isActive
                          ? 'bg-blue-700 text-white border-blue-400/40'
                          : item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Summary */}
        <div className="pt-3 border-t border-slate-800">
          <div className="px-3 mb-2 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            Status
          </div>
          <div className="bg-slate-950/70 rounded p-2.5 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Risk Engine:</span>
              <span className="text-slate-200 font-medium">Explainable v0.1</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Data Stream:</span>
              <span className="text-amber-300 font-medium">Simulated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advisory protocol notice */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-start gap-2 text-xs text-slate-400">
          <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            Verify high-priority alerts with field teams before issuing public advisories.
          </div>
        </div>
      </div>
    </aside>
  );
};
