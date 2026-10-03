import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { config } from "./config/env.js";

async function bootstrap() {
  await connectDB();

  const app = createApp();

  app.listen(config.port, () => {
    console.log(`🚀 Zonalyze API Server running on port ${config.port}`);
    console.log(`📍 Endpoint: http://localhost:${config.port}/api/investigate`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
