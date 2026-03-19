import prisma from "../../src/prisma.js";

export const createTestProduct = async (overrides = {}) => {
  const product = await prisma.product.create({
    data: {
      name: "Test Product",
      price: 100,
      stockQuantity: 10,
      description: "Test description",
      slug: "test-product"
    }
  });

  return product;
};