export interface EnvironmentData {
  pm2_5: number;
  pm10: number;
  aqi: number;
  aqiStatus?: "Good" | "Fair" | "Moderate" | "Poor" | "Very Poor";
  historical_pm25: number[];
  temperature?: number;
  temperature_7d_avg?: number;
  historical_temp?: number[];
}

export interface FacilityItem {
  id: string;
  name: string;
  type: string;
  distance_m: number;
  count?: number;
}

export interface HotelItem {
  id: string;
  name: string;
  stars: number;
  distance_m: number;
  reviewsUrl: string;
}

export interface TransitFacilities {
  metro: { count: number; nearest_dist_m: number | null };
  rail: { count: number; nearest_dist_m: number | null };
  bus: { count: number; nearest_dist_m: number | null };
  autoToto: { count: number; nearest_dist_m: number | null };
  airport: { count: number; nearest_dist_m: number | null };
}

export interface EssentialFacilities {
  hospitals: { count: number; nearest_dist_m: number | null };
  convenienceStores: { count: number; nearest_dist_m: number | null };
  parks: { count: number; nearest_dist_m: number | null };
}

export interface DetailedFacilities {
  transit: TransitFacilities;
  essentials: EssentialFacilities;
  hotels: HotelItem[];
}

export interface InfrastructureData {
  hospitals: number;
  pharmacies: number;
  railway_stations: number;
  metro_stations?: number;
  parks: number;
  nearest_hospital_dist_m: number | null;
  nearest_railway_dist_m?: number | null;
  nearest_metro_dist_m?: number | null;
  nearest_arterial_dist_m?: number | null;
  detailed?: DetailedFacilities;
}

export interface NoiseProfileData {
  estimated_bracket: "Elevated" | "Moderate" | "Low / Ambient";
  nearest_source_type: "railway" | "arterial_road" | "none";
  distance_meters: number | null;
  confidence: string;
  estimated_decibels?: number;
}

export interface AiReportData {
  summary: string;
  insights_in_brief?: {
    transit: string;
    healthcare: string;
    environment: string;
    acoustic: string;
  };
  empirical_observations: string[];
  site_inspection_targets: string[];
}

export interface LivabilityScoreData {
  score: number; // out of 10 (e.g. 7.8)
  category: "Optimal" | "Moderate" | "Constrained" | "High Risk";
  breakdown: {
    airQuality: number; // 0 - 2.5
    acousticBuffer: number; // 0 - 2.5
    transitAccess: number; // 0 - 2.5
    essentialProximity: number; // 0 - 2.5
  };
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
  livabilityScore?: LivabilityScoreData;
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
