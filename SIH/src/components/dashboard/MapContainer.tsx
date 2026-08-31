import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  Flame,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Database,
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

  // Compute normalized geographic positioning for markers based on real Supabase coordinates
  const lats = zones.map((z) => z.coordinates?.latitude ?? z.latitude ?? 26.0);
  const lngs = zones.map((z) => z.coordinates?.longitude ?? z.longitude ?? 91.5);

  const minLat = lats.length > 0 ? Math.min(...lats) : 25.0;
  const maxLat = lats.length > 0 ? Math.max(...lats) : 28.0;
  const minLng = lngs.length > 0 ? Math.min(...lngs) : 88.0;
  const maxLng = lngs.length > 0 ? Math.max(...lngs) : 95.0;

  const latSpan = maxLat - minLat || 1;
  const lngSpan = maxLng - minLng || 1;

  return (
    <div className={`bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex flex-col overflow-hidden ${className}`}>
      {/* Map Top Bar: Title, Coordinate Breadcrumbs & Layer Controls */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Regional GIS Risk Map
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-[10px] font-mono text-blue-300">
            <Database className="w-3 h-3 text-blue-400" />
            <span>4 SUPABASE ZONES (DEMO)</span>
          </div>
        </div>

        {/* Compact Layer Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-400 font-medium mr-1 hidden md:inline-flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Layers:
          </span>
          <button
            type="button"
            onClick={() => toggleLayer('heatmap')}
            className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
              activeLayers.heatmap
                ? 'bg-slate-700 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Risk Heatmap
          </button>
          <button
            type="button"
            onClick={() => toggleLayer('roads')}
            className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
              activeLayers.roads
                ? 'bg-slate-700 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Roads
          </button>
          <button
            type="button"
            onClick={() => toggleLayer('villages')}
            className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
              activeLayers.villages
                ? 'bg-slate-700 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Villages
          </button>
          <button
            type="button"
            onClick={() => toggleLayer('reports')}
            className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
              activeLayers.reports
                ? 'bg-slate-700 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Field Reports
          </button>
          <button
            type="button"
            onClick={() => toggleLayer('weather')}
            className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
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
        {/* Terrain Contour Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Heatmap Layer Visual Glow (if enabled) */}
        {activeLayers.heatmap && (
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-red-600 blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-orange-600 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-amber-600 blur-3xl" />
          </div>
        )}

        {/* 4 Real Supabase Risk Zone Markers positioned via Latitude / Longitude */}
        <div className="absolute inset-0 p-6 pointer-events-auto">
          {zones.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            const level = zone.riskLevel || zone.assessment?.riskLevel || 'MODERATE';
            const score = zone.riskScore ?? zone.assessment?.riskScore ?? 50;
            const slope = zone.slopeAngleDeg ?? zone.assessment?.slopeAngleDeg ?? 30;
            const soil = zone.soilMoisturePercent ?? zone.assessment?.soilMoisturePct ?? 0;

            const lat = zone.coordinates?.latitude ?? zone.latitude ?? 26.0;
            const lng = zone.coordinates?.longitude ?? zone.longitude ?? 91.5;

            // Map geographic coordinates to canvas percentage [10%, 82%]
            const leftPercent = 10 + ((lng - minLng) / lngSpan) * 65;
            const topPercent = 12 + ((maxLat - lat) / latSpan) * 68;

            const markerBorder = {
              LOW: 'border-emerald-600 bg-slate-900/95 text-emerald-300 hover:border-emerald-400',
              MODERATE: 'border-amber-600 bg-slate-900/95 text-amber-300 hover:border-amber-400',
              HIGH: 'border-orange-600 bg-slate-900/95 text-orange-300 hover:border-orange-400',
              CRITICAL: 'border-red-600 bg-slate-900/95 text-red-300 hover:border-red-400 shadow-lg',
            }[level];

            return (
              <div
                key={zone.id}
                style={{
                  position: 'absolute',
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="z-20 transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => onSelectZone?.(zone)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all duration-150 cursor-pointer shadow-md backdrop-blur-sm ${markerBorder} ${
                    isSelected
                      ? 'ring-2 ring-blue-500 scale-110 shadow-blue-500/20'
                      : 'hover:scale-105'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {level === 'CRITICAL' && <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                    {level === 'HIGH' && <AlertOctagon className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                    {level === 'MODERATE' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    {level === 'LOW' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    
                    <span className="font-bold text-slate-100 tracking-tight">
                      {zone.code || zone.name.split('-')[0]?.trim()}
                    </span>

                    <span className="ml-auto font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">
                      {score}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-200 text-[11px] truncate max-w-[170px]">
                    {zone.name}
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                    <span>{lat.toFixed(2)}°N, {lng.toFixed(2)}°E</span>
                  </div>

                  <div className="text-[10px] text-slate-400 mt-0.5 pt-1 border-t border-slate-800/80">
                    Slope: <strong className="text-slate-300">{slope}°</strong> • Sat: <strong className="text-slate-300">{soil}%</strong>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Center Orientation Info Banner */}
        <div className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-xl p-4 max-w-xs text-center shadow-lg backdrop-blur-sm pointer-events-none mt-20 sm:mt-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Northeast Regional GIS Surveillance
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            4 Supabase risk sectors mapped by live coordinates. Click any sector pin to inspect detailed slope & risk telemetry.
          </p>
        </div>

        {/* Bottom Left Minimal Legend */}
        <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 shadow flex items-center gap-3.5 flex-wrap z-30">
          <span className="text-[10px] uppercase font-bold text-slate-400">Risk Severity:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300 text-[11px]">Low (0–30)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300 text-[11px]">Moderate (31–60)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-300 text-[11px]">High (61–80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-slate-300 text-[11px] font-bold">Critical (81–100)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
