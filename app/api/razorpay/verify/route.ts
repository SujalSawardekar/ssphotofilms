import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateBookingPayment } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingId 
    } = await req.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      console.error('Razorpay secret missing from environment');
      return NextResponse.json({ error: 'Razorpay configuration error' }, { status: 500 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update database status
      await updateBookingPayment(
        bookingId, 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature
      );
      
      return NextResponse.json({ 
        message: 'Payment verified successfully' 
      }, { status: 200 });
    } else {
      return NextResponse.json({ 
        message: 'Invalid signature' 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ 
      error: 'Verification failed', 
      details: error.message 
    }, { status: 500 });
  }
}
