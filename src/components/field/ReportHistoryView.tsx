import React, { useState } from 'react';
import {
  FileText,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CitizenReport, ReportStatus } from '../../types';
import { Card } from '../common/Card';
import { RiskBadge } from '../common/RiskBadge';

export interface ReportHistoryViewProps {
  reports: CitizenReport[];
  onOpenReport?: (report: CitizenReport) => void;
}

export const ReportHistoryView: React.FC<ReportHistoryViewProps> = ({
  reports,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredReports = reports.filter((rep) => {
    if (filterStatus !== 'ALL' && rep.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'SYNCED':
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            SYNCED TO HQ
          </span>
        );
      case 'PENDING_SYNC':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" />
            PENDING SYNC
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gov-100 text-gov-800 border border-gov-300">
            DRAFT
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-900 border border-red-300">
            <AlertCircle className="w-3 h-3 text-red-600" />
            FAILED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-8 w-full">
      {/* Header & Status Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gov-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-primary" />
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gov-900">
                Field Incident Report History
              </h2>
              <p className="text-xs text-gov-600">
                Chronological audit trail of geo-tagged field observations and local offline queue.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-gov-700 bg-gov-100 px-3 py-1 rounded-full self-start sm:self-auto border border-gov-200">
            Total: {filteredReports.length} Reports
          </span>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'ALL', label: 'All Reports' },
            { id: 'PENDING_SYNC', label: 'Pending Sync Queue' },
            { id: 'SYNCED', label: 'Synced to Supabase HQ' },
            { id: 'DRAFT', label: 'Drafts' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-gov-900 text-white shadow-sm'
                  : 'bg-gov-100 text-gov-700 hover:bg-gov-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid (3 columns on Desktop, 2 on Tablet, 1 on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => (
          <Card key={report.id} padding="md" className="bg-white border-2 border-gov-200 hover:border-gov-300 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-gov-900 text-white text-[11px] font-mono font-bold uppercase tracking-wider">
                    {report.reportType.replace('_', ' ')}
                  </span>
                  {report.severityObserved && (
                    <RiskBadge level={report.severityObserved} size="sm" />
                  )}
                </div>
                <div className="shrink-0">
                  {getStatusBadge(report.status)}
                </div>
              </div>

              {/* Location & Time */}
              <div className="space-y-1 my-2.5">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gov-900">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{report.locationName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-gov-500">
                  <span>{report.timestamp}</span>
                  <span>Lat: {report.latitude.toFixed(4)}, Lng: {report.longitude.toFixed(4)}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gov-700 bg-gov-50 p-3 rounded-xl border border-gov-200/80 leading-relaxed min-h-[56px]">
                {report.description}
              </p>

              {/* Thumbnail Preview if attached */}
              {report.photoUrl && (
                <div className="mt-3 flex items-center gap-3 p-2 bg-gov-100/80 rounded-xl border border-gov-200">
                  <img
                    src={report.photoUrl}
                    alt="Incident photo thumbnail"
                    className="w-14 h-14 rounded-lg object-cover border border-gov-300 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-gov-800 block truncate">
                      Field Photo Evidence
                    </span>
                    <span className="text-[10px] text-gov-500 font-mono">Geo-tagged photo attached</span>
                  </div>
                </div>
              )}
            </div>

            {/* Reporter footer */}
            <div className="mt-4 pt-3 border-t border-gov-200 flex items-center justify-between text-[11px] text-gov-500">
              <span>By: <strong className="text-gov-700">{report.reporterName}</strong></span>
              <span className="font-mono text-[10px]">ID: #{report.id}</span>
            </div>
          </Card>
        ))}

        {filteredReports.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gov-200 p-6">
            <FileText className="w-12 h-12 text-gov-300 mx-auto mb-2" />
            <h4 className="text-base font-bold text-gov-700">No reports found</h4>
            <p className="text-xs text-gov-500 mt-1">There are no reports under this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
