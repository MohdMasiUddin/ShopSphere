
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderConfirmationEmail(
  email: string,
  customerName: string,
  orderNumber: string,
  total: number
) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `ShopSphere Order Confirmed - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; color: #24231f;">
        <h1 style="letter-spacing: 3px;">SHOPSPHERE.</h1>
        <h2>Thank you for your order, ${customerName}!</h2>
        <p>Your payment has been verified successfully.</p>
        <hr />
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Order Total:</strong> ₹${total.toLocaleString("en-IN")}</p>
        <p>We're preparing your order with care.</p>
        <p>Thank you for shopping with ShopSphere.</p>
      </div>
    `,
  });
console.log("Message ID:", info.messageId);
console.log("SMTP response:", info.response);
console.log("Email preview:", nodemailer.getTestMessageUrl(info));
}
