import { supabase } from '../lib/supabase';
import { LandslideEvent, RiskZone } from '../types';

export interface SupabaseLandslideEventRow {
  id: string;
  risk_zone_id: string;
  latitude: number;
  longitude: number;
  date: string;
  description: string;
}

/**
 * Fetches historical landslide events from Supabase and matches each event with its associated risk zone.
 */
export async function fetchSupabaseLandslideEvents(
  zones?: RiskZone[]
): Promise<{
  data: LandslideEvent[];
  error: string | null;
}> {
  try {
    const { data: rawEvents, error: eventsError } = await supabase
      .from('landslide_events')
      .select('id, risk_zone_id, latitude, longitude, date, description')
      .order('date', { ascending: false });

    if (eventsError) {
      return { data: [], error: `Failed to fetch landslide_events: ${eventsError.message}` };
    }

    if (!rawEvents || rawEvents.length === 0) {
      return { data: [], error: null };
    }

    const zoneMap = new Map<string, RiskZone>();
    if (zones && zones.length > 0) {
      zones.forEach((z) => zoneMap.set(z.id, z));
    }

    const transformed: LandslideEvent[] = (rawEvents as SupabaseLandslideEventRow[]).map((row) => {
      const matchedZone = zoneMap.get(row.risk_zone_id);

      return {
        id: row.id,
        location: matchedZone ? `${matchedZone.name}` : 'Regional Slope',
        riskZoneId: row.risk_zone_id,
        riskZoneName: matchedZone?.name || 'Monitored Sector',
        district: matchedZone?.district || 'Regional District',
        date: row.date,
        timestamp: row.date,
        latitude: row.latitude,
        longitude: row.longitude,
        severity: 'HIGH',
        description: row.description,
        notes: `Historical Event Recorded on ${row.date}`,
      };
    });

    return { data: transformed, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error during landslide events fetch';
    return { data: [], error: msg };
  }
}
