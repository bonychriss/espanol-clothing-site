
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../client/public/images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get product by ID
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Add new product (with image upload)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    let image = '';
    if (req.file) {
      image = '/images/' + req.file.filename;
    } else if (req.body.image) {
      image = req.body.image;
    }
    const product = new Product({ name, price, category, image, description });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Product upload error:', err);
    if (req.file) {
      console.error('File info:', req.file);
    }
    if (req.body) {
      console.error('Body:', req.body);
    }
    res.status(400).json({ message: err.message });
  }
});


// Update product by ID (with image upload)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    let image;
    if (req.file) {
      image = '/images/' + req.file.filename;
    } else if (req.body.image) {
      image = req.body.image;
    }
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, description, image },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
