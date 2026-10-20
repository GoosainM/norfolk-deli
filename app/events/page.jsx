'use client';

import { useState, useEffect, useRef } from 'react';
import { client, urlFor } from '../lib/sanity';

// Default static fallback list of previous events matching your posters
const STATIC_PREVIOUS_EVENTS = [
  {
    id: 'past-1',
    title: 'Crookie Fest',
    date: 'Sunday, 9:00 - 11:00 AM',
    location: 'Norfolk Deli, Sea Point',
    description: 'First 10 Crookies FREE! Biscoff, White Choc & OG Choc Chip Crookies with Matcha and Coffee.',
    img: '/images/event-1.png', // Save the uploaded poster image in public/images/
  },
  {
    id: 'past-2',
    title: 'Walk for GBV',
    date: '21 November | 7:00 AM',
    location: 'Sea Point',
    description: 'Walking for the constitutional rights of women and children in SA.',
    img: '/images/event-2.png',
  },
  {
    id: 'past-3',
    title: 'Run for the Dogs',
    date: 'Saturday, 20 December 2025 @ 8:30 AM',
    location: 'Sea Point Promenade to Norfolk Deli',
    description: '3km / 5km community run raising dog food and blankets for shelter pups.',
    img: '/images/event-3.png',
  },
  {
    id: 'past-4',
    title: 'Sprinkle Embroidery Workshop',
    date: '18 October 2026 | 15:00 - 17:00',
    location: 'Norfolk Deli',
    description: 'Wanderfolk x Norfolk custom cake decorating and sprinkle embroidery event.',
    img: '/images/event-4.png',
  },
  {
    id: 'past-5',
    title: 'Blok Spring Clean',
    date: 'Saturday, 5 September | 9:00 - 11:00 AM',
    location: 'Broken Bath Beach, Sea Point',
    description: 'Community beach cleanup initiative supported by Blok & Pristine Collective.',
    img: '/images/event-5.png',
  },
  {
    id: 'past-6',
    title: 'Walkies on the Prom',
    date: 'Saturday, 18 July 2026 | 09:30 - 10:30 AM',
    location: 'Norfolk Deli, Sea Point',
    description: 'Mandela Day charity walk raising funds for Sighthound Rescue SA.',
    img: '/images/event-6.png',
  },
  {
    id: 'past-7',
    title: 'Run for Cancer',
    date: '21 February | 8:00 AM',
    location: 'Norfolk Deli',
    description: 'Community charity run with UCOOK & I Heart Boobies.',
    img: '/images/event-7.png',
  },
  {
    id: 'past-8',
    title: "Run for St Joseph's Children's Hospital",
    date: '27 September 2026 | 8:00 AM',
    location: 'Mouille Point Promenade',
    description: "5K & 10K walk/run supporting St Joseph's Children's Hospital.",
    img: '/images/event-8.png',
  },
  {
    id: 'past-9',
    title: 'Run for Period Poverty',
    date: '26 September | 8:30 AM',
    location: 'Norfolk Deli, Sea Point',
    description: '5km run collecting sanitary pad donations for partner schools.',
    img: '/images/event-9.png',
  },
];

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // Fetch all events from Sanity
        const query = `*[_type == "eventItem"] | order(eventDate desc) {
          _id,
          title,
          eventDate,
          location,
          description,
          poster,
          isUpcoming
        }`;
        const data = await client.fetch(query);

        const formatted = data.map((evt) => ({
          id: evt._id,
          title: evt.title,
          date: new Date(evt.eventDate).toLocaleDateString('en-ZA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          location: evt.location || 'Norfolk Deli, Sea Point',
          description: evt.description || '',
          img: evt.poster ? urlFor(evt.poster).width(800).url() : null,
          isUpcoming: evt.isUpcoming,
        }));

        const upcoming = formatted.filter((e) => e.isUpcoming);
        const pastFromSanity = formatted.filter((e) => !e.isUpcoming);

        setUpcomingEvents(upcoming);
        // Combine Sanity past events with static posters
        setPreviousEvents([...pastFromSanity, ...STATIC_PREVIOUS_EVENTS]);
      } catch (err) {
        console.error('Failed to fetch events from Sanity:', err);
        setPreviousEvents(STATIC_PREVIOUS_EVENTS);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Carousel Arrow Controls
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="bg-decorations" aria-hidden="true">
        <img src="/images/coffee-cup.png" className="bg-decor bg-top-right" alt="" />
        <img src="/images/counter-scene.jpg" className="bg-decor bg-center" alt="" />
      </div>

      <main className="events-page-container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2>Events & Community</h2>
          <p>Join us at Norfolk Deli for special pop-ups, charity runs, and community gatherings.</p>
        </div>

        {/* SECTION 1: UPCOMING EVENTS */}
        <section className="upcoming-events-section" style={{ marginBottom: '4rem' }}>
          <div className="section-divider" style={{ borderBottom: '1px solid #3b3a2a', paddingBottom: '0.5rem' }}>
            <span className="section-title">Upcoming Events</span>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading events...</p>
          ) : upcomingEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', backgroundColor: '#f7f5ed', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#535622' }}>No Upcoming Events Right Now</h3>
              <p style={{ margin: 0, color: '#666' }}>Follow us on Instagram or check back soon for our next deli gathering!</p>
            </div>
          ) : (
            <div className="upcoming-events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              {upcomingEvents.map((evt) => (
                <div key={evt.id} className="event-card upcoming-card" style={{ background: '#f7f5ed', borderLeft: '4px solid #535622', padding: '1.5rem', borderRadius: '8px' }}>
                  {evt.img && (
                    <div className="event-card-image" style={{ marginBottom: '1rem' }}>
                      <img src={evt.img} alt={evt.title} style={{ width: '100%', borderRadius: '6px' }} />
                    </div>
                  )}
                  <div className="event-card-content">
                    <span className="event-date" style={{ fontWeight: 'bold', color: '#535622', display: 'block', marginBottom: '0.25rem' }}>
                      📅 {evt.date}
                    </span>
                    <h3 className="event-title" style={{ margin: '0 0 0.5rem 0' }}>{evt.title}</h3>
                    <p className="event-location" style={{ fontSize: '0.88rem', color: '#666', margin: '0 0 0.75rem 0' }}>
                      📍 {evt.location}
                    </p>
                    {evt.description && <p className="event-desc" style={{ fontSize: '0.9rem', color: '#444' }}>{evt.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2: SCROLLABLE PREVIOUS EVENTS */}
        <section className="previous-events-section">
          <div className="section-divider">
            <span className="section-title">Past Events</span>
            <div className="carousel-nav-btns">
              <button type="button" className="carousel-btn" onClick={scrollLeft} aria-label="Scroll left">
                &larr;
              </button>
              <button type="button" className="carousel-btn" onClick={scrollRight} aria-label="Scroll right">
                &rarr;
              </button>
            </div>
          </div>

          <div className="previous-events-scroll" ref={scrollRef}>
            {previousEvents.map((evt) => (
              <div key={evt.id} className="event-card past-card">
                {evt.img && (
                  <div className="event-card-image">
                    <img src={evt.img} alt={evt.title} />
                  </div>
                )}
                <div className="event-card-content">
                  <span className="past-tag" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#72763f', textTransform: 'uppercase' }}>
                    Past Event
                  </span>
                  <h4 style={{ margin: '0.2rem 0', fontSize: '1.1rem', color: '#2b2b25' }}>{evt.title}</h4>
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#535622', margin: '0 0 0.4rem 0' }}>
                    {evt.date}
                  </p>
                  {evt.description && (
                    <p style={{ fontSize: '0.82rem', color: '#59574a', margin: 0, lineHeight: '1.35' }}>
                      {evt.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}