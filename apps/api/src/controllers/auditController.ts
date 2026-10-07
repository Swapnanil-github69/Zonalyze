import { Request, Response } from "express";
import { InvestigateController } from "./investigate.controller.js";
import { handleAuditChat } from "./chatController.js";

/**
 * Forward Geocoding:
 * Converts text queries into coordinates via OpenStreetMap Nominatim.
 */
export const forwardGeocode = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, error: "Query string is required." });
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q.trim())}&format=jsonv2&limit=5&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Zonalyze-Location-Audit-App/1.0 (https://zonalyze.in; contact@zonalyze.in)",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ success: false, error: "Upstream geocoding service unreachable." });
    }

    const results = await response.json();

    const formatted = results.map((item: any) => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));

    return res.status(200).json({ success: true, results: formatted });
  } catch (err: any) {
    console.error("[ForwardGeocode Error]:", err?.message || err);
    return res.status(500).json({ success: false, error: "Failed to forward geocode query." });
  }
};

/**
 * Audit Controller:
 * Handles high-speed decoupled location audits and dynamic conversational inquiries.
 */
export const auditLocation = InvestigateController.investigateCoordinate;
export const investigateCoordinate = InvestigateController.investigateCoordinate;
export { handleAuditChat, InvestigateController };
export default InvestigateController;
