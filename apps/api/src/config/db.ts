import dns from "dns";
import mongoose from "mongoose";
import { config } from "./env.js";
import { Investigation } from "../models/Investigation.js";

// Fix for Windows / Node.js querySrv ECONNREFUSED with MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

/**
 * Contributor 2: Database Engineer
 * Handles connection lifecycle to MongoDB Atlas with auto-retry and index validation.
 */
export async function connectDB(): Promise<void> {
  try {
    if (!config.mongoUri) {
      console.warn("⚠️ MONGODB_URI not provided. Running without database connection.");
      return;
    }

    console.log("Connecting to MongoDB Atlas in background...");
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connection established successfully.");

    // Sync indexes asynchronously in the background so it never blocks startup
    Investigation.syncIndexes().catch((err) => {
      console.warn("Non-fatal index sync note:", err?.message || err);
    });
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error?.message || error);
    // In dev mode, do not crash immediately so other endpoints/mock modes can function
    if (config.nodeEnv === "production") {
      process.exit(1);
    }
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Attempting reconnection...");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB runtime error:", err);
});
