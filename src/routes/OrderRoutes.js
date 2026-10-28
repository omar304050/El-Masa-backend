import { Router } from "express";
import { createOrder } from "../controllers/OrderController.js";
import verifyGuestSession  from "../middleware/verifyGuestSession.js";

const router = Router();

router.post("/", verifyGuestSession, createOrder);


export default router;