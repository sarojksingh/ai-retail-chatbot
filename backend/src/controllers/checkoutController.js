import prisma from "../prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCheckout = asyncHandler(async (req, res) => {

  const userId = req.user?.userId || req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // 1️⃣ Get cart with items
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // 2️⃣ Calculate total
  let totalAmount = 0;

  for (const item of cart.items) {
    totalAmount += item.product.price * item.quantity;
  }

  // 3️⃣ Create checkout session
  const checkout = await prisma.checkout.create({
    data: {
      userId,
      totalAmount,
      status: "PENDING"
    }
  });

  return res.json({
    message: "Checkout created",
    checkoutId: checkout.id,
    totalAmount
  });

});