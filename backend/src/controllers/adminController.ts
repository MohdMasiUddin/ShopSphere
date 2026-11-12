
import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export const getDashboardOverview = async (
  _req: Request,
  res: Response
) => {
  try {
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      recentOrders,
      salesByDay,
    ] = await Promise.all([
      // Total revenue from completed payments
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),

      // Total orders
      prisma.order.count(),

      // Total registered customers
      prisma.user.count({
        where: { role: "CUSTOMER" },
      }),

      // Total active products
      prisma.product.count({
        where: { isActive: true },
      }),

      // Orders awaiting processing
      prisma.order.count({
        where: { status: "PENDING" },
      }),

      // Five most recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          payment: {
            select: {
              status: true,
              amount: true,
            },
          },
        },
      }),

      // Daily completed-payment revenue for the last seven days
      prisma.$queryRaw<Array<{ date: Date; revenue: number }>>`
      SELECT
       calendar.day AS date,
       COALESCE(SUM(payment.amount), 0) AS revenue
      FROM generate_series(
      CURRENT_DATE - INTERVAL '6 days',
      CURRENT_DATE,
      INTERVAL '1 day'
    ) AS calendar(day)
      LEFT JOIN "Payment" AS payment
      ON DATE(payment."createdAt") = calendar.day
      AND payment."status" = 'COMPLETED'
      GROUP BY calendar.day
      ORDER BY calendar.day ASC
    `,
    ]);


    res.json({
      success: true,

      overview: {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
      },

      recentOrders,

      salesTrend: salesByDay.map((item) => ({
        date: item.date.toISOString().slice(0, 10),
        revenue: Number(item.revenue),
      })),
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard overview",
    });
  }
};

export const getAdminCustomers = async (
  req: Request,
  res: Response
) => {
  try {
    const search = String(req.query.search || "").trim();

    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Admin customers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};

