import prisma from "../prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const getCategories = asyncHandler( async (req, res) => {
  //try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    if (categories) {
      res.json(categories);
    } else {
      throw new ApiError(404, "Failed to fetch categories");
    }
  //} catch (err) {
  //  res.status(500).json({ error: "Failed to fetch categories" });
  //}
});

export const createCategory = asyncHandler( async (req, res) => {
  //try {
    const { name, slug } = req.body;

    const category = await prisma.category.create({
      data: { name, slug },
    });

    if (category.name === "undefined" || category.id === "undefined"){
      throw new ApiError(400, "Failed to create category");
    } else {
      res.status(201).json(category);
    }
  //} catch (err) {
  //  res.status(400).json({ error: "Failed to create category" });
  //}

});