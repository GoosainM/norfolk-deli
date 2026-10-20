'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out animation after 1.5 seconds
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // Completely remove splash screen element after fade out finishes (2.3 seconds)
    const timer2 = setTimeout(() => {
      setShowSplash(false);
    }, 2300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      {/* Cream Splash Screen Overlay */}
      {showSplash && (
        <div 
          id="splash-screen" 
          className={`splash-overlay ${fadeOut ? 'fade-out' : ''}`}
        >
          <div className="splash-content">
            <img src="/images/ND_1.png" alt="Norfolk Deli" className="splash-logo" />
          </div>
        </div>
      )}

      {/* Scattered Background Decorative Images */}
      <div className="bg-decorations" aria-hidden="true">
        <img src="/images/birthday-cake.png" className="bg-decor bg-top-left" alt="" />
        <img src="/images/coffee-cup.png" className="bg-decor bg-top-right" alt="" />
        <img src="/images/table-spread.png" className="bg-decor bg-center-left" alt="" />
        <img src="/images/counter-scene.jpg" className="bg-decor bg-center" alt="" />
        <img src="/images/logo-black.png" className="bg-decor bg-bottom-left" alt="" />
      </div>

      {/* Clean Hero Image Section */}
      <section className="hero">
        <div className="hero-bg-animated"></div>
      </section>

      {/* Welcome Section */}
      <section className="section">
        <div className="section-header" style={{ maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
          <h2>Welcome to Norfolk Deli</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <p>
              We are an independent cafe, deli, and cakery in the heart of Sea Point, Cape Town. 
              Freshly baked cakes, great coffee, and food made with quality ingredients.
            </p>
            <p>
              Our shelves are stocked with a mix of our own creations baked from local makers and pantry favourites we&apos;ve carefully selected.
            </p>
            <p>
              A relaxed neighbourhood space built around making everyone feel welcome. 
              Order custom cakes and savoury bakes from our Bakery, explore our in-store Menu, or join us for upcoming Events.
            </p>
          </div>
        </div>

        {/* Dual Cards Section */}
        <div className="home-dual-cards">
          {/* Bakery Orders Card */}
          <div className="dual-card card-shop">
            <div className="dual-card-overlay"></div>
            <div className="dual-card-content">
              <h3>Bakery Orders</h3>
              <p>Pre-order celebration cakes and gluten-free frittatas 48 hours in advance.</p>
              <Link href="/bakery" className="btn-primary">
                Explore Bakery &rarr;
              </Link>
            </div>
          </div>

          {/* Cafe Menu Card */}
          <div className="dual-card card-menu">
            <div className="dual-card-overlay"></div>
            <div className="dual-card-content">
              <h3>Cafe Menu</h3>
              <p>Browse our walk-in counter options for coffee, rarebits, and fresh baked goods.</p>
              <Link href="/menu" className="btn-primary">
                View Menu &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}