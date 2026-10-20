'use client';

import { useState, useEffect } from 'react';
import { client } from '../lib/sanity';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('drinks');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        // Query items sorted by custom orderNumber ascending
        const query = `*[_type == "menuItem"] | order(orderNumber asc, name asc) {
          _id,
          name,
          price,
          menuType,
          category,
          description,
          addOns,
          isVegan,
          orderNumber
        }`;
        const data = await client.fetch(query);
        setMenuItems(data);
      } catch (err) {
        console.error('Failed to fetch menu items from Sanity:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItems();
  }, []);

  const filteredItems = menuItems.filter((item) => item.menuType === activeTab);

  // Preserve unique category headers
  const categories = Array.from(new Set(filteredItems.map((item) => item.category)));

  return (
    <>
      <div className="bg-decorations" aria-hidden="true">
        <img src="/images/coffee-cup.png" className="bg-decor bg-top-right" alt="" />
        <img src="/images/counter-scene.jpg" className="bg-decor bg-center" alt="" />
      </div>

      <main className="menu-main-section" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
        <div className="section-header">
          <h2>In-Store Menu</h2>
          <p>Freshly brewed coffee, artisanal drinks, breakfast, and daily deli specials.</p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs" style={{ marginBottom: '2.5rem' }}>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'drinks' ? 'active' : ''}`}
            onClick={() => setActiveTab('drinks')}
          >
            Drinks Menu
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            Food Menu
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading menu items...</p>
          </div>
        ) : (
          <div className="menu-content">
            {categories.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>No items added to this section yet.</p>
            ) : (
              categories.map((cat) => {
                const categoryItems = filteredItems.filter((item) => item.category === cat);

                return (
                  <div key={cat} className="menu-category-block" style={{ marginBottom: '3rem' }}>
                    {/* Section Header Divider */}
                    <div className="menu-section-divider">
                      <span className="menu-section-title">{cat}</span>
                    </div>

                    {/* 2-Column Grid Layout */}
                    <div className="menu-grid">
                      {categoryItems.map((item) => (
                        <div key={item._id} className="menu-item">
                          <div className="item-header">
                            <span className="item-name">
                              {item.name}
                              {item.isVegan && <span className="vegan-icon" title="Vegan">v</span>}
                            </span>
                            {item.price !== undefined && item.price !== null && (
                              <span className="item-price">R {Number(item.price).toFixed(2)}</span>
                            )}
                          </div>

                          {item.description && (
                            <p className="item-desc">{item.description}</p>
                          )}

                          {/* Render Add-Ons if present */}
                          {item.addOns && item.addOns.length > 0 && (
                            <ul className="sub-item-list" style={{ listStyle: 'none', paddingLeft: 0, marginTop: '0.35rem' }}>
                              {item.addOns.map((addon, idx) => (
                                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#59574a', lineHeight: '1.4' }}>
                                  <span>+ {addon.name}</span>
                                  {addon.price !== undefined && addon.price !== null && (
                                    <span>R {Number(addon.price).toFixed(2)}</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </>
  );
}