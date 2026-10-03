import { Investigation, IInvestigation } from "../models/Investigation.js";

/**
 * Contributor 2: Database Engineer
 * Geospatial Anti-Rate-Limit Cache:
 * Queries MongoDB Atlas with $near and $maxDistance: 150 (meters) generated within the last 7 days.
 */
export class CacheService {
  public static async findNearbyInvestigation(
    latitude: number,
    longitude: number
  ): Promise<IInvestigation | null> {
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

      return cached;
    } catch (error) {
      console.warn("⚠️ Geospatial cache lookup error (continuing with live fetch):", error);
      return null;
    }
  }

  public static async saveInvestigation(data: Partial<IInvestigation>): Promise<IInvestigation> {
    const investigation = new Investigation(data);
    return await investigation.save();
  }
}
