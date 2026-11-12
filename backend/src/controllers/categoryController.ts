import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// Get all categories
export const getCategories = async (
  _req: Request,
  res: Response
) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// Create a new category (Admin only)
export const createCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, slug, imageUrl } = req.body;

    if (
      typeof name !== "string" ||
      typeof slug !== "string" ||
      !name.trim() ||
      !slug.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Category name and slug are required",
      });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        imageUrl: imageUrl || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create category. The name or slug may already exist.",
    });
  }
};

