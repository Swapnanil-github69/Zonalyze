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
export async function fetchAddress(lat: number, lon: number): Promise<AddressData> {
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

    return {
      displayName: data.display_name || fallback.displayName,
      suburb: addr.suburb || addr.neighbourhood || addr.residential || "",
      city: addr.city || addr.town || addr.municipality || addr.county || "Unknown City",
      state: addr.state || "",
      pincode: addr.postcode || null,
    };
  } catch (error) {
    return fallback;
  }
}
