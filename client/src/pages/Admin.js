import React, { useState, useEffect } from 'react';
import { Link, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { FaBoxOpen, FaStar, FaClipboardList, FaUserCircle, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';
const lightStyles = {
  header: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: 1.5,
    fontSize: 16,
    background: '#fff',
    color: '#222',
  },
  formSelect: {
    width: '100%',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    marginBottom: 14,
    fontSize: 16,
    background: '#fff',
    color: '#FFD700',
  },
  button: {
    background: '#FFD700',
    color: '#222',
    border: 'none',
    borderRadius: 8,
    padding: '0.8rem 1.7rem',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 8,
    transition: 'background 0.2s',
  },
  card: {
    background: '#fff',
    color: '#222',
  },
  table: {
    background: '#fff',
    color: '#222',
    borderRadius: 8,
    marginTop: 12,
  },
  th: {
    background: '#eee',
    color: '#FFD700',
    padding: 8,
  },
  td: {
    padding: 8,
    borderBottom: '1px solid #ccc',
  },
};
const darkStyles = {
  container: {
    maxWidth: 900,
    margin: '40px auto',
    background: '#111',
    borderRadius: 16,
    boxShadow: '0 8px 32px #0002',
    padding: '2.5rem',
    color: '#fff',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    position: 'relative',
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: 1.5,
  },
  section: {
    marginBottom: 48,
    background: '#181818',
    borderRadius: 12,
    padding: '1.5rem',
    boxShadow: '0 2px 8px #0001',
  },
  sectionHeader: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 18,
    letterSpacing: 1,
  },
  formInput: {
    width: '100%',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    marginBottom: 14,
    fontSize: 16,
    background: '#222',
    color: '#fff',
  },
  formSelect: {
    width: '100%',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    marginBottom: 14,
    fontSize: 16,
    background: '#222',
    color: '#FFD700',
  },
  button: {
    background: '#FFD700',
    color: '#222',
    border: 'none',
    borderRadius: 8,
    padding: '0.8rem 1.7rem',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 8,
    transition: 'background 0.2s',
  },
  card: {
    background: '#222',
    color: '#fff',
  },
  table: {
    background: '#222',
    color: '#fff',
    borderRadius: 8,
    marginTop: 12,
  },
  th: {
    background: '#333',
    color: '#FFD700',
    padding: 8,
  },
  td: {
    padding: 8,
    borderBottom: '1px solid #444',
  },
};

function Admin() {
  // Auth state FIRST to avoid reference errors
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', category: '', description: '', image: null });
  const [editImagePreview, setEditImagePreview] = useState(null);

  // Open edit modal and populate form
  const handleProductEdit = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name || '',
      price: product.price || '',
      category: product.category || '',
      description: product.description || '',
      image: null
    });
    setEditImagePreview(product.image || null);
    setEditModalOpen(true);
  };

  // Handle edit form changes
  const handleEditFormChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setEditForm(prev => ({ ...prev, image: files[0] }));
      setEditImagePreview(URL.createObjectURL(files[0]));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Submit edit
  const handleEditSubmit = async e => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('price', editForm.price);
      formData.append('category', editForm.category);
      formData.append('description', editForm.description);
      if (editForm.image) {
        formData.append('image', editForm.image);
      }
      const res = await fetch(`/api/products/${editProduct._id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to update product');
      const updated = await res.json();
  setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
  window.dispatchEvent(new Event('productsUpdated'));
  setEditModalOpen(false);
  setEditProduct(null);
  setEditForm({ name: '', price: '', category: '', description: '', image: null });
  setEditImagePreview(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Close edit modal
  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditProduct(null);
    setEditForm({ name: '', price: '', category: '', description: '', image: null });
    setEditImagePreview(null);
  };
  // ...existing code...
  // Fetch products from backend on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(() => setProductError('Failed to fetch products'));
    }
  }, [isAuthenticated]);
  const location = useLocation();
  // Sidebar state for responsive/collapsible
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
      if (window.innerWidth > 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Handler functions for Product Management
  const handleProductChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setProductForm(prev => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setProductForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProductAdd = async e => {
    e.preventDefault();
    setProductLoading(true);
    setProductError('');
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('description', productForm.description);
      if (productForm.image) {
        formData.append('image', productForm.image);
      }
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to add product');
      const newProduct = await res.json();
  setProducts(prev => [newProduct, ...prev]);
  window.dispatchEvent(new Event('productsUpdated'));
  setProductForm({ name: '', price: '', category: '', description: '', image: null });
  setImagePreview(null);
    } catch (err) {
      setProductError(err.message);
    }
    setProductLoading(false);
  };

  const handleProductDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setProductError(err.message);
    }
  };

  // Handler functions for Best Picks
  const handleBestPickChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setBestPickForm(prev => ({ ...prev, image: files[0] }));
      setBestPickPreview(URL.createObjectURL(files[0]));
    } else {
      setBestPickForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBestPickAdd = async e => {
    e.preventDefault();
    setBestPickLoading(true);
    setBestPickError('');
    try {
      const formData = new FormData();
      formData.append('name', bestPickForm.name);
      if (bestPickForm.image) {
        formData.append('image', bestPickForm.image);
      }
      const res = await fetch('/api/best-picks', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to add best pick');
      const newPick = await res.json();
      setBestPicks(prev => [newPick, ...prev]);
      setBestPickForm({ name: '', image: null });
      setBestPickPreview(null);
    } catch (err) {
      setBestPickError(err.message);
    }
    setBestPickLoading(false);
  };

  const handleBestPickDelete = async id => {
    if (!window.confirm('Delete this best pick?')) return;
    try {
      const res = await fetch(`/api/best-picks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete best pick');
      setBestPicks(prev => prev.filter(p => p._id !== id));
      window.dispatchEvent(new Event('bestPicksUpdated'));
    } catch (err) {
      setBestPickError(err.message);
    }
  };

  // Handler for Order Status
  const handleOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update order');
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch (err) {
      setOrderError(err.message);
    }
  };
  const [theme, setTheme] = useState(() => localStorage.getItem('adminTheme') || 'dark');
  useEffect(() => {
    localStorage.setItem('adminTheme', theme);
  }, [theme]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Product management state
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ name: '', price: '', category: '', description: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState('');

  // Order tracking state
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Fetch orders from backend
  useEffect(() => {
    if (isAuthenticated) {
      setOrderLoading(true);
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setOrderLoading(false);
        })
        .catch(() => {
          setOrderError('Failed to fetch orders');
          setOrderLoading(false);
        });
    }
  }, [isAuthenticated]);
  // Sabor Best Picks state
  const [bestPicks, setBestPicks] = useState([]);
  const [bestPickForm, setBestPickForm] = useState({ name: '', image: null });
  const [bestPickPreview, setBestPickPreview] = useState(null);
  const [bestPickLoading, setBestPickLoading] = useState(false);
  const [bestPickError, setBestPickError] = useState('');

  // Fetch best picks from backend
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/best-picks')
        .then(res => res.json())
        .then(data => setBestPicks(data))
        .catch(() => setBestPickError('Failed to fetch best picks'));
    }
  }, [isAuthenticated]);

  // UI logic
  const styles = theme === 'light' ? lightStyles : darkStyles;
  const menuItems = [
    { key: 'product', label: 'Products', icon: <FaBoxOpen />, path: '/admin/products' },
    { key: 'bestpicks', label: 'Best Picks', icon: <FaStar />, path: '/admin/bestpicks' },
    { key: 'orders', label: 'Orders', icon: <FaClipboardList />, path: '/admin/orders' },
  ];

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 400, margin: '80px auto', background: theme === 'light' ? '#f9f9f9' : '#fff', borderRadius: 12, boxShadow: '0 4px 16px #0001', padding: '2rem', color: theme === 'light' ? '#222' : '#222' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button
            style={{ background: theme === 'light' ? '#222' : '#FFD700', color: theme === 'light' ? '#FFD700' : '#222', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, cursor: 'pointer', marginRight: 8 }}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          </button>
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#FFD700' }}>Admin Login</h2>
        <form onSubmit={e => {
          e.preventDefault();
          if (
            loginForm.username === 'admin' &&
            loginForm.password === 'admin123'
          ) {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            setLoginError('');
          } else {
            setLoginError('Invalid credentials');
          }
        }}>
          <input
            type="text"
            name="username"
            value={loginForm.username}
            onChange={e => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Username"
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 14, background: theme === 'light' ? '#fff' : '#fff', color: theme === 'light' ? '#222' : '#222' }}
            required
          />
          <input
            type="password"
            name="password"
            value={loginForm.password}
            onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Password"
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 14, background: theme === 'light' ? '#fff' : '#fff', color: theme === 'light' ? '#222' : '#222' }}
            required
          />
          <button
            type="submit"
            style={{ background: '#FFD700', color: '#222', border: 'none', borderRadius: 8, padding: '0.8rem 1.7rem', fontWeight: 700, width: '100%', marginTop: 8, cursor: 'pointer' }}
          >
            Login
          </button>
          {loginError && <div style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>{loginError}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className={`admin-page ${theme}`}> 
      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen || mobileMenuOpen ? " open" : ""}`}> 
        <div className="sidebar-header">
          <FaUserCircle size={32} />
          <span className="sidebar-username">Admin</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map(item => (
              <li key={item.key} className={location.pathname === item.path ? "active" : ""}>
                <Link to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  {item.icon} <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")}> {theme === "light" ? <FaMoon /> : <FaSun />} </button>
          <button className="logout-btn" onClick={() => { setIsAuthenticated(false); localStorage.removeItem('isAuthenticated'); }}><FaSignOutAlt /> <span>Logout</span></button>
        </div>
      </aside>
      <main className="admin-content">
        <div style={styles.container}>
          <h1 style={styles.header}>Admin Dashboard</h1>
          <Routes>
            <Route path="products" element={
              <div style={styles.section}>
                <h2 style={styles.sectionHeader}>Product Management</h2>
                <form onSubmit={handleProductAdd} style={{ marginBottom: 24 }} encType="multipart/form-data">
                  <input name="name" value={productForm.name} onChange={handleProductChange} placeholder="Name" style={styles.formInput} required />
                  <input name="price" value={productForm.price} onChange={handleProductChange} placeholder="Price" type="number" style={styles.formInput} required />
                  <select name="category" value={productForm.category} onChange={handleProductChange} style={styles.formSelect} required>
                    <option value="">Select Category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Boys">Boys</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Suits">Suits</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Casual">Casual</option>
                    <option value="Official">Official</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                  <input name="description" value={productForm.description} onChange={handleProductChange} placeholder="Description" style={styles.formInput} />
                  <input name="image" type="file" accept="image/*" onChange={handleProductChange} style={styles.formInput} />
                  {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxHeight: 60, marginBottom: 10, borderRadius: 4 }} />}
                  <button type="submit" style={styles.button} disabled={productLoading}>Add Product</button>
                </form>
                {productError && <div style={{ color: 'red', marginBottom: 12 }}>{productError}</div>}
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {products.map(product => (
                    <li key={product._id} style={{ marginBottom: 18, ...styles.card, borderRadius: 8, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <strong>{product.name}</strong> (${product.price})<br />
                        <span style={{ color: '#FFD700' }}>{product.category}</span>
                        <div style={{ fontSize: 14 }}>{product.description}</div>
                        {product.image && <img src={product.image} alt={product.name} style={{ maxHeight: 40, marginTop: 6, borderRadius: 4 }} />}
                      </div>
                      <div>
                        <button style={{ ...styles.button, marginRight: 8 }} onClick={() => handleProductEdit(product)}>
                          Edit
                        </button>
      {/* Edit Product Modal */}
      {editModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleEditSubmit} style={{ background: '#fff', borderRadius: 12, padding: '2rem', minWidth: 320, boxShadow: '0 4px 24px #0003', color: '#222', position: 'relative' }}>
            <h2 style={{ color: '#FFD700', marginBottom: 18 }}>Edit Product</h2>
            <input name="name" value={editForm.name} onChange={handleEditFormChange} placeholder="Name" style={styles.formInput} required />
            <input name="price" value={editForm.price} onChange={handleEditFormChange} placeholder="Price" type="number" style={styles.formInput} required />
            <select name="category" value={editForm.category} onChange={handleEditFormChange} style={styles.formSelect} required>
              <option value="">Select Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Boys">Boys</option>
              <option value="Footwear">Footwear</option>
              <option value="Dresses">Dresses</option>
              <option value="Suits">Suits</option>
              <option value="Accessories">Accessories</option>
              <option value="Casual">Casual</option>
              <option value="Official">Official</option>
              <option value="Outdoor">Outdoor</option>
            </select>
            <input name="description" value={editForm.description} onChange={handleEditFormChange} placeholder="Description" style={styles.formInput} />
            <input name="image" type="file" accept="image/*" onChange={handleEditFormChange} style={styles.formInput} />
            {editImagePreview && <img src={editImagePreview} alt="Preview" style={{ maxHeight: 60, marginBottom: 10, borderRadius: 4 }} />}
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <button type="submit" style={{ ...styles.button, minWidth: 100 }}>Save</button>
              <button type="button" style={{ ...styles.button, background: '#ccc', color: '#222', minWidth: 100 }} onClick={handleEditCancel}>Cancel</button>
            </div>
            <button type="button" onClick={handleEditCancel} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
          </form>
        </div>
      )}
                        <button style={{ ...styles.button, background: '#c00', color: '#fff' }} onClick={() => handleProductDelete(product._id)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            } />
            <Route path="bestpicks" element={
              <div style={styles.section}>
                <h2 style={styles.sectionHeader}>Sabor Best Picks Management</h2>
                <form onSubmit={handleBestPickAdd} style={{ marginBottom: 24 }} encType="multipart/form-data">
                  <input name="name" value={bestPickForm.name} onChange={handleBestPickChange} placeholder="Name (optional)" style={styles.formInput} />
                  <input name="image" type="file" accept="image/*" onChange={handleBestPickChange} style={styles.formInput} required />
                  {bestPickPreview && <img src={bestPickPreview} alt="Preview" style={{ maxHeight: 60, marginBottom: 10, borderRadius: 4 }} />}
                  <button type="submit" style={styles.button} disabled={bestPickLoading}>Add Best Pick</button>
                </form>
                {bestPickError && <div style={{ color: 'red', marginBottom: 12 }}>{bestPickError}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginTop: '10px' }}>
                  {bestPicks.map(pick => (
                    <div key={pick._id} style={{ ...styles.card, borderRadius: 8, padding: 16, textAlign: 'center', position: 'relative' }}>
                      <strong>{pick.name}</strong><br />
                      {pick.image && (
                        <img src={pick.image} alt={pick.name} style={{ maxHeight: 80, maxWidth: '100%', marginTop: 6, borderRadius: 4, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                      )}
                      <button style={{ ...styles.button, background: '#c00', color: '#fff', marginTop: 10 }} onClick={() => handleBestPickDelete(pick._id)}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            } />
            <Route path="orders" element={
              <div style={styles.section}>
                <h2 style={styles.sectionHeader}>Order Tracking</h2>
                <p>View and manage customer orders here.</p>
                {orderLoading ? (
                  <div>Loading orders...</div>
                ) : orderError ? (
                  <div style={{ color: 'red' }}>{orderError}</div>
                ) : (
                  <table style={{ width: '100%', ...styles.table }}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Order ID</th>
                        <th style={styles.th}>User</th>
                        <th style={styles.th}>Products</th>
                        <th style={styles.th}>Address</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id}>
                          <td style={styles.td}>{order._id}</td>
                          <td style={styles.td}>{order.user?.username || order.user?.name || 'N/A'}</td>
                          <td style={styles.td}>
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                              {order.products.map((p, idx) => (
                                <li key={idx}>
                                  {p.product?.name || 'Product'} x{p.quantity}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td style={styles.td}>{order.address}</td>
                          <td style={styles.td}>{order.status}</td>
                          <td style={styles.td}>
                            <select value={order.status} onChange={e => handleOrderStatus(order._id, e.target.value)} style={styles.formSelect}>
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Out of Stock">Sorry, Out of Stock</option>
                            </select>
                            <button style={{ ...styles.button, background: '#c00', color: '#fff', marginLeft: 8 }} onClick={() => handleOrderStatus(order._id, 'Out of Stock')}>Sorry, Out of Stock</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            } />
            <Route path="*" element={<Navigate to="products" replace />} />
          </Routes>
        </div>
      </main>
      <style>{`
        .admin-page {
          display: flex;
          min-height: 100vh;
          background: ${theme === "light" ? "#f7f7f7" : "#222"};
          color: ${theme === "light" ? "#222" : "#f7f7f7"};
        }
        .sidebar {
          width: 220px;
          background: ${theme === "light" ? "#fff" : "#333"};
          border-right: 1px solid #eee;
          transition: width 0.3s, left 0.3s;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 100;
          box-shadow: 2px 0 8px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0 0.5rem;
        }
        .sidebar:not(.open) {
          width: 0;
          min-width: 0;
          overflow: hidden;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem 0 1rem 0.5rem;
          font-weight: 600;
          font-size: 1.1rem;
        }
        .sidebar-username {
          color: #888;
        }
        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .sidebar-nav li {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.8rem 1rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .sidebar-nav li.active, .sidebar-nav li:hover {
          background: #FFD70022;
          color: #FFD700;
        }
        .sidebar-nav li span {
          font-size: 1rem;
        }
        .sidebar-footer {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0.5rem;
        }
        .theme-toggle, .logout-btn {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.8rem;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
        }
        .theme-toggle:hover, .logout-btn:hover {
          background: #FFD70022;
          color: #FFD700;
        }
        .admin-content {
          flex: 1;
          margin-left: 220px;
          padding: 2rem 2rem 2rem 2rem;
          transition: margin-left 0.3s;
        }
        .sidebar:not(.open) ~ .admin-content {
          margin-left: 0;
        }
        .hamburger {
          position: fixed;
          top: 1rem;
          left: 1rem;
          background: #fff;
          border: none;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          padding: 0.5rem 0.7rem;
          z-index: 200;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background 0.2s;
        }
        .hamburger:hover {
          background: #FFD70022;
        }
        @media (max-width: 768px) {
          .sidebar {
            width: 180px;
            min-width: 0;
            left: ${mobileMenuOpen ? "0" : "-180px"};
            transition: left 0.3s;
          }
          .admin-content {
            margin-left: 0;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
export default Admin;
 