//const express = require("express");
import express from "express";
import * as authController from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();
//const authController = require("../controllers/authController");

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authLimiter, authController.resetPassword);
router.post("/verify-email", authController.verifyEmail);
router.post("/send-verification-email", authLimiter, authController.sendVerificationEmail);

//module.exports = router;
export default router;