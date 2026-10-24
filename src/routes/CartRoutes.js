import express from "express";
import { getCart, createCart, addToCart, removeFromCart ,clearCart} from "../controllers/CartController.js"; 

const router = express.Router(); 

router.get("/:cartId", getCart);
router.post("/", createCart);
router.post("/:cartId", addToCart);
router.delete("/:cartId", removeFromCart);
router.delete("/:cartId/clear", clearCart);
export default router;