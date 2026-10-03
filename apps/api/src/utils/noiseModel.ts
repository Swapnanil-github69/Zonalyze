import { NoiseAnalysis } from "../types/index.js";

interface NoiseSourceInput {
  railwayDistM: number | null;
  arterialDistM: number | null;
}

/**
 * Computes acoustic noise proxy using inverse distance attenuation:
 * L = L0 - 20 * log10(d / d0)
 */
export function estimateNoiseProfile(input: NoiseSourceInput): NoiseAnalysis {
  const { railwayDistM, arterialDistM } = input;

  // Sound levels in dBA
  let railwayL = 0;
  let arterialL = 0;

  if (railwayDistM !== null && railwayDistM > 0) {
    const d = Math.max(railwayDistM, 1);
    railwayL = 85 - 20 * Math.log10(d / 15);
  }

  if (arterialDistM !== null && arterialDistM > 0) {
    const d = Math.max(arterialDistM, 1);
    arterialL = 75 - 20 * Math.log10(d / 10);
  }

  const maxL = Math.max(railwayL, arterialL);

  let nearest_source_type: "railway" | "arterial_road" | "none" = "none";
  let distance_meters: number | null = null;

  if (railwayDistM !== null && (arterialDistM === null || railwayDistM <= arterialDistM)) {
    nearest_source_type = "railway";
    distance_meters = railwayDistM;
  } else if (arterialDistM !== null) {
    nearest_source_type = "arterial_road";
    distance_meters = arterialDistM;
  }

  let estimated_bracket: "Elevated" | "Moderate" | "Low / Ambient" = "Low / Ambient";
  if (maxL >= 65 || (distance_meters !== null && distance_meters <= 120)) {
    estimated_bracket = "Elevated";
  } else if (maxL >= 50 || (distance_meters !== null && distance_meters <= 450)) {
    estimated_bracket = "Moderate";
  } else {
    estimated_bracket = "Low / Ambient";
  }

  let confidence = "High (verified geometry within 500m)";
  if (distance_meters === null || distance_meters > 1500) {
    confidence = "Low (no major transit/highway corridors detected within immediate acoustic zone)";
  } else if (distance_meters > 500) {
    confidence = "Moderate (corridor detected in secondary buffer 500-1500m)";
  }

  return {
    estimated_bracket,
    nearest_source_type,
    distance_meters,
    confidence,
  };
}
