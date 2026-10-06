import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import * as path from "path";

// Load backend .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config();

const apiKey = process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ ERROR: Neither GEMMA_API_KEY nor GEMINI_API_KEY is defined in .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function runModelDiagnostic() {
  console.log("=========================================");
  console.log("🔍 QUERYING GOOGLE AI STUDIO ENDPOINTS...");
  console.log("=========================================\n");

  try {
    const modelList = await ai.models.list();
    const allModels: string[] = [];
    const gemmaModels: string[] = [];

    for await (const m of modelList) {
      if (m.name) {
        allModels.push(m.name);
        if (m.name.toLowerCase().includes("gemma")) {
          gemmaModels.push(m.name);
        }
      }
    }

    if (gemmaModels.length > 0) {
      console.log(`✅ FOUND ${gemmaModels.length} GEMMA MODEL(S) ON THIS KEY:`);
      gemmaModels.forEach((name) => console.log(`   • ${name}`));

      let testedSuccess = false;
      for (const modelPath of gemmaModels) {
        const target = modelPath.replace(/^models\//, "");
        console.log(`\nTesting prompt execution on candidate: ${target}...`);
        try {
          const testRes = await ai.models.generateContent({
            model: target,
            contents: "Respond with the single word 'CONNECTED' if you receive this.",
          });
          console.log(`🎉 SUCCESS: ${target} responded ->`, testRes.text?.trim());
          testedSuccess = true;
          break;
        } catch (genErr: any) {
          console.error(`⚠️ Generation test failed on ${target}:`, genErr.message);
        }
      }

      if (!testedSuccess) {
        console.log("\n⚠️ Could not get a response from the detected Gemma models.");
      }
    } else {
      console.log("⚠️ No Gemma-branded endpoints were returned for this API key.");
      console.log("\nAvailable generation models on this key:");
      allModels.slice(0, 15).forEach((name) => console.log(`   • ${name}`));
    }
  } catch (err: any) {
    console.error("❌ API request failed:", err.message || err);
  }
}

runModelDiagnostic();
