
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CartSidebar from '../components/CartSidebar';


// Utility
const formatCurrency = (n) => `$${Number(n).toFixed(2)}`;

// Local fallback products with admin flags
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
  { 
    _id: 'mens-jeans', // Use _id for consistency with backend
    id: 'mens-jeans', 
    name: "Men's Jeans", 
    image: process.env.PUBLIC_URL + "/images/mens-jeans.jpg", 
    price: 39.99, 
    listPrice: 49.99, 
    category: 'Men', 
    rating: 4.4, 
    reviews: 70805, 
    isBestSeller: true, 
    desc: 'Premium denim with stretch for everyday comfort.',
    addedByAdmin: true, // Critical: Mark as admin-added
    isActive: true
  },
  { 
    _id: 'boyz-jeans', 
    id: 'boyz-jeans', 
    name: "Boys' Jeans", 
    image: process.env.PUBLIC_URL + "/images/boyz jeans.jpg", 
    price: 24.99, 
    listPrice: 34.99, 
    category: 'Boys', 
    rating: 4.2, 
    reviews: 1805, 
    desc: 'Durable and comfy jeans for kids on the move.',
    addedByAdmin: true,
    isActive: true
  },
  // ... continue for all products
];

const StarRating = ({ value, onChange, size = '1.1rem' }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {stars.map((s) => (
        <span
          key={s}
          onClick={onChange ? () => onChange(s) : undefined}
          aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
          style={{ background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default', lineHeight: 1, padding: 0, color: s <= Math.round(value) ? '#FFA41C' : '#ccc', fontSize: size, userSelect: 'none' }}
          role={onChange ? 'button' : undefined}
          tabIndex={onChange ? 0 : undefined}
        >
          {s <= Math.round(value) ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

function Products() {
  const [popupMsg, setPopupMsg] = useState("");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [ratings, setRatings] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [currency, setCurrency] = useState('TZS');
  const [usdRate, setUsdRate] = useState(2600); // Default fallback
  const [loadingRate, setLoadingRate] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  // Handle size selection returned from SelectSize page
  React.useEffect(() => {
    if (location.state && location.state.selectedSize && location.state.product) {
      setSelectedSizes(prev => ({ ...prev, [location.state.product.id]: location.state.selectedSize }));
      // Clear state so it doesn't persist on next navigation
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Fetch live USD rate from exchangerate.host
  useEffect(() => {
    setLoadingRate(true);
    fetch('https://api.exchangerate.host/latest?base=TZS&symbols=USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.USD) {
          setUsdRate(1 / data.rates.USD); // TZS to USD
        }
        setLoadingRate(false);
      })
      .catch(() => setLoadingRate(false));
  }, []);

  // Convert price based on currency
  const convertPrice = (price) => {
    if (currency === 'USD') {
      return loadingRate
        ? 'Loading USD rate...'
        : `$${(price / usdRate).toFixed(2)}`;
    }
    return `TZS ${price}`;
  };

  // Filters & Sort
  const [selectedCats, setSelectedCats] = useState(new Set());
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [ratingMin, setRatingMin] = useState(0);
  const [sortKey, setSortKey] = useState('featured');

  // Load and persist ratings locally
  useEffect(() => {
    try {
      const raw = localStorage.getItem('productRatings');
      if (raw) setRatings(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem('productRatings', JSON.stringify(ratings)); } catch {}
  }, [ratings]);

  // Load products from API only
  useEffect(() => {
    const fetchProducts = () => {
      fetch('/api/products')
        .then(res => (res.ok ? res.json() : Promise.reject()))
        .then(data => {
          setProducts(Array.isArray(data) ? data : []);
          try { localStorage.setItem('backendProducts', JSON.stringify(data)); } catch {}
        })
        .catch(() => setProducts([]));
    };
    fetchProducts();
    window.addEventListener('productsUpdated', fetchProducts);
    return () => window.removeEventListener('productsUpdated', fetchProducts);
  }, []);

  const allCategories = useMemo(() => {
    const s = new Set((products || []).map(p => p.category || 'General'));
    return Array.from(s);
  }, [products]);

  const applyFilters = (list) => {
    let out = list;
    if (searchQuery) {
      out = out.filter(p =>
        p.name?.toLowerCase().includes(searchQuery) ||
        p.category?.toLowerCase().includes(searchQuery) ||
        p.desc?.toLowerCase().includes(searchQuery) ||
        p.description?.toLowerCase().includes(searchQuery)
      );
    }
    if (selectedCats.size) out = out.filter(p => selectedCats.has(p.category || 'General'));
    const min = priceMin !== '' ? Number(priceMin) : -Infinity;
    const max = priceMax !== '' ? Number(priceMax) : Infinity;
    out = out.filter(p => (p.price ?? 0) >= min && (p.price ?? 0) <= max);
    out = out.filter(p => (ratings[p._id || p.id || p.name] ?? p.rating ?? 4) >= ratingMin);
    return out;
  };

  const applySort = (list) => {
    const copy = [...list];
    switch (sortKey) {
      case 'price-asc':
        copy.sort((a,b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        copy.sort((a,b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'rating': {
        const r = (p) => ratings[p._id || p.id || p.name] ?? p.rating ?? 0;
        copy.sort((a,b) => r(b) - r(a));
        break;
      }
      case 'reviews':
        copy.sort((a,b) => (b.reviews ?? 0) - (a.reviews ?? 0));
        break;
      default:
        // featured: keep input order, but nudge badges to front
        copy.sort((a,b) => ((b.isBestSeller || b.isOverallPick) ? 1 : 0) - ((a.isBestSeller || a.isOverallPick) ? 1 : 0));
    }
    return copy;
  };

  const filtered = applyFilters(products);
  const visible = applySort(filtered);

  const toggleCategory = (cat) => {
    const next = new Set(selectedCats);
    if (next.has(cat)) next.delete(cat); else next.add(cat);
    setSelectedCats(next);
  };

  const handleAddToCart = (product) => {
    // Always use backend _id if available
    let prodToAdd = product;
    if (!product._id) {
      const backendProducts = JSON.parse(localStorage.getItem('backendProducts') || '[]');
      // Try to match by name and price (in case name is not unique)
      const match = backendProducts.find(p => p.name === product.name && p.price === product.price);
      if (match && match._id) {
        prodToAdd = { ...product, _id: match._id };
      } else {
        // If no match, do not add to cart
        setPopupMsg("This product cannot be checked out. Please select a product from the main catalog.");
        setTimeout(() => setPopupMsg("") , 2500);
        return;
      }
    }
    // Only add products with valid _id
    if (!prodToAdd._id) {
      setPopupMsg("This product cannot be checked out. Please select a product from the main catalog.");
      setTimeout(() => setPopupMsg("") , 2500);
      return;
    }
    const normalized = {
      _id: prodToAdd._id,
      id: prodToAdd._id || prodToAdd.id || prodToAdd.name,
      name: prodToAdd.name,
      price: prodToAdd.price,
      image: prodToAdd.image,
      size: prodToAdd.size || '',
    };
    const updatedCart = [...cart, normalized];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setShowCart(true);
    setPopupMsg("Your item is added to cart!");
    setTimeout(() => setPopupMsg("") , 2500);
    navigate('/cart');
  };
  const handleRemoveFromCart = (idx) => setCart(cart.filter((_, i) => i !== idx));
  const handleCloseCart = () => setShowCart(false);

  const getId = (p, idx) => p._id || p.id || String(idx);

  // Styles
  const pageStyle = { maxWidth: 'none', width: '100%', margin: '0', padding: '0 2rem 2rem 0', boxSizing: 'border-box', display: 'block' };
  const layoutStyle = {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    gap: '1.5rem',
  };
  const responsiveWrap = {
    display: 'block',
  };
  const sidebarStyle = {
    position: 'sticky',
    top: 16,
    alignSelf: 'start',
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: 12,
    padding: '1rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    // Hide sidebar on mobile
    display: 'block',
  };
  const sectionTitle = { fontWeight: 700, margin: '0.25rem 0 0.5rem', color: '#111' };
  const filterItem = { display: 'flex', alignItems: 'center', gap: 8, margin: '0.35rem 0' };

  const topbarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '0.75rem 0',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    minHeight: 120,
  };

  const isNarrow = typeof window !== 'undefined' ? window.innerWidth < 980 : false;

  return (
    <div className="products products-page" style={pageStyle}>
      {popupMsg && (
        <div style={{position:'fixed',top:80,right:30,zIndex:9999,background:'#FFD700',color:'#222',padding:'1rem 2rem',borderRadius:12,boxShadow:'0 2px 12px #0002',fontWeight:700,fontSize:'1.1rem'}}>
          {popupMsg}
        </div>
      )}
      <h1 style={{ color: '#222', fontWeight: 800, fontSize: '2.2rem', margin: '2rem 0 1.5rem 0', textAlign: 'center' }}>Products</h1>

      {/* Currency changer below nav/top bar, only in Products page */}
      <div style={{ width: '100%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1rem 0', marginBottom: '0.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label htmlFor="currency" style={{ fontWeight: 600 }}>Currency:</label>
            <select
              id="currency"
              value={currency}
              onChange={e => {
                setCurrency(e.target.value);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('currency', e.target.value);
                }
              }}
              style={{ padding: '0.4em 1em', borderRadius: 8, border: '1px solid #FFD700', fontWeight: 600 }}
            >
              <option value="TZS">TZS (Tanzanian Shilling)</option>
              <option value="USD">USD (Dollar)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top bar: result count and sort */}
      <div style={topbarStyle}>
        <div style={{ color: '#555' }}>{visible.length} items</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#333', fontWeight: 600 }}>Sort by:</span>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} style={{ padding: '0.4rem 0.6rem', borderRadius: 8, border: '1px solid #ddd' }}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="reviews">Reviews</option>
          </select>
        </label>
      </div>

      {/* Layout: sidebar + grid */}
      <div style={isNarrow ? responsiveWrap : layoutStyle}>
        {/* Sidebar: hide on mobile */}
        <style>{`
          @media (max-width: 700px) {
            .products-sidebar-hide-mobile {
              display: none !important;
            }
          }
        `}</style>
        <aside className="products-sidebar-hide-mobile" style={isNarrow ? { ...sidebarStyle, marginBottom: '1rem' } : sidebarStyle}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={sectionTitle}>Departments</div>
            {allCategories.map((c) => (
              <label key={c} style={filterItem}>
                <input type="checkbox" checked={selectedCats.has(c)} onChange={() => toggleCategory(c)} />
                <span style={{ color: '#333' }}>{c}</span>
              </label>
            ))}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={sectionTitle}>Customer Reviews</div>
            {[4,3,2,1].map((n) => (
              <button key={n} onClick={() => setRatingMin(n)} style={{ ...filterItem, background: 'none', border: 'none', cursor: 'pointer', color: ratingMin === n ? '#111' : '#444' }}>
                <StarRating value={n} size="1rem" />
                <span>&nbsp;&amp; Up</span>
              </button>
            ))}
            {ratingMin > 0 && (
              <button onClick={() => setRatingMin(0)} style={{ marginTop: 6, background: 'none', border: 'none', color: '#FF9900', cursor: 'pointer', fontWeight: 700 }}>Clear rating</button>
            )}
          </div>

          <div>
            <div style={sectionTitle}>Price</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} style={{ width: 90, padding: '0.4rem', borderRadius: 8, border: '1px solid #ddd' }} />
              <span>—</span>
              <input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} style={{ width: 90, padding: '0.4rem', borderRadius: 8, border: '1px solid #ddd' }} />
            </div>
            {(priceMin !== '' || priceMax !== '') && (
              <button onClick={() => { setPriceMin(''); setPriceMax(''); }} style={{ marginTop: 6, background: 'none', border: 'none', color: '#FF9900', cursor: 'pointer', fontWeight: 700 }}>Clear price</button>
            )}
          </div>
        </aside>

        {/* Grid */}
        <main>
      <style>{`
        @media (max-width: 700px) {
          .products-grid-responsive {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
      <div style={gridStyle} className="products-grid-responsive">
            {visible.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: '1.1rem', padding: '2rem 0' }}>
                No products match your filters.
              </div>
            ) : (
              visible.map((product, idx) => {
                const id = getId(product, idx);
                const userRating = ratings[id];
                const ratingValue = userRating ?? product.rating ?? 4;
                return (
                  <div className="product-card" key={id} style={{
                    position: 'relative',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '1.25rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'flex-start',
                    minHeight: 380,
                  }}>
                    {/* Badges */}
                    {product.isBestSeller && <span style={{ position: 'absolute', top: 12, left: 12, background: '#FF9900', color: '#fff', fontWeight: 700, fontSize: '0.8rem', borderRadius: 6, padding: '2px 8px' }}>Best Seller</span>}
                    {product.isOverallPick && <span style={{ position: 'absolute', top: 12, right: 12, background: '#232F3E', color: '#fff', fontWeight: 700, fontSize: '0.8rem', borderRadius: 6, padding: '2px 8px' }}>Overall Pick</span>}

                    {/* Image */}
                    <div style={{ width: '100%', height: 220, marginBottom: '1rem', overflow: 'hidden', borderRadius: '0.75rem' }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>

                    {/* Title */}
                    <div style={{ width: '100%', marginBottom: 6, fontSize: '1rem', fontWeight: 700, color: '#111', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
                    {/* Description */}
                    <div style={{ width: '100%', color: '#333', fontSize: '0.95rem', lineHeight: 1.4, marginBottom: 8, textAlign: 'center' }}>
                      {product.description || product.desc || 'Premium quality at a great price.'}
                    </div>

                    {/* Rating + Reviews */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                      <StarRating value={ratingValue} onChange={(v) => setRatings({ ...ratings, [id]: v })} />
                      <span style={{ fontSize: '0.9rem', color: '#555' }}>{product.reviews ? product.reviews.toLocaleString() : '1,000+'}</span>
                    </div>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginTop: 4 }}>
                      <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#FFD700' }}>{product.price ? convertPrice(product.price) : 'TZS 9,900'}</div>
                      {product.listPrice && (
                        <div style={{ color: '#777', textDecoration: 'line-through', fontSize: '0.95rem' }}>{convertPrice(product.listPrice)}</div>
                      )}
                    </div>

                    {/* Size Selector Button navigates to SelectSize page */}
                    <div style={{ width: '100%', marginTop: 8 }}>
                      <button
                        type="button"
                        style={{ background: '#FFD700', color: '#222', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, width: '100%', maxWidth: 180, cursor: 'pointer', marginBottom: 6 }}
                        onClick={() => navigate('/select-size', { state: { product, selectedSize: selectedSizes[id] || '' } })}
                      >
                        {selectedSizes[id] ? `Size: ${selectedSizes[id]}` : 'Add to Cart'}
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {showCart && (
        <CartSidebar cart={cart} onClose={handleCloseCart} onRemove={handleRemoveFromCart} />
      )}

      {/* Simple responsive tweak */}
      <style>{`
        .products.products-page{max-width:none!important;margin:1rem 0!important;padding:0 2rem 2rem 0!important;display:block!important;align-items:stretch!important;justify-content:flex-start!important;}
        @media (max-width: 980px) {
          .products.products-page { padding: 0 1rem 2rem !important; }
        }
      `}</style>
    </div>
  );
}

export default Products;
