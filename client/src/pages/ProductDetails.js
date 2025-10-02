
import React, { useState, useEffect } from 'react';
function ProductDetails() {
  // Example product data (replace with real data/props)
  const product = {
    name: 'Sample Product',
    price: 52000, // TZS
    image: '',
    description: 'A great product.'
  };

  const [currency, setCurrency] = useState('TZS');
  const [usdRate, setUsdRate] = useState(2600); // Default fallback
  const [loadingRate, setLoadingRate] = useState(false);

  useEffect(() => {
    // Fetch live USD rate from exchangerate.host
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

  const convertPrice = (price) => {
    if (currency === 'USD') {
      return loadingRate
        ? 'Loading USD rate...'
        : `$${(price / usdRate).toFixed(2)}`;
    }
    return `TZS ${price}`;
  };

  return (
    <>
      {/* Navbar placeholder: replace with your Navbar component if needed */}
      <div style={{ width: '100%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1rem 0', marginBottom: '0.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {/* Currency changer only on product page */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label htmlFor="currency" style={{ fontWeight: 600 }}>Currency:</label>
            <select id="currency" value={currency} onChange={e => setCurrency(e.target.value)} style={{ padding: '0.4em 1em', borderRadius: 8, border: '1px solid #FFD700', fontWeight: 600 }}>
              <option value="TZS">TZS (Tanzanian Shilling)</option>
              <option value="USD">USD (Dollar)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="product-details" style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', fontFamily: 'Inter, Arial, sans-serif' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: '2rem', letterSpacing: 1 }}>Product Details</h2>
        <div style={{ marginBottom: 18 }}>
          <strong>Name:</strong> {product.name}
        </div>
        <div style={{ marginBottom: 18 }}>
          <strong>Price:</strong> {convertPrice(product.price)}
        </div>
        <div style={{ marginBottom: 18 }}>
          <strong>Description:</strong> {product.description}
        </div>
        {/* Add more product details and actions here */}
      </div>
    </>
  );
}

export default ProductDetails;
