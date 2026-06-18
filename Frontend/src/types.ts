export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface MonitoringZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  riskScore: number; // 0 - 100
  threatLevel: ThreatLevel;
  vegetationLoss: number; // percentage
  excavationArea: boolean;
  accessRoads: boolean;
  encroachmentArea: boolean;
  priority: ThreatLevel;
  lastUpdate: string;
  status: 'Active' | 'Under Review' | 'Inspection Assigned' | 'Resolved';
  region: string;
  country: string;
  findings: string;
  recommendations: string;
  sizeHectares: number;
  reporter: string;
  waterPollutionLevel: string; // e.g. 'High', 'None', 'Moderate'
}

export interface Alert {
  id: string;
  zoneId: string;
  locationName: string;
  lat: number;
  lng: number;
  type: 'Illegal Mining' | 'Deforestation' | 'Land Encroachment' | 'Habitat Destruction';
  riskScore: number;
  timestamp: string;
  priority: ThreatLevel;
  status: 'Critical' | 'High' | 'Pending' | 'Resolved';
  assignedOfficer?: string;
  notes?: string[];
  findings: string;
}

export interface AuditEvent {
  event: 'Detection Created' | 'Report Generated' | 'Officer Assigned' | 'Inspection Scheduled' | 'Field Verification Started' | 'Action Taken' | 'Case Resolved' | 'Case Escalated' | 'Team Dispatched' | string;
  timestamp: string;
  description: string;
}

export interface Case {
  caseId: string;
  zoneId: string;
  locationName: string;
  lat: number;
  lng: number;
  type: string;
  status: 'Detected' | 'Assigned' | 'Inspection Scheduled' | 'Under Investigation' | 'Resolved';
  riskScore: number;
  estimatedDamage: string; // e.g., "Medium" or "Rs. 1.2 Crore"
  areaImpacted: number; // in hectares
  suggestedAction: string;
  assignedOfficer: string;
  assignedAgency: string; // e.g. "State Forest Department" or "SPCB"
  assignedDistrict?: string; // Indian district environmental authority
  expectedResolutionTime: string;
  expectedInspectionDate: string;
  priority: ThreatLevel;
  timestamp: string;
  findings: string;
  auditTimeline: AuditEvent[];
}

export interface SystemSettings {
  confidenceThreshold: number;
  alertOnCriticalOnly: boolean;
  satelliteRefreshInterval: 'Daily' | 'Weekly' | 'Hourly';
  autoEscalation: boolean;
  integrations: {
    interferometry: boolean;
    sentinelRadar: boolean;
    landsatThermal: boolean;
    authorityAlerts: boolean;
  };
}
