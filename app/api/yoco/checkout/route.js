import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { cart, customer } = await req.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Empty cart' }, { status: 400 });
    }

    // TODO: look up prices server-side (e.g. from Sanity by item id)
    // instead of trusting the client's price, or anyone can change the total.
    const totalRand = cart.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
    const amount = Math.round(totalRand * 100); // cents

    if (amount < 200) {
      return NextResponse.json({ error: 'Minimum order is R2.00' }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL; // e.g. https://www.norfolkdeli.co.za

    const r = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount,
        currency: 'ZAR',
        successUrl: `${siteUrl}/order-success`,
        cancelUrl: `${siteUrl}/bakery`,
        failureUrl: `${siteUrl}/bakery`,
        metadata: {
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          collectionSlot: customer.collectionSlot,
          items: cart.map((i) => `${i.quantity}x ${i.title}`).join(', ').slice(0, 400),
        },
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error('Yoco error:', data);
      return NextResponse.json({ error: 'Payment provider error' }, { status: 502 });
    }

    return NextResponse.json({ redirectUrl: data.redirectUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}