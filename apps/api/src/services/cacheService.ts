import { CacheService } from "./cache.service.js";

export function findNearbyInvestigation(latitude: number, longitude: number) {
  return CacheService.findNearbyInvestigation(latitude, longitude);
}
