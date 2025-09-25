const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb+srv://wolfwiganz_db_user:BaaDyman321@cluster0.tlnggkf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Basic route
app.get('/', (req, res) => {
  res.send('Clothing Store API');
});

// TODO: Add routes for products, users, cart, orders
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/featured-images', require('./routes/featuredImages'));
app.use('/api/best-picks', require('./routes/bestPicks'));

const path = require('path');
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
