import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

// Initialize Nodemailer with secure SMTP settings (proven to work in tests)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: 'ssphotographyofficial08@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD, 
  },
});

export async function GET(request: Request) {
  // Security check: Ensure this is only called by an authorized cron job or secret key
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const now = new Date();
    
    // Calculate tomorrow's date string (YYYY-MM-DD) based on server time
    // This catches everything occurring on the next calendar day
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Check connection to Gmail
    await transporter.verify();

    // 1. Fetch only confirmed bookings that haven't been notified yet
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        status: 'Confirmed',
        reminderSent: false
      }
    });

    console.log(`[AUTOMATION] Server Time: ${now.toISOString()}`);
    console.log(`[AUTOMATION] Scanning for: "${tomorrowStr}"`);

    // 2. Identify bookings scheduled for tomorrow (YYYY-MM-DD matching)
    const targetBookings = upcomingBookings.filter(booking => {
      return booking.eventDate.startsWith(tomorrowStr);
    });

    if (targetBookings.length === 0) {
      return NextResponse.json({ 
        message: `No events matched for ${tomorrowStr} yet.`,
        checked: upcomingBookings.length 
      });
    }

    const results = await Promise.all(targetBookings.map(async (booking) => {
      let emailSent = false;

      try {
        console.log(`[AUTOMATION] Sending email for ${booking.clientName}`);
        
        await transporter.sendMail({
          from: '"SS Photo & Films Alert" <ssphotographyofficial08@gmail.com>',
          to: 'ssphotographyofficial08@gmail.com',
          subject: `⚡ URGENT: 24h Reminder for ${booking.clientName}`,
          html: `
            <div style="font-family: sans-serif; padding: 30px; background: #fafafa; border: 4px solid #D4AF37; border-radius: 12px; max-width: 600px; margin: auto;">
              <h1 style="color: #424340; font-family: sans-serif; font-size: 24px; text-transform: uppercase; margin-bottom: 5px;">Upcoming Session Alert</h1>
              <p style="color: #D4AF37; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 25px;">24-Hour Automated Reminder</p>
              
              <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); border: 1px solid #eee;">
                <p style="margin: 8px 0;"><strong>Client:</strong> ${booking.clientName}</p>
                <p style="margin: 8px 0;"><strong>Package:</strong> ${booking.packageType || 'Service Package'}</p>
                <p style="margin: 8px 0;"><strong>Date & Time:</strong> ${booking.eventDate}</p>
                <p style="margin: 8px 0;"><strong>Location:</strong> ${booking.location}</p>
                <p style="margin: 8px 0;"><strong>Phone:</strong> ${booking.phone}</p>
              </div>

              <div style="margin-top: 30px; font-size: 10px; color: #999; text-align: center; font-family: sans-serif; opacity: 0.8;">
                SS Photo & Films • Managed Alert System
              </div>
            </div>
          `,
        });
        
        // Mark as sent
        await prisma.booking.update({
          where: { id: booking.id },
          data: { reminderSent: true }
        });

        emailSent = true;
      } catch (err) {
        console.error(`[AUTOMATION] Sending Error:`, err);
      }

      return {
        id: booking.id,
        client: booking.clientName,
        email: emailSent ? 'Sent' : 'Failed'
      };
    }));

    return NextResponse.json({ 
      processedCount: targetBookings.length, 
      bookings: results 
    });

  } catch (error: any) {
    console.error("[AUTOMATION] System Error:", error);
    return NextResponse.json({ error: "Reminder logic failed", details: error.message }, { status: 500 });
  }
}
