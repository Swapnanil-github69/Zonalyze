import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import investigateRoutes from "./routes/investigateRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", investigateRoutes);
app.use("/api", chatRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    name: "Zonalyze API Server",
    status: "online",
    healthCheck: "/api/health",
    version: "1.0.0",
  });
});

app.get("/api", (_req, res) => {
  res.status(200).json({
    status: "online",
    endpoints: {
      health: "/api/health",
      investigate: "/api/investigate",
      chat: "/api/chat",
    },
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

async function bootstrap() {
  const port = Number(process.env.PORT) || 5000;

  // 1. Open HTTP listener immediately so API server is active in <100ms
  app.listen(port, () => {
    console.log(`⚡ Zonalyze API server running at http://localhost:${port}`);
  });

  // 2. Connect to MongoDB in background without blocking server availability
  connectDB().catch((err) => {
    console.error("Database connection failed:", err?.message || err);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
