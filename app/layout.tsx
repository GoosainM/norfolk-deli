'use client';

import React, { useState, Suspense } from 'react';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import BackToTop from './components/BackToTop';
import CartDrawer from './components/CartDrawer';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Section Heading */}
        <h2 
          style={{
            fontSize: '2rem',
            color: 'var(--accent-olive, #535622)',
            margin: '0 0 0.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}
        >
          Visit Us
        </h2>

        {/* Address */}
        <p className="footer-location">
          6 Norfolk Road, Sea Point, Cape Town 8005
        </p>

        {/* Google Map Embed */}
        <div className="footer-map-container">
          <iframe
            title="Norfolk Deli Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.825615783515!2d18.388701976722883!3d-33.91084282194602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc673418c3bdfb%3A0x8e833ddbd3e1ff51!2s6%20Norfolk%20Rd%2C%20Sea%20Point%2C%20Cape%20Town%2C%208005!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza"
            width="100%"
            height="260"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Contact Info */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem',
            marginTop: '0.5rem'
          }}
        >
          <a
            href="mailto:info@norfolkdeli.co.za"
            style={{
              color: 'var(--accent-olive, #535622)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="fa-regular fa-envelope"></i> info@norfolkdeli.co.za
          </a>

          <a
            href="https://wa.me/27710434342"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent-olive, #535622)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="fa-brands fa-whatsapp"></i> +27 71 043 4342
          </a>

          <div className="footer-social" style={{ marginTop: '0.4rem' }}>
            <a
              href="https://www.instagram.com/norfolk.deli"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-link"
              aria-label="Norfolk Deli Instagram"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>

        <p className="footer-copy" style={{ marginTop: '1.5rem' }}>
          &copy; 2026 Norfolk Deli. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <title>Norfolk Deli | Sea Point Pre-Orders & Events</title>
        <meta 
          name="description" 
          content="Pre-order freshly baked cakes, savoury frittatas, and view monthly community events at Norfolk Deli in Sea Point." 
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.cdnfonts.com/css/glacial-indifference" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/tan-meringue" rel="stylesheet" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body>
        <Script src="https://js.yoco.com/sdk/v1/yoco-sdk-web.js" strategy="lazyOnload" />

        <CartProvider>
          <Suspense fallback={<nav className="navbar"></nav>}>
            <Navbar onOpenCart={() => setIsCartOpen(true)} />
          </Suspense>

          {children}
          
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <Footer />
          <BackToTop />
        </CartProvider>
      </body>
    </html>
  );
}