import dns from "dns";
import mongoose from "mongoose";
import { config } from "../config/env.js";

// Fix for Windows / Node.js querySrv ECONNREFUSED with MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

async function main() {
  console.log("Connecting to:", config.mongoUri ? config.mongoUri.replace(/:([^:@]+)@/, ":****@") : "none");
  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
    const db = mongoose.connection.db;
    if (!db) {
      console.log("No database connection object available.");
      process.exit(1);
    }
    console.log(`✅ Connected successfully to database: "${db.databaseName}"`);
    const collections = await db.listCollections().toArray();
    console.log(`\nFound ${collections.length} collection(s):`);
    if (collections.length === 0) {
      console.log("  (No collections yet. MongoDB creates collections on the first insert or via createCollection())");
    } else {
      collections.forEach((c) => console.log(`  - ${c.name}`));
    }

    let hasInvestigations = collections.some((c) => c.name === "investigations");

    if (!hasInvestigations) {
      console.log("\n⚡ Initializing 'investigations' collection & indexes in database...");
      const { Investigation } = await import("../models/Investigation.js");
      await Investigation.createCollection();
      await Investigation.syncIndexes();
      hasInvestigations = true;
      console.log("✅ 'investigations' collection successfully created in MongoDB!");
    }

    if (hasInvestigations) {
      const count = await db.collection("investigations").countDocuments();
      console.log(`\nIs "investigations" collection present? YES ✅`);
      console.log(`Total documents in "investigations": ${count}`);
      const indexes = await db.collection("investigations").indexes();
      console.log("Registered indexes on 'investigations':", indexes.map((i) => i.name));
    }
  } catch (err: any) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
