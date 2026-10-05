import mongoose, { Schema, Document } from "mongoose";

/**
 * Contributor 2: Database Engineer
 * Production MongoDB Mongoose model for Zonalyze Investigations.
 * Fully supports geospatial 2dsphere indexing, 7-day TTL lifecycle,
 * deterministic infrastructure telemetry, acoustic profiling, and Gemini AI debriefs.
 */

export interface FacilityEntity {
  name: string;
  distanceMeters: number;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface HotelEntity extends FacilityEntity {
  stars?: number | null;
  hotelType?: string;
}

export interface FacilitiesData {
  metro: FacilityEntity | null;
  railway: FacilityEntity | null;
  busStop: FacilityEntity | null;
  autoStand?: FacilityEntity | null;
  hospital: FacilityEntity | null;
  store: FacilityEntity | null;
  park: FacilityEntity | null;
  airport: FacilityEntity | null;
  hotels: HotelEntity[];
}

export interface IInvestigation extends Document {
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  environment: {
    pm2_5: number;
    pm10: number;
    aqi: number;
    historical_pm25: number[];
    currentTemp?: number;
    avgTempLastWeek?: number;
    historicalTemp?: number[];
  };
  facilities?: FacilitiesData;
  noise?: Record<string, unknown>;
  aiDebrief?: {
    summary: string;
    observations: string[];
    inspectionTargets: string[];
  };
  infrastructure: {
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
  };
  noiseProfile: {
    estimated_bracket: "Elevated" | "Moderate" | "Low / Ambient";
    nearest_source_type: "railway" | "arterial_road" | "none";
    distance_meters: number | null;
    confidence: string;
  };
  aiReport: {
    summary: string;
    insights_in_brief?: {
      transit: string;
      healthcare: string;
      environment: string;
      acoustic: string;
    };
    empirical_observations: string[];
    site_inspection_targets: string[];
  };
  livabilityScore?: number;
  createdAt: Date;
}

const FacilitySubSchema = new Schema(
  {
    name: { type: String, required: true },
    distanceMeters: { type: Number, required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  { _id: false }
);

const HotelSubSchema = new Schema(
  {
    name: { type: String, required: true },
    distanceMeters: { type: Number, required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    stars: { type: Number, default: null },
    hotelType: { type: String },
  },
  { _id: false }
);

const FacilitiesSchema = new Schema(
  {
    metro: { type: FacilitySubSchema, default: null },
    railway: { type: FacilitySubSchema, default: null },
    busStop: { type: FacilitySubSchema, default: null },
    autoStand: { type: FacilitySubSchema, default: null },
    hospital: { type: FacilitySubSchema, default: null },
    store: { type: FacilitySubSchema, default: null },
    park: { type: FacilitySubSchema, default: null },
    airport: { type: FacilitySubSchema, default: null },
    hotels: { type: [HotelSubSchema], default: [] },
  },
  { _id: false }
);

const InvestigationSchema = new Schema<IInvestigation>(
  {
    location: {
      type: { type: String, enum: ["Point"], default: "Point", required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    address: { type: String, default: "Unknown Location" },
    environment: {
      pm2_5: { type: Number, required: true },
      pm10: { type: Number, required: true },
      aqi: { type: Number, required: true },
      historical_pm25: { type: [Number], default: [] },
      currentTemp: { type: Number },
      avgTempLastWeek: { type: Number },
      historicalTemp: { type: [Number] },
    },
    facilities: { type: FacilitiesSchema },
    noise: { type: Schema.Types.Mixed },
    aiDebrief: {
      summary: { type: String },
      observations: { type: [String] },
      inspectionTargets: { type: [String] },
    },
    infrastructure: {
      hospitals: { type: Number, default: 0 },
      pharmacies: { type: Number, default: 0 },
      railway_stations: { type: Number, default: 0 },
      metro_stations: { type: Number, default: 0 },
      parks: { type: Number, default: 0 },
      nearest_hospital_dist_m: { type: Number, default: null },
      nearest_hospital_name: { type: String, default: null },
      nearby_hospitals: [
        {
          name: { type: String },
          distance: { type: Number },
          type: { type: String },
          coordinates: { type: [Number] },
        },
      ],
      nearest_railway_dist_m: { type: Number, default: null },
      nearest_railway_name: { type: String, default: null },
      nearest_metro_dist_m: { type: Number, default: null },
      nearest_metro_name: { type: String, default: null },
      nearest_arterial_dist_m: { type: Number, default: null },
    },
    noiseProfile: {
      estimated_bracket: {
        type: String,
        enum: ["Elevated", "Moderate", "Low / Ambient"],
        required: true,
      },
      nearest_source_type: {
        type: String,
        enum: ["railway", "arterial_road", "none"],
        required: true,
      },
      distance_meters: { type: Number, default: null },
      confidence: { type: String, required: true },
    },
    aiReport: {
      summary: { type: String, required: true },
      insights_in_brief: {
        transit: { type: String },
        healthcare: { type: String },
        environment: { type: String },
        acoustic: { type: String },
      },
      empirical_observations: { type: [String], default: [] },
      site_inspection_targets: { type: [String], default: [] },
    },
    livabilityScore: { type: Number },
    createdAt: { type: Date, default: Date.now, expires: "7d" }, // 7-day TTL index
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        return ret;
      },
    },
  }
);

// 2dsphere index for spherical proximity queries ($near, $maxDistance)
InvestigationSchema.index({ location: "2dsphere" });
InvestigationSchema.index({ createdAt: -1 });

export const Investigation = mongoose.model<IInvestigation>("Investigation", InvestigationSchema);
