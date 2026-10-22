'use client';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function OrderSuccess() {
  const { clearCart } = useCart();
  useEffect(() => { clearCart?.(); }, []);
  return (
    <main style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <h1>Thank you!</h1>
      <p>Your pre-order has been received. We'll see you at collection.</p>
    </main>
  );
}