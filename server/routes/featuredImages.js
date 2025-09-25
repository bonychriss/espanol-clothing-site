const express = require('express');
const router = express.Router();
const FeaturedImage = require('../models/FeaturedImage');

// GET all featured images
router.get('/', async (req, res) => {
  try {
    const images = await FeaturedImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured images' });
  }
});

// POST a new featured image
router.post('/', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'Image is required' });
    const newImage = new FeaturedImage({ image });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save featured image' });
  }
});

module.exports = router;
