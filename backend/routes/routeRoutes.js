import express from "express";
import { getRoutes } from "../controllers/routeController.js";

const router = express.Router();

router.post("/", getRoutes);

export default router;
