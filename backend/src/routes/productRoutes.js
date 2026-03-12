//const express = require("express");
import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeAdmin } from "../middleware/roleMiddleware.js";
import * as productController from "../controllers/productController.js";

const router = express.Router();
//const productController = require("../controllers/productController");
//const { authenticate } = require("../middleware/authMiddleware");
//const { authorizeAdmin } = require("../middleware/roleMiddleware");

// Public routes
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// Admin routes 

    //Un-secure routes
    //router.post("/", productController.createProduct);
    //router.put("/:id", productController.updateProduct);
    //router.delete("/:id", productController.deleteProduct);

//Secure routes
router.post("/", authenticate, authorizeAdmin, productController.createProduct);
router.put("/:id", authenticate, authorizeAdmin, productController.updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, productController.deleteProduct);

//module.exports = router;
export default router;