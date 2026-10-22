import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.text();
  const id = req.headers.get('webhook-id');
  const ts = req.headers.get('webhook-timestamp');
  const sigHeader = req.headers.get('webhook-signature') || '';

  const secret = Buffer.from(process.env.YOCO_WEBHOOK_SECRET.replace('whsec_', ''), 'base64');
  const expected = crypto.createHmac('sha256', secret).update(`${id}.${ts}.${body}`).digest('base64');

  const valid = sigHeader.split(' ').some((s) => s.replace('v1,', '') === expected);
  if (!valid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

  const event = JSON.parse(body);
  if (event.type === 'payment.succeeded') {
    const meta = event.payload?.metadata;
    // TODO: mark the order paid, email the customer and the deli, etc.
    console.log('Paid order for', meta?.customerName, meta?.collectionSlot);
  }

  return NextResponse.json({ received: true });
}