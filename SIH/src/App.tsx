import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthorityDashboard } from './pages/AuthorityDashboard';
import { RiskMapPage } from './pages/RiskMapPage';
import { AlertsPage } from './pages/AlertsPage';
import { RoadsPage } from './pages/RoadsPage';
import { FieldReportsPage } from './pages/FieldReportsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
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
      {activeTab === 'risk-map' && (
        <RiskMapPage activeStateCode={activeStateCode} />
      )}
      {activeTab === 'alerts' && (
        <AlertsPage />
      )}
      {activeTab === 'roads' && (
        <RoadsPage />
      )}
      {activeTab === 'field-reports' && (
        <FieldReportsPage />
      )}
      {activeTab === 'analytics' && (
        <AnalyticsPage />
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
