import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthorityDashboard } from './pages/AuthorityDashboard';
import { FieldOfficerPortal } from './pages/FieldOfficerPortal';
import { CitizenPortal } from './pages/CitizenPortal';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
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
              className="text-blue-400 underline font-medium hover:text-blue-300 cursor-pointer"
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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Unified Role Selection Landing Screen */}
          <Route path="/" element={<RoleSelectionPage />} />

          {/* 2. Role-Specific Dynamic Login Gateway */}
          <Route path="/login/:role" element={<LoginPage />} />

          {/* 3. District Administration Authority Dashboard (Protected) */}
          <Route
            path="/authority/*"
            element={
              <ProtectedRoute allowedRole="Authority" roleKey="authority">
                <AuthorityAppWrapper />
              </ProtectedRoute>
            }
          />

          {/* 4. Field Officer Mobile Surveillance Portal (Protected) */}
          <Route
            path="/field/*"
            element={
              <ProtectedRoute allowedRole="FieldOfficer" roleKey="field">
                <FieldOfficerPortal />
              </ProtectedRoute>
            }
          />

          {/* 5. Public Citizen Safety & Reporting Portal (Protected) */}
          <Route
            path="/citizen/*"
            element={
              <ProtectedRoute allowedRole="Citizen" roleKey="citizen">
                <CitizenPortal />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to role selection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
