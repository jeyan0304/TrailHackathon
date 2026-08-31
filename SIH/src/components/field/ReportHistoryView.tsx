import React, { useState } from 'react';
import {
  FileText,
  Clock,
  MapPin,
  AlertCircle,
  Filter,
  Check,
  Eye,
  Camera,
  Video,
  X,
  ShieldCheck,
  AlertOctagon,
} from 'lucide-react';
import { CitizenReport } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { Button } from '../common/Button';
import {
  getHumanReadableReportType,
  getHumanReadableVerificationStatus,
} from '../../services/citizenReportService';

export interface ReportHistoryViewProps {
  reports: CitizenReport[];
  onVerifyReport?: (reportId: string) => Promise<void> | void;
  onRejectReport?: (reportId: string) => Promise<void> | void;
}

export const ReportHistoryView: React.FC<ReportHistoryViewProps> = ({
  reports,
  onVerifyReport,
  onRejectReport,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);

  const filteredReports = reports.filter((report) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'PENDING') return report.verificationStatus === 'PENDING' || report.status === 'PENDING_SYNC';
    if (filterType === 'VERIFIED') return report.verificationStatus === 'VERIFIED';
    if (filterType === 'REJECTED') return report.verificationStatus === 'REJECTED';
    return report.reportType === filterType;
  });

  const handleVerify = async (reportId: string) => {
    if (!onVerifyReport) return;
    setIsProcessingAction(true);
    await onVerifyReport(reportId);
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport((prev) => (prev ? { ...prev, verificationStatus: 'VERIFIED', status: 'SYNCED' } : null));
    }
    setIsProcessingAction(false);
  };

  const handleReject = async (reportId: string) => {
    if (!onRejectReport) return;
    setIsProcessingAction(true);
    await onRejectReport(reportId);
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport((prev) => (prev ? { ...prev, verificationStatus: 'REJECTED', status: 'SYNCED' } : null));
    }
    setIsProcessingAction(false);
  };

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
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
          {[
            { key: 'ALL', label: 'All Logs' },
            { key: 'PENDING', label: 'Awaiting verification' },
            { key: 'VERIFIED', label: 'Verified' },
            { key: 'CRACK', label: 'Ground cracks' },
            { key: 'ROAD_BLOCKAGE', label: 'Road blockage' },
            { key: 'SLOPE_MOVEMENT', label: 'Slope movement' },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterType(key)}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => {
          const isPending = report.verificationStatus === 'PENDING' || report.status === 'PENDING_SYNC';
          const isVerified = report.verificationStatus === 'VERIFIED';
          const isRejected = report.verificationStatus === 'REJECTED';
          const isCitizen = report.reporterRole === 'Citizen' || report.reporterType === 'Citizen' || !report.reporterRole || report.reporterName?.includes('Citizen') || report.reporterName?.includes('Wanda');

          return (
            <div
              key={report.id}
              className={`rounded-xl border p-4 bg-slate-900 space-y-3 transition-colors ${
                isPending
                  ? 'border-amber-700/60 bg-amber-950/15'
                  : isVerified
                  ? 'border-emerald-800/80 bg-emerald-950/10'
                  : isRejected
                  ? 'border-red-900/60 bg-red-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold uppercase">
                    {getHumanReadableReportType(report.reportType)}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isCitizen
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                  }`}>
                    {isCitizen ? 'CITIZEN' : 'FIELD PATROL'}
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
                    isVerified
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : isRejected
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'bg-amber-900/60 text-amber-300 border border-amber-700'
                  }`}
                >
                  {isVerified ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : isRejected ? (
                    <X className="w-3 h-3 text-red-400" />
                  ) : (
                    <Clock className="w-3 h-3 text-amber-400" />
                  )}
                  {getHumanReadableVerificationStatus(report.verificationStatus)}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  {report.locationName || (report.location && report.location.name) || `${report.latitude?.toFixed(2)}°N, ${report.longitude?.toFixed(2)}°E`}
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
                    Evidence Attached
                  </span>
                </div>
              )}

              {/* Card Footer: Metadata + Inspect Action */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <span>{report.reporterName || 'Citizen Sentinel'}</span>
                  <span>•</span>
                  <span>{report.timestamp}</span>
                </div>

                <Button
                  variant="outline"
                  size="xs"
                  icon={<Eye className="w-3 h-3" />}
                  onClick={() => setSelectedReport(report)}
                >
                  Inspect
                </Button>
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

      {/* Comprehensive Report Inspection Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                    {getHumanReadableReportType(selectedReport.reportType)}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      selectedReport.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : selectedReport.verificationStatus === 'REJECTED'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {getHumanReadableVerificationStatus(selectedReport.verificationStatus)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Report Inspection: #{selectedReport.id.slice(0, 8)}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white p-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description: What Happened */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
              <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                What Happened (Incident Observation):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedReport.description}
              </p>
            </div>

            {/* Location & Time Reported */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block">Location & GPS</span>
                <span className="text-slate-200 font-bold text-xs truncate block">
                  {typeof selectedReport.latitude === 'number' && typeof selectedReport.longitude === 'number'
                    ? `${selectedReport.latitude.toFixed(4)}°N, ${selectedReport.longitude.toFixed(4)}°E`
                    : selectedReport.locationName || 'GPS Verified'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block">Time Reported</span>
                <span className="text-slate-200 font-bold text-xs block">
                  {selectedReport.timestamp}
                </span>
              </div>
            </div>

            {/* Evidence & Reporter Details */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Reporter Classification:</span>
                <span className="font-mono font-bold text-emerald-300">
                  {selectedReport.reporterName || 'Citizen Sentinel'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800/60">
                <span className="text-slate-400">Attached Evidence:</span>
                <div className="flex items-center gap-2">
                  {selectedReport.photoUrl && (
                    <span className="flex items-center gap-1 text-sky-400 font-mono text-[11px]">
                      <Camera className="w-3.5 h-3.5" /> Photo Available
                    </span>
                  )}
                  {selectedReport.videoUrl && (
                    <span className="flex items-center gap-1 text-purple-400 font-mono text-[11px]">
                      <Video className="w-3.5 h-3.5" /> Video Available
                    </span>
                  )}
                  {!selectedReport.photoUrl && !selectedReport.videoUrl && (
                    <span className="text-slate-500 font-mono text-[11px]">No Media Attached</span>
                  )}
                </div>
              </div>

              {/* Photo Evidence View */}
              {selectedReport.photoUrl && (
                <div className="rounded-lg overflow-hidden border border-slate-800 bg-black mt-2">
                  <img
                    src={selectedReport.photoUrl}
                    alt="Ground Evidence Preview"
                    className="w-full max-h-48 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Field Officer Action Controls */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  loading={isProcessingAction}
                  icon={<AlertOctagon className="w-3.5 h-3.5 text-red-400" />}
                  onClick={() => handleReject(selectedReport.id)}
                >
                  Dismiss Report
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  loading={isProcessingAction}
                  icon={<ShieldCheck className="w-3.5 h-3.5" />}
                  onClick={() => handleVerify(selectedReport.id)}
                >
                  Verify Incident
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportHistoryView;
