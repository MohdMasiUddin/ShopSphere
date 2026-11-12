import { Router } from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadProductImage } from "../controllers/uploadController.js";



import {
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
} from "../controllers/productController.js";

import {
  authenticate,
  authorizeAdmin,
} from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/upload-image",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  uploadProductImage
);

router.get(
  "/admin/all",
  authenticate,
  authorizeAdmin,
  getAdminProducts
);

// Public routes
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);

// Admin-only routes
router.post("/", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
