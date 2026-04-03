"use server";

import { sendEmail } from '@/lib/email';
import prisma from '@/lib/prisma';

/**
 * Sends a real email reply to a team applicant.
 * @param applicantId - Unique ID of the applicant
 * @param message - The reply message content
 */
export async function sendTeamApplicationReply(applicantId: number, message: string) {
  if (!message || message.trim() === "") {
    throw new Error("Reply message cannot be empty.");
  }

  try {
    // 1. Fetch applicant details
    const applicant = await prisma.teamApplication.findUnique({
      where: { id: applicantId }
    });

    if (!applicant) {
      throw new Error(`Applicant with ID ${applicantId} not found.`);
    }

    // 2. Format a professional email
    const subject = `Update regarding your Application: ${applicant.name}`;
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #000; padding: 30px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">SS Photo & Films</h1>
        </div>
        <div style="padding: 40px;">
          <p style="font-size: 16px;">Hello <strong>${applicant.name}</strong>,</p>
          <p style="font-size: 16px;">Thank you for your interest in joining our creative circle. Our team has reviewed your application and portfolio.</p>
          
          <div style="background-color: #f9fafb; padding: 25px; border-radius: 6px; border-left: 4px solid #D4AF37; margin: 25px 0;">
            <p style="margin: 0; font-size: 15px; color: #4b5563;">${message}</p>
          </div>
          
          <p style="font-size: 16px;">We will reach out to you if there are further steps required or to schedule a meeting/interview.</p>
          
          <p style="margin-top: 40px; font-size: 16px;">Best Regards,<br/><strong>Team SS Photo & Films</strong></p>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
          &copy; ${new Date().getFullYear()} SS Photo & Films. All rights reserved.
        </div>
      </div>
    `;

    // 3. Send the email
    await sendEmail({
      to: applicant.email,
      subject,
      html,
      text: `Hello ${applicant.name}, ${message}. Best Regards, Team SS Photo & Films.`
    });

    return { success: true };
  } catch (error: any) {
    console.error("[TEAM_ACTIONS] Failed to send reply:", error);
    return { success: false, error: error.message };
  }
}
