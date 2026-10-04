import mongoose, { Schema, Document } from "mongoose";

/**
 * TypeScript Interfaces for Zonalyze Data Persistence Layer
 */

export interface GeoPoint {
  type: "Point";
  coordinates: [longitude: number, latitude: number]; // strictly longitude first for GeoJSON compatibility
}

export interface AddressSchema {
  displayName: string;
  suburb: string;
  city: string;
  state: string;
  pincode: string | null;
}

export interface EnvironmentMetrics {
  aqi: number;
  aqiStatus: "Good" | "Fair" | "Moderate" | "Poor" | "Very Poor";
  pm2_5: number;
  pm10: number;
  currentTemp: number;
  avgTempLastWeek: number;
  historicalPm25: number[];
}

export interface NoiseProfile {
  bracket: "Low / Ambient" | "Moderate" | "Elevated";
  nearestSource: string;
  distanceMeters: number | null;
  confidence: string;
}

export interface FacilityEntity {
  name: string;
  distanceMeters: number;
}

export interface HotelEntity extends FacilityEntity {
  stars?: number | null;
  hotelType: string;
}

export interface FacilitiesMap {
  metro: FacilityEntity | null;
  railway: FacilityEntity | null;
  busStop: FacilityEntity | null;
  autoStand: FacilityEntity | null;
  hospital: FacilityEntity | null;
  store: FacilityEntity | null;
  park: FacilityEntity | null;
  airport: FacilityEntity | null;
  hotels: HotelEntity[];
}

export interface AIDebrief {
  summary: string;
  observations: string[];
  inspectionTargets: string[];
}

export interface IInvestigation extends Document {
  location: GeoPoint;
  address: AddressSchema;
  environment: EnvironmentMetrics;
  noise: NoiseProfile;
  facilities: FacilitiesMap;
  aiDebrief: AIDebrief;
  livabilityScore: number;
  createdAt: Date;
}

/**
 * Embedded Sub-Schemas with { _id: false }
 */

const AddressSubSchema = new Schema<AddressSchema>(
  {
    displayName: { type: String, required: true, trim: true },
    suburb: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: null },
  },
  { _id: false }
);

const EnvironmentSubSchema = new Schema<EnvironmentMetrics>(
  {
    aqi: { type: Number, required: true },
    aqiStatus: {
      type: String,
      enum: ["Good", "Fair", "Moderate", "Poor", "Very Poor"],
      required: true,
    },
    pm2_5: { type: Number, required: true },
    pm10: { type: Number, required: true },
    currentTemp: { type: Number, required: true },
    avgTempLastWeek: { type: Number, required: true },
    historicalPm25: { type: [Number], default: [] },
  },
  { _id: false }
);

const NoiseSubSchema = new Schema<NoiseProfile>(
  {
    bracket: {
      type: String,
      enum: ["Low / Ambient", "Moderate", "Elevated"],
      required: true,
    },
    nearestSource: { type: String, required: true },
    distanceMeters: { type: Number, default: null },
    confidence: { type: String, required: true },
  },
  { _id: false }
);

const FacilityEntitySubSchema = new Schema<FacilityEntity>(
  {
    name: { type: String, required: true },
    distanceMeters: { type: Number, required: true },
  },
  { _id: false }
);

const HotelEntitySubSchema = new Schema<HotelEntity>(
  {
    name: { type: String, required: true },
    distanceMeters: { type: Number, required: true },
    stars: { type: Number, default: null },
    hotelType: { type: String, default: "Hotel" },
  },
  { _id: false }
);

const FacilitiesSubSchema = new Schema<FacilitiesMap>(
  {
    metro: { type: FacilityEntitySubSchema, default: null },
    railway: { type: FacilityEntitySubSchema, default: null },
    busStop: { type: FacilityEntitySubSchema, default: null },
    autoStand: { type: FacilityEntitySubSchema, default: null },
    hospital: { type: FacilityEntitySubSchema, default: null },
    store: { type: FacilityEntitySubSchema, default: null },
    park: { type: FacilityEntitySubSchema, default: null },
    airport: { type: FacilityEntitySubSchema, default: null },
    hotels: { type: [HotelEntitySubSchema], default: [] },
  },
  { _id: false }
);

const AIDebriefSubSchema = new Schema<AIDebrief>(
  {
    summary: { type: String, required: true },
    observations: { type: [String], default: [] },
    inspectionTargets: { type: [String], default: [] },
  },
  { _id: false }
);

/**
 * Main Investigation Mongoose Schema
 */

const InvestigationSchema = new Schema<IInvestigation>(
  {
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: { type: AddressSubSchema, required: true },
    environment: { type: EnvironmentSubSchema, required: true },
    noise: { type: NoiseSubSchema, required: true },
    facilities: { type: FacilitiesSubSchema, required: true },
    aiDebrief: { type: AIDebriefSubSchema, required: true },
    livabilityScore: {
      type: Number,
      required: true,
      min: 1.0,
      max: 10.0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800, // 7 days in seconds
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

/**
 * Critical Indexes:
 * 1. 2dsphere index for spherical proximity queries ($near) up to 150m.
 * 2. Descending index on createdAt for fast retrieval of recent location lookups.
 * (Note: TTL index is configured via expires on the createdAt field above)
 */
InvestigationSchema.index({ location: "2dsphere" });
InvestigationSchema.index({ createdAt: -1 });

export const Investigation = mongoose.model<IInvestigation>("Investigation", InvestigationSchema);
