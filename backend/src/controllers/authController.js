
import prisma from "../prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken
} from "../services/tokenService.js";

//User Register function
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
};

//Login function
export const login = async (req, res) => {

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
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
};

//Refresh token function
export const refreshToken = async (req, res) => {

  try {

    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token }
    });

    if (!storedToken || storedToken.revoked) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    if (new Date() > storedToken.expiresAt) {
      return res.status(403).json({ message: "Token expired" });
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
    
  } catch (error) {
    console.error("Refresh token error:-", error);
    return res.status(403).json({ error: "Invalid refresh token" });
  }
};

//Logout function
export const logout = async (req, res) => {

  try {

    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(400).json({ message: "No refresh token" });
    }

    await prisma.refreshToken.updateMany({
      where: { token, revoked: false },
      data: { revoked: true }
    });

    res.clearCookie("refreshToken");

    res.json({
      message: "Logged out successfully"
    });
  }
  catch(error) {
    console.error("Logout error:-", error);
    return res.status(500).json({ error: "Logout failed" });

  }
};


