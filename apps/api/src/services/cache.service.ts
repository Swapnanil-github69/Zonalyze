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

export class CacheService {
  public static async findNearbyInvestigation(
    latitude: number,
    longitude: number
  ): Promise<IInvestigation | null> {
    // 1. Fast in-memory check (<1ms)
    const now = Date.now();
    for (const item of memoryInvestigations) {
      if (now - item.timestamp < MEMORY_CACHE_TTL) {
        if (haversineMeters(latitude, longitude, item.lat, item.lon) <= 150) {
          return item.data;
        }
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
        memoryInvestigations.unshift({
          lat: latitude,
          lon: longitude,
          timestamp: now,
          data: cached,
        });
        if (memoryInvestigations.length > MAX_MEMORY_ITEMS) memoryInvestigations.pop();
      }

      return cached;
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
