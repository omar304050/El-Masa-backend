import express from "express";
import { getCart, createCart, addToCart, removeFromCart } from "../controllers/CartController.js"; 

const router = express.Router(); 

router.get("/:cartId", getCart);
router.post("/", createCart);
router.post("/:cartId", addToCart);
router.delete("/:cartId", removeFromCart);
router.delete("/:cartId", (req, res) => {
    return res.status(200).json({
      test: "DELETE ROUTE WORKS",
      cartId: req.params.cartId,
    });
  });
export default router;