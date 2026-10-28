import { Router } from "express";
import { createOrder, getOrders } from "../controllers/OrderController.js";
import verifyGuestSession  from "../middleware/verifyGuestSession.js";

const router = Router();

router.post("/", verifyGuestSession, createOrder);
router.get("/", verifyGuestSession, getOrders);

export default router;