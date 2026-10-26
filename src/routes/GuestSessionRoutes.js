
import express from "express";
import {
  createGuestSession,
  checkGuestSession,
} from "../controllers/guestSessionController.js";

const router = express.Router();

router.post("/", createGuestSession);
router.get("/", checkGuestSession);

export default router;
