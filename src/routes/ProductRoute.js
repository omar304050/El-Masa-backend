import express from 'express';
import { getProducts, createProduct, getProductById, editProductById, deleteProductById } from '../controllers/ProductController.js';
import upload from '../middleware/upload.js';
import  verifyAdmin  from '../middleware/VerifyAdmin.js';
const router = express.Router();

router.get('/', getProducts);
router.post("/", verifyAdmin, upload.array("images", 5), createProduct);
router.get("/:id", getProductById);
router.put("/:id", verifyAdmin, editProductById);
router.delete("/:id", verifyAdmin, deleteProductById);
export default router;