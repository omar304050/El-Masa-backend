import express from "express";
import { getCart, createCart, addToCart, removeFromCart } from "../controllers/CartController.js"; 

const router = express.Router(); 

router.get("/:cartId", getCart);
router.post("/", createCart);
router.post("/:cartId", addToCart);
router.delete("/:cartId", removeFromCart);
export default router;