const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
    },
  });

  const fashion = await prisma.category.create({
    data: {
      name: "Fashion",
      slug: "fashion",
    },
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: "iPhone 15",
        slug: "iphone-15",
        description: "Latest Apple smartphone",
        price: 79999,
        sku: "IP15-001",
        stockQuantity: 50,
        categoryId: electronics.id,
      },
      {
        name: "Bluetooth Headphones",
        slug: "bluetooth-headphones",
        description: "Noise cancelling headphones",
        price: 2999,
        sku: "BH-002",
        stockQuantity: 120,
        categoryId: electronics.id,
      },
      {
        name: "Men's T-Shirt",
        slug: "mens-tshirt",
        description: "Cotton casual wear",
        price: 799,
        sku: "TS-003",
        stockQuantity: 200,
        categoryId: fashion.id,
      },
    ],
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });