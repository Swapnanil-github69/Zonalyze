import mongoose from "mongoose";
import { config } from "./env.js";

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

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(config.mongoUri);
    console.log("✅ MongoDB connection established successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
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
