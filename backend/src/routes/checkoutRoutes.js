import express from "express";
import { createCheckout, confirmCheckout } from "../controllers/checkoutController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createCheckout);
router.post("/:id/confirm", authenticate, confirmCheckout);


export default router;