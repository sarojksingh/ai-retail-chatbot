import express from "express";
import { createCheckout } from "../controllers/checkoutController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createCheckout);


export default router;