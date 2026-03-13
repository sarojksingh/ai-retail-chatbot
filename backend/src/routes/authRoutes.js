//const express = require("express");
import express from "express";
import * as authController from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validators/authSchemas.js";

const router = express.Router();

router.post("/register", 
    authLimiter, 
    validateRequest(registerSchema),
    authController.register);
router.post("/login", 
    authLimiter,
    validateRequest(loginSchema), 
    authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/forgot-password", 
    authLimiter,
    validateRequest(forgotPasswordSchema), 
    authController.forgotPassword);
router.post("/reset-password", 
    authLimiter, 
    validateRequest(resetPasswordSchema),
    authController.resetPassword);
router.post("/verify-email", authController.verifyEmail);
router.post("/send-verification-email", authLimiter, authController.sendVerificationEmail);

//module.exports = router;
export default router;