
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});
const upload = multer({ storage });

// Upload profile photo (protected)
router.post('/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // Save file path to user (for demo, just save filename)
    user.avatarUrl = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ avatarUrl: user.avatarUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Register
router.post('/register', async (req, res) => {
  try {
  const { name, email, password, address, phone, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, address, phone, role: role || 'customer' });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    // Include email in JWT payload
    const token = jwt.sign({ userId: user._id, email: user.email }, 'secretkey');
  res.json({ token, user: { name: user.name, email: user.email, address: user.address, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password (protected)
router.post('/change-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Missing fields.' });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Old password incorrect.' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user info (protected)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ name: user.name, email: user.email, address: user.address, phone: user.phone, role: user.role });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
