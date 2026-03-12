//const express = require("express");
import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();
//const categoryController = require("../controllers/categoryController");
//const { authenticate } = require("../middleware/authMiddleware");
//const { authorizeAdmin } = require("../middleware/roleMiddleware");

// Public
router.get("/", categoryController.getCategories);

// Admin only
router.post("/", authenticate, authorizeAdmin, categoryController.createCategory);

//module.exports = router;
export default router;