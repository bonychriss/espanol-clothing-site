const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Place order (new schema)
router.post('/', async (req, res) => {
  try {
    console.log('Received order:', req.body);
    const { items, customer, total } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    if (!customer || !customer.name || !customer.email || !customer.address) {
      return res.status(400).json({ message: 'Customer information is incomplete' });
    }
    for (let item of items) {
      if (!item.name || !item.price || !item.quantity) {
        return res.status(400).json({ message: 'Each item must have name, price, and quantity' });
      }
    }
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ success: true, orderId: order._id, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order: ' + error.message });
  }
});

// Get all orders (admin)
// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my orders (user)
// Get my orders (user)
router.get('/my', async (req, res) => {
  try {
  // Simple token extraction (for demo, should use middleware)
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  const jwt = require('jsonwebtoken');
  const decoded = jwt.verify(token, 'secretkey');
  const userEmail = decoded.email || decoded.userId;
  console.log('Decoded email from token:', userEmail);
  // Find orders by customer email
  const orders = await Order.find({ 'customer.email': userEmail });
  console.log('Orders found for user:', orders);
  res.json(orders);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
