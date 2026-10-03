import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/zonalyze",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  nominatimUserAgent: "Zonalyze-Location-Auditor/1.0 (contact: info@zonalyze.local)",
};
