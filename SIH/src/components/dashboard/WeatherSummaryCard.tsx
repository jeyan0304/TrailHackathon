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
  const trendIcon = {
    RISING: <TrendingUp className="w-3.5 h-3.5 text-red-400" />,
    FALLING: <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />,
    STABLE: <Minus className="w-3.5 h-3.5 text-slate-400" />,
  }[weather.rainfallTrend];

  return (
    <div className={`bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900">
        <div className="flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Weather Summary
          </h3>
          <span className="text-xs text-slate-400">
            (Simulated)
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Rainfall Spotlight */}
        <div className="bg-slate-950/70 rounded p-3 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-medium text-slate-400">
              24h Rainfall Accumulation
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold font-mono text-blue-400">
                {weather.rainfallAccumulation24hMm}
              </span>
              <span className="text-xs text-slate-400">mm</span>
              <span className="text-xs text-slate-500 ml-2">
                (72h: {weather.rainfallAccumulation72hMm} mm)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-300 font-medium px-2 py-1 rounded bg-slate-900 border border-slate-800">
            {trendIcon}
            <span>Rainfall {weather.rainfallTrend.toLowerCase()}</span>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Current Intensity</span>
            <span className="text-slate-200 font-semibold font-mono mt-0.5 block">{weather.rainfallCurrentMm} mm/h</span>
          </div>

          <div className="p-2 rounded bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Humidity</span>
            <span className="text-slate-200 font-semibold font-mono mt-0.5 block">{weather.humidityPct}%</span>
          </div>

          <div className="p-2 rounded bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Temperature</span>
            <span className="text-slate-200 font-semibold font-mono mt-0.5 block">{weather.temperatureC}°C</span>
          </div>

          <div className="p-2 rounded bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Wind Speed</span>
            <span className="text-slate-200 font-semibold font-mono mt-0.5 block">{weather.windSpeedKmh} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
