import { supabase } from '../lib/supabase';
import { Alert, RiskLevel, AlertStatus, RiskZone, Road, Village } from '../types';

export interface SupabaseAlertRow {
  id: string;
  risk_zone_id: string;
  severity: string;
  status: string;
  reason: string;
  affected_road_id?: string | null;
  affected_village_id?: string | null;
  recommended_response?: string | null;
  timestamp: string;
}

function normalizeAlertSeverity(rawSeverity?: string): RiskLevel {
  const upper = (rawSeverity || '').toUpperCase().trim();
  if (upper === 'CRITICAL') return 'CRITICAL';
  if (upper === 'HIGH') return 'HIGH';
  if (upper === 'MODERATE' || upper === 'MEDIUM') return 'MODERATE';
  if (upper === 'LOW') return 'LOW';
  return 'HIGH';
}

function normalizeAlertStatus(rawStatus?: string): AlertStatus {
  const upper = (rawStatus || '').toUpperCase().trim();
  if (upper === 'ACTIVE') return 'ACTIVE';
  if (upper === 'ACKNOWLEDGED') return 'ACKNOWLEDGED';
  if (upper === 'RESOLVED') return 'RESOLVED';
  return 'ACTIVE';
}

/**
 * Fetches alerts from Supabase and resolves matching risk zones, roads, and villages.
 */
export async function fetchSupabaseAlerts(
  zones?: RiskZone[],
  roads?: Road[],
  villages?: Village[]
): Promise<{
  data: Alert[];
  error: string | null;
}> {
  try {
    const { data: rawAlerts, error: alertsError } = await supabase
      .from('alerts')
      .select('id, risk_zone_id, severity, status, reason, affected_road_id, affected_village_id, recommended_response, timestamp')
      .order('timestamp', { ascending: false });

    if (alertsError) {
      return { data: [], error: `Failed to fetch alerts: ${alertsError.message}` };
    }

    if (!rawAlerts || rawAlerts.length === 0) {
      return { data: [], error: null };
    }

    const zoneMap = new Map<string, RiskZone>();
    if (zones && zones.length > 0) {
      zones.forEach((z) => zoneMap.set(z.id, z));
    }

    const roadMap = new Map<string, Road>();
    if (roads && roads.length > 0) {
      roads.forEach((r) => roadMap.set(r.id, r));
    }

    const villageMap = new Map<string, Village>();
    if (villages && villages.length > 0) {
      villages.forEach((v) => villageMap.set(v.id, v));
    }

    const transformed: Alert[] = (rawAlerts as SupabaseAlertRow[]).map((row) => {
      const severity = normalizeAlertSeverity(row.severity);
      const status = normalizeAlertStatus(row.status);
      const matchedZone = zoneMap.get(row.risk_zone_id);
      const matchedRoad = row.affected_road_id ? roadMap.get(row.affected_road_id) : undefined;
      const matchedVillage = row.affected_village_id ? villageMap.get(row.affected_village_id) : undefined;

      const affectedRoadName = matchedRoad?.name || (matchedZone ? `${matchedZone.code} Corridor` : 'Local Highway Route');
      const affectedVillageName = matchedVillage?.name || (matchedZone ? `${matchedZone.district} Sector` : 'Settlement Area');

      const title = `${severity} Warning: ${matchedZone?.name || 'Monitored Sector'}`;
      const location = matchedZone ? `${matchedZone.name} (${matchedZone.district}, ${matchedZone.state})` : 'Northeast Corridor';

      const factors = matchedZone?.contributingFactors || [
        row.reason,
        'Active geological fault & saturated regolith layers',
      ];

      return {
        id: row.id,
        severity,
        riskScore: severity === 'CRITICAL' ? 88 : severity === 'HIGH' ? 72 : severity === 'MODERATE' ? 48 : 25,
        title,
        location,
        zoneId: row.risk_zone_id,
        riskZoneId: row.risk_zone_id,
        riskZoneName: matchedZone?.name,
        timestamp: row.timestamp
          ? new Date(row.timestamp).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            }) + ' (Live Sync)'
          : 'Live Sync',
        reason: row.reason,
        contributingFactors: factors,
        affectedRoads: [affectedRoadName],
        affectedVillages: [affectedVillageName],
        affectedRoad: affectedRoadName,
        affectedVillage: affectedVillageName,
        affectedRoadId: row.affected_road_id || undefined,
        affectedVillageId: row.affected_village_id || undefined,
        recommendedAction: row.recommended_response || 'Initiate rapid response patrol and inspect drainage culverts.',
        recommendedResponse: row.recommended_response || 'Initiate rapid response patrol and inspect drainage culverts.',
        status,
        isDemoData: true,
        isDemoAlert: true,
      };
    });

    return { data: transformed, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error during alerts fetch';
    return { data: [], error: msg };
  }
}
