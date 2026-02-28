const prisma = require("../prisma");

// Get all products with pagination + category filter
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const skip = (page - 1) * limit;

    const where = category
      ? { category: { slug: category } }
      : {};

    const products = await prisma.product.findMany({
      where,
      skip: Number(skip),
      take: Number(limit),
      include: {
        category: true,
        images: true,
      },
    });

    const total = await prisma.product.count({ where });

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      sku,
      stockQuantity,
      categoryId,
    } = req.body;

    // Basic validation
    if (!name || !slug || !price || !categoryId) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    if (isNaN(price)) {
      return res.status(400).json({ error: "Price must be number" });
    }

    if (!Number.isInteger(Number(stockQuantity))) {
      return res.status(400).json({ error: "Stock must be integer" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price) ,
        sku,
        stockQuantity: parseInt(stockQuantity),
        categoryId,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create product" });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.product.update({
      where: { id },
      data: req.body,
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to update product" });
    console.error(error);
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete product" });
  }
};