import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token, amountInCents, currency = 'ZAR', customerDetails } = await request.json();

    // Call Yoco Charge API
    const response = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Secret-Key': process.env.YOCO_SECRET_KEY, // Set in .env.local
      },
      body: JSON.stringify({
        token: token,
        amountInCents: amountInCents,
        currency: currency,
        metadata: {
          customerName: customerDetails?.name,
          customerEmail: customerDetails?.email,
          customerPhone: customerDetails?.phone,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data }, { status: 400 });
    }

    return NextResponse.json({ success: true, charge: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}