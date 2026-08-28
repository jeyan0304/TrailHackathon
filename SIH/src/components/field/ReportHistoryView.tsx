import React, { useState } from 'react';
import {
  FileText,
  Clock,
  MapPin,
  AlertCircle,
  Filter,
  Check,
} from 'lucide-react';
import { CitizenReport } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

export interface ReportHistoryViewProps {
  reports: CitizenReport[];
}

export const ReportHistoryView: React.FC<ReportHistoryViewProps> = ({ reports }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);

  const filteredReports = reports.filter((report) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'PENDING') return report.status === 'PENDING_SYNC';
    if (filterType === 'SYNCED') return report.status === 'SYNCED';
    return report.reportType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-slate-100">
              Submitted Hazard & Incident Logs
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit history of field surveillance reports and citizen submissions.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {['ALL', 'PENDING', 'SYNCED', 'CRACK', 'ROAD_BLOCKAGE', 'SLOPE_MOVEMENT'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setFilterType(filter)}
              className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter === 'ALL' ? 'All Logs' : filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => {
          const isPending = report.status === 'PENDING_SYNC';

          return (
            <div
              key={report.id}
              className={`rounded-xl border p-4 bg-slate-900 space-y-3 transition-colors ${
                isPending ? 'border-amber-700/60 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold uppercase">
                    {report.reportType.replace('_', ' ')}
                  </span>
                  {report.severityObserved && (
                    <RiskBadge level={report.severityObserved} size="sm" />
                  )}
                  {report.roadBlocked && (
                    <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold">
                      ROAD BLOCKED
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                    isPending
                      ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {isPending ? <Clock className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  {isPending ? 'OFFLINE QUEUED' : 'SYNCED'}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {report.locationName || (report.location && report.location.name)}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                  {report.description}
                </p>
              </div>

              {/* Photo preview thumbnail if present */}
              {report.photoUrl && (
                <div className="relative rounded-lg overflow-hidden border border-slate-800 max-h-36 bg-slate-950">
                  <img
                    src={report.photoUrl}
                    alt="Field hazard evidence"
                    className="w-full h-32 object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300">
                    Visual Evidence Attached
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>By: {report.reporterName || 'Field Patrol'}</span>
                <span className="font-mono">{report.timestamp}</span>
              </div>
            </div>
          );
        })}

        {filteredReports.length === 0 && (
          <div className="col-span-full text-center py-12 bg-slate-900 rounded-xl border border-slate-800 p-6">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-300">No reports match this criteria</h4>
            <p className="text-xs text-slate-500 mt-1">Submit a new incident from the Report tab.</p>
          </div>
        )}
      </div>

      {/* Modal / Detail View if selected */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-100">
                Report Details: {selectedReport.id}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-100"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedReport.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportHistoryView;
