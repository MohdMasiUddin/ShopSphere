
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(
  email: string,
  customerName: string,
  orderNumber: string,
  total: number
) {
  const from =
    process.env.EMAIL_FROM || "ShopSphere <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
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

  if (error) {
    console.error("Resend email failed:", error);
    throw new Error(error.message);
  }

  console.log("Order confirmation email sent:", data?.id);
}
