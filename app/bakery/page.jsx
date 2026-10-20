'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { client, urlFor } from '../lib/sanity';

export default function BakeryPage() {
  const [activeTab, setActiveTab] = useState('savouries');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchBakeryItems() {
      try {
        const query = `*[_type == "bakeryItem" && inStock == true] | order(orderNumber asc, _createdAt desc) {
  _id,
  title,
  price,
  category,
  description,
  portion,
  image,
  orderNumber
}`;
        const data = await client.fetch(query);

        const formatted = data.map((item) => ({
          id: item._id,
          name: item.title,
          price: Number(item.price),
          category: item.category,
          description: item.description || '',
          portion: item.portion || '',
          img: item.image ? urlFor(item.image).width(600).url() : '/images/fritatta.png',
        }));

        setItems(formatted);
      } catch (err) {
        console.error('Failed to fetch bakery items from Sanity:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBakeryItems();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.img,
    });
  };

  const savouries = items.filter((i) => i.category === 'Savouries');
  const cakes = items.filter(
    (i) => i.category === 'Cakes & Bakes' || i.category === 'cakes'
  );

  return (
    <>
      {/* Scattered Background Decorative Images */}
      <div className="bg-decorations" aria-hidden="true">
        <img src="/images/birthday-cake.png" className="bg-decor bg-top-left" alt="" />
        <img src="/images/coffee-cup.png" className="bg-decor bg-top-right" alt="" />
        <img src="/images/table-spread.png" className="bg-decor bg-center-left" alt="" />
        <img src="/images/counter-scene.jpg" className="bg-decor bg-center" alt="" />
        <img src="/images/logo-black.png" className="bg-decor bg-bottom-left" alt="" />
      </div>

      <main className="section">
        {/* Page Title Header */}
        <div className="section-header">
          <h2>Bakery Pre-Orders</h2>
          <p>Order fresh celebration cakes and savoury frittatas for collection at our deli.</p>
        </div>

        {/* Interactive Category Switcher Tabs */}
        <div className="category-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'savouries' ? 'active' : ''}`}
            onClick={() => setActiveTab('savouries')}
          >
            Savouries
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'cakes' ? 'active' : ''}`}
            onClick={() => setActiveTab('cakes')}
          >
            Cakes & Bakes
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading fresh bakery items...</p>
          </div>
        ) : (
          <>
            {/* CATEGORY 1: SAVOURIES */}
            <section
              id="savouries-section"
              className={`bakery-category-block tab-content ${
                activeTab === 'savouries' ? 'active' : ''
              }`}
              style={{ display: activeTab === 'savouries' ? 'block' : 'none' }}
            >
              <h3 className="category-title">Savouries</h3>
              <p className="category-subtitle">Free range egg frittata – gluten free</p>

              <div className="products-grid">
                {savouries.length === 0 ? (
                  <p style={{ padding: '1rem 0' }}>No savoury items currently available.</p>
                ) : (
                  savouries.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-img-wrapper">
                        <img src={product.img} alt={product.name} className="product-img" />
                      </div>
                      <div className="product-info">
                        <h4 className="item-title">{product.name}</h4>
                        {product.portion && (
                          <p className="product-portion">{product.portion}</p>
                        )}
                        {product.description && (
                          <p className="product-desc">{product.description}</p>
                        )}
                        <span className="product-price item-price">
                          R {product.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-primary add-to-cart-btn add-to-basket-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Basket
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* CATEGORY 2: CAKES & BAKES */}
            <section
              id="cakes-section"
              className={`bakery-category-block tab-content ${
                activeTab === 'cakes' ? 'active' : ''
              }`}
              style={{ display: activeTab === 'cakes' ? 'block' : 'none' }}
            >
              <h3 className="category-title">Cakes & Bakes</h3>

              <div className="products-grid">
                {cakes.length === 0 ? (
                  <p style={{ padding: '1rem 0' }}>No cakes or bakes currently available.</p>
                ) : (
                  cakes.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-img-wrapper">
                        <img src={product.img} alt={product.name} className="product-img" />
                      </div>
                      <div className="product-info">
                        <h4 className="item-title">{product.name}</h4>
                        {product.portion && (
                          <p className="product-portion">{product.portion}</p>
                        )}
                        {product.description && (
                          <p className="product-desc">{product.description}</p>
                        )}
                        <span className="product-price item-price">
                          R {product.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-primary add-to-cart-btn add-to-basket-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Basket
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {/* Good to Know Notice Box */}
        <div className="good-to-know-box">
          <h5>Good to know</h5>
          <p>
            Our baked goods are made fresh to order in small batches, using real butter and
            quality ingredients.
          </p>
          <p>Each cake is finished in our signature style, with considered decoration.</p>
          <p>Our bakes listed above are not available in gluten/sugar-free variations.</p>
          <p className="notice-highlight">48 hours notice is required for all orders.</p>
          <div className="collection-times">
            <strong>Collection:</strong> Weekdays 9am - 3pm | Weekend 9am - 1pm
          </div>
        </div>
      </main>
    </>
  );
}