import nodemailer from 'nodemailer';

// Initialize Nodemailer transporter with secure SMTP settings
// Configuration verified to work with ssphotographyofficial08@gmail.com
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: 'ssphotographyofficial08@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD, 
  },
});

/**
 * Sends an email using the pre-configured transporter.
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - HTML content of the email
 * @param text - Plain text version of the email
 */
export async function sendEmail({ to, subject, html, text }: { to: string, subject: string, html: string, text?: string }) {
  console.log(`[EMAIL_DEBUG] Attempting to send email to: ${to}`);
  try {
    // Verify connection before sending
    console.log(`[EMAIL_DEBUG] Verifying SMTP connection...`);
    await transporter.verify();
    console.log(`[EMAIL_DEBUG] SMTP Connection verified.`);
    
    const info = await transporter.sendMail({
      from: '"SS Photo & Films" <ssphotographyofficial08@gmail.com>',
      to,
      subject,
      html,
      text: text || "This is an automated message from SS Photo & Films.",
    });

    console.log(`[EMAIL_DEBUG] Success! Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[EMAIL_DEBUG] Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
