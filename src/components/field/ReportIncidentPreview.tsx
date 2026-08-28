import React, { useState, useRef } from 'react';
import {
  Camera,
  MapPin,
  CheckCircle2,
  Video,
  X,
  AlertTriangle,
  ChevronDown,
  Send,
  HardDrive,
  RotateCcw,
  ImageIcon,
  FileVideo,
  Mic,
  Radio
} from 'lucide-react';
import { ReportType, RiskLevel, CitizenReport } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { RiskBadge } from '../common/RiskBadge';

export interface ReportIncidentPreviewProps {
  gpsLocation: {
    lat: number;
    lng: number;
    locationName: string;
    accuracy: number;
  };
  onSwitchToHistory: () => void;
  onSubmitReport?: (report: Omit<CitizenReport, 'id' | 'isMockData' | 'syncStatus' | 'reporterName' | 'reporterId' | 'timestamp'>) => void;
}

type FormStep = 'type' | 'details' | 'media' | 'review' | 'success';

interface PhotoAttachment {
  id: string;
  dataUrl: string;
  name: string;
  type: 'photo' | 'video';
  sizeLabel: string;
}

const INCIDENT_TYPES: Array<{
  type: ReportType;
  label: string;
  description: string;
  icon: string;
  example: string;
  severityHint: RiskLevel;
}> = [
  {
    type: 'CRACK',
    label: 'Surface / Slope Crack',
    description: 'Tension cracks on asphalt, soil scarps, or rock face fissures',
    icon: '⚡',
    example: 'e.g. 5m length longitudinal crack on uphill road shoulder',
    severityHint: 'HIGH',
  },
  {
    type: 'SLOPE_MOVEMENT',
    label: 'Active Slope Movement',
    description: 'Soil creep, tilting trees, bulging retaining wall, or sliding mud',
    icon: '⛰️',
    example: 'e.g. Soil bulge above culvert with tilted utility poles',
    severityHint: 'HIGH',
  },
  {
    type: 'ROAD_BLOCKAGE',
    label: 'Road Debris / Blockage',
    description: 'Boulders, mudflow, or fallen trees obstructing carriageway',
    icon: '🚧',
    example: 'e.g. Mud debris blocking right carriageway lane',
    severityHint: 'CRITICAL',
  },
  {
    type: 'LANDSLIDE',
    label: 'Active Landslide Event',
    description: 'Major slope failure, debris avalanche, or mass rockfall',
    icon: '🚨',
    example: 'e.g. Full slope slip cut across highway segment',
    severityHint: 'CRITICAL',
  },
  {
    type: 'INFRASTRUCTURE_DAMAGE',
    label: 'Infrastructure Damage',
    description: 'Damaged culvert, retaining gabion wall, bridge abutment, or drain',
    icon: '🏗️',
    example: 'e.g. Gabion retaining wall collapsed under stormwater pressure',
    severityHint: 'MODERATE',
  },
  {
    type: 'OTHER',
    label: 'Other Hazard / Anomaly',
    description: 'Unusual water seepage from slope, clogged drainage channel',
    icon: '⚠️',
    example: 'e.g. Concentrated water spring emerging from cut face',
    severityHint: 'MODERATE',
  },
];

const SEVERITY_OPTIONS: Array<{ level: RiskLevel; label: string; description: string }> = [
  { level: 'LOW', label: 'Low', description: 'Monitor — no immediate danger' },
  { level: 'MODERATE', label: 'Moderate', description: 'Caution — potential risk if conditions worsen' },
  { level: 'HIGH', label: 'High', description: 'Alert — immediate inspection required' },
  { level: 'CRITICAL', label: 'Critical', description: 'Emergency — potential life safety risk' },
];

export const ReportIncidentPreview: React.FC<ReportIncidentPreviewProps> = ({
  gpsLocation,
  onSwitchToHistory,
  onSubmitReport,
}) => {
  const [step, setStep] = useState<FormStep>('type');
  const [selectedType, setSelectedType] = useState<ReportType>('CRACK');
  const [description, setDescription] = useState('');
  const [severityObserved, setSeverityObserved] = useState<RiskLevel>('HIGH');
  const [roadBlocked, setRoadBlocked] = useState(false);
  const [affectedRoadName, setAffectedRoadName] = useState('');
  const [attachments, setAttachments] = useState<PhotoAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const selectedTypeInfo = INCIDENT_TYPES.find(t => t.type === selectedType)!;

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (attachments.length >= 5) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const sizeKb = Math.round(file.size / 1024);
        const sizeLabel = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
        setAttachments(prev => [
          ...prev,
          {
            id: `photo-${Date.now()}-${Math.random()}`,
            dataUrl,
            name: file.name,
            type: file.type.startsWith('video') ? 'video' : 'photo',
            sizeLabel,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = () => {
    if (!description.trim()) return;
    setIsSubmitting(true);
    // Simulate async submission / offline queue
    setTimeout(() => {
      const newReportId = `rep-${Date.now()}`;
      setSubmittedReportId(newReportId);
      if (onSubmitReport) {
        onSubmitReport({
          reportType: selectedType,
          latitude: gpsLocation.lat,
          longitude: gpsLocation.lng,
          locationName: gpsLocation.locationName,
          description: description.trim(),
          photoUrl: attachments.find(a => a.type === 'photo')?.dataUrl,
          videoUrl: attachments.find(a => a.type === 'video')?.dataUrl,
          status: 'PENDING_SYNC',
          reporterType: 'FieldOfficer',
          severityObserved,
          roadBlocked,
          affectedRoadName: roadBlocked ? affectedRoadName : undefined,
        });
      }
      setIsSubmitting(false);
      setStep('success');
    }, 1200);
  };

  const handleReset = () => {
    setStep('type');
    setSelectedType('CRACK');
    setDescription('');
    setSeverityObserved('HIGH');
    setRoadBlocked(false);
    setAffectedRoadName('');
    setAttachments([]);
    setSubmittedReportId(null);
  };

  // ─── SUCCESS SCREEN ───────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="space-y-5 pb-24 lg:pb-8 w-full max-w-xl mx-auto">
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-emerald-950 mb-2">Report Queued Successfully</h2>
          <p className="text-sm text-emerald-800 mb-4 leading-relaxed">
            Your incident report has been stored securely in the local offline queue.
            It will sync to HQ servers automatically when network coverage resumes.
          </p>

          <div className="bg-white border border-emerald-200 rounded-xl p-3 text-left text-xs space-y-2 mb-5 font-mono">
            <div className="flex items-center justify-between gap-2">
              <span className="text-gov-500">Report ID</span>
              <span className="font-bold text-gov-900">{submittedReportId}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-gov-500">Type</span>
              <span className="font-bold text-gov-900">{selectedTypeInfo.label}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-gov-500">Severity</span>
              <RiskBadge level={severityObserved} size="sm" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-gov-500">GPS Location</span>
              <span className="font-bold text-gov-900 text-right truncate max-w-[150px]">{gpsLocation.locationName}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-gov-500">Status</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[10px] font-bold animate-pulse">
                PENDING SYNC
              </span>
            </div>
            {attachments.length > 0 && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-gov-500">Attachments</span>
                <span className="font-bold text-gov-900">{attachments.length} file(s) queued</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="primary" size="md" fullWidth onClick={handleReset} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Submit Another Report
            </Button>
            <Button variant="outline" size="md" fullWidth onClick={onSwitchToHistory}>
              View Report History
            </Button>
          </div>
        </div>

        <Card padding="sm" className="bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-start gap-2">
          <Radio className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <span>
            <strong>Offline Resilience Active:</strong> This report is safely stored locally using device storage.
            Network sync will happen automatically when coverage is restored.
          </span>
        </Card>
      </div>
    );
  }

  // ─── STEP INDICATOR ───────────────────────────────────────────────────────
  const steps: Array<{ key: FormStep; label: string }> = [
    { key: 'type', label: 'Type' },
    { key: 'details', label: 'Details' },
    { key: 'media', label: 'Media' },
    { key: 'review', label: 'Review' },
  ];
  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="space-y-5 pb-24 lg:pb-8 w-full">
      {/* ── Header ── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gov-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Camera className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg sm:text-xl font-extrabold text-gov-900">
            Field Incident Report
          </h2>
        </div>
        <p className="text-xs text-gov-500 mb-4">
          Fast mobile capture optimized for field officers in low-network terrain.
        </p>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => {
            const isDone = i < currentStepIndex;
            const isActive = i === currentStepIndex;
            return (
              <React.Fragment key={s.key}>
                <div className="flex flex-col items-center gap-1 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : isActive
                        ? 'bg-brand-primary border-brand-primary text-white'
                        : 'bg-white border-gov-300 text-gov-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${isActive ? 'text-brand-primary' : isDone ? 'text-emerald-600' : 'text-gov-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full mt-[-10px] transition-all ${i < currentStepIndex ? 'bg-emerald-400' : 'bg-gov-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── GPS Location Card (always visible) ── */}
      <Card padding="md" className="bg-emerald-50/90 border-2 border-emerald-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider block">
                GPS Auto-Locked
              </span>
              <p className="text-sm font-extrabold text-emerald-950">
                {gpsLocation.locationName}
              </p>
              <p className="text-xs font-mono text-emerald-700 mt-0.5">
                {gpsLocation.lat.toFixed(5)}, {gpsLocation.lng.toFixed(5)} · ±{gpsLocation.accuracy}m
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-2 py-1 bg-emerald-200 text-emerald-900 text-[10px] font-mono font-bold rounded-full border border-emerald-400">
            GPS LOCKED
          </span>
        </div>
      </Card>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* STEP 1: INCIDENT TYPE */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {step === 'type' && (
        <div className="space-y-4">
          <label className="text-xs sm:text-sm font-extrabold text-gov-900 uppercase tracking-wider block px-1">
            Select Incident / Hazard Classification:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INCIDENT_TYPES.map((item) => {
              const isSelected = selectedType === item.type;
              return (
                <div
                  key={item.type}
                  onClick={() => setSelectedType(item.type)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer select-none flex flex-col justify-between active:scale-95 ${
                    isSelected
                      ? 'border-brand-primary bg-sky-50 shadow-md ring-2 ring-sky-200'
                      : 'border-gov-200 bg-white hover:border-gov-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-3xl">{item.icon}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" />}
                    </div>
                    <h4 className="text-sm font-extrabold text-gov-900">{item.label}</h4>
                    <p className="text-xs text-gov-600 mt-1 leading-snug">{item.description}</p>
                  </div>
                  <span className="text-[11px] text-gov-500 font-mono italic block mt-3 pt-2 border-t border-gov-100">
                    {item.example}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep('details')}
            >
              Next: Add Details →
            </Button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* STEP 2: DETAILS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {step === 'details' && (
        <div className="space-y-4">
          {/* Selected type summary */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gov-200">
            <span className="text-2xl">{selectedTypeInfo.icon}</span>
            <div>
              <span className="text-xs font-bold text-gov-500 uppercase tracking-wider block">Selected Type</span>
              <span className="text-sm font-extrabold text-gov-900">{selectedTypeInfo.label}</span>
            </div>
            <button
              type="button"
              onClick={() => setStep('type')}
              className="ml-auto text-xs text-brand-primary font-bold hover:underline"
            >
              Change
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-extrabold text-gov-900 uppercase tracking-wider block mb-2">
              Incident Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder={`Describe what you observed...\n${selectedTypeInfo.example}`}
              className="w-full rounded-xl border-2 border-gov-200 bg-white px-4 py-3 text-sm text-gov-900 placeholder-gov-400 font-sans focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-sky-200 resize-none transition-all"
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] text-gov-400">
                Include measurements, distances, or chain markings if possible.
              </span>
              <span className={`text-[11px] font-mono ${description.length < 20 ? 'text-red-400' : 'text-emerald-600'}`}>
                {description.length} chars
              </span>
            </div>
          </div>

          {/* Severity Observed */}
          <div>
            <label className="text-xs font-extrabold text-gov-900 uppercase tracking-wider block mb-2">
              Observed Severity
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SEVERITY_OPTIONS.map(opt => (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => setSeverityObserved(opt.level)}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer text-xs ${
                    severityObserved === opt.level
                      ? 'border-brand-primary bg-sky-50 ring-2 ring-sky-200'
                      : 'border-gov-200 bg-white hover:border-gov-300'
                  }`}
                >
                  <RiskBadge level={opt.level} size="sm" />
                  <p className="text-[10px] text-gov-500 mt-1 leading-snug">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Road Blocked Toggle */}
          <div className="bg-white rounded-xl border border-gov-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-sm font-extrabold text-gov-900">Road / Route Blocked?</span>
                <p className="text-xs text-gov-500 mt-0.5">Toggle if any carriageway is obstructed</p>
              </div>
              <button
                type="button"
                onClick={() => setRoadBlocked(!roadBlocked)}
                className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                  roadBlocked ? 'bg-red-500' : 'bg-gov-300'
                }`}
                aria-pressed={roadBlocked}
                role="switch"
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${
                    roadBlocked ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
            {roadBlocked && (
              <div className="mt-3 pt-3 border-t border-gov-100">
                <label className="text-xs font-bold text-gov-700 block mb-1">Road / Route Name (Optional)</label>
                <input
                  type="text"
                  value={affectedRoadName}
                  onChange={e => setAffectedRoadName(e.target.value)}
                  placeholder="e.g. NH-6 Shillong Bypass"
                  className="w-full rounded-lg border border-gov-200 px-3 py-2 text-sm text-gov-900 focus:outline-none focus:border-brand-primary"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="md" onClick={() => setStep('type')}>
              ← Back
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              disabled={description.trim().length < 5}
              onClick={() => setStep('media')}
            >
              Next: Add Media →
            </Button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* STEP 3: MEDIA */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {step === 'media' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gov-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-5 h-5 text-brand-primary" />
              <h3 className="text-sm font-extrabold text-gov-900">Photo / Video Evidence</h3>
            </div>
            <p className="text-xs text-gov-500 mb-4">
              Capture up to 5 items. Saved locally — uploads when network is restored.
            </p>

            {/* Upload buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {/* Hidden file inputs */}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />

              {attachments.length < 5 && (
                <>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-700 transition-all active:scale-95 cursor-pointer"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-xs font-bold">Camera Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700 transition-all active:scale-95 cursor-pointer"
                  >
                    <Video className="w-6 h-6" />
                    <span className="text-xs font-bold">Video Clip</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gov-300 bg-gov-50 hover:bg-gov-100 text-gov-600 transition-all active:scale-95 cursor-pointer"
                  >
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-xs font-bold">Gallery</span>
                  </button>
                </>
              )}
            </div>

            {/* Attachment Thumbnails */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gov-700 uppercase tracking-wider">
                  Attached Media ({attachments.length}/5)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {attachments.map(att => (
                    <div key={att.id} className="relative group rounded-xl overflow-hidden border border-gov-200 bg-gov-100 aspect-square">
                      {att.type === 'photo' ? (
                        <img
                          src={att.dataUrl}
                          alt={att.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-purple-50">
                          <FileVideo className="w-8 h-8 text-purple-500" />
                          <span className="text-[10px] font-mono text-purple-700 text-center px-1 truncate w-full text-center">
                            {att.name}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-md"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[9px] font-mono px-2 py-1 truncate">
                        {att.sizeLabel}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {attachments.length === 0 && (
              <div className="text-center py-6 text-gov-400">
                <Mic className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No media attached. You can skip this step.</p>
              </div>
            )}
          </div>

          <Card padding="sm" className="bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <HardDrive className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Photos and videos are stored locally in the app queue. They will upload automatically when network resumes — even large files are chunked safely.
            </span>
          </Card>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="md" onClick={() => setStep('details')}>
              ← Back
            </Button>
            <Button variant="primary" size="md" fullWidth onClick={() => setStep('review')}>
              Review Report →
            </Button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* STEP 4: REVIEW */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {step === 'review' && (
        <div className="space-y-4">
          <Card padding="lg" className="bg-white border border-gov-200 space-y-4">
            <h3 className="text-sm font-extrabold text-gov-900 uppercase tracking-wider border-b border-gov-100 pb-2">
              Report Summary — Confirm Before Submitting
            </h3>

            {/* Incident Type */}
            <div className="flex items-start gap-3">
              <span className="text-2xl">{selectedTypeInfo.icon}</span>
              <div>
                <span className="text-[10px] font-bold text-gov-500 uppercase tracking-wider">Incident Type</span>
                <p className="text-sm font-extrabold text-gov-900">{selectedTypeInfo.label}</p>
              </div>
            </div>

            {/* GPS */}
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-800 uppercase tracking-wider block mb-1">GPS Location</span>
              <p className="text-gov-800 font-semibold">{gpsLocation.locationName}</p>
              <p className="text-gov-500 font-mono mt-0.5">
                {gpsLocation.lat.toFixed(5)}, {gpsLocation.lng.toFixed(5)} · ±{gpsLocation.accuracy}m accuracy
              </p>
            </div>

            {/* Description */}
            <div>
              <span className="text-[10px] font-bold text-gov-500 uppercase tracking-wider block mb-1">Description</span>
              <p className="text-sm text-gov-800 leading-relaxed bg-gov-50 rounded-xl p-3 border border-gov-100">
                {description}
              </p>
            </div>

            {/* Severity + Road */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-gov-500 uppercase tracking-wider block mb-1">Observed Severity</span>
                <RiskBadge level={severityObserved} size="md" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gov-500 uppercase tracking-wider block mb-1">Road Blocked?</span>
                <span className={`px-2 py-1 rounded-full font-bold ${roadBlocked ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-gov-100 text-gov-600 border border-gov-200'}`}>
                  {roadBlocked ? `Yes — ${affectedRoadName || 'Road not specified'}` : 'No'}
                </span>
              </div>
            </div>

            {/* Media */}
            {attachments.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-gov-500 uppercase tracking-wider block mb-2">Attached Media</span>
                <div className="flex gap-2 flex-wrap">
                  {attachments.map(att => (
                    <div key={att.id} className="w-16 h-16 rounded-lg overflow-hidden border border-gov-200 bg-gov-100 relative">
                      {att.type === 'photo' ? (
                        <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-50">
                          <FileVideo className="w-5 h-5 text-purple-500" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="w-16 h-16 rounded-lg bg-gov-50 border border-gov-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-gov-500">{attachments.length} file(s)</span>
                  </div>
                </div>
              </div>
            )}

            {attachments.length === 0 && (
              <p className="text-xs text-gov-400 italic">No media attached.</p>
            )}
          </Card>

          {/* Warning banner */}
          <Card padding="sm" className="bg-amber-50 border border-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Offline Submission:</strong> This report will be queued locally and synced to HQ when network coverage is available. All data is preserved even if you close the app.
            </p>
          </Card>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="md" onClick={() => setStep('media')}>
              ← Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Queuing Report...' : 'Submit to Offline Queue'}
            </Button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full text-center text-xs text-gov-400 hover:text-gov-600 font-medium py-2 cursor-pointer"
          >
            Cancel and start over
          </button>
        </div>
      )}
    </div>
  );
};
