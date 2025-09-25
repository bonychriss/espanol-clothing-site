import React from 'react';
import { useParams } from 'react-router-dom';

export default function Order() {
  const { orderId } = useParams();
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error('Order not found');
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  // Example usage of local image import for display
  // Replace item.image with local URL if needed
  // <img src={"/images/" + item.image} alt={item.name} />

  if (!order) {
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading order...</div>;
  if (error) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>;
  return <div style={{ padding: 40, textAlign: 'center' }}>No order found.</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <h2 style={{ color: '#FFD700', fontWeight: 800, fontSize: '1.5rem', marginBottom: 18, textAlign: 'center' }}>Order Tracking</h2>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>Order Details</div>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 12 }}>
          {order.items.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
              <img src={item.image.startsWith('/images/') ? item.image : '/images/' + item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#222' }}>{item.name}</div>
                <div style={{ color: '#555', fontSize: '0.95rem' }}>Size: {item.size}</div>
                <div style={{ color: '#FFD700', fontWeight: 700 }}>{item.price ? `$${item.price.toFixed(2)}` : '$0.00'}</div>
              </div>
            </li>
          ))}
        </ul>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#232F3E', textAlign: 'right' }}>Total: ${order.total.toFixed(2)}</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: '#222', marginBottom: 6 }}>Delivery Address</div>
        <div>{order.address}</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: '#222', marginBottom: 6 }}>Phone Number</div>
        <div>{order.phone}</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: '#222', marginBottom: 6 }}>Payment Method</div>
        <div style={{ fontWeight: 700, color: '#FFD700', marginBottom: 6 }}>Cash on Delivery</div>
      </div>
      <div style={{ marginTop: 24, fontWeight: 700, color: '#232F3E', fontSize: '1.1rem' }}>Order Status: <span style={{ color: '#FFD700' }}>{order.status || 'Processing'}</span></div>
    </div>
  );
}
