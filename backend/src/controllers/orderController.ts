import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const orderSchema = z.object({
  addressId: z.number().int().positive(),
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().min(1),
    })
  ).min(1),
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const validation = orderSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid order details",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { addressId, items } = validation.data;
    const userId = req.user!.userId;

    // Verify that the address belongs to this customer.
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      res.status(404).json({
        success: false,
        message: "Shipping address not found",
      });
      return;
    }

    // Combine duplicate product IDs.
    const quantities = new Map<number, number>();

    for (const item of items) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) || 0) + item.quantity
      );
    }

    const order = await prisma.$transaction(async (tx) => {
      const productIds = Array.from(quantities.keys());

      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true,
        },
      });

      if (products.length !== productIds.length) {
        throw new Error("PRODUCT_UNAVAILABLE");
      }

      let total = 0;

      const orderItems = products.map((product) => {
        const quantity = quantities.get(product.id)!;

        if (product.stock < quantity) {
          throw new Error("INSUFFICIENT_STOCK");
        }

        const price = Number(product.price);
        total += price * quantity;

        return {
          productId: product.id,
          quantity,
          price,
        };
      });

      total = Math.round(total * 100) / 100;

      // Reduce stock safely inside the transaction.
      for (const item of orderItems) {
        const result = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (result.count !== 1) {
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

      return tx.order.create({
        data: {
          orderNumber: `SS-${Date.now()}`,
          userId,
          total,
          shippingName: address.fullName,
          shippingPhone: address.phone,
          shippingAddress: address.street,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPostal: address.postalCode,
          items: {
            create: orderItems,
          },
          payment: {
            create: {
              amount: total,
              status: "PENDING",
            },
          },
        },
        include: {
          items: {
            include: { product: true },
          },
          payment: true,
        },
      });
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    if (error instanceof Error) {
      if (error.message === "PRODUCT_UNAVAILABLE") {
        res.status(400).json({
          success: false,
          message: "One or more products are unavailable",
        });
        return;
      }

      if (error.message === "INSUFFICIENT_STOCK") {
        res.status(400).json({
          success: false,
          message: "Insufficient product stock",
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user!.userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
    });
  }
};

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
      return;
    }

    const schema = z.object({
      status: z.enum([
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ]),
    });

    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid order status",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { status } = validation.data;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          payment: true,
        },
      });

      if (!existingOrder) {
        throw new Error("ORDER_NOT_FOUND");
      }

      if (
        existingOrder.status === "DELIVERED" ||
        existingOrder.status === "CANCELLED"
      ) {
        throw new Error("ORDER_ALREADY_FINAL");
      }

      if (existingOrder.status === "SHIPPED" && status !== "DELIVERED") {
        throw new Error("INVALID_STATUS_TRANSITION");
      }

      if (
        existingOrder.payment?.status === "COMPLETED" &&
        status === "CANCELLED"
      ) {
        throw new Error("REFUND_REQUIRED");
      }

      if (status === "CANCELLED") {
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status },
      });
    });

    res.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ORDER_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Order not found",
        });
        return;
      }

      if (error.message === "ORDER_ALREADY_FINAL") {
        res.status(400).json({
          success: false,
          message: "This order is already in a final state",
        });
        return;
      }

      if (error.message === "INVALID_STATUS_TRANSITION") {
        res.status(400).json({
          success: false,
          message: "Invalid order status transition",
        });
        return;
      }

      if (error.message === "REFUND_REQUIRED") {
        res.status(400).json({
          success: false,
          message: "A completed payment must be refunded before cancellation",
        });
        return;
      }
    }

    console.error("Update order status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

