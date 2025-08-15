import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const emailFrom =
    process.env.NODE_ENV === "production"
      ? "My Wallets <do-not-reply@josemokeni.cloud>"
      : "My Wallets <onboarding@resend.dev>";

  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: "Reset Your Password - My Wallets",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>You requested to reset your password for your My Wallets account.</p>
          <div style="margin: 32px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
          <p style="color: #999; font-size: 12px;">My Wallets Team</p>
        </div>
      `,
    });
    console.log("Password reset email sent:", result);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}
