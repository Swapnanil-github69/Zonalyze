import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Zonalyze API",
    timestamp: new Date().toISOString(),
  });
});

export default router;
