
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Order from './pages/Order';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import './styles.css';
import SelectSize from './pages/SelectSize';

function App() {
  return (
    <Router>
  {/* Only show Navbar if not on /admin route */}
  {!window.location.pathname.startsWith('/admin') && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order" element={<Order />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/select-size" element={<SelectSize />} />
      </Routes>
    </Router>
  );
}

export default App;
