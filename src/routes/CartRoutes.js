import express from "express";
import { getCart, createCart, addToCart, removeFromCart ,clearCart} from "../controllers/CartController.js"; 
import  verifyGuestSession  from "../middleware/verifyGuestSession.js";

const router = express.Router(); 

router.get("/:cartId", verifyGuestSession, getCart);
router.post("/", verifyGuestSession, createCart);
router.post("/:cartId", verifyGuestSession, addToCart);
router.delete("/:cartId", verifyGuestSession, removeFromCart);
router.delete("/:cartId/clear", verifyGuestSession, clearCart);
export default router;