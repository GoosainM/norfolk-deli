'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenCart }) {
  const pathname = usePathname();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Toggle Button */}
        <button 
          id="mobile-menu-toggle" 
          className="mobile-toggle-btn" 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <i className={isMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
        </button>

        {/* Mobile-enabled Navigation Menu */}
        <nav id="site-nav" className={`nav-wrapper ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link href="/" className={pathname === '/' ? 'active' : ''} onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/bakery" className={pathname === '/bakery' ? 'active' : ''} onClick={closeMenu}>
                Bakery
              </Link>
            </li>
            <li>
              <Link href="/menu" className={pathname === '/menu' ? 'active' : ''} onClick={closeMenu}>
                Menu
              </Link>
            </li>
            <li>
              <Link href="/events" className={pathname === '/events' ? 'active' : ''} onClick={closeMenu}>
                Events
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-basket-wrapper">
          <button id="open-cart" className="basket-btn" onClick={onOpenCart}>
            <span>Basket</span>
            <span id="cart-badge" className="basket-badge">{totalItems}</span>
          </button>
        </div>
      </div>
    </header>
  );
}