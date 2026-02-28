const prisma = require("../prisma");

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const category = await prisma.category.create({
      data: { name, slug },
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: "Failed to create category" });
  }
};