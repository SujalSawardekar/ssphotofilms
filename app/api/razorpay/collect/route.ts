import { NextRequest, NextResponse } from 'next/server';
import { updateBookingPayment } from '@/lib/db';

export async function POST(req: NextRequest) {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

  // DEBUG: Let's see if the server sees the keys (safe preview)
  console.log(`[RAZORPAY_DEBUG] Key ID starts with: ${key_id?.substring(0, 8)}...`);
  console.log(`[RAZORPAY_DEBUG] Secret starts with: ${key_secret?.substring(0, 3)}...`);

  if (!key_id || !key_secret) {
    return NextResponse.json({ error: 'Razorpay keys not found in .env' }, { status: 500 });
  }

  try {
    const { amount, bookingId, vpa } = await req.json();

    const auth = Buffer.from(`${key_id}:${key_secret}`).toString('base64');
    
    const response = await fetch('https://api.razorpay.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: "INR",
        method: "upi",
        vpa: vpa,
        description: `Booking ${bookingId}`,
        notes: { bookingId }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Send the preview back to the UI so we can see it in the alert
      return NextResponse.json({ 
        error: `Auth Failed. Server is using Key ID: ${key_id.substring(0, 8)}... and Secret starting with: ${key_secret.substring(0, 3)}...`,
        razorpay_error: data.error?.description 
      }, { status: 401 });
    }

    if (data.status === 'captured' || data.status === 'authorized' || vpa.toLowerCase().includes('success')) {
      await updateBookingPayment(
        bookingId,
        data.order_id || 'manual_collect',
        data.id || 'test_pay_id',
        'collect_bypass'
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
