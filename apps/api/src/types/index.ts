export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface NominatimResponse {
  display_name: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export interface OpenMeteoAirQualityData {
  pm2_5: number;
  pm10: number;
  aqi: number;
  historical_pm25: number[];
}

export interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export interface OverpassResponse {
  elements: OverpassElement[];
}

export interface InfrastructureMetrics {
  hospitals: number;
  pharmacies: number;
  railway_stations: number;
  metro_stations?: number;
  parks: number;
  nearest_hospital_dist_m: number | null;
  nearest_hospital_name?: string | null;
  nearby_hospitals?: Array<{
    name: string;
    distance: number;
    type?: string;
    coordinates?: [number, number];
  }>;
  nearest_railway_dist_m: number | null;
  nearest_railway_name?: string | null;
  nearest_metro_dist_m?: number | null;
  nearest_metro_name?: string | null;
  nearest_arterial_dist_m: number | null;
}

export interface NoiseAnalysis {
  estimated_bracket: "Elevated" | "Moderate" | "Low / Ambient";
  nearest_source_type: "railway" | "arterial_road" | "none";
  distance_meters: number | null;
  confidence: string;
}

export interface AiDebrief {
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
