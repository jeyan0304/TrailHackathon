import { useState } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthorityDashboard } from './pages/AuthorityDashboard';
import { DEMO_ALERTS, DEMO_ROADS } from './data/mockData';

export function App() {
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

export default App;
