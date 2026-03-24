import express from "express";
import {
  createOrder,
  getCheckoutSummary,
  getOrders,
  processOrderPayment,
  updateOrderStatus
} from "../controllers/orderController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/checkout/summary", authenticate, getCheckoutSummary);
router.post("/", authenticate, createOrder);
router.get("/", authenticate, getOrders);
router.patch("/:id/payment", authenticate, processOrderPayment);
router.patch("/:id/status", authenticate, authorizeAdmin, updateOrderStatus);

export default router;
