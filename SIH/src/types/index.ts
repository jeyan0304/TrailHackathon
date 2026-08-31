/**
 * NER-SafeSlope Core Type Definitions
 * Unified domain models supporting District Authority, Field Officer, and Citizen Portals
 * Adheres strictly to CONVENTIONS.md & PROJECT_SPEC.md
 */

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export type RoadStatus = 'OPEN' | 'RESTRICTED' | 'BLOCKED' | 'UNKNOWN';

export type ReportType =
  | 'CRACK'
  | 'SLOPE_MOVEMENT'
  | 'ROAD_BLOCKAGE'
  | 'LANDSLIDE'
  | 'INFRASTRUCTURE_DAMAGE'
  | 'OTHER';

export type ConnectionStatus = 'ONLINE' | 'SYNCING' | 'OFFLINE';

export type ReportStatus = 'DRAFT' | 'PENDING_SYNC' | 'SUBMITTED' | 'SYNCED' | 'FAILED';

export type UserRole = 'Authority' | 'FieldOfficer' | 'Citizen';

export type FieldActiveTab = 'dashboard' | 'nearby' | 'report' | 'history' | 'offline';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  district?: string;
  badgeNumber?: string;
}

export interface Authority extends User {
  role: 'Authority';
  department: string;
  designation?: string;
  jurisdiction?: string;
  jurisdictionDistrict?: string;
  emergencyContact?: string;
}

export interface FieldOfficer extends User {
  role: 'FieldOfficer';
  officerId?: string;
  badgeNumber: string;
  rank?: string;
  assignedRegion?: string;
  currentSector?: string;
  contactNumber?: string;
  status?: 'ON_DUTY' | 'PATROLLING' | 'RESPONDING' | 'OFF_DUTY';
  batteryLevel?: number;
  assignedZoneId?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
}

export interface CitizenReport {
  id: string;
  reportType: ReportType;
  reporterName?: string;
  reporterId?: string;
  reporterRole?: 'FieldOfficer' | 'Citizen';
  reporterType?: 'FieldOfficer' | 'Citizen';
  location?: {
    name: string;
    latitude: number;
    longitude: number;
  };
  latitude?: number;
  longitude?: number;
  locationName?: string;
  timestamp: string;
  description: string;
  photoUrl?: string;
  videoUrl?: string;
  status?: ReportStatus;
  syncStatus?: ConnectionStatus;
  riskZoneId?: string;
  severityObserved?: RiskLevel;
  roadBlocked?: boolean;
  affectedRoadName?: string;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  isOfflineSynced?: boolean;
  isMockData?: boolean;
}

export interface RiskAssessment {
  id?: string;
  riskZoneId?: string;
  riskScore: number; // 0–100
  riskLevel: RiskLevel;
  timestamp: string;
  contributingFactors: string[];
  rainfallIntensityMm?: number;
  rainfallAccumulation24hMm?: number;
  slopeAngleDeg?: number;
  soilMoisturePct?: number;
  historicalLandslideCount?: number;
  rainfallContribution?: number;
  slopeContribution?: number;
  soilMoistureContribution?: number;
  historyContribution?: number;
  isSimulated?: boolean;
}

export interface RiskZone {
  id: string;
  name: string;
  code?: string;
  district: string;
  state: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  latitude?: number;
  longitude?: number;
  assessment?: RiskAssessment;
  riskScore?: number; // 0–100
  riskLevel?: RiskLevel;
  slopeAngleDeg?: number;
  rainfallAccumulationMm?: number;
  currentRainfallMmH?: number;
  soilMoisturePercent?: number;
  historicalEventsCount?: number;
  nearbyRoads: string[];
  nearbyVillages: string[];
  criticalInfrastructure?: string[];
  contributingFactors?: string[];
  lastUpdated: string;
  isDemoData?: boolean;
}

export interface WeatherData {
  id: string;
  location: string;
  district?: string;
  state?: string;
  rainfallMm?: number;
  rainfallCurrentMm?: number;
  rainfallAccumulation24hMm: number;
  rainfallAccumulation72hMm?: number;
  rainfallTrend?: 'RISING' | 'STABLE' | 'FALLING';
  temperatureC: number;
  humidityPct?: number;
  humidityPercent?: number;
  windSpeedKmh: number;
  timestamp: string;
  isSimulated: boolean;
}

export interface Road {
  id: string;
  code: string;
  name: string;
  type?: 'National Highway' | 'State Highway' | 'District Road' | 'Rural Road';
  startLocation?: string;
  endLocation?: string;
  status: RoadStatus;
  connectingRoute?: string;
  affectedSegment?: string;
  restrictionReason?: string;
  blockageReason?: string;
  lastInspectionTime?: string;
  lastInspection?: string;
  passabilityNotes?: string;
  linkedRiskZoneId?: string;
  riskZoneId?: string;
  riskZoneName?: string;
  importanceScore?: number;
  latitude?: number;
  longitude?: number;
}

export interface Village {
  id: string;
  name: string;
  district: string;
  population: number;
  householdCount?: number;
  nearestRiskZoneId?: string;
  riskZoneId?: string;
  riskZoneName?: string;
  populationExposure?: number;
  latitude?: number;
  longitude?: number;
  evacuationStatus?: 'SAFE' | 'ADVISORY_ISSUED' | 'EVACUATION_ORDERED' | 'NORMAL';
  isEvacuationReady?: boolean;
  emergencyShelter?: string;
}

export interface Infrastructure {
  id: string;
  name: string;
  type: string;
  importanceScore?: number;
  latitude?: number;
  longitude?: number;
  location?: string;
  status?: string;
  vulnerabilityStatus?: 'SECURE' | 'AT_RISK' | 'CRITICAL_RISK';
  linkedRiskZoneId?: string;
  riskZoneId?: string;
  riskZoneName?: string;
}

export interface Alert {
  id: string;
  severity: RiskLevel;
  riskScore?: number;
  title: string;
  location: string;
  zoneId?: string;
  riskZoneId?: string;
  riskZoneName?: string;
  timestamp: string;
  reason: string;
  contributingFactors?: string[];
  affectedRoads?: string[];
  affectedVillages?: string[];
  affectedRoad?: string;
  affectedVillage?: string;
  affectedRoadId?: string;
  affectedVillageId?: string;
  recommendedAction: string;
  recommendedResponse?: string;
  status: AlertStatus;
  isDemoData?: boolean;
  isDemoAlert?: boolean;
}

export interface LandslideEvent {
  id: string;
  location: string;
  riskZoneId?: string;
  riskZoneName?: string;
  district?: string;
  date?: string;
  timestamp?: string;
  latitude?: number;
  longitude?: number;
  severity?: RiskLevel;
  casualties?: number;
  fatalities?: number;
  roadBlockedDays?: number;
  infrastructureDamaged?: boolean;
  description?: string;
  notes?: string;
}

export interface EmergencyPriority {
  id: string;
  rank: number;
  title: string;
  zoneId: string;
  location: string;
  riskScore: number;
  riskLevel: RiskLevel;
  roadImpact: string;
  populationExposed: number;
  recommendedAction: string;
  assignedUnit?: string;
  lastUpdated: string;
}
