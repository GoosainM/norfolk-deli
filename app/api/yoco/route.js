import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token, amountInCents, customer } = await request.json();

    const response = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Secret-Key': process.env.YOCO_SECRET_KEY,
      },
      body: JSON.stringify({
        token,
        amountInCents,
        currency: 'ZAR',
        metadata: {
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          collectionSlot: customer.collectionSlot,
        },
      }),
    });

    const data = await response.json();

    if (response.ok && data.status === 'successful') {
      return NextResponse.json({ success: true, charge: data });
    } else {
      return NextResponse.json({ success: false, error: data.displayMessage || 'Charge failed' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}