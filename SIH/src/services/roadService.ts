import { supabase } from '../lib/supabase';
import { Road, RoadStatus, RiskZone } from '../types';

export interface SupabaseRoadRow {
  id: string;
  risk_zone_id: string;
  name: string;
  status: string;
  importance_score: number;
  latitude: number;
  longitude: number;
}

function normalizeRoadStatus(statusRaw?: string): RoadStatus {
  const upper = (statusRaw || '').toUpperCase().trim();
  if (upper === 'OPEN') return 'OPEN';
  if (upper === 'RESTRICTED') return 'RESTRICTED';
  if (upper === 'BLOCKED') return 'BLOCKED';
  return 'UNKNOWN';
}

function getRoadStatusReason(status: RoadStatus, roadName: string): string {
  switch (status) {
    case 'BLOCKED':
      return `Debris and slope sliding obstructing carriageway on ${roadName}. Vehicular transit suspended.`;
    case 'RESTRICTED':
      return `Single-lane passage operational on ${roadName}. Speed limit enforced due to heavy rainfall precautions.`;
    case 'OPEN':
      return `All lanes clear and passable with routine surveillance on ${roadName}.`;
    case 'UNKNOWN':
    default:
      return `Passability status awaiting recent on-ground inspection for ${roadName}.`;
  }
}

/**
 * Fetches roads from Supabase and matches each road with its associated risk zone.
 */
export async function fetchSupabaseRoads(
  zones?: RiskZone[]
): Promise<{
  data: Road[];
  error: string | null;
}> {
  try {
    const { data: rawRoads, error: roadsError } = await supabase
      .from('roads')
      .select('id, risk_zone_id, name, status, importance_score, latitude, longitude');

    if (roadsError) {
      return { data: [], error: `Failed to fetch roads: ${roadsError.message}` };
    }

    if (!rawRoads || rawRoads.length === 0) {
      return { data: [], error: null };
    }

    const zoneMap = new Map<string, RiskZone>();
    if (zones && zones.length > 0) {
      zones.forEach((z) => zoneMap.set(z.id, z));
    }

    const transformed: Road[] = (rawRoads as SupabaseRoadRow[]).map((row) => {
      const status = normalizeRoadStatus(row.status);
      const matchedZone = zoneMap.get(row.risk_zone_id);

      const codeMatch = row.name.match(/^([A-Za-z0-9\-]+)/);
      const code = codeMatch ? codeMatch[1] : 'RD';

      const type: Road['type'] = row.name.startsWith('NH')
        ? 'National Highway'
        : row.name.startsWith('SH')
        ? 'State Highway'
        : 'District Road';

      return {
        id: row.id,
        code,
        name: row.name,
        type,
        status,
        importanceScore: row.importance_score ?? 50,
        latitude: row.latitude,
        longitude: row.longitude,
        linkedRiskZoneId: row.risk_zone_id,
        riskZoneId: row.risk_zone_id,
        riskZoneName: matchedZone?.name || 'Monitored Sector',
        affectedSegment: matchedZone ? `${matchedZone.name}` : 'Regional Segment',
        restrictionReason: getRoadStatusReason(status, row.name),
        lastInspectionTime: 'Live Verification',
        passabilityNotes: `Importance Priority: ${row.importance_score ?? 50}/100`,
      };
    });

    return { data: transformed, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error during roads fetch';
    return { data: [], error: msg };
  }
}
