import { Router } from "express";
import { getDashboardOverview, getAdminCustomers, } from "../controllers/adminController.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  authorizeAdmin,
  getDashboardOverview
);

router.get(
  "/customers",
  authenticate,
  authorizeAdmin,
  getAdminCustomers
);


export default router;
