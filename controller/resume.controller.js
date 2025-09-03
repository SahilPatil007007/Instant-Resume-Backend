import express from "express";
import protectRoute from "../middelware/protectRoute.js"
import { createResume, deleteResume, getResumeById, getUserResumes, updateResume } from "../service/resume.service.js";

const router = express.Router();

router.post("/createresume", protectRoute, createResume);
router.get("/getresume", protectRoute, getUserResumes);
router.get("/byid/:id", protectRoute, getResumeById);
router.put("/updateresume/:id", protectRoute, updateResume);
router.delete("/deleteresume/:id", protectRoute, deleteResume);

export default router;