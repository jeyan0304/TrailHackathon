// NER-SafeSlope — Core Entities & Domain Types
// Strictly adhering to CONVENTIONS.md & PROJECT_SPEC.md

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type ReportType =
  | 'CRACK'
  | 'SLOPE_MOVEMENT'
  | 'ROAD_BLOCKAGE'
  | 'LANDSLIDE'
  | 'INFRASTRUCTURE_DAMAGE'
  | 'OTHER';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export type RoadStatus = 'OPEN' | 'RESTRICTED' | 'BLOCKED' | 'UNKNOWN';

export type ConnectionStatus = 'ONLINE' | 'SYNCING' | 'OFFLINE';

export type ReportStatus = 'DRAFT' | 'PENDING_SYNC' | 'SUBMITTED' | 'SYNCED' | 'FAILED';

export interface User {
  id: string;
  name: string;
  role: 'Authority' | 'FieldOfficer' | 'Citizen';
  badgeNumber?: string;
  phoneNumber?: string;
  email?: string;
}

export interface Authority {
  id: string;
  name: string;
  department: string;
  jurisdictionDistrict: string;
  emergencyContact: string;
}

export interface FieldOfficer {
  id: string;
  officerId: string;
  name: string;
  rank: string;
  assignedRegion: string;
  currentSector: string;
  contactNumber: string;
  status: 'ON_DUTY' | 'PATROLLING' | 'RESPONDING' | 'OFF_DUTY';
  batteryLevel?: number;
}

export interface CitizenReport {
  id: string;
  reportType: ReportType;
  latitude: number;
  longitude: number;
  locationName: string;
  timestamp: string;
  description: string;
  photoUrl?: string;
  videoUrl?: string;
  status: ReportStatus;
  syncStatus: ConnectionStatus;
  reporterType: 'FieldOfficer' | 'Citizen';
  reporterName: string;
  reporterId?: string;
  riskZoneId?: string;
  severityObserved?: RiskLevel;
  roadBlocked?: boolean;
  affectedRoadName?: string;
  isMockData: boolean;
}

export interface RiskAssessment {
  id: string;
  riskZoneId: string;
  riskScore: number; // 0–100
  riskLevel: RiskLevel;
  timestamp: string;
  contributingFactors: string[];
  rainfallContribution: number;
  slopeContribution: number;
  soilMoistureContribution: number;
  historyContribution: number;
}

export interface RiskZone {
  id: string;
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  riskScore: number; // 0–100
  riskLevel: RiskLevel;
  slopeAngleDeg: number;
  rainfallAccumulationMm: number;
  currentRainfallMmH: number;
  soilMoisturePercent: number;
  historicalEventsCount: number;
  nearbyRoads: string[];
  nearbyVillages: string[];
  contributingFactors: string[];
  lastUpdated: string;
  isDemoData: boolean;
}

export interface WeatherData {
  id: string;
  location: string;
  rainfallMm: number;
  rainfallAccumulation24hMm: number;
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  timestamp: string;
  isSimulated: boolean;
}

export interface Road {
  id: string;
  name: string;
  code: string;
  status: RoadStatus;
  connectingRoute: string;
  riskZoneId?: string;
  blockageReason?: string;
  lastInspection: string;
}

export interface Village {
  id: string;
  name: string;
  district: string;
  population: number;
  riskZoneId: string;
  isEvacuationReady: boolean;
}

export interface Infrastructure {
  id: string;
  name: string;
  type: 'BRIDGE' | 'ROAD_SEGMENT' | 'CULVERT' | 'HOSPITAL' | 'POWER_GRID' | 'TELECOM_TOWER';
  status: 'OPERATIONAL' | 'AT_RISK' | 'DAMAGED' | 'INSPECTING';
  riskZoneId: string;
}

export interface Alert {
  id: string;
  severity: RiskLevel;
  title: string;
  location: string;
  timestamp: string;
  reason: string;
  affectedRoad: string;
  affectedVillage: string;
  recommendedAction: string;
  status: AlertStatus;
  isDemoAlert: boolean;
}

export interface LandslideEvent {
  id: string;
  location: string;
  timestamp: string;
  severity: RiskLevel;
  notes: string;
  fatalities?: number;
  infrastructureDamaged?: boolean;
}

export type FieldActiveTab = 'dashboard' | 'nearby' | 'report' | 'history' | 'offline';
