import React, { useState, useEffect } from 'react';
import { Road, RoadStatus } from '../types';
import { DEMO_ROADS, DEMO_RISK_ZONES } from '../data/mockData';
import { fetchSupabaseRoads } from '../services/roadService';
import { fetchSupabaseRiskZones } from '../services/riskZoneService';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import {
  Route,
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Database,
  MapPin,
  Sparkles,
  Search,
  Filter,
  X,
  Compass,
  Layers,
} from 'lucide-react';

export const RoadsPage: React.FC = () => {
  const [roads, setRoads] = useState<Road[]>([]);
  const [selectedRoad, setSelectedRoad] = useState<Road | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<RoadStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadRoadsData() {
      setIsLoading(true);
      setErrorMessage(null);

      const { data: zonesData } = await fetchSupabaseRiskZones();

      const { data: roadsData, error: roadsErr } = await fetchSupabaseRoads(
        zonesData && zonesData.length > 0 ? zonesData : DEMO_RISK_ZONES
      );

      if (!isMounted) return;

      if (roadsErr) {
        setErrorMessage(roadsErr);
        setRoads(DEMO_ROADS);
      } else if (roadsData && roadsData.length > 0) {
        setRoads(roadsData);
        setIsSupabaseLive(true);
      } else {
        setRoads(DEMO_ROADS);
      }
      setIsLoading(false);
    }

    loadRoadsData();
    return () => {
      isMounted = false;
    };
  }, []);

  const statusBadge = (status: RoadStatus) => {
    switch (status) {
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-red-950 text-red-300 border border-red-700">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            BLOCKED
          </span>
        );
      case 'RESTRICTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            RESTRICTED
          </span>
        );
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            OPEN / PASSABLE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            UNKNOWN
          </span>
        );
    }
  };

  const filteredRoads = roads.filter((road) => {
    if (selectedStatus !== 'ALL' && road.status !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = road.name.toLowerCase().includes(q);
      const matchesCode = road.code.toLowerCase().includes(q);
      const matchesSector = (road.riskZoneName || '').toLowerCase().includes(q);
      const matchesReason = (road.restrictionReason || '').toLowerCase().includes(q);
      if (!matchesName && !matchesCode && !matchesSector && !matchesReason) {
        return false;
      }
    }
    return true;
  });

  const totalRoads = roads.length;
  const blockedCount = roads.filter((r) => r.status === 'BLOCKED').length;
  const restrictedCount = roads.filter((r) => r.status === 'RESTRICTED').length;
  const openCount = roads.filter((r) => r.status === 'OPEN').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              HIGHWAY INFRASTRUCTURE & PASSABILITY NETWORK
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Route className="w-6 h-6 text-amber-400" />
            Arterial Road Network & Passability
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time highway passability, active blockage reports, debris flow warnings, and emergency transit corridor clearance.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isSupabaseLive && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800 text-xs font-mono text-blue-300">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>SUPABASE LIVE</span>
            </div>
          )}
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-semibold font-mono">
            DEMO DATA (SIMULATED)
          </span>
        </div>
      </div>

      {/* Error State Banner */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-800 text-xs text-amber-300">
          <span className="font-bold">Notice:</span> {errorMessage}. Showing cached baseline network data.
        </div>
      )}

      {/* Highway Passability KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Monitored Corridors"
          value={totalRoads}
          subValue="highways & links"
          statusText="Active Regional Grid"
          supportingMetric="Surveillance across all sectors"
          severity="info"
          icon={<Layers className="w-5 h-5 text-sky-400" />}
        />

        <StatCard
          label="Blocked Corridors"
          value={blockedCount}
          subValue="transit suspended"
          statusText={blockedCount > 0 ? `${blockedCount} Critical Blockages` : 'Zero Blockages'}
          supportingMetric="Immediate clearance mobilization"
          severity={blockedCount > 0 ? 'CRITICAL' : 'LOW'}
          icon={<AlertOctagon className="w-5 h-5 text-red-500" />}
        />

        <StatCard
          label="Restricted Corridors"
          value={restrictedCount}
          subValue="single-lane caution"
          statusText={restrictedCount > 0 ? `${restrictedCount} Routes Restricted` : 'No Restrictions'}
          supportingMetric="Speed controls and escort active"
          severity={restrictedCount > 0 ? 'MODERATE' : 'LOW'}
          icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
        />

        <StatCard
          label="Open & Passable"
          value={openCount}
          subValue="routine surveillance"
          statusText="Clear Passability"
          supportingMetric="Normal vehicular transit"
          severity="LOW"
          icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status Filter:
            </span>
            {(['ALL', 'BLOCKED', 'RESTRICTED', 'OPEN', 'UNKNOWN'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-slate-400">
            Showing {filteredRoads.length} of {roads.length} corridors
          </div>
        </div>

        {/* Search Input */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search highways by route code (e.g., NH-06), corridor name, or monitored risk sector..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Road Cards Grid */}
      {isLoading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Fetching arterial highway status and passability telemetry...</p>
        </div>
      ) : filteredRoads.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-12 text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
          <h3 className="text-sm font-bold text-slate-200">No road corridors match this filter</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try resetting your search query or selecting a different status filter to view all arterial routes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {filteredRoads.map((road) => {
            const isBlocked = road.status === 'BLOCKED';
            const isRestricted = road.status === 'RESTRICTED';

            return (
              <div
                key={road.id}
                onClick={() => setSelectedRoad(road)}
                className={`bg-slate-900 rounded-xl border p-4 space-y-3 hover:bg-slate-800/60 transition-all cursor-pointer shadow-sm ${
                  isBlocked
                    ? 'border-red-800/80 bg-red-950/15 border-l-4 border-l-red-500'
                    : isRestricted
                    ? 'border-amber-800/80 bg-amber-950/10 border-l-4 border-l-amber-500'
                    : 'border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {road.code}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 font-mono">
                        {road.type || 'Highway Route'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 truncate">
                      {road.name}
                    </h3>
                  </div>

                  <div className="shrink-0">{statusBadge(road.status)}</div>
                </div>

                {/* Restriction Reason */}
                {road.restrictionReason && (
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                    {road.restrictionReason}
                  </p>
                )}

                {/* Sector and Coordinates */}
                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  {road.riskZoneName && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="text-slate-300 font-medium">Sector: {road.riskZoneName}</span>
                    </div>
                  )}

                  {road.latitude && road.longitude && (
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                      <Compass className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{road.latitude.toFixed(2)}°N, {road.longitude.toFixed(2)}°E</span>
                    </div>
                  )}
                </div>

                {/* Footer Metrics */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  {typeof road.importanceScore === 'number' && (
                    <span className="flex items-center gap-1 text-amber-300 font-semibold">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Priority: {road.importanceScore}/100
                    </span>
                  )}
                  <span className="text-blue-400 hover:underline">View Corridor</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Road Detail Modal */}
      {selectedRoad && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRoad(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {selectedRoad.code}
                  </span>
                  {statusBadge(selectedRoad.status)}
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-1">
                  {selectedRoad.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRoad.type || 'Arterial Corridor'} • Connected to {selectedRoad.riskZoneName || 'Monitored Sector'}
                </p>
              </div>

              <button
                onClick={() => setSelectedRoad(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Operational Situation */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                Passability & Condition Report:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedRoad.restrictionReason || 'Standard operational parameters maintained across all segments.'}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400">Importance Priority</span>
                <div className="text-base font-bold text-amber-300 font-mono">
                  {selectedRoad.importanceScore ?? 50} / 100
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400">Coordinates</span>
                <div className="text-xs font-bold text-slate-200 font-mono truncate">
                  {selectedRoad.latitude && selectedRoad.longitude
                    ? `${selectedRoad.latitude.toFixed(2)}°N, ${selectedRoad.longitude.toFixed(2)}°E`
                    : 'Verified Live'}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedRoad(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setSelectedRoad(null)}
              >
                Acknowledge Corridor Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadsPage;
