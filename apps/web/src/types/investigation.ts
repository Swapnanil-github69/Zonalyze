export interface EnvironmentData {
  pm2_5: number;
  pm10: number;
  aqi: number;
  historical_pm25: number[];
}

export interface InfrastructureData {
  hospitals: number;
  pharmacies: number;
  railway_stations: number;
  parks: number;
  nearest_hospital_dist_m: number | null;
}

export interface NoiseProfileData {
  estimated_bracket: "Elevated" | "Moderate" | "Low / Ambient";
  nearest_source_type: "railway" | "arterial_road" | "none";
  distance_meters: number | null;
  confidence: string;
}

export interface AiReportData {
  summary: string;
  empirical_observations: string[];
  site_inspection_targets: string[];
}

export interface InvestigationResult {
  _id: string;
  cached: boolean;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lon, lat]
  };
  address: string;
  environment: EnvironmentData;
  infrastructure: InfrastructureData;
  noiseProfile: NoiseProfileData;
  aiReport: AiReportData;
  createdAt: string;
}

export type AuditStage =
  | "idle"
  | "checking_cache"
  | "ingesting_telemetry"
  | "computing_heuristics"
  | "synthesizing_ai"
  | "completed"
  | "error";
