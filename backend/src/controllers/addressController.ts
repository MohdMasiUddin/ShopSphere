import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const addressSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().min(10),
  street: z.string().trim().min(3),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  postalCode: z.string().trim().min(4),
  country: z.string().trim().min(2).default("India"),
});

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve addresses",
    });
  }
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const validation = addressSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid address details",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const address = await prisma.address.create({
      data: {
        ...validation.data,
        userId: req.user!.userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      address,
    });
  } catch (error) {
    console.error("Create address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create address",
    });
  }
};

