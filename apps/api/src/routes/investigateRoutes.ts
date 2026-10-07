import { Router } from "express";
import {
  getInvestigationById,
  getRecentInvestigations,
  investigateLocation,
} from "../controllers/investigateController.js";
import { InvestigateController } from "../controllers/investigate.controller.js";
import { forwardGeocode } from "../controllers/auditController.js";

const router = Router();

router.post("/investigate", InvestigateController.investigateCoordinate);
router.get("/investigations/recent", getRecentInvestigations);
router.get("/investigations/:id", getInvestigationById);
router.get("/investigations/:id/debrief", InvestigateController.hydrateDebrief);
router.post("/investigate/chat", InvestigateController.chatAboutLocation);
router.get("/investigate/tts", InvestigateController.textToSpeech);
router.get("/geocode", forwardGeocode);
router.get("/geocode/search", forwardGeocode);
router.get("/audit/geocode", forwardGeocode);

export default router;
