import { Router } from "express";
import {
  getInvestigationById,
  getRecentInvestigations,
  investigateLocation,
} from "../controllers/investigateController.js";
import { InvestigateController } from "../controllers/investigate.controller.js";

const router = Router();

router.post("/investigate", InvestigateController.investigateCoordinate);
router.get("/investigations/recent", getRecentInvestigations);
router.get("/investigations/:id", getInvestigationById);
router.post("/investigate/chat", InvestigateController.chatAboutLocation);
router.get("/investigate/tts", InvestigateController.textToSpeech);

export default router;
