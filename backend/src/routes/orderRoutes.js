import express from "express";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/orderController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";

const router = express.Router();

router.post("/", authenticate, createOrder);
router.get("/", authenticate, getOrders);
router.patch("/:id/status", authenticate, authorizeAdmin, updateOrderStatus);

export default router;