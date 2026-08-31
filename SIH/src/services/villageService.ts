import { supabase } from '../lib/supabase';
import { Village, RiskZone } from '../types';

export interface SupabaseVillageRow {
  id: string;
  risk_zone_id: string;
  name: string;
  population_exposure: number;
  latitude: number;
  longitude: number;
}

/**
 * Fetches villages from Supabase and matches each village with its associated risk zone.
 */
export async function fetchSupabaseVillages(
  zones?: RiskZone[]
): Promise<{
  data: Village[];
  error: string | null;
}> {
  try {
    const { data: rawVillages, error: villagesError } = await supabase
      .from('villages')
      .select('id, risk_zone_id, name, population_exposure, latitude, longitude');

    if (villagesError) {
      return { data: [], error: `Failed to fetch villages: ${villagesError.message}` };
    }

    if (!rawVillages || rawVillages.length === 0) {
      return { data: [], error: null };
    }

    const zoneMap = new Map<string, RiskZone>();
    if (zones && zones.length > 0) {
      zones.forEach((z) => zoneMap.set(z.id, z));
    }

    const transformed: Village[] = (rawVillages as SupabaseVillageRow[]).map((row) => {
      const matchedZone = zoneMap.get(row.risk_zone_id);

      return {
        id: row.id,
        name: row.name,
        district: matchedZone?.district || 'Monitored District',
        population: row.population_exposure ?? 0,
        populationExposure: row.population_exposure ?? 0,
        latitude: row.latitude,
        longitude: row.longitude,
        riskZoneId: row.risk_zone_id,
        nearestRiskZoneId: row.risk_zone_id,
        riskZoneName: matchedZone?.name || 'Monitored Sector',
        evacuationStatus: 'ADVISORY_ISSUED',
        isEvacuationReady: true,
        emergencyShelter: 'Designated Community Evacuation Centre',
      };
    });

    return { data: transformed, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error during villages fetch';
    return { data: [], error: msg };
  }
}
