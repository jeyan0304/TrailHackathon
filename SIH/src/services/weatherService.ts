import { supabase } from '../lib/supabase';
import { WeatherData, RiskZone } from '../types';

export interface SupabaseWeatherRow {
  id?: string;
  risk_zone_id: string;
  rainfall: number;
  rainfall_accumulation: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}

export interface ZoneWeatherSummary {
  riskZoneId: string;
  zoneName: string;
  rainfall: number;
  rainfallAccumulation: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}

/**
 * Fetches weather_data from Supabase, matching each risk zone with its latest record by timestamp DESC.
 */
export async function fetchSupabaseWeatherData(
  zones?: RiskZone[]
): Promise<{
  weatherList: ZoneWeatherSummary[];
  summaryWeather: WeatherData | null;
  error: string | null;
}> {
  try {
    // 1. Fetch raw weather_data
    const { data: rawWeather, error: weatherError } = await supabase
      .from('weather_data')
      .select('id, risk_zone_id, rainfall, rainfall_accumulation, temperature, humidity, timestamp')
      .order('timestamp', { ascending: false });

    if (weatherError) {
      return {
        weatherList: [],
        summaryWeather: null,
        error: `Failed to fetch weather_data: ${weatherError.message}`,
      };
    }

    if (!rawWeather || rawWeather.length === 0) {
      return { weatherList: [], summaryWeather: null, error: null };
    }

    // 2. Build map of latest weather record per risk_zone_id
    const latestByZoneId = new Map<string, SupabaseWeatherRow>();

    for (const record of rawWeather as SupabaseWeatherRow[]) {
      if (!latestByZoneId.has(record.risk_zone_id)) {
        latestByZoneId.set(record.risk_zone_id, record);
      }
    }

    // 3. Map zone names if zones provided
    const zoneMap = new Map<string, RiskZone>();
    if (zones && zones.length > 0) {
      zones.forEach((z) => zoneMap.set(z.id, z));
    }

    const weatherList: ZoneWeatherSummary[] = Array.from(latestByZoneId.values()).map(
      (record) => {
        const matchedZone = zoneMap.get(record.risk_zone_id);
        return {
          riskZoneId: record.risk_zone_id,
          zoneName: matchedZone?.name || `Zone ${record.risk_zone_id.slice(0, 8)}`,
          rainfall: record.rainfall ?? 0,
          rainfallAccumulation: record.rainfall_accumulation ?? 0,
          temperature: record.temperature ?? 22,
          humidity: record.humidity ?? 80,
          timestamp: record.timestamp,
        };
      }
    );

    // 4. Construct overall/focal weather summary (highest accumulation zone or first record)
    const sortedByRain = [...weatherList].sort(
      (a, b) => b.rainfallAccumulation - a.rainfallAccumulation
    );
    const topWeather = sortedByRain[0];

    const summaryWeather: WeatherData | null = topWeather
      ? {
          id: `weather-${topWeather.riskZoneId}`,
          location: `${topWeather.zoneName} Doppler Radar`,
          rainfallMm: topWeather.rainfall,
          rainfallCurrentMm: topWeather.rainfall,
          rainfallAccumulation24hMm: topWeather.rainfallAccumulation,
          rainfallTrend: topWeather.rainfall > 10 ? 'RISING' : 'STABLE',
          temperatureC: topWeather.temperature,
          humidityPct: topWeather.humidity,
          windSpeedKmh: 18,
          timestamp: topWeather.timestamp,
          isSimulated: true,
        }
      : null;

    return { weatherList, summaryWeather, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error during weather data fetch';
    return { weatherList: [], summaryWeather: null, error: msg };
  }
}
