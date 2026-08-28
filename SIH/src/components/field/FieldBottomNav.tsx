import React from 'react';
import { Compass, Camera, FileText, RefreshCcw, PlusCircle } from 'lucide-react';
import { FieldActiveTab } from '../../types';

export interface FieldBottomNavProps {
  activeTab: FieldActiveTab;
  onTabChange: (tab: FieldActiveTab) => void;
  pendingCount: number;
}

export const FieldBottomNav: React.FC<FieldBottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingCount,
}) => {
  const tabs: Array<{
    id: FieldActiveTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
    highlight?: boolean;
  }> = [
    {
      id: 'dashboard',
      label: 'Nearby Risk',
      icon: Compass,
    },
    {
      id: 'report',
      label: 'Report',
      icon: PlusCircle,
      highlight: true,
    },
    {
      id: 'history',
      label: 'My Reports',
      icon: FileText,
    },
    {
      id: 'offline',
      label: 'Sync Queue',
      icon: RefreshCcw,
      badge: pendingCount,
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 shadow-lg select-none"
      aria-label="Mobile Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id || (tab.id === 'dashboard' && activeTab === 'nearby');
          const Icon = tab.icon;

          if (tab.highlight) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center -top-3 focus:outline-none"
                aria-selected={isActive}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/30'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-semibold mt-1 tracking-tight ${
                    isActive ? 'text-blue-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full transition-colors active:bg-slate-800 ${
                isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-selected={isActive}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded-full text-[9px] font-bold font-mono min-w-[16px] text-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium mt-1 tracking-tight truncate ${
                  isActive ? 'font-bold text-blue-400' : ''
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const FieldNavigation = FieldBottomNav;
