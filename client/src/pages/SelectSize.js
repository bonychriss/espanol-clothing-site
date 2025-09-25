import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function CustomerRatingForm() {
  const [stars, setStars] = React.useState(0);
  const [hoverStars, setHoverStars] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Save rating to localStorage and notify Home page
    let userName = '';
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      userName = user?.name || user?.username || '';
    } catch {}
    const rating = { stars, comment, name: userName };
    const ratings = JSON.parse(localStorage.getItem('customerRatings') || '[]');
    ratings.push(rating);
    localStorage.setItem('customerRatings', JSON.stringify(ratings));
    window.dispatchEvent(new Event('customer-rating-submitted'));
  };
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '1.5rem', marginBottom: 4 }}>
        {[1,2,3,4,5].map(i => (
          <span
            key={i}
            style={{ cursor: 'pointer', color: (hoverStars || stars) >= i ? '#FFA41C' : '#ccc', transition: 'color 0.2s' }}
            onClick={() => setStars(i)}
            onMouseEnter={() => setHoverStars(i)}
            onMouseLeave={() => setHoverStars(0)}
            aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
          >★</span>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Leave a comment..."
        rows={3}
        style={{ fontFamily: 'inherit', fontSize: '1rem', borderRadius: 8, border: '1px solid #FFD700', padding: 8, resize: 'vertical', background: '#fff', color: '#222' }}
        required
      />
      <button type="submit" style={{ background: '#FFD700', color: '#232F3E', border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
        Submit Rating
      </button>
      {submitted && (
        <div style={{ color: '#228B22', fontWeight: 600, marginTop: 6 }}>Thank you for your feedback!</div>
      )}
    </form>
  );
}

const clothingSizes = ['XS','S','M','L','XL','XXL'];
const footwearSizes = ['6','7','8','9','10','11','12'];

export default function SelectSize() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, selectedSize } = location.state || {};
  const [size, setSize] = React.useState(selectedSize || '');
  const isLoggedIn = !!localStorage.getItem('token');
  const [showCartPopup, setShowCartPopup] = React.useState(false);
  // Import localProducts from Products.js
  const localProducts = [
    { id: 'mens-jeans', name: "Men's Jeans", image: process.env.PUBLIC_URL + "/images/mens-jeans.jpg", price: 39.99, listPrice: 49.99, category: 'Men', rating: 4.4, reviews: 70805, isBestSeller: true, desc: 'Premium denim with stretch for everyday comfort.' },
    { id: 'boyz-jeans', name: "Boys' Jeans", image: process.env.PUBLIC_URL + "/images/boyz jeans.jpg", price: 24.99, listPrice: 34.99, category: 'Boys', rating: 4.2, reviews: 1805, desc: 'Durable and comfy jeans for kids on the move.' },
    { id: 'sweater', name: 'Cozy Sweater', image: process.env.PUBLIC_URL + "/images/sweater.jpg", price: 29.99, listPrice: 39.99, category: 'Women', rating: 4.6, reviews: 15094, desc: 'Soft knit with a relaxed fit to keep you warm.' },
    { id: 'suit', name: 'Classic Suit', image: process.env.PUBLIC_URL + "/images/suit.jpg", price: 129.99, listPrice: 159.99, category: 'Men', rating: 4.7, reviews: 4364, isOverallPick: true, desc: 'Tailored silhouette with stretch fabric for all-day wear.' },
    { id: 'dresses', name: 'Summer Dress', image: process.env.PUBLIC_URL + "/images/dresses.jpg", price: 49.99, listPrice: 59.99, category: 'Women', rating: 4.3, reviews: 874, desc: 'Breezy and flattering, perfect for sunny days.' },
    { id: 'shirt', name: 'Casual Shirt', image: process.env.PUBLIC_URL + "/images/shirt.jpg", price: 19.99, listPrice: 24.99, category: 'Men', rating: 4.1, reviews: 3421, desc: 'Breathable cotton blend for effortless style.' },
    { id: 'beest-of-all', name: 'Best Of All Set', image: process.env.PUBLIC_URL + "/images/beest of all.jpg", price: 54.99, listPrice: 69.99, category: 'Women', rating: 4.5, reviews: 612, desc: 'Mix-and-match set designed to elevate your look.' },
    { id: 'shoes-1', name: 'Sneakers', image: process.env.PUBLIC_URL + "/images/shoes 1.jpg", price: 59.99, listPrice: 79.99, category: 'Shoes', rating: 4.6, reviews: 2310, desc: 'Everyday sneakers with cushioned support.' },
    { id: 'shoes-2', name: 'Running Shoes', image: process.env.PUBLIC_URL + "/images/shoes2.jpg", price: 69.99, listPrice: 89.99, category: 'Shoes', rating: 4.4, reviews: 1543, desc: 'Lightweight runners built for speed and comfort.' },
    { id: 'shoes-3', name: 'Trainers', image: process.env.PUBLIC_URL + "/images/shoes3.jpg", price: 62.49, listPrice: 74.99, category: 'Shoes', rating: 4.2, reviews: 845, desc: 'Versatile trainers for gym and street.' },
    { id: 'shoes-4', name: 'Court Shoes', image: process.env.PUBLIC_URL + "/images/shoes 4.jpg", price: 64.99, listPrice: 84.99, category: 'Shoes', rating: 4.3, reviews: 541, desc: 'Court-ready grip with everyday style.' },
    { id: 'shoes-5', name: 'Mesh Sneakers', image: process.env.PUBLIC_URL + "/images/shoes 5.jpg", price: 72.5, listPrice: 89.99, category: 'Shoes', rating: 4.5, reviews: 999, desc: 'Breathable mesh upper with responsive cushioning.' },
    { id: 'shoes-6', name: 'Casual Shoes', image: process.env.PUBLIC_URL + "/images/shoes6.jpg", price: 57.0, listPrice: 69.99, category: 'Shoes', rating: 4.0, reviews: 432, desc: 'Weekend-ready shoes with a clean profile.' },
    { id: 'shoes-7', name: 'Street Sneakers', image: process.env.PUBLIC_URL + "/images/shoes7.jpg", price: 66.0, listPrice: 84.0, category: 'Shoes', rating: 4.3, reviews: 1288, desc: 'Street style meets comfort in these staples.' },
  ];
  // Find similar products by category
  const similarProducts = product && product.category ? localProducts.filter(p => p.category === product.category && p.id !== product.id) : [];

  if (!product) {
    return <div style={{ padding: 40, textAlign: 'center' }}>No product selected.</div>;
  }


  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // If product has no _id, try to find it in backend products by name
    let prodToAdd = product;
    if (!product._id) {
      // Try to find backend product in localStorage (set by Products.js)
      const backendProducts = JSON.parse(localStorage.getItem('backendProducts') || '[]');
      const match = backendProducts.find(p => p.name === product.name);
      if (match && match._id) {
        prodToAdd = { ...product, _id: match._id };
      }
    }
    cart.push({
      _id: prodToAdd._id,
      id: prodToAdd._id || prodToAdd.id || prodToAdd.name,
      name: prodToAdd.name,
      price: prodToAdd.price,
      image: prodToAdd.image,
      size,
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    setShowCartPopup(true);
    setTimeout(() => {
      setShowCartPopup(false);
      navigate('/products');
    }, 3500);
  };

  return (
    <div className="select-size-full" style={{ minHeight: '100vh', background: '#FFF8DC', padding: '32px 0', position: 'relative' }}>
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '40px',
          background: '#232F3E',
          color: '#FFD700',
          padding: '1rem 2rem',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '1.5rem',
          fontFamily: 'cursive, "Segoe Script", "Brush Script MT", "Lucida Handwriting", "Apple Chancery", sans-serif',
          boxShadow: '0 2px 12px #0003',
          zIndex: 9999,
          opacity: showCartPopup ? 1 : 0,
          transform: showCartPopup ? 'translateY(0)' : 'translateY(-30px)',
          transition: 'opacity 0.7s, transform 0.7s',
          pointerEvents: 'none',
        }}
      >
        𝒜𝒹𝒹𝑒𝒹 𝒯𝑜 𝒞𝒶𝓇𝓉
      </div>
      <div className="select-size-main" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
        {/* ...existing code... */}
        <div className="product-flex" style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start', marginBottom: 32 }}>
          <img src={product.image} alt={product.name} className="product-image" style={{ flex: '0 0 320px', width: '100%', maxWidth: 320, height: 320, objectFit: 'contain', borderRadius: 16, background: '#f8f8f8', boxShadow: '0 2px 12px #0001' }} />
          <div className="product-details" style={{ flex: '1 1 320px', minWidth: 240, padding: '0 12px' }}>
            <h1 style={{ fontWeight: 800, fontSize: '2rem', color: '#232F3E', marginBottom: 10 }}>{product.name}</h1>
            <div style={{ color: '#FFD700', fontWeight: 700, fontSize: '1.25rem', marginBottom: 8 }}>TZS {product.price}</div>
            {product.desc && <div style={{ color: '#444', fontSize: '1.08rem', marginBottom: 8 }}>{product.desc}</div>}
            {product.rating && (
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: '#FFA41C', fontSize: '1.25rem', fontWeight: 600 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
                  ))}
                </span>
              </div>
            )}
            <div style={{ color: '#888', fontSize: '1rem', marginBottom: 8 }}>Category: {product.category}</div>
            {/* Customer Ratings Section */}
            <div className="customer-ratings" style={{ marginTop: 28, padding: '1.2rem', background: '#FFF8DC', borderRadius: 10, boxShadow: '0 2px 8px #FFD70022' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#111', marginBottom: 10, letterSpacing: '1px', fontFamily: 'Segoe UI, Arial, sans-serif', textShadow: '0 2px 8px #FFD70022' }}>What Our Customers Say</h3>
              <CustomerRatingForm />
            </div>
          </div>
        </div>
        <div className="size-section" style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#FFD700', fontWeight: 800, fontSize: '1.3rem', marginBottom: 18 }}>Select Size</h2>
          {!isLoggedIn && (
            <div style={{ color: '#b8860b', fontWeight: 600, fontSize: '1.08rem', marginBottom: 18 }}>
              Please <a href="/login" style={{ color: '#232F3E', textDecoration: 'underline' }}>login</a> or <a href="/register" style={{ color: '#232F3E', textDecoration: 'underline' }}>register</a> to choose a size.
            </div>
          )}
          <div className="size-selectors" style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 18 }}>
            {(product.category && (product.category.toLowerCase() === 'footwear' || product.category.toLowerCase() === 'shoes')) ? (
              <div>
                <div style={{ fontWeight: 700, marginBottom: 10 }}>Footwear Sizes</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {footwearSizes.map(sz => (
                    <button
                      key={sz}
                      type="button"
                      className={`size-btn${size === sz ? ' selected' : ''}`}
                      style={{
                        padding: '0.6rem 1.3rem',
                        borderRadius: 8,
                        border: size === sz ? '2px solid #FFD700' : '1px solid #ddd',
                        background: size === sz ? '#FFF8DC' : '#fff',
                        color: '#222',
                        fontWeight: 700,
                        cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                        boxShadow: size === sz ? '0 2px 8px #FFD70044' : 'none',
                        marginBottom: 4,
                        opacity: isLoggedIn ? 1 : 0.6
                      }}
                      onClick={() => isLoggedIn && setSize(sz)}
                      disabled={!isLoggedIn}
                    >{sz}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 700, marginBottom: 10 }}>Clothing Sizes</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {clothingSizes.map(sz => (
                    <button
                      key={sz}
                      type="button"
                      className={`size-btn${size === sz ? ' selected' : ''}`}
                      style={{
                        padding: '0.6rem 1.3rem',
                        borderRadius: 8,
                        border: size === sz ? '2px solid #FFD700' : '1px solid #ddd',
                        background: size === sz ? '#FFF8DC' : '#fff',
                        color: '#222',
                        fontWeight: 700,
                        cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                        boxShadow: size === sz ? '0 2px 8px #FFD70044' : 'none',
                        marginBottom: 4,
                        opacity: isLoggedIn ? 1 : 0.6
                      }}
                      onClick={() => isLoggedIn && setSize(sz)}
                      disabled={!isLoggedIn}
                    >{sz}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            className="add-to-cart-btn"
            style={{ background: '#232F3E', color: '#fff', border: 'none', borderRadius: 8, padding: '0.8rem 1.7rem', fontWeight: 700, minWidth: 180, fontSize: '1.08rem', marginTop: 10, cursor: isLoggedIn && size ? 'pointer' : 'not-allowed', opacity: isLoggedIn && size ? 1 : 0.6 }}
            disabled={!isLoggedIn || !size}
            onClick={handleAddToCart}
          >Add to Cart</button>
        </div>
        {/* Related Products */}
        {similarProducts.length > 0 && (
          <div className="related-products-section" style={{ marginTop: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: '#232F3E', marginBottom: 18 }}>Related Products</h2>
            <div className="related-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 22 }}>
              {similarProducts.map(sp => (
                <div key={sp.id} className="related-product-card" style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #0001', padding: 12, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={sp.image} alt={sp.name} style={{ width: '100%', maxWidth: 90, height: 90, objectFit: 'contain', borderRadius: 8, marginBottom: 8, background: '#f8f8f8' }} />
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#222', marginBottom: 2 }}>{sp.name}</div>
                  <div style={{ color: '#FFD700', fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>TZS {sp.price}</div>
                  <button
                    style={{ background: '#FFD700', color: '#222', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: 4 }}
                    onClick={() => navigate('/select-size', { state: { product: sp } })}
                  >View</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Responsive CSS */}
      <style>{`
        .select-size-full { font-family: 'Segoe UI', Arial, sans-serif; }
        .product-flex { flex-direction: row; }
        @media (max-width: 900px) {
          .product-flex { flex-direction: column; align-items: center; }
          .product-image { margin-bottom: 18px; }
        }
        .size-btn.selected { border: 2px solid #FFD700 !important; background: #FFF8DC !important; box-shadow: 0 2px 8px #FFD70044; }
        .add-to-cart-btn { transition: background 0.2s; }
        .add-to-cart-btn:hover:not(:disabled) { background: #FFD700; color: #232F3E; }
        .related-products-grid { margin-top: 0; }
        .related-product-card:hover { box-shadow: 0 4px 16px #FFD70033; }
      `}</style>
    </div>
  );
}

