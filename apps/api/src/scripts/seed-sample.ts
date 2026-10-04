import dns from "dns";
import mongoose from "mongoose";
import { config } from "../config/env.js";
import { Investigation } from "../models/Investigation.js";

// Fix for Windows / Node.js querySrv ECONNREFUSED with MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const sampleInvestigations = [
  {
    location: {
      type: "Point" as const,
      coordinates: [88.4325, 22.5804] as [number, number], // Sector V, Salt Lake, Kolkata [lon, lat]
    },
    address: "Sector V, Bidhannagar, Kolkata, West Bengal 700091, India",
    environment: {
      pm2_5: 38.4,
      pm10: 76.2,
      aqi: 82,
      historical_pm25: [45.1, 42.0, 39.5, 36.2, 38.4],
    },
    infrastructure: {
      hospitals: 3,
      pharmacies: 8,
      railway_stations: 1,
      parks: 2,
      nearest_hospital_dist_m: 1200,
    },
    noiseProfile: {
      estimated_bracket: "Moderate" as const,
      nearest_source_type: "arterial_road" as const,
      distance_meters: 85,
      confidence: "High (verified road corridor proximity)",
    },
    aiReport: {
      summary:
        "Commercial technology corridor with dense road network, balanced rapid transit proximity, and moderate ambient acoustic levels.",
      empirical_observations: [
        "Sector V Green Line metro access within walking perimeter (approx 220m).",
        "Particulate concentrations elevated during morning and evening rush hours along the major arterial corridor.",
        "Commercial buffer strips provide partial acoustic isolation for interior plots.",
      ],
      site_inspection_targets: [
        "Audit sound attenuation properties of west-facing facade glazing.",
        "Inspect HVAC air filter ratings (MERV-13 minimum recommended).",
        "Verify sidewalk pedestrian connectivity along College More intersection during peak hours.",
      ],
    },
  },
  {
    location: {
      type: "Point" as const,
      coordinates: [77.6412, 12.9719] as [number, number], // Indiranagar 100ft Road, Bengaluru [lon, lat]
    },
    address: "100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038, India",
    environment: {
      pm2_5: 24.6,
      pm10: 51.0,
      aqi: 58,
      historical_pm25: [28.2, 26.0, 24.1, 23.5, 24.6],
    },
    infrastructure: {
      hospitals: 4,
      pharmacies: 12,
      railway_stations: 1,
      parks: 4,
      nearest_hospital_dist_m: 950,
    },
    noiseProfile: {
      estimated_bracket: "Elevated" as const,
      nearest_source_type: "arterial_road" as const,
      distance_meters: 30,
      confidence: "High (active commercial thoroughfare)",
    },
    aiReport: {
      summary:
        "High-energy urban mixed-use district with immediate access to essential services and notable evening sound levels.",
      empirical_observations: [
        "Purple Line metro station situated within 450m walking distance.",
        "Mature tree canopy moderates ambient surface temperatures.",
        "Commercial nightlife generates elevated acoustic baseline after 20:00.",
      ],
      site_inspection_targets: [
        "Conduct acoustic baseline measurement during peak commercial hours (20:00 - 23:00).",
        "Evaluate setback adequacy and vehicular delivery access on side avenues.",
      ],
    },
  },
  {
    location: {
      type: "Point" as const,
      coordinates: [72.8258, 19.0657] as [number, number], // Carter Road, Bandra West, Mumbai [lon, lat]
    },
    address: "Carter Road Promenade, Bandra West, Mumbai, Maharashtra 400050, India",
    environment: {
      pm2_5: 15.2,
      pm10: 34.0,
      aqi: 44,
      historical_pm25: [19.0, 17.2, 16.0, 14.8, 15.2],
    },
    infrastructure: {
      hospitals: 2,
      pharmacies: 7,
      railway_stations: 1,
      parks: 3,
      nearest_hospital_dist_m: 1100,
    },
    noiseProfile: {
      estimated_bracket: "Low / Ambient" as const,
      nearest_source_type: "none" as const,
      distance_meters: null,
      confidence: "High (marine coastal zone without adjacent rail)",
    },
    aiReport: {
      summary:
        "Coastal residential zone featuring maritime ventilation, low ambient noise, and direct pedestrian promenade access.",
      empirical_observations: [
        "Consistent sea breeze facilitates efficient particulate dispersion.",
        "Absence of rail lines or multi-lane highways within 1 km ensures low noise exposure.",
        "High walking accessibility to parks and community spaces along the shoreline.",
      ],
      site_inspection_targets: [
        "Assess marine salinity corrosion resilience on external electrical fittings and metal fixtures.",
        "Check building stormwater sump pump redundancy for high-tide monsoon surge.",
      ],
    },
  },
];

async function seed() {
  console.log("Connecting to:", config.mongoUri ? config.mongoUri.replace(/:([^:@]+)@/, ":****@") : "none");
  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 8000 });
    const db = mongoose.connection.db;
    console.log(`✅ Connected successfully to database: "${db?.databaseName}"`);

    // Clean previous sample entries
    console.log("\n🧹 Clearing existing sample investigations...");
    await Investigation.deleteMany({});

    console.log("📦 Uploading 3 sample location investigations to 'investigations' collection...");
    const inserted = await Investigation.create(sampleInvestigations);
    console.log(`✅ Successfully uploaded ${inserted.length} sample document(s)!\n`);

    inserted.forEach((doc, idx) => {
      console.log(`--- [Investigation #${idx + 1}] ---`);
      console.log(`ID:           ${doc._id}`);
      console.log(`Address:      ${doc.address}`);
      console.log(`Coordinates:  [${doc.location.coordinates[0]}, ${doc.location.coordinates[1]}]`);
      console.log(`AQI:          ${doc.environment.aqi} (PM2.5: ${doc.environment.pm2_5})`);
      console.log(`Noise:        ${doc.noiseProfile.estimated_bracket} (Nearest: ${doc.noiseProfile.nearest_source_type})`);
      console.log(`Summary:      ${doc.aiReport.summary}\n`);
    });

    // Test 2dsphere proximity query ($near within 150m of Sector V, Kolkata)
    console.log("🧪 Testing 2dsphere Geospatial Index ($near within 150m):");
    const testLon = 88.4326;
    const testLat = 22.5805;
    const nearby = await Investigation.findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [testLon, testLat],
          },
          $maxDistance: 150,
        },
      },
    });

    if (nearby) {
      console.log(`🎯 Geospatial query SUCCESS: Found "${nearby.address}" within 150m!`);
    } else {
      console.warn("⚠️ No nearby document found.");
    }

    const totalCount = await Investigation.countDocuments();
    console.log(`\n🎉 Total investigations stored in MongoDB Atlas: ${totalCount}`);
  } catch (err: any) {
    console.error("❌ Seed error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

seed();
