import { Router } from "express";
import { InvestigateController } from "../controllers/investigate.controller.js";

const router = Router();

router.post("/investigate", InvestigateController.investigateCoordinate);
router.post("/investigate/chat", InvestigateController.chatAboutLocation);
router.get("/investigate/tts", InvestigateController.textToSpeech);

export default router;
