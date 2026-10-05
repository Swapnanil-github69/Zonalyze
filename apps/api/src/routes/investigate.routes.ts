import { Router } from "express";
import { InvestigateController } from "../controllers/investigate.controller.js";
import {
  getInvestigationById,
  getRecentInvestigations,
  investigateLocation,
} from "../controllers/investigateController.js";

const router = Router();

router.post("/investigate", investigateLocation);
router.get("/investigate/recent", getRecentInvestigations);
router.post("/investigate/chat", InvestigateController.chatAboutLocation);
router.get("/investigate/tts", InvestigateController.textToSpeech);
router.get("/investigate/:id", getInvestigationById);

export default router;
