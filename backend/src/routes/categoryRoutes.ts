import { Router } from "express";

import {
  getCategories,
  createCategory,
} from "../controllers/categoryController.js";

import {
  authenticate,
  authorizeAdmin,
} from "../middleware/authMiddleware.js";

const router = Router();

// Public route
router.get("/", getCategories);

// Admin-only route
router.post("/", authenticate, authorizeAdmin, createCategory);

export default router;

