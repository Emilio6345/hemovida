import { Router } from "express";
import { consultarBot } from "../controllers/bot_controller.js";

const router = Router();

// POST /api/v1/bot/generate
router.post("/generate", consultarBot);

export default router;