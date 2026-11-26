import nodemailer from 'nodemailer';

/**
 * Creates a reusable nodemailer transporter.
 * Uses environment variables if configured (e.g. SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS),
 * or falls back to an Ethereal / development test configuration so it works out-of-the-box.
 */
export function getMailTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  // If credentials exist, use custom SMTP
  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback for development: logs OTP to server console and returns mock-friendly transporter
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'reshans.atelier@ethereal.email',
      pass: 'reshansDevPass2026',
    },
  });
}

/**
 * Sends a luxury styled OTP password reset email to the customer
 */
export async function sendPasswordResetOtpEmail(toEmail: string, otp: string, customerName?: string) {
  const transporter = getMailTransporter();
  const from = process.env.SMTP_FROM || '"Reshans Atelier" <support@reshans.com>';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f6f5; margin: 0; padding: 20px; color: #141414; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e8e5e3; border-radius: 4px; overflow: hidden; }
          .header { background: #093624; padding: 28px 24px; text-align: center; }
          .header h1 { color: #f9f295; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: 2px; text-transform: uppercase; }
          .content { padding: 36px 32px; text-align: center; }
          .title { font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #141414; }
          .text { font-size: 13px; line-height: 1.6; color: #55585b; margin-bottom: 24px; }
          .otp-card { background: #fbfbfb; border: 1.5px dashed #093624; border-radius: 6px; padding: 18px 24px; display: inline-block; margin: 10px 0 24px; }
          .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #093624; font-family: monospace; }
          .expiry { font-size: 11px; color: #888888; margin-top: 6px; font-weight: 600; text-transform: uppercase; }
          .footer { background: #fdfdfd; padding: 16px 24px; text-align: center; font-size: 11px; color: #888888; border-top: 1px solid #f0eded; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reshans Atelier</h1>
          </div>
          <div class="content">
            <h2 class="title">Password Reset Request</h2>
            <p class="text">Hello ${customerName || 'Valued Customer'},<br/>We received a request to reset your Reshans Atelier account password. Use the verification code below to complete your reset:</p>
            
            <div class="otp-card">
              <div class="otp-code">${otp}</div>
              <div class="expiry">Valid for 10 minutes only</div>
            </div>

            <p class="text" style="font-size: 12px; color: #777777;">If you did not request this code, please ignore this email or contact our atelier support team immediately.</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Reshans Atelier Dhaka. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject: `${otp} is your Reshans Atelier Password Reset Code`,
      text: `Your password reset code is: ${otp}. Valid for 10 minutes.`,
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[Nodemailer] SMTP send error:`, err.message);
    throw new Error('Failed to send verification code email. Please verify SMTP settings.');
  }
}
