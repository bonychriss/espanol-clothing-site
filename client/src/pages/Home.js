import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  // Testimonials data (could also be translated)
  const testimonials = [
    { name: 'Jane Doe', quote: 'Amazing quality!', image: process.env.PUBLIC_URL + '/images/jane.jpg', stars: 5 },
    { name: 'John Smith', quote: 'Fast delivery and great service.', image: process.env.PUBLIC_URL + '/images/john.jpg', stars: 4 },
    // Add more testimonials as needed
  ];

  // Testimonial index state
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // Simple utility helpers
  const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
  const fmt = (s) => String(s || '').trim();
  const preloadImage = (src) => {
    if (!src) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  };

  // SEO basics
  useEffect(() => {
    document.title = t('documentTitle');
    const desc = t('metaDescription');
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
    }, [t]);

  // Hero assets
  const heroImages = useMemo(() => [
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80',
  ], []);
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    // Preload all hero images on mount
    heroImages.forEach(preloadImage);
  }, [heroImages]);

  // Preload the first hero image for faster LCP
  useEffect(() => {
    if (heroImages.length > 0) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImages[0];
      document.head.appendChild(link);
    }
  }, [heroImages]);

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx((i) => (i + 1) % testimonials.length), 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  
  // Category grid
  const categories = [
    { key: 'men', label: 'Men', image: process.env.PUBLIC_URL + '/images/mens-jeans.jpg', href: '/products?category=Men' },
    { key: 'women', label: 'Women', image: process.env.PUBLIC_URL + '/images/dresses.jpg', href: '/products?category=Women' },
    { key: 'kids', label: 'Kids', image: process.env.PUBLIC_URL + '/images/sweater.jpg', href: '/products?category=Kids' },
    { key: 'casual', label: 'Casual', image: process.env.PUBLIC_URL + '/images/suit.jpg', href: '/products?category=Casual' },
  ];


  // Best Picks (server-backed)
  const [bestPicks, setBestPicks] = useState([]);
  const [bpLoading, setBpLoading] = useState(true);
  const [bpError, setBpError] = useState(null);
  const fetchBestPicks = React.useCallback(async () => {
    setBpLoading(true);
    setBpError(null);
    try {
      const res = await fetch(`${API_BASE}/api/best-picks`, {credentials: 'include'});
      if (!res.ok) {
        // If the response is not ok, try to read the error message from the response body
        const errorData = await res.json().catch(() => ({message: `Failed to fetch Best Picks: ${res.status}`})); // Attempt to parse JSON, if fails, create a default error object
        throw new Error(errorData?.message || `Failed to fetch Best Picks: ${res.status}`);
      }
      const data = await res.json(); // Directly parse the JSON from the response
      setBestPicks(Array.isArray(data) ? data : []); // Set the best picks
    } catch (err) {
      setBpError(err?.message || 'Failed to fetch Best Picks');
      setBestPicks([]);
    } finally {
      setBpLoading(false);
    }
  }, [API_BASE]);
  useEffect(() => {
    fetchBestPicks();
    const handler = () => fetchBestPicks();
    window.addEventListener('bestPicksUpdated', handler);
    return () => window.removeEventListener('bestPicksUpdated', handler);
  }, [fetchBestPicks]);

  // Product videos array (moved outside useEffect)
  const productVideos = useMemo(() => [
    {
      sources: [
        { src: process.env.PUBLIC_URL + '/videos/3206484-hd_1920_1080_25fps.mp4', type: 'video/mp4' },
      ],
      poster: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    },
    {
      sources: [
        { src: process.env.PUBLIC_URL + '/videos/3753702-uhd_3840_2160_25fps.mp4', type: 'video/mp4' },
      ],
      poster: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    },
    {
      sources: [
        { src: process.env.PUBLIC_URL + '/videos/3753702-uhd_3840_2160_25fps.mp4', type: 'video/mp4' },
      ],
      poster: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    },
  ], []);
  const [videoIdx, setVideoIdx] = useState(0);
  useEffect(() => {
    if (!productVideos.length) return;
    const interval = setInterval(() => setVideoIdx((prev) => (prev + 1) % productVideos.length), 10000);
    return () => clearInterval(interval);
  }, [productVideos.length]);

  return (
    <main>
      {/* Language changer */}
      <div style={{ width: '100%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '0.5rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="language-select" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Language:</label>
            <select
              id="language-select"
              value={i18n.language}
              onChange={e => i18n.changeLanguage(e.target.value)}
              style={{ padding: '0.4em 1em', borderRadius: 8, border: '1px solid #FFD700', fontWeight: 600, fontSize: '0.9rem' }}
            >
              <option value="en">English</option>
              <option value="fr">Français (French)</option>
              <option value="sw">Kiswahili (Swahili)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        aria-label="Hero"
        style={{
          backgroundImage: `url(${heroImages[heroIdx]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '72vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'background-image 0.8s ease',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15))'
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff', padding: '0 1rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', margin: 0, fontWeight: 800 }}>
            {t('heroTitle')}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', opacity: 0.95, marginTop: 10 }}>
            {t('heroSubtitle')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 18 }}>
            <a href="/products?sort=new-arrivals" style={{
              background: '#FFD700', color: '#222', fontWeight: 700,
              padding: '0.7rem 1.2rem', borderRadius: 8, textDecoration: 'none'
            }}>{t('shopNewArrivals')}</a>
            <button
              style={{
                background: 'transparent', color: '#fff', border: '2px solid #fff',
                padding: '0.6rem 1.1rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer'
              }}
              onClick={() => navigate('/products')}
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      
      {/* Categories Grid */}
      <section aria-labelledby="shop-by-category" style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
        <h2 id="shop-by-category" style={{ color: '#FFD700', fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{t('shopByCategory')}</h2>
        <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {categories.map((c) => (
            <a key={c.key} href={c.href} style={{ textDecoration: 'none', color: 'inherit' }} aria-label={`Shop ${c.label}`}>
              <div style={{
                borderRadius: 16, overflow: 'hidden', position: 'relative',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
              }}>
                <img src={c.image} alt={`${c.label} category`} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '4 / 5', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', left: 12, bottom: 12, color: '#fff', fontWeight: 800, textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>{t(c.key, c.label)}</div>
              </div>
            </a>
          ))}
        </div>
      </section>


      {/* Best Picks */}
      <section id="best-picks" aria-labelledby="best-picks-title" style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
        <h2 id="best-picks-title" className="section-title" style={{ color: '#FFD700', fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{t('bestPicks')}</h2>
        {bpLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 280, borderRadius: 16, background: '#f3f3f3' }} />
            ))}
          </div>
        )}
        {bpError && (
          <div style={{ color: 'crimson', padding: '0.5rem 0' }}>{bpError}</div>
        )}
        {!bpLoading && !bpError && (
          <div className="trending-list best-picks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
            {bestPicks.map((item, idx) => (
              <div
                key={idx}
                className="trend-tile"
                style={{
                  position: 'relative', width: '100%', aspectRatio: '4 / 5', borderRadius: 16,
                  overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', cursor: 'pointer'
                }}
                aria-label={fmt(item.name) || `Best pick ${idx + 1}`}
              >
                <img
                  src={item.image}
                  alt={fmt(item.name) || `Best pick ${idx + 1}`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', left: 12, bottom: 12, color: '#fff', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                  {fmt(item.name) || 'Best Pick'}
                </div>
                <button
                  style={{
                    position: 'absolute', right: 12, bottom: 12, background: '#FFD700', color: '#222', fontWeight: 700,
                    border: 'none', borderRadius: 8, padding: '0.5rem 1.1rem', cursor: 'pointer', zIndex: 2
                  }}
                  onClick={() => {
                    if (!isAuthenticated) {
                      // Show user-friendly alert and redirect to login page
                      const userChoice = window.confirm(
                        'You need to be logged in to add items to your cart.\n\n' +
                        'Click "OK" to log in or "Cancel" to create a new account.'
                      );
                      
                      if (userChoice) {
                        navigate('/login');
                      } else {
                        navigate('/register');
                      }
                      return;
                    }
                    navigate('/select-size', { state: { product: item } });
                  }}
                >
                  {t('selectSize')}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Video Hero */}
      <section
        className="floating-video-hero"
        aria-label="Featured video"
        style={{
          position: 'relative',
          minHeight: '72vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '2rem 0',
          overflow: 'hidden',
          background: 'none', // Remove any background
        }}
      >
        <video
          key={videoIdx}
          playsInline
          autoPlay
          muted
          loop
          preload="metadata"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        >
          {productVideos[videoIdx].sources.map((source, index) => (
            <source key={`${videoIdx}-${index}`} src={source.src} type={source.type} />
          ))}
        </video>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ background: 'rgba(0,0,0,0.35)', color: '#fff', padding: '0.75rem 1rem', borderRadius: 10, fontWeight: 800 }}>
            New Season. New You. <a href="/products" style={{ color: '#FFD700', textDecoration: 'none', marginLeft: 8, pointerEvents: 'auto' }}>Shop Now</a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section aria-labelledby="testimonials" style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
        <h2 id="testimonials" style={{ textAlign: 'center', color: '#FFD700', fontSize: 24, fontWeight: 800, marginBottom: 16 }}>What Our Customers Say</h2>
        <div style={{ background: '#222', borderRadius: 16, padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px #0001', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontStyle: 'italic' }}>
            <span style={{ color: '#FFD700', fontSize: 20 }}>&ldquo;</span>{testimonials[testimonialIdx].quote}<span style={{ color: '#FFD700', fontSize: 20 }}>&rdquo;</span>
          </div>
          <div style={{ color: '#FFD700', fontWeight: 600, fontSize: 18, marginTop: 6 }}>{'★'.repeat(testimonials[testimonialIdx].stars)}</div>
          <div style={{ marginTop: 6, fontSize: 15, color: '#aaa' }}>— {testimonials[testimonialIdx].name}</div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <div className="social-float" style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 100 }}>
        <a href="https://wa.me/+255683972666" className="whatsapp" target="_blank" rel="noopener noreferrer" style={{ width: 55, height: 55, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26, background: '#25d366', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)', textDecoration: 'none' }}>
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>

      {/* Footer */}
      <footer style={{ width: '100vw', background: '#222', color: '#fff', marginTop: '3rem', padding: '2rem 0 1.5rem 0', borderTop: '4px solid #FFD700' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ minWidth: 220, flex: 1 }}>
            <h3 style={{ color: '#FFD700', marginBottom: 12 }}>{t('companyInfo')}</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
              {t('companyInfoText')}
            </p>
          </div>
          <div style={{ minWidth: 220, flex: 1 }}>
            <h3 style={{ color: '#FFD700', marginBottom: 12 }}>{t('exclusiveOffers')}</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} style={{ display: 'flex', gap: 10 }}>
              <input type="email" placeholder={t('yourEmail')} required style={{ padding: '0.5rem', borderRadius: 6, border: 'none', flex: 1 }} />
              <button type="submit" style={{ background: '#FFD700', color: '#222', border: 'none', borderRadius: 6, padding: '0.5rem 0.9rem', fontWeight: 700 }}>{t('subscribe')}</button>
            </form>
          </div>
          <div style={{ minWidth: 220, flex: 1 }}>
            <h3 style={{ color: '#FFD700', marginBottom: 12 }}>{t('followUs')}</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="https://maps.google.com/maps/search/Kisiwani%2C%20Mwai%20Kibaki%20Rd%2C%20Dar%20es%20Salaam%2C%20Tanzania/@-6.7697,39.2637,17z?hl=en" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, background: '#EA4335', textDecoration: 'none' }}>
                <i className="fas fa-map-marker-alt"></i>
              </a>
              <a href="https://www.facebook.com/share/1JN42xsde4/" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, background: '#1877F3' }}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/saborespanol25?igsh=Mm5xZGk1ZTlqMnpi" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, background: '#E4405F' }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@sabor.espaol?_t=ZM-8zsiyFtFw9A&_r=1" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, background: '#000' }}>
                <i className="fab fa-tiktok"></i>
              </a>
              <a href="https://twitter.com/username" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, background: '#1DA1F2' }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com/company/yourcompany" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, background: '#0077B5' }}>
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem', color: '#aaa' }}>
          &copy; {new Date().getFullYear()} {t('copyright')}
        </div>
      </footer>

      {/* Enhanced Mobile Responsive CSS */}
      <style>{`
        /* Tablet and smaller desktop */
        @media (max-width: 980px) {
          .categories-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
            gap: 1rem !important;
          }
          .best-picks-grid, .trending-list {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 1rem !important;
          }
        }
        
        /* Mobile tablets (768px and below) */
        @media (max-width: 768px) {
          main {
            padding: 0 !important;
          }
          
          /* Language selector */
          main > div:first-child > div {
            padding: 0 1rem !important;
            flex-direction: column !important;
            gap: 8px !important;
          }
          
          /* Hero section */
          section[aria-label="Hero"] {
            min-height: 60vh !important;
            padding: 0 1rem !important;
          }
          
          section[aria-label="Hero"] h1 {
            font-size: clamp(1.8rem, 4vw, 2.5rem) !important;
          }
          
          section[aria-label="Hero"] p {
            font-size: clamp(0.9rem, 2vw, 1.1rem) !important;
          }
          
          section[aria-label="Hero"] > div:last-child > div:last-child {
            flex-direction: column !important;
            gap: 8px !important;
          }
          
          section[aria-label="Hero"] > div:last-child > div:last-child a,
          section[aria-label="Hero"] > div:last-child > div:last-child button {
            width: 100% !important;
            max-width: 200px !important;
            text-align: center !important;
          }
          
          /* Categories */
          .categories-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          
          /* Best picks */
          .best-picks-grid, .trending-list {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          
          /* Video section */
          .floating-video-hero {
            min-height: 50vh !important;
            margin: 1.5rem 0 !important;
          }
          
          /* Footer */
          footer > div {
            flex-direction: column !important;
            gap: 1.5rem !important;
            padding: 0 1rem !important;
          }
          
          footer > div > div {
            min-width: auto !important;
            text-align: center !important;
          }
          
          footer form {
            flex-direction: column !important;
            gap: 8px !important;
          }
          
          /* Social float */
          .social-float {
            bottom: 15px !important;
            right: 15px !important;
          }
          
          .social-float a {
            width: 50px !important;
            height: 50px !important;
            font-size: 24px !important;
          }
        }
        
        /* Mobile phones (600px and below) */
        @media (max-width: 600px) {
          /* Sections padding */
          section[aria-labelledby] {
            padding: 0 0.75rem !important;
            margin: 1.5rem auto !important;
          }
          
          /* Hero section */
          section[aria-label="Hero"] {
            min-height: 50vh !important;
            padding: 0 0.75rem !important;
          }
          
          /* Categories and best picks */
          .categories-grid, .best-picks-grid, .trending-list {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }
          
          .trend-tile, .category-card {
            min-height: 160px !important;
          }
          
          .trend-tile img, .category-card img {
            height: 140px !important;
          }
          
          .trend-tile button {
            padding: 0.4rem 0.8rem !important;
            font-size: 0.85rem !important;
          }
          
          /* Video section */
          .floating-video-hero {
            min-height: 40vh !important;
            margin: 1rem 0 !important;
          }
          
          .floating-video-hero > div:last-child > div {
            padding: 0.5rem 0.75rem !important;
            font-size: 0.9rem !important;
          }
          
          /* Testimonials */
          section[aria-labelledby="testimonials"] {
            margin: 1.5rem auto !important;
          }
          
          section[aria-labelledby="testimonials"] > div {
            padding: 1rem !important;
          }
          
          /* Section titles */
          h2 {
            font-size: 1.5rem !important;
          }
        }
        
        /* Small mobile phones (480px and below) */
        @media (max-width: 480px) {
          /* Further reduce spacing */
          section[aria-labelledby] {
            padding: 0 0.5rem !important;
            margin: 1rem auto !important;
          }
          
          section[aria-label="Hero"] {
            padding: 0 0.5rem !important;
            min-height: 45vh !important;
          }
          
          .categories-grid, .best-picks-grid, .trending-list {
            gap: 0.4rem !important;
          }
          
          .trend-tile, .category-card {
            min-height: 140px !important;
          }
          
          .trend-tile img, .category-card img {
            height: 120px !important;
          }
          
          .trend-tile button {
            padding: 0.3rem 0.6rem !important;
            font-size: 0.8rem !important;
          }
          
          /* Video section */
          .floating-video-hero {
            min-height: 35vh !important;
          }
          
          /* Social float */
          .social-float {
            bottom: 10px !important;
            right: 10px !important;
          }
          
          .social-float a {
            width: 45px !important;
            height: 45px !important;
            font-size: 20px !important;
          }
          
          /* Footer */
          footer {
            padding: 1.5rem 0 1rem 0 !important;
          }
          
          /* Section titles */
          h2 {
            font-size: 1.3rem !important;
            margin-bottom: 12px !important;
          }
        }
        
        /* Extra small devices (360px and below) */
        @media (max-width: 360px) {
          section[aria-labelledby] {
            padding: 0 0.25rem !important;
          }
          
          section[aria-label="Hero"] {
            padding: 0 0.25rem !important;
          }
          
          .categories-grid, .best-picks-grid, .trending-list {
            gap: 0.3rem !important;
          }
          
          .trend-tile, .category-card {
            min-height: 120px !important;
          }
          
          .trend-tile img, .category-card img {
            height: 100px !important;
          }
          
          .trend-tile button {
            padding: 0.25rem 0.5rem !important;
            font-size: 0.75rem !important;
          }
          
          /* Video section */
          .floating-video-hero {
            min-height: 30vh !important;
          }
          
          /* Testimonials */
          section[aria-labelledby="testimonials"] > div {
            padding: 0.75rem !important;
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </main>
  );
}
