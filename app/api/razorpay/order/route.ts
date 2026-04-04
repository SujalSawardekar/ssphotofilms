import { NextRequest, NextResponse } from 'next/server';
const Razorpay = require('razorpay');

export async function POST(req: NextRequest) {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error('Razorpay keys missing from environment');
    return NextResponse.json({ error: 'Razorpay configuration error' }, { status: 500 });
  }

  const razorpay = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
  });
  try {
    const { amount, bookingId } = await req.json();

    if (!amount || !bookingId) {
      return NextResponse.json({ error: 'Missing amount or bookingId' }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay handles amount in paise
      currency: "INR",
      receipt: `receipt_${bookingId}`,
      notes: {
        bookingId: bookingId
      }
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Razorpay Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
