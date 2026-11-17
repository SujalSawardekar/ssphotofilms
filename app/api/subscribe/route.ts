import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // 1. Save subscriber in PostgreSQL Database (under ClientQuery so it displays in /admin/queries)
    const existing = await prisma.clientQuery.findFirst({
      where: {
        email: cleanEmail,
        status: 'Subscribed'
      }
    });

    if (!existing) {
      await prisma.clientQuery.create({
        data: {
          name: 'Coming Soon VIP Subscriber',
          email: cleanEmail,
          message: 'Subscribed on Coming Soon page to receive launch announcement notification.',
          date: currentDate,
          status: 'Subscribed',
          messages: {
            create: {
              text: `VIP subscriber registered on ${currentDate} from Coming Soon page.`,
              sender: 'client',
              status: 'sent'
            }
          }
        }
      });
    }

    // 2. Send instant confirmation email to the subscriber
    try {
      await sendEmail({
        to: cleanEmail,
        subject: "You're on the VIP list — SS Photo & Films",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #080808; color: #F5F0E6; padding: 40px 20px; text-align: center;">
            <div style="max-width: 540px; margin: 0 auto; background-color: #12110F; border: 1px solid rgba(201, 166, 107, 0.3); border-radius: 12px; padding: 40px 30px;">
              <h1 style="color: #C9A66B; font-size: 24px; letter-spacing: 4px; margin-bottom: 10px; font-weight: 700;">SS PHOTO & FILMS</h1>
              <p style="color: #A8845A; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 30px;">Chiplun, Maharashtra</p>
              
              <div style="height: 1px; background: linear-gradient(to right, transparent, #C9A66B, transparent); margin: 20px 0;"></div>
              
              <h2 style="color: #F5F0E6; font-size: 18px; letter-spacing: 2px; margin-top: 30px; font-weight: 600;">YOU'RE ON THE VIP LIST</h2>
              
              <p style="color: rgba(244, 244, 244, 0.75); font-size: 14px; line-height: 1.6; margin: 20px 0;">
                Thank you for subscribing! We are putting the final touches on our new chapter of cinematic storytelling.
              </p>
              
              <p style="color: rgba(244, 244, 244, 0.75); font-size: 14px; line-height: 1.6;">
                You will be the very first to know the moment our official website goes live.
              </p>
              
              <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
                <p style="color: #C9A66B; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">
                  Shreyas Sawardekar & Team
                </p>
                <p style="color: rgba(244, 244, 244, 0.4); font-size: 11px; margin-top: 5px;">
                  SS Photo & Films · Chiplun, Maharashtra
                </p>
              </div>
            </div>
          </div>
        `,
        text: "Thank you for subscribing to SS Photo & Films! You are on our VIP list and will be notified the moment we launch."
      });
    } catch (mailErr) {
      console.warn('[SUBSCRIBE_EMAIL_NOTICE] Could not send confirmation email (SMTP credentials may not be active in dev):', mailErr);
      // We still return success: true because the subscriber is saved in the database
    }

    return NextResponse.json({
      success: true,
      message: "You're on the VIP list. We'll notify you when we launch."
    });
  } catch (err: any) {
    console.error('Subscription error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to process subscription. Please try again.' },
      { status: 500 }
    );
  }
}
