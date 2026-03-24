import prisma from "../prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserIdFromRequest = (req) => req.user?.userId || req.user?.id;

const getCartWithItems = async (tx, userId) => tx.cart.findUnique({
  where: { userId },
  include: {
    items: {
      include: {
        product: true
      }
    }
  }
});

const calculateCartTotal = (cartItems) => cartItems.reduce((sum, item) => (
  sum + (item.product.price * item.quantity)
), 0);

export const createOrder = asyncHandler(async (req, res) => {

  const userId = getUserIdFromRequest(req);

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const result = await prisma.$transaction(async (tx) => {

    // 1️⃣ Get cart with items
    const cart = await getCartWithItems(tx, userId);

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    // 2️⃣ Validate stock
    for (const item of cart.items) {
      if (item.product.stockQuantity < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for ${item.product.name}`
        );
      }
    }

    // 3️⃣ Calculate total
    const totalAmount = calculateCartTotal(cart.items);

    // 4️⃣ Create order
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price // snapshot
          }))
        }
      }
    });

    // 5️⃣ Deduct stock
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

    // 6️⃣ Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return order;

  });

  return res.json({
    message: "Order created successfully",
    orderId: result.id,
    order: {
      id: result.id,
      status: result.status,
      paymentStatus: result.paymentStatus
    }
  });

});

export const getOrders = asyncHandler(async (req, res) => {

  const userId = getUserIdFromRequest(req);

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return res.json({
    orders: orders.map(order => ({
      id: order.id,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: item.product
      }))
    }))
  });

});

export const getCheckoutSummary = asyncHandler(async (req, res) => {

  const userId = getUserIdFromRequest(req);

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const cart = await getCartWithItems(prisma, userId);

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const subtotal = calculateCartTotal(cart.items);

  return res.json({
    checkout: {
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      totalAmount: subtotal,
      currency: "INR",
      paymentStatus: "PENDING",
      items: cart.items.map(item => ({
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        lineTotal: item.product.price * item.quantity
      }))
    }
  });

});

export const updateOrderStatus = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
  ];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await prisma.order.findUnique({
    where: { id }
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Optional: basic status flow validation
  if (order.status === "DELIVERED") {
    throw new ApiError(400, "Delivered order cannot be updated");
  }

  if (order.status === "CANCELLED") {
    throw new ApiError(400, "Cancelled order cannot be updated");
  }

  await prisma.order.update({
    where: { id },
    data: { status }
  });

  res.json({
    message: "Order status updated"
  });

});

export const processOrderPayment = asyncHandler(async (req, res) => {

  const userId = getUserIdFromRequest(req);
  const { id } = req.params;
  const { paymentStatus } = req.body;

  const validPaymentStatuses = ["PENDING", "PAID", "FAILED"];

  if (!validPaymentStatuses.includes(paymentStatus)) {
    throw new ApiError(400, "Invalid payment status");
  }

  const order = await prisma.order.findUnique({
    where: { id }
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.userId !== userId && req.user?.role !== "Admin") {
    throw new ApiError(403, "Not allowed to update payment for this order");
  }

  if (order.status === "CANCELLED") {
    throw new ApiError(400, "Cannot pay for a cancelled order");
  }

  if (order.paymentStatus === "PAID" && paymentStatus !== "PAID") {
    throw new ApiError(400, "Paid order payment status cannot be downgraded");
  }

  const data = { paymentStatus };

  if (paymentStatus === "PAID" && order.status === "PENDING") {
    data.status = "CONFIRMED";
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data
  });

  return res.json({
    message: "Payment processed successfully",
    order: {
      id: updatedOrder.id,
      status: updatedOrder.status,
      paymentStatus: updatedOrder.paymentStatus
    }
  });

});
