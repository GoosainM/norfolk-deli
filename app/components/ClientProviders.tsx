'use client';

import React, { useState, Suspense } from 'react';
import { CartProvider } from '../context/CartContext';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import BackToTop from './BackToTop';

export default function ClientProviders({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <Suspense fallback={<nav className="navbar"></nav>}>
        <Navbar onOpenCart={() => setIsCartOpen(true)} />
      </Suspense>

      {children}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {footer}
      <BackToTop />
    </CartProvider>
  );
}