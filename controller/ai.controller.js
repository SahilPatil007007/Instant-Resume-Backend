import express from "express";
import protectRoute from "../middelware/protectRoute.js";
import { impoveWithAi } from "../service/ai.service.js";

const router = express.Router();

router.post("/improve", protectRoute, impoveWithAi);

export default router;