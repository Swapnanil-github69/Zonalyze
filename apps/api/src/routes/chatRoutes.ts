import { Router } from "express";
import { handleAuditChat } from "../controllers/chatController.js";

const router = Router();

router.post("/chat", handleAuditChat);

export default router;
