import { Router } from "express";
import { InvestigateController } from "../controllers/investigate.controller.js";

const router = Router();

router.post("/investigate", InvestigateController.investigateCoordinate);
router.post("/investigate/chat", InvestigateController.chatAboutLocation);

export default router;
