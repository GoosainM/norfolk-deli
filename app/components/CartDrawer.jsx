'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateQuantity } = useCart();
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    collectionSlot: '',
  });
  const [loading, setLoading] = useState(false);

  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const today = new Date();

    const min = new Date();
    min.setDate(today.getDate() + 2);

    const max = new Date();
    max.setFullYear(today.getFullYear() + 1);

    setMinDate(min);
    setMaxDate(max);
    setCurrentMonth(new Date(min.getFullYear(), min.getMonth(), 1));
  }, []);

  const handlePrevMonth = () => {
    if (!currentMonth || !minDate) return;
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const minMonthStart = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    if (prev >= minMonthStart) {
      setCurrentMonth(prev);
    }
  };

  const handleNextMonth = () => {
    if (!currentMonth || !maxDate) return;
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    if (next <= maxDate) {
      setCurrentMonth(next);
    }
  };

  const handleDateClick = (date) => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const hoursText = isWeekend ? '9am - 1pm' : '9am - 3pm';
    const formattedDate = date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const fullSlot = `${formattedDate} (${hoursText})`;
    setSelectedDate(date);
    setCustomer((prev) => ({ ...prev, collectionSlot: fullSlot }));
  };

  const calendarGrid = useMemo(() => {
    if (!currentMonth) return [];

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInCurrentMonth = lastDayOfMonth.getDate();

    const dayOfWeekOfFirst = firstDayOfMonth.getDay();
    const prevMonthDaysToShow = dayOfWeekOfFirst;

    const grid = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = prevMonthDaysToShow; i > 0; i--) {
      const dayNum = prevMonthLastDay - i + 1;
      grid.push({
        day: dayNum,
        date: new Date(year, month - 1, dayNum),
        type: 'prev',
      });
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      grid.push({
        day: i,
        date: new Date(year, month, i),
        type: 'current',
      });
    }

    const nextMonthDaysToShow = 42 - grid.length;
    for (let i = 1; i <= nextMonthDaysToShow; i++) {
      grid.push({
        day: i,
        date: new Date(year, month + 1, i),
        type: 'next',
      });
    }

    return grid;
  }, [currentMonth]);

  const monthLabel = currentMonth
    ? currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : '';

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Yoco Checkout API: create a checkout on our server, then redirect to Yoco's hosted page
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your basket is currently empty!');
      return;
    }

    if (!customer.name || !customer.email || !customer.phone || !customer.collectionSlot) {
      alert('Please fill in your contact details and select a collection date from the calendar.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/yoco/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cart.map(({ id, title, price, quantity }) => ({
            id,
            title,
            price,
            quantity,
          })),
          customer,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error || 'Could not start payment. Please try again.');
      }

      // Send the customer to Yoco's hosted payment page.
      // The cart is cleared on /order-success, not here.
      window.location.href = data.redirectUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      alert(err.message || 'An error occurred starting your payment.');
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      ></div>

      <div className={`cart-drawer ${isOpen ? 'open' : ''}`} id="cart-drawer">
        <div className="cart-drawer-content">
          <div className="cart-header">
            <h3>Your Order Basket</h3>
            <button className="cart-close" onClick={onClose} aria-label="Close cart">
              &times;
            </button>
          </div>

          <div className="cart-body" id="cart-items-container">
            {cart.length === 0 ? (
              <p className="empty-cart-msg">Your basket is currently empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: '44px',
                        height: '44px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div className="cart-item-details">
                    <h4>{item.title}</h4>
                    <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: 'bold', color: '#535622' }}>
                      R {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      type="button"
                      className="qty-btn minus-btn"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="qty-btn plus-btn"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleCheckout} className="checkout-customer-fields">
            <h3>Customer & Collection Details</h3>

            <div className="form-group">
              <label htmlFor="cust-name">Full Name *</label>
              <input
                type="text"
                id="cust-name"
                placeholder="e.g. Jane Doe"
                required
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cust-email">Email Address *</label>
              <input
                type="email"
                id="cust-email"
                placeholder="e.g. jane@example.com"
                required
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cust-phone">Mobile Number *</label>
              <input
                type="tel"
                id="cust-phone"
                placeholder="e.g. 0821234567"
                required
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Select Collection Date (48hr Notice Required) *</label>

              {currentMonth ? (
                <div className="cafe-calendar">
                  <div className="cafe-cal-header">
                    <button type="button" onClick={handlePrevMonth} className="cafe-cal-nav">&larr;</button>
                    <span className="cafe-cal-title">{monthLabel}</span>
                    <button type="button" onClick={handleNextMonth} className="cafe-cal-nav">&rarr;</button>
                  </div>

                  <div className="cafe-cal-weekdays">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>

                  <div className="cafe-cal-days">
                    {calendarGrid.map((dayData, idx) => {
                      const dateObj = dayData.date;
                      const dateCompare = new Date(dateObj).setHours(0, 0, 0, 0);
                      const minCompare = new Date(minDate).setHours(0, 0, 0, 0);
                      const maxCompare = new Date(maxDate).setHours(0, 0, 0, 0);

                      const isDisabled = dateCompare < minCompare || dateCompare > maxCompare;
                      const isSelected = selectedDate && selectedDate.toDateString() === dateObj.toDateString();
                      const isCurrentDay = dateObj.toDateString() === new Date().toDateString();

                      let cellClass = `cafe-day cafe-day-${dayData.type}`;
                      if (isDisabled) cellClass += ' disabled';
                      if (isCurrentDay && !isSelected) cellClass += ' is-today';
                      if (isSelected) cellClass += ' selected';

                      return (
                        <button
                          key={`${dayData.type}-${dayData.day}-${idx}`}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleDateClick(dateObj)}
                          className={cellClass}
                        >
                          <span className="cafe-day-num">{dayData.day}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="calendar-hint">Loading collection calendar...</p>
              )}

              {customer.collectionSlot ? (
                <div className="selected-slot-banner">
                  <strong>Selected Pickup:</strong>
                  <p>{customer.collectionSlot}</p>
                </div>
              ) : (
                <p className="calendar-hint">Please click an available date on the calendar above.</p>
              )}
            </div>

            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Total:</span>
                <span id="cart-total-price">R {total.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                className="btn-primary full-width"
                id="checkout-btn"
                disabled={loading || cart.length === 0}
              >
                {loading ? 'Redirecting to Yoco...' : 'Pay via Yoco'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}