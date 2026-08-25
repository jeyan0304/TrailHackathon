import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeStateCode?: string;
  onStateChange?: (stateCode: string) => void;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  activeAlertsCount?: number;
  criticalAlertsCount?: number;
  blockedRoadsCount?: number;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeStateCode = 'ML',
  onStateChange,
  activeTab = 'overview',
  onTabChange,
  activeAlertsCount = 4,
  criticalAlertsCount = 1,
  blockedRoadsCount = 1,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        activeStateCode={activeStateCode}
        onStateChange={onStateChange}
        activeAlertsCount={activeAlertsCount}
        criticalAlertsCount={criticalAlertsCount}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          activeAlertsCount={activeAlertsCount}
          blockedRoadsCount={blockedRoadsCount}
        />

        {/* Central Dashboard Main Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 lg:p-6 space-y-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
