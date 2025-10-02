import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Icon components
const HomeIcon = () => <span style={{ marginRight: 8 }}>🏠</span>;
const ProductsIcon = () => <span style={{ marginRight: 8 }}>👗</span>;
const OrdersIcon = () => <span style={{ marginRight: 8 }}>📦</span>;
const NewArrivalsIcon = () => <span style={{ marginRight: 8 }}>✨</span>;
const CartIcon = () => <span style={{ marginRight: 8 }}>🛒</span>;
const AccountIcon = () => <span style={{ marginRight: 8 }}>👤</span>;
const LoginIcon = () => <span style={{ marginRight: 8 }}>🔑</span>;
const RegisterIcon = () => <span style={{ marginRight: 8 }}>📝</span>;

const productNames = [
  "Men's Jeans", "Boys' Jeans", "Cozy Sweater", "Classic Suit", "Summer Dress", "Casual Shirt",
  "Best Of All Set", "Sneakers", "Running Shoes", "Trainers", "Court Shoes", "Mesh Sneakers",
  "Casual Shoes", "Street Sneakers"
];

const menuLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  color: '#FFD700',
  fontWeight: 700,
  textDecoration: 'none',
  margin: '0.7em 0',
  fontSize: '1.1rem'
};

function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Search functionality
  useEffect(() => {
    if (search.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = productNames.filter(n => n.toLowerCase().includes(search.trim().toLowerCase()));
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [search]);

  const handleSearch = e => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 120); // Delay to allow click
  };

  const handleMenuClick = () => setMenuOpen(m => !m);
  const handleLinkClick = () => setMenuOpen(false);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <nav style={{
      background: '#222',
      color: '#FFD700',
      padding: '0.7rem 2rem',
      position: 'relative',
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24
      }}>
        {/* Left: Logo and Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/images/sabor Espanol logo.jpeg"
              alt="Sabor Espanol Logo"
              style={{
                height: 48,
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          </Link>
          <div style={{ position: 'relative' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                onBlur={handleInputBlur}
                placeholder="Search products..."
                style={{ padding: '0.4rem 1rem', borderRadius: 6, border: 'none', fontSize: '1rem', minWidth: 180 }}
                autoComplete="off"
              />
              <button type="submit" style={{ background: '#FFD700', color: '#222', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', fontWeight: 700, cursor: 'pointer' }}>Search</button>
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '100%',
                  background: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                  zIndex: 1001,
                  color: '#222',
                  fontWeight: 500,
                  fontSize: '1rem'
                }}>
                  {suggestions.map((s, idx) => (
                    <div
                      key={idx}
                      onMouseDown={() => handleSuggestionClick(s)}
                      style={{
                        padding: '0.6em 1em',
                        cursor: 'pointer',
                        borderBottom: idx !== suggestions.length - 1 ? '1px solid #eee' : 'none',
                        background: '#fff'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#ffe7ba'}
                      onMouseOut={e => e.currentTarget.style.background = '#fff'}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
        
        {/* Right: Hamburger */}
        <button
          onClick={handleMenuClick}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 32,
            cursor: 'pointer',
            color: '#FFD700',
            outline: 'none'
          }}
          aria-label="Open menu"
        >
          &#9776;
        </button>
      </div>
      
      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: 60,
            right: 20,
            minWidth: 180,
            background: '#222',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            padding: '1rem 1.5rem',
            zIndex: 2000,
            marginTop: 0
          }}>
          <Link to="/" onClick={handleLinkClick} style={menuLinkStyle}><HomeIcon />Home</Link>
          <Link to="/products" onClick={handleLinkClick} style={menuLinkStyle}><ProductsIcon />Products</Link>
          <Link to="/new-arrivals" onClick={handleLinkClick} style={menuLinkStyle}><NewArrivalsIcon />New Arrivals</Link>
          <Link to="/orders" onClick={handleLinkClick} style={menuLinkStyle}><OrdersIcon />Orders</Link>
          <Link to="/cart" onClick={handleLinkClick} style={menuLinkStyle}><CartIcon />Cart</Link>
          <Link to="/profile" onClick={handleLinkClick} style={menuLinkStyle}><AccountIcon />Account</Link>
          <Link to="/login" onClick={handleLinkClick} style={menuLinkStyle}><LoginIcon />Login</Link>
          <Link to="/register" onClick={handleLinkClick} style={menuLinkStyle}><RegisterIcon />Register</Link>
        </div>
      )}

      {/* Mobile Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          nav {
            padding: 0.5rem 1rem !important;
          }
          nav > div {
            gap: 12px !important;
          }
          nav > div > div:first-child {
            flex: 1 !important;
            gap: 12px !important;
          }
          nav input {
            min-width: 120px !important;
            padding: 0.3rem 0.8rem !important;
            font-size: 0.9rem !important;
          }
          nav button[type="submit"] {
            padding: 0.3rem 0.8rem !important;
            font-size: 0.9rem !important;
          }
          nav img {
            height: 36px !important;
          }
          nav button[aria-label="Open menu"] {
            position: fixed !important;
            top: 12px !important;
            right: 16px !important;
            z-index: 2001 !important;
            background: rgba(34, 34, 34, 0.9) !important;
            border-radius: 6px !important;
            padding: 4px 8px !important;
            font-size: 24px !important;
          }
        }
        @media (max-width: 480px) {
          nav {
            padding: 0.4rem 0.8rem !important;
          }
          nav > div > div:first-child {
            gap: 8px !important;
          }
          nav input {
            min-width: 80px !important;
            font-size: 0.8rem !important;
          }
          nav button[type="submit"] {
            font-size: 0.8rem !important;
            padding: 0.3rem 0.6rem !important;
          }
          nav img {
            height: 32px !important;
          }
          nav button[aria-label="Open menu"] {
            top: 10px !important;
            right: 12px !important;
            font-size: 20px !important;
            padding: 4px 6px !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
