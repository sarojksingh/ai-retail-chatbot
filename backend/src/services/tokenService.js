import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import crypto from "crypto";

export const generateAccessToken = (user) => {

  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = async (user) => {

  const token = crypto.randomBytes(64).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt
    }
  });

  return token;
};