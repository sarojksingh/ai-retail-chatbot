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

export const confirmCheckout = asyncHandler(async (req, res) => {

  const userId = req.user?.userId || req.user?.id;
  const { id } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const result = await prisma.$transaction(async (tx) => {

    // 1️⃣ Validate checkout
    const checkout = await tx.checkout.findUnique({
      where: { id }
    });

    if (!checkout) {
      throw new ApiError(404, "Checkout not found");
    }

    if (checkout.userId !== userId) {
      throw new ApiError(403, "Access denied");
    }

    if (checkout.status === "COMPLETED") {
      throw new ApiError(400, "Checkout already completed");
    }

    // 2️⃣ Get cart
    const cart = await tx.cart.findUnique({
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

    // 3️⃣ Validate stock
    for (const item of cart.items) {
      if (item.product.stockQuantity < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for ${item.product.name}`
        );
      }
    }

    // 4️⃣ Calculate total
    let totalAmount = 0;
    for (const item of cart.items) {
      totalAmount += item.product.price * item.quantity;
    }

    // 5️⃣ Create order
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    });

    // 6️⃣ Deduct stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity
          }
        }
      });
    }

    // 7️⃣ Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    // 8️⃣ Update checkout
    await tx.checkout.update({
      where: { id },
      data: { status: "COMPLETED" }
    });

    return order;

  });

  return res.json({
    message: "Checkout confirmed and order created",
    orderId: result.id
  });

});