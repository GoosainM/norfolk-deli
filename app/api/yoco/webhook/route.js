import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Escape anything a customer typed before putting it in the email HTML
const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));

// Standard Webhooks signature check (what Yoco uses)
function verifySignature(rawBody, headers) {
  const id = headers.get('webhook-id');
  const timestamp = headers.get('webhook-timestamp');
  const sigHeader = headers.get('webhook-signature');
  const secretRaw = process.env.YOCO_WEBHOOK_SECRET;

  if (!id || !timestamp || !sigHeader || !secretRaw) return false;

  // Reject anything signed more than 5 minutes ago (replay protection)
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 5 * 60) return false;

  const secret = Buffer.from(secretRaw.replace(/^whsec_/, ''), 'base64');
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest('base64');
  const expectedBuf = Buffer.from(expected);

  // Header looks like "v1,<sig> v1,<sig2>"
  return sigHeader.split(' ').some((part) => {
    const sig = part.split(',')[1];
    if (!sig) return false;
    const sigBuf = Buffer.from(sig);
    return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);
  });
}

async function sendOrderEmail(event) {
  const payment = event.payload || {};
  const meta = payment.metadata || {};
  const isTest = payment.mode === 'test';
  const amount = ((payment.amount || 0) / 100).toFixed(2);

  const rows = [
    ['Customer', meta.customerName],
    ['Phone', meta.customerPhone],
    ['Email', meta.customerEmail],
    ['Collection', meta.collectionSlot],
    ['Items', meta.items],
    ['Total paid', `R ${amount}`],
    ['Card', payment.paymentMethodDetails?.card?.maskedCard],
    ['Yoco payment ID', payment.id],
    ['Yoco checkout ID', meta.checkoutId],
  ].filter(([, v]) => v);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="color:#535622;margin-bottom:4px">New paid order${isTest ? ' (TEST)' : ''}</h2>
      <p style="margin-top:0;color:#555">A payment was just completed on norfolkdeli.co.za.</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:150px">${esc(k)}</td>
            <td style="padding:8px;border-bottom:1px solid #eee">${esc(v)}</td>
          </tr>`
          )
          .join('')}
      </table>
    </div>`;

  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // true for 465, false for 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Norfolk Deli Orders" <${process.env.SMTP_USER}>`,
    to: process.env.ORDER_NOTIFY_EMAIL.split(',').map((e) => e.trim()),
    replyTo: meta.customerEmail || undefined,
    subject: `${isTest ? '[TEST] ' : ''}New paid order: R ${amount}${
      meta.customerName ? ' - ' + meta.customerName : ''
    }`,
    html,
  });
    // Confirmation email to the customer (failure here must not break the cafe email)
  if (meta.customerEmail && !isTest) {
    try {
      await transporter.sendMail({
        from: `"Norfolk Deli" <${process.env.SMTP_USER}>`,
        to: meta.customerEmail,
        subject: 'Your Norfolk Deli order is confirmed',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px">
            <h2 style="color:#535622">Thank you, ${esc(meta.customerName || '')}!</h2>
            <p>We've received your payment of <strong>R ${amount}</strong>.</p>
            <p><strong>Items:</strong> ${esc(meta.items || '')}</p>
            <p><strong>Collection:</strong> ${esc(meta.collectionSlot || '')}</p>
            <p>If you need to change anything, just reply to this email.</p>
            <p>Norfolk Deli</p>
          </div>`,
      });
    } catch (err) {
      console.error('Customer email failed:', err);
    }
  }
}

export async function POST(req) {
  const rawBody = await req.text();

  if (!verifySignature(rawBody, req.headers)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }

  // Only email for successful payments; acknowledge everything else
  if (event.type !== 'payment.succeeded') {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  try {
    await sendOrderEmail(event);
  } catch (err) {
    console.error('Order email failed:', err);
    // A non-2xx makes Yoco retry the webhook later
    return NextResponse.json({ error: 'Email failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}