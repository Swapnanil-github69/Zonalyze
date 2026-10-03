import mongoose, { Schema, Document } from "mongoose";

/**
 * Contributor 2: Database Engineer
 * Geospatial schema supporting $near spherical queries (150m radius) and 7-day automatic TTL eviction.
 */

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
  };
  infrastructure: {
    hospitals: number;
    pharmacies: number;
    railway_stations: number;
    parks: number;
    nearest_hospital_dist_m: number | null;
  };
  noiseProfile: {
    estimated_bracket: "Elevated" | "Moderate" | "Low / Ambient";
    nearest_source_type: "railway" | "arterial_road" | "none";
    distance_meters: number | null;
    confidence: string;
  };
  aiReport: {
    summary: string;
    empirical_observations: string[];
    site_inspection_targets: string[];
  };
  createdAt: Date;
}

const InvestigationSchema = new Schema<IInvestigation>({
  location: {
    type: { type: String, enum: ["Point"], default: "Point", required: true },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  address: { type: String, default: "Unknown Location" },
  environment: {
    pm2_5: { type: Number, required: true },
    pm10: { type: Number, required: true },
    aqi: { type: Number, required: true },
    historical_pm25: { type: [Number], default: [] }
  },
  infrastructure: {
    hospitals: { type: Number, default: 0 },
    pharmacies: { type: Number, default: 0 },
    railway_stations: { type: Number, default: 0 },
    parks: { type: Number, default: 0 },
    nearest_hospital_dist_m: { type: Number, default: null }
  },
  noiseProfile: {
    estimated_bracket: { 
      type: String, 
      enum: ["Elevated", "Moderate", "Low / Ambient"], 
      required: true 
    },
    nearest_source_type: { 
      type: String, 
      enum: ["railway", "arterial_road", "none"], 
      required: true 
    },
    distance_meters: { type: Number, default: null },
    confidence: { type: String, required: true }
  },
  aiReport: {
    summary: { type: String, required: true },
    empirical_observations: { type: [String], default: [] },
    site_inspection_targets: { type: [String], default: [] }
  },
  createdAt: { type: Date, default: Date.now, expires: "7d" } // 7-day TTL index
});

// 2dsphere index for spherical distance queries ($near, $maxDistance)
InvestigationSchema.index({ location: "2dsphere" });

export const Investigation = mongoose.model<IInvestigation>("Investigation", InvestigationSchema);
