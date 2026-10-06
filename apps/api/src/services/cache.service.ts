import { Investigation, IInvestigation } from "../models/Investigation.js";

/**
 * Contributor 2: Database Engineer
 * Geospatial Anti-Rate-Limit Cache:
 * Queries MongoDB Atlas with $near and $maxDistance: 150 (meters) generated within the last 7 days.
 */
interface CachedInvestigation {
  lat: number;
  lon: number;
  timestamp: number;
  data: IInvestigation;
}

const memoryInvestigations: CachedInvestigation[] = [];
const MEMORY_CACHE_TTL = 15 * 60 * 1000; // 15 mins
const MAX_MEMORY_ITEMS = 50;

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isInvestigationCorrupted(cached: any): boolean {
  if (!cached) return false;
  const railName = (
    cached.facilities?.railway?.name ||
    cached.infrastructure?.nearest_railway_name ||
    ""
  ).toLowerCase();
  const metroName = (
    cached.facilities?.metro?.name ||
    cached.infrastructure?.nearest_metro_name ||
    ""
  ).toLowerCase();
  const hasAirport = Boolean(cached.facilities?.airport?.name);

  // Stale detection: if rail station has "metro" or "line 1" or "line 2" or "esplanade" or "central",
  // or if airport is completely missing in an urban area, PURGE AND RE-RUN:
  return (
    railName.includes("line 1") ||
    railName.includes("line 2") ||
    railName.includes("esplanade") ||
    railName.includes("central") ||
    railName.includes("chandni chowk") ||
    railName.includes("metro") ||
    metroName.includes("kamarkundu") ||
    !hasAirport
  );
}

export class CacheService {
  public static invalidateMemoryCache(id?: any): void {
    if (!id) {
      memoryInvestigations.length = 0;
      return;
    }
    const idStr = String(id);
    for (let i = memoryInvestigations.length - 1; i >= 0; i--) {
      if (String(memoryInvestigations[i].data?._id) === idStr) {
        memoryInvestigations.splice(i, 1);
      }
    }
  }

  public static async findNearbyInvestigation(
    latitude: number,
    longitude: number,
    forceRefresh = false
  ): Promise<IInvestigation | null> {
    // 1. Fast in-memory check (<1ms)
    const now = Date.now();
    for (let i = memoryInvestigations.length - 1; i >= 0; i--) {
      const item = memoryInvestigations[i];
      if (now - item.timestamp >= MEMORY_CACHE_TTL) {
        memoryInvestigations.splice(i, 1);
        continue;
      }
      if (haversineMeters(latitude, longitude, item.lat, item.lon) <= 150) {
        if (forceRefresh || isInvestigationCorrupted(item.data)) {
          memoryInvestigations.splice(i, 1);
          continue;
        }
        return item.data;
      }
    }

    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const cached = await Investigation.findOne({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude], // GeoJSON order: [lon, lat]
            },
            $maxDistance: 150, // 150 meters radius
          },
        },
        createdAt: { $gte: sevenDaysAgo },
      }).exec();

      if (cached) {
        if (forceRefresh || isInvestigationCorrupted(cached)) {
          console.log("[api] Purging corrupted/stale cache entry for coordinate:", cached._id);
          try {
            await Investigation.deleteOne({ _id: cached._id });
          } catch (delErr) {
            console.warn("⚠️ Failed to delete corrupted document:", delErr);
          }
          CacheService.invalidateMemoryCache(cached._id);
          return null;
        }

        memoryInvestigations.unshift({
          lat: latitude,
          lon: longitude,
          timestamp: now,
          data: cached,
        });
        if (memoryInvestigations.length > MAX_MEMORY_ITEMS) memoryInvestigations.pop();
        return cached;
      }

      return null;
    } catch (error) {
      console.warn("⚠️ Geospatial cache lookup error (continuing with live fetch):", error);
      return null;
    }
  }

  public static async saveInvestigation(data: Partial<IInvestigation> | Record<string, any>): Promise<IInvestigation> {
    const investigation = new Investigation(data);
    const saved = await investigation.save();

    const coords = data.location?.coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      memoryInvestigations.unshift({
        lon: coords[0],
        lat: coords[1],
        timestamp: Date.now(),
        data: saved,
      });
      if (memoryInvestigations.length > MAX_MEMORY_ITEMS) memoryInvestigations.pop();
    }

    return saved;
  }
}
