import prisma from "../prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addToCart = asyncHandler(async (req, res) => {

  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new ApiError(400, "ProductId and quantity required");
  }

  // 1️⃣ Check product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // 2️⃣ Check stock
  if (product.stockQuantity < quantity) {
    throw new ApiError(400, "Insufficient stock");
  }

  // 3️⃣ Find or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId }
    });
  }

  // 4️⃣ Check if item already exists
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId
      }
    }
  });

  if (existingItem) {
    // update quantity
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity
      }
    });

  } else {
    // create new item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      }
    });
  }

  return res.json({
    message: "Item added to cart"
  });

});

export const getCart = asyncHandler(async (req, res) => {

  const userId = req.user?.userId || req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

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

  // If no cart exists → return empty
  if (!cart) {
    return res.json({ items: [] });
  }

  return res.json({
    items: cart.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: item.product
    }))
  });

});

export const updateCartItem = asyncHandler(async (req, res) => {

  const userId = req.user?.userId || req.user?.id;
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    throw new ApiError(400, "ProductId and quantity required");
  }

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than 0");
  }

  // 1️⃣ Find cart
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // 2️⃣ Find cart item
  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId
      }
    }
  });

  if (!item) {
    throw new ApiError(404, "Item not found in cart");
  }

  // 3️⃣ Validate stock
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.stockQuantity < quantity) {
    throw new ApiError(400, "Insufficient stock");
  }

  // 4️⃣ Update quantity
  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity }
  });

  return res.json({
    message: "Cart updated"
  });

});

export const removeCartItem = asyncHandler(async (req, res) => {

  const userId = req.user?.userId || req.user?.id;
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "ProductId is required");
  }

  // 1️⃣ Find cart
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // 2️⃣ Find item
  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId
      }
    }
  });

  if (!item) {
    throw new ApiError(404, "Item not found in cart");
  }

  // 3️⃣ Delete item
  await prisma.cartItem.delete({
    where: { id: item.id }
  });

  return res.json({
    message: "Item removed"
  });

});