import express from "express";
import { getCart, createCart, addToCart } from "../controllers/CartController.js"; 

const router = express.Router(); 

router.get("/:cartId", getCart);
router.post("/", createCart);
router.post("/:cartId", addToCart);
export default router;