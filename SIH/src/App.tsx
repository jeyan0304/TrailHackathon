import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthorityDashboard } from './pages/AuthorityDashboard';
import { FieldOfficerPortal } from './pages/FieldOfficerPortal';
import { CitizenPortal } from './pages/CitizenPortal';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { DEMO_ALERTS, DEMO_ROADS } from './data/mockData';

function AuthorityAppWrapper() {
  const [activeStateCode, setActiveStateCode] = useState<string>('NER');
  const [activeTab, setActiveTab] = useState<string>('overview');

  const activeAlertsCount = DEMO_ALERTS.filter((a) => a.status === 'ACTIVE').length;
  const criticalAlertsCount = DEMO_ALERTS.filter(
    (a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE'
  ).length;
  const blockedRoadsCount = DEMO_ROADS.filter((r) => r.status === 'BLOCKED').length;

  return (
    <DashboardLayout
      activeStateCode={activeStateCode}
      onStateChange={(state) => setActiveStateCode(state)}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab)}
      activeAlertsCount={activeAlertsCount}
      criticalAlertsCount={criticalAlertsCount}
      blockedRoadsCount={blockedRoadsCount}
    >
      {activeTab === 'overview' && (
        <AuthorityDashboard activeStateCode={activeStateCode} />
      )}

      {activeTab !== 'overview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-300 font-mono font-bold text-sm">
            {activeTab.toUpperCase().slice(0, 3)}
          </div>
          <h3 className="text-base font-semibold text-slate-100 uppercase tracking-wide">
            {activeTab.replace('-', ' ')} View
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            This section is scheduled for subsequent project phases. Return to the{' '}
            <button
              onClick={() => setActiveTab('overview')}
              className="text-blue-400 underline font-medium hover:text-blue-300"
            >
              Overview Dashboard
            </button>.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Unified Role Selection Landing Screen */}
        <Route path="/" element={<RoleSelectionPage />} />

        {/* District Administration Authority Dashboard */}
        <Route path="/authority/*" element={<AuthorityAppWrapper />} />

        {/* Field Officer Mobile Surveillance Portal */}
        <Route path="/field/*" element={<FieldOfficerPortal />} />

        {/* Public Citizen Safety & Reporting Portal */}
        <Route path="/citizen/*" element={<CitizenPortal />} />

        {/* Catch-all redirect to role selection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
