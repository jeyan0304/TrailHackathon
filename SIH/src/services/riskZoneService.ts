import { supabase } from '../lib/supabase';
import { RiskZone, RiskLevel } from '../types';

export interface SupabaseRiskZoneRow {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  slope_angle: number;
  soil_moisture: number;
}

export interface SupabaseRiskAssessmentRow {
  id: string;
  risk_zone_id: string;
  risk_score: number;
  risk_level: string;
  contributing_factors: string[] | string | null;
  timestamp: string;
}

export interface SupabaseWeatherRow {
  id?: string;
  risk_zone_id: string;
  rainfall: number;
  rainfall_accumulation: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}

export interface SupabaseVillageRow {
  id: string;
  risk_zone_id: string;
  name: string;
  population_exposure: number;
  latitude: number;
  longitude: number;
}

export interface SupabaseInfrastructureRow {
  id: string;
  risk_zone_id: string;
  name: string;
  type: string;
  importance_score: number;
  latitude: number;
  longitude: number;
}

export interface SupabaseLandslideEventRow {
  id: string;
  risk_zone_id: string;
  latitude: number;
  longitude: number;
  date: string;
  description: string;
}

/**
 * Maps known Northeast India regions and districts based on zone name
 */
function resolveZoneLocation(name: string): { district: string; state: string } {
  const lower = name.toLowerCase();
  if (lower.includes('sikkim')) {
    return { district: 'East Sikkim', state: 'Sikkim' };
  }
  if (lower.includes('meghalaya')) {
    return { district: 'East Khasi Hills', state: 'Meghalaya' };
  }
  if (lower.includes('arunachal')) {
    return { district: 'West Kameng', state: 'Arunachal Pradesh' };
  }
  if (lower.includes('nagaland')) {
    return { district: 'Kohima', state: 'Nagaland' };
  }
  if (lower.includes('assam')) {
    return { district: 'Dima Hasao', state: 'Assam' };
  }
  if (lower.includes('mizoram')) {
    return { district: 'Aizawl', state: 'Mizoram' };
  }
  return { district: 'Central Hills', state: 'Northeast Region' };
}

function parseFactors(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((f) => String(f));
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((f) => String(f));
    } catch {
      return raw.includes(',') ? raw.split(',').map((s) => s.trim()) : [raw];
    }
  }
  return ['Heavy rainfall contributing to slope instability.'];
}

function normalizeRiskLevel(levelStr?: string): RiskLevel {
  const upper = (levelStr || '').toUpperCase().trim();
  if (upper === 'CRITICAL') return 'CRITICAL';
  if (upper === 'HIGH') return 'HIGH';
  if (upper === 'MODERATE' || upper === 'MEDIUM') return 'MODERATE';
  if (upper === 'LOW') return 'LOW';
  return 'MODERATE';
}

/**
 * Fetches risk_zones, matched with latest risk_assessments, latest weather_data, villages, infrastructure, and landslide events.
 */
export async function fetchSupabaseRiskZones(): Promise<{
  data: RiskZone[];
  error: string | null;
}> {
  try {
    // 1. Fetch risk_zones
    const { data: rawZones, error: zonesError } = await supabase
      .from('risk_zones')
      .select('id, name, latitude, longitude, slope_angle, soil_moisture');

    if (zonesError) {
      return { data: [], error: `Failed to fetch risk_zones: ${zonesError.message}` };
    }

    if (!rawZones || rawZones.length === 0) {
      return { data: [], error: null };
    }

    // 2. Fetch risk_assessments
    const { data: rawAssessments, error: assessmentsError } = await supabase
      .from('risk_assessments')
      .select('id, risk_zone_id, risk_score, risk_level, contributing_factors, timestamp');

    if (assessmentsError) {
      console.warn('Could not fetch risk_assessments:', assessmentsError.message);
    }

    // 3. Fetch weather_data
    const { data: rawWeather, error: weatherError } = await supabase
      .from('weather_data')
      .select('id, risk_zone_id, rainfall, rainfall_accumulation, temperature, humidity, timestamp')
      .order('timestamp', { ascending: false });

    if (weatherError) {
      console.warn('Could not fetch weather_data for zones:', weatherError.message);
    }

    // 4. Fetch villages
    const { data: rawVillages, error: villagesError } = await supabase
      .from('villages')
      .select('id, risk_zone_id, name, population_exposure, latitude, longitude');

    if (villagesError) {
      console.warn('Could not fetch villages for zones:', villagesError.message);
    }

    // 5. Fetch infrastructure
    const { data: rawInfra, error: infraError } = await supabase
      .from('infrastructure')
      .select('id, risk_zone_id, name, type, importance_score, latitude, longitude');

    if (infraError) {
      console.warn('Could not fetch infrastructure for zones:', infraError.message);
    }

    // 6. Fetch landslide_events
    const { data: rawEvents, error: eventsError } = await supabase
      .from('landslide_events')
      .select('id, risk_zone_id, latitude, longitude, date, description');

    if (eventsError) {
      console.warn('Could not fetch landslide_events for zones:', eventsError.message);
    }

    // 7. Map latest assessment per zone ID
    const latestAssessmentsByZoneId = new Map<string, SupabaseRiskAssessmentRow>();
    if (rawAssessments && rawAssessments.length > 0) {
      for (const assessment of rawAssessments as SupabaseRiskAssessmentRow[]) {
        const existing = latestAssessmentsByZoneId.get(assessment.risk_zone_id);
        if (!existing) {
          latestAssessmentsByZoneId.set(assessment.risk_zone_id, assessment);
        } else {
          const currentTime = new Date(assessment.timestamp).getTime();
          const existingTime = new Date(existing.timestamp).getTime();
          if (currentTime > existingTime) {
            latestAssessmentsByZoneId.set(assessment.risk_zone_id, assessment);
          }
        }
      }
    }

    // 8. Map latest weather per zone ID
    const latestWeatherByZoneId = new Map<string, SupabaseWeatherRow>();
    if (rawWeather && rawWeather.length > 0) {
      for (const weather of rawWeather as SupabaseWeatherRow[]) {
        if (!latestWeatherByZoneId.has(weather.risk_zone_id)) {
          latestWeatherByZoneId.set(weather.risk_zone_id, weather);
        }
      }
    }

    // 9. Group villages per zone ID
    const villagesByZoneId = new Map<string, SupabaseVillageRow[]>();
    if (rawVillages && rawVillages.length > 0) {
      for (const v of rawVillages as SupabaseVillageRow[]) {
        const list = villagesByZoneId.get(v.risk_zone_id) || [];
        list.push(v);
        villagesByZoneId.set(v.risk_zone_id, list);
      }
    }

    // 10. Group infrastructure per zone ID
    const infraByZoneId = new Map<string, SupabaseInfrastructureRow[]>();
    if (rawInfra && rawInfra.length > 0) {
      for (const inf of rawInfra as SupabaseInfrastructureRow[]) {
        const list = infraByZoneId.get(inf.risk_zone_id) || [];
        list.push(inf);
        infraByZoneId.set(inf.risk_zone_id, list);
      }
    }

    // 11. Group events per zone ID
    const eventsByZoneId = new Map<string, SupabaseLandslideEventRow[]>();
    if (rawEvents && rawEvents.length > 0) {
      for (const ev of rawEvents as SupabaseLandslideEventRow[]) {
        const list = eventsByZoneId.get(ev.risk_zone_id) || [];
        list.push(ev);
        eventsByZoneId.set(ev.risk_zone_id, list);
      }
    }

    // 12. Transform and match into frontend RiskZone format
    const transformed: RiskZone[] = (rawZones as SupabaseRiskZoneRow[]).map((zone) => {
      const assessment = latestAssessmentsByZoneId.get(zone.id);
      const weather = latestWeatherByZoneId.get(zone.id);
      const zoneVillages = villagesByZoneId.get(zone.id) || [];
      const zoneInfra = infraByZoneId.get(zone.id) || [];
      const zoneEvents = eventsByZoneId.get(zone.id) || [];

      const loc = resolveZoneLocation(zone.name);
      const factors = parseFactors(assessment?.contributing_factors);
      const riskLevel = normalizeRiskLevel(assessment?.risk_level);
      const riskScore = typeof assessment?.risk_score === 'number' ? assessment.risk_score : 50;

      const codeMatch = zone.name.match(/^(Zone\s+[A-Z0-9]+)/i);
      const code = codeMatch ? codeMatch[1] : zone.name.slice(0, 6);

      const rainfallAcc = weather?.rainfall_accumulation ?? 0;
      const rainfallRate = weather?.rainfall ?? 0;

      const nearbyVillages =
        zoneVillages.length > 0
          ? zoneVillages.map((v) => `${v.name} (${v.population_exposure} pop)`)
          : ['Monitored Settlements'];

      const criticalInfrastructure =
        zoneInfra.length > 0
          ? zoneInfra.map((i) => `${i.name} (${i.type})`)
          : ['Critical Regional Asset'];

      return {
        id: zone.id,
        name: zone.name,
        code,
        district: loc.district,
        state: loc.state,
        coordinates: {
          latitude: zone.latitude,
          longitude: zone.longitude,
        },
        latitude: zone.latitude,
        longitude: zone.longitude,
        slopeAngleDeg: zone.slope_angle,
        soilMoisturePercent: zone.soil_moisture,
        rainfallAccumulationMm: rainfallAcc,
        currentRainfallMmH: rainfallRate,
        riskScore,
        riskLevel,
        contributingFactors: factors,
        historicalEventsCount: zoneEvents.length,
        criticalInfrastructure,
        assessment: {
          id: assessment?.id,
          riskZoneId: zone.id,
          riskScore,
          riskLevel,
          timestamp: assessment?.timestamp || new Date().toISOString(),
          contributingFactors: factors,
          slopeAngleDeg: zone.slope_angle,
          soilMoisturePct: zone.soil_moisture,
          rainfallAccumulation24hMm: rainfallAcc,
          rainfallIntensityMm: rainfallRate,
          historicalLandslideCount: zoneEvents.length,
          isSimulated: true,
        },
        nearbyRoads: ['Regional Highway Corridor'],
        nearbyVillages,
        lastUpdated: assessment?.timestamp
          ? new Date(assessment.timestamp).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Live',
        isDemoData: true,
      };
    });

    return { data: transformed, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error during risk zone fetch';
    return { data: [], error: msg };
  }
}
