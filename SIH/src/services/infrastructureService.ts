import { supabase } from '../lib/supabase';
import { Infrastructure, RiskZone } from '../types';

export interface SupabaseInfrastructureRow {
  id: string;
  risk_zone_id: string;
  name: string;
  type: string;
  importance_score: number;
  latitude: number;
  longitude: number;
}

/**
 * Fetches infrastructure assets from Supabase and matches each asset with its associated risk zone.
 */
export async function fetchSupabaseInfrastructure(
  zones?: RiskZone[]
): Promise<{
  data: Infrastructure[];
  error: string | null;
}> {
  try {
    const { data: rawInfra, error: infraError } = await supabase
      .from('infrastructure')
      .select('id, risk_zone_id, name, type, importance_score, latitude, longitude');

    if (infraError) {
      return { data: [], error: `Failed to fetch infrastructure: ${infraError.message}` };
    }

    if (!rawInfra || rawInfra.length === 0) {
      return { data: [], error: null };
    }

    const zoneMap = new Map<string, RiskZone>();
    if (zones && zones.length > 0) {
      zones.forEach((z) => zoneMap.set(z.id, z));
    }

    const transformed: Infrastructure[] = (rawInfra as SupabaseInfrastructureRow[]).map((row) => {
      const matchedZone = zoneMap.get(row.risk_zone_id);

      return {
        id: row.id,
        name: row.name,
        type: row.type,
        importanceScore: row.importance_score ?? 50,
        latitude: row.latitude,
        longitude: row.longitude,
        location: matchedZone ? `${matchedZone.district}, ${matchedZone.state}` : 'Monitored Corridor',
        status: 'MONITORED',
        vulnerabilityStatus: row.importance_score > 75 ? 'CRITICAL_RISK' : 'AT_RISK',
        linkedRiskZoneId: row.risk_zone_id,
        riskZoneId: row.risk_zone_id,
        riskZoneName: matchedZone?.name || 'Monitored Sector',
      };
    });

    return { data: transformed, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error during infrastructure fetch';
    return { data: [], error: msg };
  }
}
