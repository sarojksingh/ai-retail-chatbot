import express from "express";
import { addToCart, getCart, 
    updateCartItem, removeCartItem } from "../controllers/cartController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { addToCartSchema } from "../validators/cartValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/add", 
    authenticate, 
    //validateRequest(addToCartSchema),
    addToCart);
router.get("/", authenticate, getCart);
router.patch("/item", authenticate, updateCartItem);
router.delete("/item", authenticate, removeCartItem);    

export default router;