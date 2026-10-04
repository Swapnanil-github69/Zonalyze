import dotenv from "dotenv";
import path from "path";
// Load from root .env and apps/api/.env
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config();

const mongoUri = process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0
  ? process.env.MONGODB_URI.trim()
  : "mongodb://localhost:27017/zonalyze";

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri,
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  nominatimUserAgent: "Zonalyze-Location-Auditor/1.0 (contact: info@zonalyze.local)",
};
