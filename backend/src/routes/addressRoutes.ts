import { Router } from "express";
import {
  getAddresses,
  createAddress,
} from "../controllers/addressController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticate, getAddresses);
router.post("/", authenticate, createAddress);

export default router;

