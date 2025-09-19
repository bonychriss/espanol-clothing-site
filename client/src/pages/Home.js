
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

function Home() {
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

  // ...existing code...


  return (
    <div className="home">
      {/* Hero Section */}
      <div className="boohoo-hero" style={{ backgroundImage: `url(${heroBanner.image})` }}>
        <div className="boohoo-hero-overlay">
          <h1 style={{
            color: '#fff',
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontWeight: 800,
            fontSize: '3rem',
            letterSpacing: '2px',
            textShadow: '0 2px 12px #000'
          }}>
            {heroBanner.headline}
          </h1>
        </div>
      </div>



      <div className="boohoo-promo-slider" style={{ background: promoSlides[promoIdx].bg, color: promoSlides[promoIdx].color }}>
        <span>{promoSlides[promoIdx].text}</span>
      </div>

      {/* Removed category links, New Arrivals, Best Sellers, and Featured Products as requested */}

      {/* Trending Products */}
      <div className="trending-row">
        <h2>Trending Now</h2>
        <div className="trending-list">
          {fallbackProducts.map((item, idx) => (
            <div className="product-card small" key={idx} style={{ width: '180px', height: '240px', padding: '1rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px #eee', margin: '0.5rem' }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.75rem', marginBottom: '0.5rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.name}</h4>
            </div>
          ))}
      </div>
        </div>

      {/* WhatsApp Chat Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 10001,
          background: '#25D366',
          borderRadius: '50%',
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px #222',
          textDecoration: 'none',
        }}
        aria-label="Chat with us on WhatsApp"
      >
        {/* Official WhatsApp SVG icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#25D366"/>
          <path d="M22.1 19.7c-.3-.2-1.7-.8-2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.1-.2.1-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.3-.8-.7-1.3-1.5-1.5-1.8-.2-.3-.1-.5.1-.7.1-.1.3-.4.4-.6.1-.2.1-.3 0-.5-.1-.2-.7-1.7-.9-2.3-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.7.7-.7 1.7s.7 2 1.1 2.5c.4.5 1.6 2.5 3.9 3.3.5.2.9.3 1.2.2.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1.1z" fill="#fff"/>
        </svg>
      </a>

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" style={{ background: '#FFD700', color: '#222', borderRadius: 4, padding: '0.5rem 0', textAlign: 'center', textDecoration: 'none', fontWeight: 600 }}>Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" style={{ background: '#FFD700', color: '#222', borderRadius: 4, padding: '0.5rem 0', textAlign: 'center', textDecoration: 'none', fontWeight: 600 }}>Facebook</a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon" style={{ background: '#FFD700', color: '#222', borderRadius: 4, padding: '0.5rem 0', textAlign: 'center', textDecoration: 'none', fontWeight: 600 }}>TikTok</a>
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
