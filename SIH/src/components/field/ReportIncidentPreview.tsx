import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  Send,
  CheckCircle2,
  UploadCloud,
  Image as ImageIcon,
  X,
  FileText,
} from 'lucide-react';
import { ReportType, RiskLevel, CitizenReport } from '../../types';
import { Button } from '../common/Button';

export interface ReportIncidentPreviewProps {
  gpsLocation: {
    lat: number;
    lng: number;
    locationName: string;
    accuracy: number;
  };
  onSwitchToHistory: () => void;
  onSubmitReport: (
    report: Omit<CitizenReport, 'id' | 'isMockData' | 'syncStatus' | 'reporterName' | 'reporterId' | 'timestamp'>
  ) => void;
}

export const ReportIncidentPreview: React.FC<ReportIncidentPreviewProps> = ({
  gpsLocation,
  onSwitchToHistory,
  onSubmitReport,
}) => {
  const [reportType, setReportType] = useState<ReportType>('ROAD_BLOCKAGE');
  const [severity, setSeverity] = useState<RiskLevel>('HIGH');
  const [locationName, setLocationName] = useState(gpsLocation.locationName);
  const [description, setDescription] = useState('');
  const [roadBlocked, setRoadBlocked] = useState(true);
  const [affectedRoadName, setAffectedRoadName] = useState('NH-06 Shillong–Silchar Highway');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const reportTypes: Array<{ type: ReportType; label: string; desc: string }> = [
    { type: 'ROAD_BLOCKAGE', label: 'Road Blocked by Mud / Rocks', desc: 'Vehicles cannot pass or road is partly covered' },
    { type: 'CRACK', label: 'Large Ground or Road Crack', desc: 'Visible split in the asphalt, shoulder, or hillside' },
    { type: 'SLOPE_MOVEMENT', label: 'Hillside Shifting / Tilting Trees', desc: 'Soil creeping down, loose rocks rolling down' },
    { type: 'LANDSLIDE', label: 'Active Landslide / Collapse', desc: 'Major slope failure or mudslide happening right now' },
    { type: 'INFRASTRUCTURE_DAMAGE', label: 'Damaged Bridge / Wall / Drain', desc: 'Broken culvert, retaining wall, or bridge abutment' },
    { type: 'OTHER', label: 'Other Hazard', desc: 'Water overflowing or drainage choke' },
  ];

  const handleSimulatePhoto = () => {
    // Simulated field photo of mudslide
    setPhotoPreview('https://images.unsplash.com/photo-1584972191378-d70853fc47bc?w=800&auto=format&fit=crop&q=80');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoPreview(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitReport({
        reportType,
        latitude: gpsLocation.lat,
        longitude: gpsLocation.lng,
        locationName,
        description,
        photoUrl: photoPreview || undefined,
        status: 'PENDING_SYNC',
        reporterType: 'FieldOfficer',
        severityObserved: severity,
        roadBlocked,
        affectedRoadName: roadBlocked ? affectedRoadName || 'Local Route' : undefined,
        verificationStatus: 'VERIFIED',
      });
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onSwitchToHistory();
      }, 1500);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            Report a Hazard on the Ground
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit what you see. Works online or offline — saved automatically to your device.
          </p>
        </div>
        <Button
          variant="outline"
          size="xs"
          icon={<FileText className="w-3.5 h-3.5" />}
          onClick={onSwitchToHistory}
        >
          View Submitted Reports
        </Button>
      </div>

      {showSuccessToast && (
        <div className="bg-emerald-950 border border-emerald-700 text-emerald-200 p-4 rounded-xl flex items-center gap-3 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold">Report Saved Successfully!</h4>
            <p className="text-xs text-emerald-300">
              Your hazard report is safely stored on device and synced with Disaster Control.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-5">
        {/* 1. Incident Type Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            1. What kind of hazard did you see?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {reportTypes.map((item) => {
              const isSelected = reportType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setReportType(item.type)}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950 border-blue-500 text-blue-200 ring-1 ring-blue-500'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs">{item.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Observed Severity */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            2. How severe is the danger?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { lvl: 'CRITICAL' as const, label: 'Critical', sub: 'Road Blocked' },
              { lvl: 'HIGH' as const, label: 'High', sub: 'Active Slide' },
              { lvl: 'MODERATE' as const, label: 'Moderate', sub: 'Mud Runoff' },
              { lvl: 'LOW' as const, label: 'Low', sub: 'Minor Movement' },
            ].map(({ lvl, label, sub }) => {
              const isSelected = severity === lvl;
              const style = {
                LOW: isSelected ? 'bg-emerald-900 border-emerald-500 text-white font-bold' : 'bg-slate-950 text-slate-400 border-slate-800',
                MODERATE: isSelected ? 'bg-amber-900 border-amber-500 text-white font-bold' : 'bg-slate-950 text-slate-400 border-slate-800',
                HIGH: isSelected ? 'bg-orange-900 border-orange-500 text-white font-bold' : 'bg-slate-950 text-slate-400 border-slate-800',
                CRITICAL: isSelected ? 'bg-red-900 border-red-500 text-white font-bold' : 'bg-slate-950 text-slate-400 border-slate-800',
              }[lvl];

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSeverity(lvl)}
                  className={`p-2.5 rounded-lg border text-center transition-colors ${style}`}
                >
                  <div className="text-xs font-bold uppercase">{label}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. GPS & Location Verification */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            3. Location & Landmark
          </label>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Lat: {gpsLocation.lat.toFixed(4)}, Lng: {gpsLocation.lng.toFixed(4)}
              </span>
              <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded text-[10px]">
                GPS Locked ±{gpsLocation.accuracy}m
              </span>
            </div>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Near Sonapur Tunnel, East Jaintia Hills, or local landmark..."
              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>
        </div>

        {/* 4. Road Blockage Assessment */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Is the road blocked for vehicles?</span>
              <span className="text-[11px] text-slate-400">Can cars, buses, or emergency vehicles pass?</span>
            </div>
            <button
              type="button"
              onClick={() => setRoadBlocked(!roadBlocked)}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                roadBlocked ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {roadBlocked ? 'YES (ROAD BLOCKED)' : 'NO (ROAD PASSABLE)'}
            </button>
          </div>
          {roadBlocked && (
            <input
              type="text"
              value={affectedRoadName}
              onChange={(e) => setAffectedRoadName(e.target.value)}
              placeholder="e.g. NH-06 Shillong–Silchar Lifeline / SH-5 Sohra Highway"
              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
            />
          )}
        </div>

        {/* 5. Field Photo / Camera Capture */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            5. Take or Upload a Photo of the Hazard
          </label>

          {photoPreview ? (
            <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 max-h-56">
              <img src={photoPreview} alt="Field preview" className="w-full h-52 object-cover" />
              <button
                type="button"
                onClick={() => setPhotoPreview(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                Geo-tagged • {new Date().toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <label className="p-4 rounded-lg border-2 border-dashed border-slate-700 hover:border-slate-500 bg-slate-950/60 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors">
                <UploadCloud className="w-6 h-6 text-slate-400" />
                <span className="text-xs font-semibold text-slate-200">Take / Upload Photo</span>
                <span className="text-[10px] text-slate-500">Camera or gallery</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>

              <button
                type="button"
                onClick={handleSimulatePhoto}
                className="p-4 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 flex flex-col items-center justify-center gap-1.5 transition-colors text-slate-300 cursor-pointer"
              >
                <ImageIcon className="w-6 h-6 text-blue-400" />
                <span className="text-xs font-semibold text-slate-200">Use Sample Photo</span>
                <span className="text-[10px] text-slate-500">Debris & rock slide</span>
              </button>
            </div>
          )}
        </div>

        {/* 6. Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            6. What is happening? Describe what you see:
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Landslide has blocked the road near our village. Heavy mud and boulders are covering the lane. Vehicles cannot pass..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-4">
          <span className="text-[11px] text-slate-400">
            * Automatically cached on device if offline
          </span>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            icon={<Send className="w-4 h-4" />}
          >
            Submit Incident Report
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportIncidentPreview;
