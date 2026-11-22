
import express from "express";
import { adminLogin, adminLogout , getAllOrders } from "../controllers/AdminController.js";
import verifyAdmin from "../middleware/VerifyAdmin.js";
import { getDashboardStats } from "../controllers/AdminController.js";
const router = express.Router();

router.post("/login", adminLogin);
router.get("/dashboard",verifyAdmin, getDashboardStats);
router.get("/getAllOrders", verifyAdmin , getAllOrders)
router.post("/logout", verifyAdmin, adminLogout);   


export default router;
