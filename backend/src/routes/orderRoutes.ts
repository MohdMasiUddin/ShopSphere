import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,

} from "../controllers/orderController.js";
import { authenticate, authorizeAdmin, } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticate, createOrder);
router.get("/my-orders", authenticate, getMyOrders);
router.get("/", authenticate, authorizeAdmin, getAllOrders);
router.patch("/:id/status", authenticate, authorizeAdmin, updateOrderStatus);

export default router;

