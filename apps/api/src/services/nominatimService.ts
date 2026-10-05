import axios from "axios";

export interface AddressData {
  displayName: string;
  suburb: string;
  city: string;
  state: string;
  pincode: string | null;
}

/**
 * Resolves neighborhood, city, state, and postal code from OpenStreetMap Nominatim
 * without requiring an API key.
 *
 * @param lat Latitude of the target coordinate
 * @param lon Longitude of the target coordinate
 * @returns Parsed AddressData or safe defaults upon failure/timeout
 */
const addressMemoryCache = new Map<string, { timestamp: number; data: AddressData }>();
const ADDR_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function fetchAddress(lat: number, lon: number): Promise<AddressData> {
  const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  const cached = addressMemoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < ADDR_TTL_MS) {
    return cached.data;
  }

  const fallback: AddressData = {
    displayName: `Point (${lat.toFixed(4)},${lon.toFixed(4)})`,
    suburb: "",
    city: "",
    state: "",
    pincode: null,
  };

  try {
    const endpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

    const response = await axios.get(endpoint, {
      headers: {
        "User-Agent": "ZonalyzeApp/1.0 (academic-location-audit)",
        Accept: "application/json",
      },
      timeout: 5000,
    });

    const data = response.data;
    if (!data || data.error) {
      return fallback;
    }

    const addr = data.address || {};

    const result: AddressData = {
      displayName: data.display_name || fallback.displayName,
      suburb: addr.suburb || addr.neighbourhood || addr.residential || "",
      city: addr.city || addr.town || addr.municipality || addr.county || "Unknown City",
      state: addr.state || "",
      pincode: addr.postcode || null,
    };
    addressMemoryCache.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;
  } catch (error) {
    return fallback;
  }
}
