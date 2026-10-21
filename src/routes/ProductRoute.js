import express from 'express';
import { getProducts, createProduct, getProductById, editProductById } from '../controllers/ProductController.js';
import upload from '../middleware/upload.js';
const router = express.Router();

router.get('/', getProducts);
router.post("/", upload.array("images", 5), createProduct);
router.get("/:id", getProductById);
router.put("/:id", editProductById);

export default router;