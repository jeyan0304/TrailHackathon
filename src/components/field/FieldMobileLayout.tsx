import React from 'react';
import { ConnectionStatus, FieldOfficer, FieldActiveTab } from '../../types';
import { FieldHeader } from './FieldHeader';
import { FieldBottomNav } from './FieldBottomNav';

export interface FieldMobileLayoutProps {
  children: React.ReactNode;
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
  activeTab: FieldActiveTab;
  onTabChange: (tab: FieldActiveTab) => void;
}

export const FieldMobileLayout: React.FC<FieldMobileLayoutProps> = ({
  children,
  officer,
  connectionStatus,
  pendingSyncCount,
  onToggleConnection,
  gpsCoordinates,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="min-h-screen w-full bg-gov-100 text-gov-900 flex flex-col selection:bg-brand-primary selection:text-white">
      {/* Responsive Top Header */}
      <FieldHeader
        officer={officer}
        connectionStatus={connectionStatus}
        pendingSyncCount={pendingSyncCount}
        onToggleConnection={onToggleConnection}
        gpsCoordinates={gpsCoordinates}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* Main Responsive Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
        {/* Prototype / Demo Notice */}
        <div className="mb-4 px-3.5 py-1.5 bg-gov-200/90 rounded-xl text-xs font-mono text-gov-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1 border border-gov-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>[DEMO / PROTOTYPE ENVIRONMENT — NORTH EASTERN REGION OF INDIA]</span>
          </div>
          <span className="font-bold text-gov-800 text-[11px] uppercase tracking-wider">
            PERSON 2: Field Officer & Citizen Reporting System
          </span>
        </div>

        {children}
      </main>

      {/* Mobile-Only Bottom Navigation (hidden on lg+ screens) */}
      <FieldBottomNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        pendingCount={pendingSyncCount}
      />
    </div>
  );
};

export default FieldMobileLayout;
