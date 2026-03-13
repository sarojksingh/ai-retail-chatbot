//const express = require("express");
import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();
//const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/verify-email", authController.verifyEmail);
router.post("/send-verification-email", authController.sendVerificationEmail);

//module.exports = router;
export default router;