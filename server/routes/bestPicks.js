const express = require('express');
const router = express.Router();
const BestPick = require('../models/BestPick');
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

// GET all best picks
router.get('/', async (req, res) => {
  try {
    const picks = await BestPick.find().sort({ createdAt: -1 });
    res.json(picks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch best picks' });
  }
});

// POST a new best pick (with image upload)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    let image = '';
    if (req.file) {
      image = '/images/' + req.file.filename;
    } else if (req.body.image) {
      image = req.body.image;
    }
    const newPick = new BestPick({ name, image });
    await newPick.save();
    res.status(201).json(newPick);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save best pick' });
  }
});


// DELETE a best pick by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await BestPick.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Best pick not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete best pick' });
  }
});

module.exports = router;
