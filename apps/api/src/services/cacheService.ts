import { CacheService } from "./cache.service.js";

export function findNearbyInvestigation(latitude: number, longitude: number, forceRefresh = false) {
  return CacheService.findNearbyInvestigation(latitude, longitude, forceRefresh);
}

export function invalidateMemoryCache(id?: any) {
  return CacheService.invalidateMemoryCache(id);
}
