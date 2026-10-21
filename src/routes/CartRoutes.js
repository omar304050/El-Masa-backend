import express from "express";
import getCart from "../controllers/CartController.js"; 

const router = express.Router(); 

router.get("/:cartId", getCart);

export default router;