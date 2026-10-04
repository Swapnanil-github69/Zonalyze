import express, { Application } from "express";
import cors from "cors";
import { config } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import investigateRoutes from "./routes/investigate.routes.js";

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json());

  // Routes
  app.use("/api", healthRoutes);
  app.use("/api", investigateRoutes);

  return app;
}
