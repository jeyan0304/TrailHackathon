/**
 * NER-SafeSlope Core Type Definitions
 * Adheres strictly to CONVENTIONS.md and PROJECT_SPEC.md
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

export type UserRole = 'Authority' | 'FieldOfficer' | 'Citizen';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  district?: string;
}

export interface Authority extends User {
  role: 'Authority';
  department: string;
  designation: string;
  jurisdiction: string;
}

export interface FieldOfficer extends User {
  role: 'FieldOfficer';
  badgeNumber: string;
  assignedZoneId?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
}

export interface RiskAssessment {
  riskScore: number; // 0–100
  riskLevel: RiskLevel;
  timestamp: string;
  contributingFactors: string[];
  rainfallIntensityMm: number;
  rainfallAccumulation24hMm: number;
  slopeAngleDeg: number;
  soilMoisturePct: number;
  historicalLandslideCount: number;
  isSimulated?: boolean;
}

export interface RiskZone {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  assessment: RiskAssessment;
  nearbyRoads: string[];
  nearbyVillages: string[];
  criticalInfrastructure: string[];
  lastUpdated: string;
}

export interface WeatherData {
  id: string;
  location: string;
  district: string;
  state: string;
  rainfallCurrentMm: number;
  rainfallAccumulation24hMm: number;
  rainfallAccumulation72hMm: number;
  rainfallTrend: 'RISING' | 'STABLE' | 'FALLING';
  temperatureC: number;
  humidityPct: number;
  windSpeedKmh: number;
  timestamp: string;
  isSimulated: boolean;
}

export interface Road {
  id: string;
  code: string;
  name: string;
  type: 'National Highway' | 'State Highway' | 'District Road' | 'Rural Road';
  startLocation: string;
  endLocation: string;
  status: RoadStatus;
  affectedSegment?: string;
  restrictionReason?: string;
  lastInspectionTime: string;
  passabilityNotes?: string;
  linkedRiskZoneId?: string;
}

export interface Village {
  id: string;
  name: string;
  district: string;
  population: number;
  householdCount: number;
  nearestRiskZoneId: string;
  evacuationStatus: 'SAFE' | 'ADVISORY_ISSUED' | 'EVACUATION_ORDERED' | 'NORMAL';
  emergencyShelter?: string;
}

export interface Infrastructure {
  id: string;
  name: string;
  type: 'Bridge' | 'Hospital' | 'School' | 'Power Station' | 'Telecom Tower' | 'Water Supply';
  location: string;
  vulnerabilityStatus: 'SECURE' | 'AT_RISK' | 'CRITICAL_RISK';
  linkedRiskZoneId: string;
}

export interface Alert {
  id: string;
  severity: RiskLevel;
  riskScore: number;
  title: string;
  location: string;
  zoneId: string;
  timestamp: string;
  reason: string;
  contributingFactors: string[];
  affectedRoads: string[];
  affectedVillages: string[];
  recommendedAction: string;
  status: AlertStatus;
  isDemoData: boolean;
}

export interface CitizenReport {
  id: string;
  reportType: ReportType;
  reporterName?: string;
  reporterRole: 'FieldOfficer' | 'Citizen';
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  description: string;
  photoUrl?: string;
  videoUrl?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  isOfflineSynced: boolean;
}

export interface LandslideEvent {
  id: string;
  location: string;
  district: string;
  date: string;
  severity: RiskLevel;
  casualties: number;
  roadBlockedDays: number;
  description: string;
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
