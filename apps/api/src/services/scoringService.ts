type ScoreInput = {
  environment: Record<string, unknown>;
  facilities: Record<string, unknown>;
  noise: Record<string, unknown>;
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function firstDistance(...values: unknown[]): number | null {
  for (const value of values) {
    const candidate =
      typeof value === "object" && value !== null
        ? asRecord(value).distanceMeters ?? asRecord(value).distance_meters
        : value;
    if (typeof candidate === "number" && Number.isFinite(candidate) && candidate >= 0) {
      return candidate;
    }
  }
  return null;
}

function facilityDistance(
  facilities: Record<string, unknown>,
  key: string,
  ...legacyKeys: string[]
): number | null {
  return firstDistance(
    facilities[key],
    ...legacyKeys.map((legacyKey) => facilities[legacyKey])
  );
}

/**
 * Computes a deterministic 10-point livability score from environmental,
 * facility-distance, and noise telemetry.
 */
export function computeLivabilityScore(data: {
  environment: any;
  facilities: any;
  noise: any;
}): number {
  const input: ScoreInput = {
    environment: asRecord(data.environment),
    facilities: asRecord(data.facilities),
    noise: asRecord(data.noise),
  };
  const environment = input.environment;
  const facilities = input.facilities;
  const infrastructure = asRecord(facilities.infrastructure);
  const noise = input.noise;
  const pm25 = environment.pm2_5;

  let score = 0;
  if (typeof pm25 === "number" && Number.isFinite(pm25) && pm25 >= 0) {
    score +=
      pm25 <= 15 ? 3.0 :
      pm25 <= 35 ? 2.4 :
      pm25 <= 60 ? 1.6 :
      pm25 <= 100 ? 0.8 : 0.2;
  }

  const metroDistance = facilityDistance(
    facilities,
    "metro",
    "nearest_metro_dist_m"
  ) ?? facilityDistance(infrastructure, "nearest_metro_dist_m");
  const busStopDistance = facilityDistance(
    facilities,
    "busStop",
    "bus_stop",
    "nearest_bus_stop_dist_m"
  ) ?? facilityDistance(infrastructure, "nearest_bus_stop_dist_m");
  const autoStandDistance = facilityDistance(
    facilities,
    "autoStand",
    "auto_stand",
    "nearest_auto_stand_dist_m"
  ) ?? facilityDistance(infrastructure, "nearest_auto_stand_dist_m");

  if (
    (metroDistance !== null && metroDistance < 600) ||
    (busStopDistance !== null && busStopDistance < 250)
  ) {
    score += 2.5;
  } else if (
    (metroDistance !== null && metroDistance < 1200) ||
    (busStopDistance !== null && busStopDistance < 600) ||
    (autoStandDistance !== null && autoStandDistance < 500)
  ) {
    score += 1.7;
  } else if (
    (metroDistance !== null && metroDistance < 2500) ||
    (busStopDistance !== null && busStopDistance < 1200)
  ) {
    score += 1.0;
  } else {
    score += 0.3;
  }

  const hospitalDistance = facilityDistance(
    facilities,
    "hospital",
    "nearest_hospital_dist_m"
  ) ?? facilityDistance(infrastructure, "nearest_hospital_dist_m");
  const storeDistance = facilityDistance(
    facilities,
    "store",
    "grocery",
    "nearest_store_dist_m"
  ) ?? facilityDistance(infrastructure, "nearest_store_dist_m");

  if (hospitalDistance !== null) {
    score += hospitalDistance < 1500 ? 1.0 : hospitalDistance < 3000 ? 0.5 : 0;
  }
  if (storeDistance !== null) {
    score += storeDistance < 400 ? 1.0 : storeDistance < 1000 ? 0.5 : 0;
  }

  const noiseBracket = noise.bracket ?? noise.estimated_bracket;
  score +=
    noiseBracket === "Low / Ambient"
      ? 1.5
      : noiseBracket === "Moderate"
        ? 0.9
        : noiseBracket === "Elevated"
          ? 0.2
          : 0;

  const parkDistance = facilityDistance(
    facilities,
    "park",
    "nearest_park_dist_m"
  ) ?? facilityDistance(infrastructure, "nearest_park_dist_m");
  if (parkDistance !== null) {
    score += parkDistance < 600 ? 1.0 : parkDistance < 1500 ? 0.5 : 0;
  }

  return Math.round(Math.min(10, Math.max(1, score)) * 10) / 10;
}
