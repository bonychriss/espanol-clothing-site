
import React from 'react';

export default function Orders() {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('You must be logged in to view your orders.');
        const res = await fetch('/api/orders/my', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF8DC', paddingTop: 40 }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ color: '#222', fontWeight: 800, fontSize: '2.2rem', marginBottom: 28, textAlign: 'center' }}>Orders</h1>
          <div style={{ padding: 40, textAlign: 'center' }}>Loading orders...</div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF8DC', paddingTop: 40 }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ color: '#222', fontWeight: 800, fontSize: '2.2rem', marginBottom: 28, textAlign: 'center' }}>Orders</h1>
          <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>
        </div>
      </div>
    );
  }
  if (!orders.length) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF8DC', paddingTop: 40 }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ color: '#222', fontWeight: 800, fontSize: '2.2rem', marginBottom: 28, textAlign: 'center' }}>Orders</h1>
          <div style={{ padding: 40, textAlign: 'center' }}>No orders placed yet.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8DC', paddingTop: 40 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ color: '#222', fontWeight: 800, fontSize: '2.2rem', marginBottom: 28, textAlign: 'center' }}>Orders</h1>
        <h2 style={{ color: '#FFD700', fontWeight: 800, fontSize: '2rem', marginBottom: 28, textAlign: 'center' }}>Your Orders</h2>
        {orders.map(order => (
          <div key={order._id} style={{ borderBottom: '1px solid #eee', marginBottom: 24, paddingBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Order Date:</strong> {new Date(order.createdAt || order.orderDate).toLocaleString()}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Status:</strong> {order.status}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Delivery To:</strong> {order.customer?.address} {order.customer?.phone ? `, ${order.customer.phone}` : ''}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Payment Method:</strong> {order.paymentMethod || 'Cash on Delivery'}
            </div>
            <div>
              <strong>Products:</strong>
              <ul>
                {(order.items || []).map((item, idx) => (
                  <li key={idx} style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{item.name || 'Product'}</span> — Qty: <span>{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ fontWeight: 700, color: '#232F3E', textAlign: 'right', marginTop: 8 }}>
              Total: {order.currency === 'TZS' ? 'TZS' : '₹'}{order.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
