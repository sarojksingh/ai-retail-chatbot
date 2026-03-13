//const express = require("express");
import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();
//const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

//module.exports = router;
export default router;