
import prisma from "../prisma.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
//import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken
} from "../services/tokenService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

//User Register function
export const register = asyncHandler( async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  //try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    res.json({ message: "User registered", user });
  /*} catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }*/
});

//Login function
export const login = asyncHandler( async (req, res) => {

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    //return res.status(401).json({ message: "Invalid credentials" });
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    //return res.status(401).json({ message: "Invalid credentials" });
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
});

//Refresh token function
export const refreshToken = asyncHandler( async (req, res) => {

  //try {

    const token = req.cookies.refreshToken;

    if (!token) {
      //return res.status(401).json({ message: "No refresh token" });
      throw new ApiError(401, "No refresh token");
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token }
    });

    if (!storedToken || storedToken.revoked) {
      //return res.status(403).json({ message: "Invalid refresh token" });
      throw new ApiError(403, "Invalid refresh token");
    }

    if (new Date() > storedToken.expiresAt) {
      //return res.status(403).json({ message: "Token expired" });
      throw new ApiError(403, "Token expired");
    }

    const user = await prisma.user.findUnique({
      where: { id: storedToken.userId }
    });

    // generate new tokens
    const accessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken });

  /*} catch (error) {
    console.error("Refresh token error:-", error);
    return res.status(403).json({ error: "Invalid refresh token" });
  }*/
});

//Logout function
export const logout = asyncHandler( async (req, res) => {

  //try {

    const token = req.cookies.refreshToken;

    if (!token) {
      //return res.status(400).json({ message: "No refresh token" });
      throw new ApiError(400, "No refresh token");
    }

    await prisma.refreshToken.updateMany({
      where: { token, revoked: false },
      data: { revoked: true }
    });

    res.clearCookie("refreshToken");

    res.json({
      message: "Logged out successfully"
    });
  /*} catch(error) {
    console.error("Logout error:-", error);
    return res.status(500).json({ error: "Logout failed" });

  }*/
});

//Forgot password function
export const forgotPassword = asyncHandler( async (req, res) => {

  //try {

    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      //return res.status(404).json({ message: "User not found" });
      throw new ApiError(404, "User not found!");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    // DEV MODE → return token
    return res.json({
      message: "Password reset token generated",
      resetToken: token
    });

    /*
    // PRODUCTION EMAIL (commented)
    await sendResetEmail(user.email, token);
    */

  /*} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to generate reset token" });
  }*/

});

//Reset password function
export const resetPassword = asyncHandler( async (req, res) => {

  //try {

    const { token, newPassword } = req.body;

    const storedToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!storedToken) {
      //return res.status(400).json({ message: "Invalid reset token" });
      throw new ApiError(400, "Invalid reset token");
    }

    if (new Date() > storedToken.expiresAt) {
      //return res.status(400).json({ message: "Reset token expired" });
      throw new ApiError(400, "Reset token expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: storedToken.userId },
      data: { passwordHash: hashedPassword }
    });

    await prisma.passwordResetToken.delete({
      where: { token }
    });

    return res.json({
      message: "Password reset successful"
    });

  /*} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Password reset failed" });
  }*/

});

//Email verification mail send
export const sendVerificationEmail = asyncHandler(async (req, res) => {

  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt
    }
  });

  res.json({
    message: "Verification token generated",
    token
  });

  /*
  // EMAIL SERVICE (future)
  await sendVerificationEmail(user.email, token);
  */

});

//Verify Email 
export const verifyEmail = asyncHandler(async (req, res) => {

  const { token } = req.body;

  const storedToken = await prisma.emailVerificationToken.findUnique({
    where: { token }
  });

  if (!storedToken) {
    throw new ApiError(400, "Invalid verification token");
  }

  if (new Date() > storedToken.expiresAt) {
    throw new ApiError(400, "Verification token expired");
  }

  await prisma.user.update({
    where: { id: storedToken.userId },
    data: { emailVerified: true }
  });

  await prisma.emailVerificationToken.delete({
    where: { token }
  });

  res.json({
    message: "Email verified successfully"
  });

});

