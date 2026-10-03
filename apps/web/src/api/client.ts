import axios from "axios";
import { InvestigationResult } from "../types/investigation";

const apiBase = import.meta.env.VITE_API_URL || "/api";

export const apiClient = axios.create({
  baseURL: apiBase,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export async function investigateCoordinates(
  latitude: number,
  longitude: number
): Promise<InvestigationResult> {
  const response = await apiClient.post<InvestigationResult>("/investigate", {
    latitude,
    longitude,
  });
  return response.data;
}
