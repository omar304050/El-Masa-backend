
import express from "express";
import { adminLogin } from "../controllers/AdminController.js";
import verifyAdmin from "../middleware/VerifyAdmin.js";
import { getDashboardStats } from "../controllers/AdminController.js";
const router = express.Router();

router.post("/login", adminLogin);
router.get("/dashboard", getDashboardStats);


export default router;
