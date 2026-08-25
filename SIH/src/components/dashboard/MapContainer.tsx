import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  Flame,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
} from 'lucide-react';
import { RiskZone } from '../../types';

interface MapContainerProps {
  zones: RiskZone[];
  selectedZoneId?: string;
  onSelectZone?: (zone: RiskZone) => void;
  className?: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
  className = '',
}) => {
  const [activeLayers, setActiveLayers] = useState({
    heatmap: true,
    roads: true,
    villages: true,
    reports: true,
    weather: false,
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className={`bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col overflow-hidden ${className}`}>
      {/* Map Top Bar: Title & Compact Layer Controls */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Regional GIS Risk Map
          </h3>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            • 25.5788° N, 91.8933° E
          </span>
        </div>

        {/* Compact Layer Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-400 font-medium mr-1 hidden md:inline flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Layers:
          </span>
          <button
            onClick={() => toggleLayer('heatmap')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              activeLayers.heatmap
                ? 'bg-slate-700 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Risk Heatmap
          </button>
          <button
            onClick={() => toggleLayer('roads')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              activeLayers.roads
                ? 'bg-slate-700 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Roads
          </button>
          <button
            onClick={() => toggleLayer('villages')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              activeLayers.villages
                ? 'bg-slate-700 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Villages
          </button>
          <button
            onClick={() => toggleLayer('reports')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              activeLayers.reports
                ? 'bg-slate-700 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Field Reports
          </button>
          <button
            onClick={() => toggleLayer('weather')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              activeLayers.weather
                ? 'bg-slate-700 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Rainfall Radar
          </button>
        </div>
      </div>

      {/* Main Map Visualization Centerpiece */}
      <div className="relative min-h-[480px] lg:min-h-[520px] bg-slate-950 flex flex-col items-center justify-center p-6 border-b border-slate-800 overflow-hidden select-none">
        {/* Clean Terrain Contour Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Monitored Zone Risk Markers */}
        <div className="absolute inset-0 p-8 flex flex-wrap items-center justify-around pointer-events-auto">
          {zones.map((zone, idx) => {
            const isSelected = selectedZoneId === zone.id;
            const level = zone.assessment.riskLevel;

            const markerStyle = {
              LOW: 'border-emerald-600 bg-slate-900/95 text-emerald-300 hover:border-emerald-400',
              MODERATE: 'border-amber-600 bg-slate-900/95 text-amber-300 hover:border-amber-400',
              HIGH: 'border-orange-600 bg-slate-900/95 text-orange-300 hover:border-orange-400',
              CRITICAL: 'border-red-600 bg-slate-900/95 text-red-300 hover:border-red-400 shadow-lg',
            }[level];

            return (
              <button
                key={zone.id}
                onClick={() => onSelectZone?.(zone)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all duration-150 cursor-pointer shadow-sm ${markerStyle} ${
                  isSelected ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-102'
                }`}
                style={{
                  transform: `translate(${(idx % 3 - 1) * 35}px, ${(Math.floor(idx / 3) - 0.5) * 25}px)`,
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {level === 'CRITICAL' && <Flame className="w-3.5 h-3.5 text-red-400" />}
                  {level === 'HIGH' && <AlertOctagon className="w-3.5 h-3.5 text-orange-400" />}
                  {level === 'MODERATE' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                  {level === 'LOW' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  <span className="font-semibold text-slate-100">{zone.code}</span>
                  <span className="ml-auto font-mono text-[11px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-200">
                    {zone.assessment.riskScore}
                  </span>
                </div>
                <div className="font-medium text-slate-200 truncate max-w-[180px]">
                  {zone.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Rain: {zone.assessment.rainfallAccumulation24hMm} mm • Slope: {zone.assessment.slopeAngleDeg}°
                </div>
              </button>
            );
          })}
        </div>

        {/* Center Notice */}
        <div className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-lg p-5 max-w-sm text-center shadow-lg backdrop-blur-sm">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            GIS Map Placeholder (Phase 3 Integration)
          </h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Click any zone pin to view terrain slope, rainfall accumulation, and contributing risk factors.
          </p>
        </div>

        {/* Bottom Left Minimal Legend */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300 shadow flex items-center gap-3.5 flex-wrap">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Risk Severity:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Low (0–30)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">Moderate (31–60)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-slate-300">High (61–80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-slate-300 font-medium">Critical (81–100)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
