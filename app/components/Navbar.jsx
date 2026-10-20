'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenCart }) {
  const pathname = usePathname();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="site-header">
      <div className="header-container">
        <button id="mobile-menu-toggle" className="mobile-toggle-btn" aria-label="Toggle navigation menu">
          <i className="fa-solid fa-bars"></i>
        </button>

        <nav id="site-nav" className="nav-wrapper">
          <ul className="nav-links">
            <li>
              <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
            </li>
            <li>
              <Link href="/bakery" className={pathname === '/bakery' ? 'active' : ''}>Bakery</Link>
            </li>
            <li>
              <Link href="/menu" className={pathname === '/menu' ? 'active' : ''}>Menu</Link>
            </li>
            <li>
              <Link href="/events" className={pathname === '/events' ? 'active' : ''}>Events</Link>
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