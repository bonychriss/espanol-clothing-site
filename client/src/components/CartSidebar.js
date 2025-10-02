import React from 'react';

function CartSidebar({ cart, onClose, onRemove }) {
  // Read currency from localStorage (default TZS)
  const currency = typeof window !== 'undefined' ? (localStorage.getItem('currency') || 'TZS') : 'TZS';
  // USD rate fallback (should match Products page logic)
  const [usdRate, setUsdRate] = React.useState(2600);
  const [loadingRate, setLoadingRate] = React.useState(false);

  React.useEffect(() => {
    setLoadingRate(true);
    fetch('https://api.exchangerate.host/latest?base=TZS&symbols=USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.USD) {
          setUsdRate(1 / data.rates.USD);
        }
        setLoadingRate(false);
      })
      .catch(() => setLoadingRate(false));
  }, []);

  const convertPrice = (price) => {
    if (currency === 'USD') {
      return loadingRate
        ? 'Loading USD rate...'
        : `$${(price / usdRate).toFixed(2)}`;
    }
    return `TZS ${price}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '350px',
      height: '100vh',
      background: '#fff',
      boxShadow: '-2px 0 16px #2222',
      zIndex: 10002,
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <button onClick={onClose} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#222' }}>×</button>
      <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem', color: '#FFD700' }}>Your Cart</h2>
      {cart.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>Your cart is empty.</div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cart.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 16 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ color: '#232F3E', fontWeight: 700, fontSize: '1rem' }}>{item.price ? convertPrice(item.price) : 'TZS 9,900'}</div>
              </div>
              <button onClick={() => onRemove(idx)} style={{ background: 'none', border: 'none', color: '#FF9900', fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <button style={{ background: '#FFD700', color: '#222', border: 'none', borderRadius: 6, padding: '0.8rem 0', fontWeight: 700, fontSize: '1.1rem', marginTop: '2rem', cursor: 'pointer' }}>Checkout</button>
    </div>
  );
}

export default CartSidebar;
