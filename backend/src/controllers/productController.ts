import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// Get all active products
export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// Get a single product by ID
export const getProductById = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
      },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
    });
  }
};

// Search and filter products
export const searchProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const search = String(req.query.search || "").trim();
    const category = String(req.query.category || "").trim();
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (req.query.minPrice !== undefined) {
      if (!Number.isFinite(minPrice) || minPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid minimum price",
        });
      }

      where.price = {
        ...where.price,
        gte: minPrice,
      };
    }

    if (req.query.maxPrice !== undefined) {
      if (!Number.isFinite(maxPrice) || maxPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid maximum price",
        });
      }

      where.price = {
        ...where.price,
        lte: maxPrice,
      };
    }

    if (
      req.query.minPrice !== undefined &&
      req.query.maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "Minimum price cannot exceed maximum price",
      });
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Search products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search products",
    });
  }
};

// Create a new product (Admin only)
export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      sku,
      stock,
      imageUrl,
      categoryId,
      isFeatured,
    } = req.body;

    if (
      !name ||
      !slug ||
      !description ||
      !sku ||
      !imageUrl ||
      !categoryId ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields",
      });
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock ?? 0);
    const parsedCategoryId = Number(categoryId);

    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0 ||
      !Number.isInteger(parsedStock) ||
      parsedStock < 0 ||
      !Number.isInteger(parsedCategoryId) ||
      parsedCategoryId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid price, stock, or category",
      });
    }

    if (
      originalPrice !== undefined &&
      originalPrice !== null &&
      (!Number.isFinite(Number(originalPrice)) ||
        Number(originalPrice) <= parsedPrice)
    ) {
      return res.status(400).json({
        success: false,
        message: "Original price must be greater than selling price",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parsedPrice,
        originalPrice:
          originalPrice === undefined || originalPrice === null
            ? null
            : Number(originalPrice),
        sku,
        stock: parsedStock,
        imageUrl,
        categoryId: parsedCategoryId,
        isFeatured: Boolean(isFeatured),
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product. Check whether the SKU or slug already exists.",
    });
  }
};

// Update an existing product (Admin only)
export const updateProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      sku,
      stock,
      imageUrl,
      categoryId,
      isFeatured,
      isActive,
    } = req.body;

    const data: any = {};

    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (sku !== undefined) data.sku = sku;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;

    if (price !== undefined) {
      const parsedPrice = Number(price);

      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid product price",
        });
      }

      data.price = parsedPrice;
    }

    if (originalPrice !== undefined) {
      if (
        originalPrice !== null &&
        (!Number.isFinite(Number(originalPrice)) ||
          Number(originalPrice) <= Number(data.price ?? existingProduct.price))
      ) {
        return res.status(400).json({
          success: false,
          message: "Original price must be greater than selling price",
        });
      }

      data.originalPrice =
        originalPrice === null ? null : Number(originalPrice);
    }

    if (stock !== undefined) {
      const parsedStock = Number(stock);

      if (!Number.isInteger(parsedStock) || parsedStock < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid stock quantity",
        });
      }

      data.stock = parsedStock;
    }

    if (categoryId !== undefined) {
      const parsedCategoryId = Number(categoryId);

      if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      data.categoryId = parsedCategoryId;
    }

    if (isFeatured !== undefined) {
      if (typeof isFeatured !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isFeatured must be true or false",
        });
      }

      data.isFeatured = isFeatured;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false",
        });
      }

      data.isActive = isActive;
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product. Check whether the SKU or slug already exists.",
    });
  }
};

// Delete a product by deactivating it (Admin only)
export const deleteProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!existingProduct.isActive) {
      return res.status(400).json({
        success: false,
        message: "Product is already inactive",
      });
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });

    res.status(200).json({
      success: true,
      message: "Product removed from the storefront successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
};

export const getAdminProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get admin products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};
