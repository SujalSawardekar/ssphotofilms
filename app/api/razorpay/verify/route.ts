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
      console.error('[VERIFY_ERROR] RAZORPAY_KEY_SECRET is missing in environment variables!');
      return NextResponse.json({ error: 'Server configuration error (Secret missing)' }, { status: 500 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      console.log('[VERIFY_SUCCESS] Signature matches. Updating database for Booking:', bookingId);
      try {
        await updateBookingPayment(
          bookingId, 
          razorpay_order_id, 
          razorpay_payment_id, 
          razorpay_signature
        );
        return NextResponse.json({ message: 'Payment verified and database updated' }, { status: 200 });
      } catch (dbError: any) {
        console.error('[VERIFY_DB_ERROR] Failed to update booking:', dbError.message);
        return NextResponse.json({ error: 'Database update failed', details: dbError.message }, { status: 500 });
      }
    } else {
      console.error('[VERIFY_SIGNATURE_FAILURE] Signature mismatch!');
      console.error('Expected:', expectedSignature);
      console.error('Received:', razorpay_signature);
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[VERIFY_CRITICAL_ERROR]:', error.message);
    return NextResponse.json({ error: 'Verification process crashed', details: error.message }, { status: 500 });
  }
}
