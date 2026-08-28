import React from 'react';
import { WeatherData } from '../../types';
import {
  CloudRain,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

interface WeatherSummaryCardProps {
  weather: WeatherData;
  className?: string;
}

export const WeatherSummaryCard: React.FC<WeatherSummaryCardProps> = ({
  weather,
  className = '',
}) => {
  const trend = weather.rainfallTrend || 'RISING';
  const trendIcon = {
    RISING: <TrendingUp className="w-3.5 h-3.5 text-red-400" />,
    FALLING: <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />,
    STABLE: <Minus className="w-3.5 h-3.5 text-slate-400" />,
  }[trend];

  return (
    <div className={`bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Precipitation & Weather
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            (DEMO FEED)
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Prominent 24h Rainfall Spotlight */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-semibold text-slate-400">
              24h Rainfall Accumulation
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold font-mono text-blue-400 tracking-tight">
                {weather.rainfallAccumulation24hMm}
              </span>
              <span className="text-sm text-slate-300 font-semibold">mm</span>
              {weather.rainfallAccumulation72hMm && (
                <span className="text-xs text-slate-500 ml-2 font-mono">
                  (72h: {weather.rainfallAccumulation72hMm} mm)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-200 font-semibold px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            {trendIcon}
            <span>Rainfall {trend.toLowerCase()}</span>
          </div>
        </div>

        {/* Visually Quieter Secondary Weather Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono pt-1">
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Current Rate</span>
            <span className="text-slate-200 font-bold mt-0.5 block">{weather.rainfallCurrentMm ?? weather.rainfallMm ?? 0} mm/h</span>
          </div>

          <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Humidity</span>
            <span className="text-slate-200 font-bold mt-0.5 block">{weather.humidityPct ?? weather.humidityPercent ?? 0}%</span>
          </div>

          <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Temp</span>
            <span className="text-slate-200 font-bold mt-0.5 block">{weather.temperatureC}°C</span>
          </div>

          <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Wind</span>
            <span className="text-slate-200 font-bold mt-0.5 block">{weather.windSpeedKmh} km/h</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center font-mono">
          Radar Station: {weather.location}
        </p>
      </div>
    </div>
  );
};

export default WeatherSummaryCard;
