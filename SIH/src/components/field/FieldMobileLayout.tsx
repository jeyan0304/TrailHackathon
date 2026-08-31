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
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white pb-16 lg:pb-0">
      {/* Top Header */}
      <FieldHeader
        officer={officer}
        connectionStatus={connectionStatus}
        pendingSyncCount={pendingSyncCount}
        onToggleConnection={onToggleConnection}
        gpsCoordinates={gpsCoordinates}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
        {children}
      </main>

      {/* Mobile-Only Bottom Navigation */}
      <FieldBottomNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        pendingCount={pendingSyncCount}
      />
    </div>
  );
};

export default FieldMobileLayout;
