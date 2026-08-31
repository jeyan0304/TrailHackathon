import React from 'react';
import {
  Shield,
  Building2,
  Radio,
  Users,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Activity,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RoleSelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-white">
                  NER-SafeSlope
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  AI EARLY WARNING PLATFORM
                </span>
              </div>
              <p className="text-xs text-slate-400">
                North Eastern Region Landslide Surveillance & Emergency Response
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Active Region:</span>
            <span className="text-slate-200 font-semibold">Meghalaya Corridor (Demo)</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Integrated Multi-Stakeholder Decision Support System</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Your Operational Role
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Choose an operational gateway below to authenticate and access role-specific landslide surveillance tools, emergency prioritization matrices, and on-ground reporting capabilities.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
          {/* 1. District Administration */}
          <Link
            to="/login/authority"
            className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/80 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-blue-950/40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-colors pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800/80 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  <Lock className="w-3 h-3 text-blue-400" /> Auth Required
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900">
                  DESKTOP COMMAND
                </span>
                <h3 className="text-lg font-bold text-white mt-2 group-hover:text-blue-300 transition-colors">
                  District Administration
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Strategic overview for District Disaster Management Authorities (DDMA), EOC operators, and engineers.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>GIS Risk Heatmap & Slope Sectors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Multi-Hazard Alert Dispatch Feed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>NH-06 & Arterial Passability Matrix</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Emergency Priority Action Ranking</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
              <span>Log In as Authority</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. Field Officer Portal */}
          <Link
            to="/login/field"
            className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/80 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-sky-950/40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-600/10 rounded-full blur-2xl group-hover:bg-sky-600/20 transition-colors pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-sky-950 border border-sky-800/80 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                  <Radio className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  <Lock className="w-3 h-3 text-sky-400" /> Auth Required
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-900">
                  MOBILE SURVEILLANCE
                </span>
                <h3 className="text-lg font-bold text-white mt-2 group-hover:text-sky-300 transition-colors">
                  Field Officer Portal
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  On-ground inspection tools for SDRF, NDRF, traffic police patrols, and PWD road inspectors.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>GPS-Tagged Incident Reporting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Camera Photo Evidence Upload</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Offline Storage & Auto-Sync Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Nearby Risk Sectors Telemetry</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-sky-400 group-hover:text-sky-300">
              <span>Log In as Field Officer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 3. Public / Citizen Portal */}
          <Link
            to="/login/citizen"
            className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/80 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition-colors pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  <Lock className="w-3 h-3 text-emerald-400" /> Auth Required
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900">
                  PUBLIC ACCESS
                </span>
                <h3 className="text-lg font-bold text-white mt-2 group-hover:text-emerald-300 transition-colors">
                  Public / Citizen Portal
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Community early warnings, monsoon road advisories, emergency numbers, and citizen hazard reports.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Public Landslide Risk Warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>One-Touch Emergency Helplines (1070/112)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Simplified Citizen Hazard Reporting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Monsoon Safety Do's & Don'ts</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>Log In as Citizen</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </main>

      {/* Footer Banner */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        NER-SafeSlope • Smart India Hackathon Prototype • AI-Driven Landslide Early Warning & Decision Support
      </footer>
    </div>
  );
};

export default RoleSelectionPage;
