import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutSidebar({ cart, total, onClose }) {
  const navigate = useNavigate();
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: 380,
      height: '100vh',
      background: '#fff',
      boxShadow: '-4px 0 24px #0002',
      zIndex: 9999,
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      borderTopLeftRadius: 18,
      borderBottomLeftRadius: 18,
      transition: 'right 0.3s',
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: '#FFD700', color: '#222', border: 'none', borderRadius: 8, padding: '0.4rem 1rem', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Close</button>
      <h2 style={{ color: '#FFD700', fontWeight: 800, fontSize: '1.3rem', marginBottom: 10, textAlign: 'center' }}>Checkout</h2>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>Order Summary</div>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 12 }}>
        {cart.map((item, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <img src={item.image} alt={item.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#222' }}>{item.name}</div>
              <div style={{ color: '#555', fontSize: '0.95rem' }}>Size: {item.size}</div>
              <div style={{ color: '#FFD700', fontWeight: 700 }}>{item.price ? `TZS ${item.price}` : 'TZS 0'}</div>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#232F3E', textAlign: 'right' }}>Total: TZS {total}</div>
      <button
        style={{ background: '#FFD700', color: '#222', border: 'none', borderRadius: 8, padding: '0.9rem 1.7rem', fontWeight: 700, width: '100%', fontSize: '1.1rem', cursor: 'pointer', marginTop: 10 }}
        onClick={() => navigate('/checkout')}
      >Proceed to Checkout</button>
    </div>
  );
}
