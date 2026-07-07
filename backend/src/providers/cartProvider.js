
import prisma from "../prisma.js";

export const cartProvider = {
  async addItem(userId, productId, quantity = 1) {
    const cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: {
          id: existingItem.id
        },
        data: {
          quantity: existingItem.quantity + quantity
        }
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      }
    });
  }
};