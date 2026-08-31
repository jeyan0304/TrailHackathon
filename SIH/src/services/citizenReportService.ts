import { supabase } from '../lib/supabase';
import { CitizenReport, ReportType } from '../types';
import { MOCK_REPORTS } from '../data/mockData';

export interface SupabaseCitizenReportRow {
  id: string;
  reporter_id?: string | null;
  report_type: string;
  latitude: number;
  longitude: number;
  photo_url?: string | null;
  video_url?: string | null;
  description: string;
  verification_status?: string | null;
  timestamp: string;
}

const LOCAL_STORAGE_REPORTS_KEY = 'ner_safeslope_citizen_reports_cache';

/**
 * Loads cached client reports from storage or falls back to standard baseline reports.
 */
function getCachedReports(): CitizenReport[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Unable to read local reports cache:', e);
  }
  return MOCK_REPORTS;
}

/**
 * Persists reports in client cache for cross-view synchronization.
 */
function saveCachedReports(reports: CitizenReport[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
  } catch (e) {
    console.warn('Unable to save local reports cache:', e);
  }
}

export function normalizeReportType(typeRaw?: string): ReportType {
  const upper = (typeRaw || '').toUpperCase().trim();
  if (upper.includes('CRACK')) return 'CRACK';
  if (upper.includes('SLOPE') || upper.includes('MOVEMENT')) return 'SLOPE_MOVEMENT';
  if (upper.includes('ROAD') || upper.includes('BLOCK')) return 'ROAD_BLOCKAGE';
  if (upper.includes('LANDSLIDE')) return 'LANDSLIDE';
  if (upper.includes('INFRASTRUCTURE') || upper.includes('DAMAGE')) return 'INFRASTRUCTURE_DAMAGE';
  return 'OTHER';
}

export function normalizeVerificationStatus(statusRaw?: string): 'PENDING' | 'VERIFIED' | 'REJECTED' {
  const upper = (statusRaw || '').toUpperCase().trim();
  if (upper === 'VERIFIED') return 'VERIFIED';
  if (upper === 'REJECTED') return 'REJECTED';
  return 'PENDING';
}

/**
 * Human-readable terminology mapped strictly to PROJECT_SPEC.md conventions
 */
export function getHumanReadableReportType(typeRaw?: ReportType | string): string {
  const normalized = normalizeReportType(typeRaw);
  switch (normalized) {
    case 'ROAD_BLOCKAGE':
      return 'Road blockage';
    case 'CRACK':
      return 'Ground / rock crack';
    case 'SLOPE_MOVEMENT':
      return 'Slope movement';
    case 'LANDSLIDE':
      return 'Active landslide / rockfall';
    case 'INFRASTRUCTURE_DAMAGE':
      return 'Infrastructure damage';
    case 'OTHER':
    default:
      return 'Other hazard observation';
  }
}

/**
 * Human-readable verification status mapped strictly to PROJECT_SPEC.md conventions
 */
export function getHumanReadableVerificationStatus(statusRaw?: string): string {
  const normalized = normalizeVerificationStatus(statusRaw);
  switch (normalized) {
    case 'VERIFIED':
      return 'Verified by field team';
    case 'REJECTED':
      return 'Unverified / dismissed';
    case 'PENDING':
    default:
      return 'Awaiting verification';
  }
}

/**
 * Submits a new citizen / field report.
 * 1. Attempts Supabase insertion with existing columns.
 * 2. Synchronizes with client report repository to ensure instant visibility across Citizen, Field Officer, and Authority views.
 */
export async function submitSupabaseCitizenReport(report: {
  reportType: ReportType;
  latitude: number;
  longitude: number;
  description: string;
  photoUrl?: string | null;
  videoUrl?: string | null;
  locationName?: string;
  reporterRole?: 'FieldOfficer' | 'Citizen';
  reporterName?: string;
}): Promise<{
  data: CitizenReport | null;
  error: string | null;
  isLiveInserted: boolean;
}> {
  const role = report.reporterRole || 'Citizen';
  const isCitizen = role === 'Citizen';

  // 1. Resolve current authenticated Supabase user ID if active
  let reporterId: string | null = null;
  try {
    const { data: authData } = await supabase.auth.getUser();
    reporterId = authData?.user?.id || null;
  } catch {
    reporterId = null;
  }

  const payload = {
    reporter_id: reporterId,
    report_type: report.reportType,
    latitude: report.latitude,
    longitude: report.longitude,
    photo_url: report.photoUrl || null,
    video_url: report.videoUrl || null,
    description: report.description,
    verification_status: 'PENDING',
    timestamp: new Date().toISOString(),
  };

  let newReport: CitizenReport;
  let isLiveInserted = false;
  let insertErrorMsg: string | null = null;

  try {
    const { data: insertedRows, error: insertError } = await supabase
      .from('citizen_reports')
      .insert([payload])
      .select();

    if (insertError) {
      console.warn('Supabase citizen_reports insert notice:', insertError.message);
      insertErrorMsg = insertError.message;
    } else if (insertedRows && insertedRows[0]) {
      const inserted = insertedRows[0] as SupabaseCitizenReportRow;
      isLiveInserted = true;
      newReport = {
        id: inserted.id,
        reporterId: inserted.reporter_id || undefined,
        reporterName: report.reporterName || (isCitizen ? 'Citizen Sentinel' : 'Field Patrol Officer'),
        reporterRole: role,
        reporterType: role,
        reportType: normalizeReportType(inserted.report_type),
        description: inserted.description,
        latitude: inserted.latitude,
        longitude: inserted.longitude,
        locationName: report.locationName || `${inserted.latitude.toFixed(2)}°N, ${inserted.longitude.toFixed(2)}°E`,
        location: {
          name: report.locationName || `${inserted.latitude.toFixed(2)}°N, ${inserted.longitude.toFixed(2)}°E`,
          latitude: inserted.latitude,
          longitude: inserted.longitude,
        },
        photoUrl: inserted.photo_url || undefined,
        videoUrl: inserted.video_url || undefined,
        verificationStatus: normalizeVerificationStatus(inserted.verification_status || undefined),
        status: 'SUBMITTED',
        timestamp: new Date(inserted.timestamp).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }) + ' (Live Sync)',
        isOfflineSynced: false,
        isMockData: false,
      };

      // Save to client cache store
      const current = getCachedReports();
      saveCachedReports([newReport, ...current.filter((r) => r.id !== newReport.id)]);

      return { data: newReport, error: null, isLiveInserted: true };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Report submission exception';
    console.warn('Report submission exception:', msg);
    insertErrorMsg = msg;
  }

  // Local/Offline resilient report creation
  newReport = {
    id: `rep-${Date.now()}`,
    reporterId: reporterId || undefined,
    reporterName: report.reporterName || (isCitizen ? 'Citizen Sentinel' : 'Insp. Thendup Sangma'),
    reporterRole: role,
    reporterType: role,
    reportType: report.reportType,
    description: report.description,
    latitude: report.latitude,
    longitude: report.longitude,
    locationName: report.locationName || `${report.latitude.toFixed(2)}°N, ${report.longitude.toFixed(2)}°E`,
    location: {
      name: report.locationName || `${report.latitude.toFixed(2)}°N, ${report.longitude.toFixed(2)}°E`,
      latitude: report.latitude,
      longitude: report.longitude,
    },
    photoUrl: report.photoUrl || undefined,
    videoUrl: report.videoUrl || undefined,
    verificationStatus: 'PENDING',
    status: 'PENDING_SYNC',
    timestamp: new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' (Local Queue)',
    isOfflineSynced: false,
    isMockData: false,
  };

  const current = getCachedReports();
  saveCachedReports([newReport, ...current.filter((r) => r.id !== newReport.id)]);

  return {
    data: newReport,
    error: insertErrorMsg,
    isLiveInserted,
  };
}

/**
 * Fetches citizen & field reports from Supabase and synchronizes with local store.
 * Always merges live records with cached submissions so incoming reports are never lost.
 */
export async function fetchSupabaseCitizenReports(): Promise<{
  data: CitizenReport[];
  error: string | null;
}> {
  const cached = getCachedReports();

  try {
    const { data: rawReports, error: reportsError } = await supabase
      .from('citizen_reports')
      .select('id, reporter_id, report_type, latitude, longitude, photo_url, video_url, description, verification_status, timestamp')
      .order('timestamp', { ascending: false });

    if (reportsError) {
      console.warn('Supabase fetch notice:', reportsError.message);
      return { data: cached, error: `Supabase fetch notice: ${reportsError.message}` };
    }

    if (!rawReports || rawReports.length === 0) {
      return { data: cached, error: null };
    }

    const liveTransformed: CitizenReport[] = (rawReports as SupabaseCitizenReportRow[]).map((row) => {
      const type = normalizeReportType(row.report_type);
      const verificationStatus = normalizeVerificationStatus(row.verification_status || undefined);

      return {
        id: row.id,
        reporterId: row.reporter_id || undefined,
        reporterName: row.reporter_id ? `User (${row.reporter_id.slice(0, 8)})` : 'Citizen Sentinel',
        reporterRole: 'Citizen',
        reporterType: 'Citizen',
        reportType: type,
        description: row.description,
        latitude: row.latitude,
        longitude: row.longitude,
        locationName: `${row.latitude.toFixed(2)}°N, ${row.longitude.toFixed(2)}°E`,
        location: {
          name: `${row.latitude.toFixed(2)}°N, ${row.longitude.toFixed(2)}°E`,
          latitude: row.latitude,
          longitude: row.longitude,
        },
        photoUrl: row.photo_url || undefined,
        videoUrl: row.video_url || undefined,
        verificationStatus,
        status: verificationStatus === 'VERIFIED' ? 'SUBMITTED' : 'PENDING_SYNC',
        timestamp: row.timestamp
          ? new Date(row.timestamp).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            }) + ' (Live Sync)'
          : 'Live Sync',
        isOfflineSynced: false,
        isMockData: false,
      };
    });

    // Merge live reports with local cached reports (deduplicate by id)
    const liveIds = new Set(liveTransformed.map((r) => r.id));
    const merged = [
      ...liveTransformed,
      ...cached.filter((r) => !liveIds.has(r.id)),
    ];

    saveCachedReports(merged);
    return { data: merged, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error during citizen reports fetch';
    return { data: cached, error: msg };
  }
}

/**
 * Updates the verification status of a report in Supabase citizen_reports table and the local store.
 */
export async function updateSupabaseCitizenReportStatus(
  reportId: string,
  verificationStatus: 'VERIFIED' | 'REJECTED'
): Promise<{ success: boolean; error: string | null }> {
  // Update in local cache store immediately
  const current = getCachedReports();
  const updated = current.map((r) =>
    r.id === reportId
      ? {
          ...r,
          verificationStatus,
          status: 'SYNCED' as const,
          syncStatus: 'ONLINE' as const,
        }
      : r
  );
  saveCachedReports(updated);

  try {
    const { error } = await supabase
      .from('citizen_reports')
      .update({ verification_status: verificationStatus })
      .eq('id', reportId);

    if (error) {
      console.warn('Supabase citizen_reports status update notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating report status';
    console.warn('Status update exception:', msg);
    return { success: false, error: msg };
  }
}
