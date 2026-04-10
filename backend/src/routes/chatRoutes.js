//const express = require("express");
import express from "express";
import { chatHandler } from "../controllers/chatController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, chatHandler);

//module.exports = router;
export default router;