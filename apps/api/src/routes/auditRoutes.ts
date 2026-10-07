import { Router } from "express";
import { forwardGeocode, auditLocation } from "../controllers/auditController.js";

const router = Router();

router.get("/geocode", forwardGeocode);
router.get("/audit/geocode", forwardGeocode);
router.post("/audit", auditLocation);

export default router;
