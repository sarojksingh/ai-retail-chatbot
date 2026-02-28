const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorizeAdmin } = require("../middleware/roleMiddleware");

// Public
router.get("/", categoryController.getCategories);

// Admin only
router.post("/", authenticate, authorizeAdmin, categoryController.createCategory);

module.exports = router;