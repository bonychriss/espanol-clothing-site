import React, { useState, useEffect } from 'react';

const heroBanner = {
  image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
  headline: 'Clothing with attitude',
  sub: 'Shop the latest arrivals for men, women & kids',
};

const promoSlides = [
  { text: 'Up to 50% Off Everything!', bg: '#FFD700', color: '#000' },
  { text: 'Free Delivery Over $50', bg: '#000', color: '#FFD700' },
  { text: 'Student Discount 20%', bg: '#FFD700', color: '#000' },
];

function getStoredRatings() {
  try {
    return JSON.parse(localStorage.getItem('customerRatings') || '[]');
  } catch {
    return [];
  }
}
function addStoredRating(rating) {
  const ratings = getStoredRatings();
  ratings.push(rating);
  localStorage.setItem('customerRatings', JSON.stringify(ratings));
}

function Home() {
  // Customer ratings state
  const [customerRatings, setCustomerRatings] = useState(getStoredRatings());
  useEffect(() => {
    const handler = () => setCustomerRatings(getStoredRatings());
    window.addEventListener('customer-rating-submitted', handler);
    return () => window.removeEventListener('customer-rating-submitted', handler);
  }, []);

  // Testimonials carousel state
  const testimonials = [
    ...customerRatings.map(r => ({ text: r.comment, name: r.name || 'Anonymous', stars: r.stars })),
    { text: 'Amazing quality and fast delivery!', name: 'Sarah K.', stars: 5 },
    { text: 'Trendy styles at great prices. Will shop again!', name: 'James M.', stars: 5 },
    { text: 'Customer service was super helpful!', name: 'Amina T.', stars: 5 }
  ];
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx((c) => (c + 1) % testimonials.length), 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);
  // WhatsApp chat button
  const whatsappNumber = '255683972666'; // Updated to user's WhatsApp number

  // Product videos for hero slider (local files)
  const productVideos = [
    {
      video: process.env.PUBLIC_URL + "/videos/1943413-hd_1920_1080_24fps.mp4",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
    },
    {
      video: process.env.PUBLIC_URL + "/videos/3206484-hd_1920_1080_25fps.mp4",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    },
    {
      video: process.env.PUBLIC_URL + "/videos/3206567-hd_1080_1920_25fps.mp4",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
    },
    {
      video: process.env.PUBLIC_URL + "/videos/3753702-uhd_3840_2160_25fps.mp4",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    },
    {
      video: process.env.PUBLIC_URL + "/videos/3888253-uhd_2160_4096_25fps.mp4",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
    },
    {
      video: process.env.PUBLIC_URL + "/videos/3917703-uhd_2160_4096_25fps.mp4",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    },
    {
      video: process.env.PUBLIC_URL + "/videos/3917742-uhd_4096_2160_25fps.mp4",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const [videoIdx, setVideoIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setVideoIdx((prev) => (prev + 1) % productVideos.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [productVideos.length]);

  const [promoIdx] = useState(0);

  // Products fetched from backend
  const fallbackProducts = [
    { name: "Men's Jeans", image: process.env.PUBLIC_URL + "/images/mens-jeans.jpg" },
    { name: 'Sweater', image: process.env.PUBLIC_URL + "/images/sweater.jpg" },
    { name: 'Suit', image: process.env.PUBLIC_URL + "/images/suit.jpg" },
    { name: 'Dresses', image: process.env.PUBLIC_URL + "/images/dresses.jpg" }
  ];

  // Sabor Best Picks state
  const [bestPicks, setBestPicks] = useState([]);
  const fetchBestPicks = async () => {
    try {
      const res = await fetch('/api/best-picks');
      const data = await res.json();
      setBestPicks(Array.isArray(data) ? data : []);
    } catch (err) {
      setBestPicks([]);
    }
  };
  useEffect(() => {
    fetchBestPicks();
    // Listen for best picks update event
    const handler = () => fetchBestPicks();
    window.addEventListener('bestPicksUpdated', handler);
    return () => window.removeEventListener('bestPicksUpdated', handler);
  }, []);

  // Hero images for sliding effect
  const heroImages = [
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1600&q=80'
  ];
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setHeroIdx((i) => (i + 1) % heroImages.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="boohoo-hero" style={{ backgroundImage: `url(${heroImages[heroIdx]})`, transition: 'background-image 0.8s' }}>
        <div className="boohoo-hero-overlay">
          <h1>
            <span className="attitude-title">{heroBanner.headline}</span>
          </h1>
        </div>
        {/* Removed navigation dots */}
      </div>

      <div className="boohoo-promo-slider" style={{ background: promoSlides[promoIdx].bg, color: promoSlides[promoIdx].color }}>
        <span>{promoSlides[promoIdx].text}</span>
      </div>

      {/* Sabor Best Picks Section */}
      <div className="best-picks-row">
  <h2 className="section-title">Sabor Best Picks</h2>
    <div className="trending-list hero-floating-carousel">
          {Array.isArray(bestPicks) && bestPicks.map((item, idx) => (
            <div
              key={idx}
              className="trend-tile"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 5',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                cursor: 'pointer'
              }}
              aria-label={item.name}
              onClick={() => window.location = '/products'}
            >
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '36%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))',
                pointerEvents: 'none'
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="trending-row">
  <h2 className="section-title">Trending Now</h2>
        <div className="trending-list">
          {fallbackProducts.map((item, idx) => (
            <div
              key={idx}
              className="trend-tile"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 5',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
              }}
              aria-label={item.name}
            >
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '36%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))',
                pointerEvents: 'none'
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Video Hero */}
      <section className="floating-video-hero" aria-label="Featured video">
        <div className="video-frame">
          <video
            key={videoIdx}
            src={productVideos[videoIdx].video}
            playsInline
            autoPlay
            muted
            loop
            preload="metadata"
            poster={productVideos[videoIdx].image}
          />
          <div className="video-overlay">
            <div>New Season. New You.</div>
            <a href="/products">Shop Now</a>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
  <section className="testimonials-section hero-section-match">
        <h2 style={{ textAlign: 'center', color: '#FFD700', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>What Our Customers Say</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 120, width: '100%', justifyContent: 'center' }}>
          <div style={{ background: '#222', borderRadius: 16, padding: '1.5rem 2rem', boxShadow: '0 2px 8px #0001', textAlign: 'center', width: '100%', maxWidth: 900, margin: '0 auto', transition: 'box-shadow 0.3s', fontSize: 18, marginBottom: 16 }}>
            <span style={{ fontStyle: 'italic', color: '#FFD700', fontSize: 20 }}>&ldquo;</span>
            {testimonials[testimonialIdx].text}
            <span style={{ fontStyle: 'italic', color: '#FFD700', fontSize: 20 }}>&rdquo;</span>
            <div style={{ color: '#FFD700', fontWeight: 600, fontSize: 18, marginTop: 10 }}>{'★'.repeat(testimonials[testimonialIdx].stars)}</div>
            <div style={{ marginTop: 10, fontSize: 15, color: '#aaa' }}>— {testimonials[testimonialIdx].name}</div>
          </div>
          {/* Removed testimonial navigation dots */}
        </div>
      </section>

      {/* WhatsApp Chat Button */}
      {/* Exact HTML for floating social icons */}
      <div className="social-float" style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 100 }}>
        <a href="https://wa.me/+255683972666" className="whatsapp" target="_blank" rel="noopener noreferrer" style={{ width: 55, height: 55, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26, background: '#25d366', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)', textDecoration: 'none', transition: 'transform 0.3s ease' }}>
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>

      {/* Footer Section */}
      <footer style={{ width: '100vw', background: '#222', color: '#fff', marginTop: '3rem', padding: '2.5rem 0 1.5rem 0', borderTop: '4px solid #FFD700' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Company Info */}
          <div style={{ minWidth: 220, flex: 1 }}>
            <h3 style={{ color: '#FFD700', marginBottom: 12 }}>Company Info</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>We believe fashion should be fun, affordable, and accessible to everyone. Our mission is to deliver the latest styles with great quality and service.</p>
          </div>
          {/* Newsletter */}
          <div style={{ minWidth: 220, flex: 1 }}>
            <h3 style={{ color: '#FFD700', marginBottom: 12 }}>Get Exclusive Offers</h3>
            <form className="newsletter-form" onSubmit={e => { e.preventDefault(); alert('Subscribed!'); }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input type="email" placeholder="Your email" required style={{ padding: '0.5rem', borderRadius: 4, border: 'none', marginBottom: 8 }} />
              <button type="submit" style={{ background: '#FFD700', color: '#222', border: 'none', borderRadius: 4, padding: '0.5rem 0', fontWeight: 600 }}>Subscribe</button>
            </form>
          </div>
          {/* Social Links */}
            <div style={{ minWidth: 220, flex: 1 }}>
              <h3 style={{ color: '#FFD700', marginBottom: 12 }}>Follow Us</h3>
              <div className="social-float" style={{ display: 'flex', flexDirection: 'row', gap: '10px', zIndex: 100 }}>
              <a href="https://maps.google.com/maps/search/Kisiwani%2C%20Mwai%20Kibaki%20Rd%2C%20Dar%20es%20Salaam%2C%20Tanzania/@-6.7697,39.2637,17z?hl=en" className="location" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', background: '#EA4335', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)', textDecoration: 'none', transition: 'transform 0.3s ease' }}>
                <i className="fas fa-map-marker-alt"></i>
              </a>
              <a href="https://www.facebook.com/share/1JN42xsde4/" className="facebook" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', background: '#1877F3', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)', textDecoration: 'none', transition: 'transform 0.3s ease' }}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/saborespanol25?igsh=Mm5xZGk1ZTlqMnpi" className="instagram" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', background: '#E4405F', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)', textDecoration: 'none', transition: 'transform 0.3s ease' }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@sabor.espaol?_t=ZM-8zsiyFtFw9A&_r=1" className="tiktok" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', background: '#000000', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)', textDecoration: 'none', transition: 'transform 0.3s ease' }}>
                <i className="fab fa-tiktok"></i>
              </a>
              <a href="https://twitter.com/username" className="twitter" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', background: '#1DA1F2', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)', textDecoration: 'none', transition: 'transform 0.3s ease' }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com/company/yourcompany" className="linkedin" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', background: '#0077B5', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)', textDecoration: 'none', transition: 'transform 0.3s ease' }}>
                <i className="fab fa-linkedin-in"></i>
              </a>
              </div>
            </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: '#aaa' }}>
          &copy; {new Date().getFullYear()} Clothing Co. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
