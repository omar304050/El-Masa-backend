import express from "express";
import { getCart, createCart } from "../controllers/CartController.js"; 

const router = express.Router(); 

router.get("/:cartId", getCart);
router.post("/", createCart);

export default router;