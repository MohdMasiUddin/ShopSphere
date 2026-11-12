import { Request, Response } from "express";
import { z } from "zod";
import Razorpay from "razorpay";
import { prisma } from "../config/prisma.js";
import crypto from "crypto";
import { sendOrderConfirmationEmail } from "../services/emailService.js";

const paymentSchema = z.object({
  orderId: z.number().int().positive(),
});

export const createRazorpayOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const validation = paymentSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
      return;
    }

    const { orderId } = validation.data;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user!.userId,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    if (!order.payment || order.payment.status !== "PENDING") {
      res.status(400).json({
        success: false,
        message: "Payment is not available for this order",
      });
      return;
    }

    if (order.status !== "PENDING") {
      res.status(400).json({
        success: false,
        message: "Only pending orders can be paid",
      });
      return;
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials are missing");
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(order.total) * 100),
      currency: "INR",
      receipt: order.orderNumber,
    });

    await prisma.payment.update({
      where: {
        orderId: order.id,
      },
      data: {
        providerOrderId: razorpayOrder.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      keyId,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};


export const verifyRazorpayPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const schema = z.object({
      razorpay_order_id: z.string().min(1),
      razorpay_payment_id: z.string().min(1),
      razorpay_signature: z.string().min(1),
    });

    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid payment details",
      });
      return;
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = validation.data;

    const payment = await prisma.payment.findFirst({
      where: {
        providerOrderId: razorpay_order_id,
        status: "PENDING",
        order: {
          userId: req.user!.userId,
          status: "PENDING",
        },
      },
    });

    if (!payment) {
      res.status(404).json({
        success: false,
        message: "Pending payment not found",
      });
      return;
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new Error("Razorpay secret is missing");
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          providerPaymentId: razorpay_payment_id,
        },
      });

      const updatedOrder = await tx.order.update({
        where: { id: payment.orderId },
        data: { status: "CONFIRMED" },
      });

      return { updatedPayment, updatedOrder };
    });


const orderDetails = await prisma.order.findUnique({
  where: { id: result.updatedOrder.id },
  include: {
    user: {
      select: {
        name: true,
        email: true,
      },
    },
  },
});

if (orderDetails) {
  try {
    await sendOrderConfirmationEmail(
      orderDetails.user.email,
      orderDetails.user.name,
      orderDetails.orderNumber,
      Number(orderDetails.total)
    );
    console.log("Order confirmation email sent successfully.");
  } catch (emailError) {
    console.error("Order confirmation email failed:", emailError);
  }
}


    res.json({
      success: true,
      message: "Payment verified successfully",
      payment: result.updatedPayment,
      order: result.updatedOrder,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

