import dotenv from "dotenv";
import path from "path";
// Load from root .env and apps/api/.env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/zonalyze",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  nominatimUserAgent: "Zonalyze-Location-Auditor/1.0 (contact: info@zonalyze.local)",
};
