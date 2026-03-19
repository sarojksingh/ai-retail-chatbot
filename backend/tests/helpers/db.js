import prisma from "../../src/prisma.js";

export const cleanDB = async () => {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany({
    where: {
      name: 'Test User'
    }
  });
};