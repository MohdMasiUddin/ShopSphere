
import "dotenv/config";
import { sendOrderConfirmationEmail } from "./services/emailService.js";

async function testEmail() {
  try {
    await sendOrderConfirmationEmail(
      "customer@example.com",
      "ShopSphere Test Customer",
      "SS-TEST-001",
      799
    );

    console.log("Test email generated successfully!");
  } catch (error) {
    console.error("Email test failed:", error);
  }
}

testEmail();

