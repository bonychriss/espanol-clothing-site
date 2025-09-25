// Script to import localProducts from frontend into MongoDB
const mongoose = require('mongoose');
const Product = require('../models/Product');

const localProducts = [
  { name: "Men's Jeans", image: '/images/mens-jeans.jpg', price: 39.99, category: 'Men', description: 'Premium denim with stretch for everyday comfort.' },
  { name: "Boys' Jeans", image: '/images/boyz jeans.jpg', price: 24.99, category: 'Boys', description: 'Durable and comfy jeans for kids on the move.' },
  { name: 'Cozy Sweater', image: '/images/sweater.jpg', price: 29.99, category: 'Women', description: 'Soft knit with a relaxed fit to keep you warm.' },
  { name: 'Classic Suit', image: '/images/suit.jpg', price: 129.99, category: 'Men', description: 'Tailored silhouette with stretch fabric for all-day wear.' },
  { name: 'Summer Dress', image: '/images/dresses.jpg', price: 49.99, category: 'Women', description: 'Breezy and flattering, perfect for sunny days.' },
  { name: 'Casual Shirt', image: '/images/shirt.jpg', price: 19.99, category: 'Men', description: 'Breathable cotton blend for effortless style.' },
  { name: 'Best Of All Set', image: '/images/beest of all.jpg', price: 54.99, category: 'Women', description: 'Mix-and-match set designed to elevate your look.' },
  { name: 'Sneakers', image: '/images/shoes 1.jpg', price: 59.99, category: 'Shoes', description: 'Everyday sneakers with cushioned support.' },
  { name: 'Running Shoes', image: '/images/shoes2.jpg', price: 69.99, category: 'Shoes', description: 'Lightweight runners built for speed and comfort.' },
  { name: 'Trainers', image: '/images/shoes3.jpg', price: 62.49, category: 'Shoes', description: 'Versatile trainers for gym and street.' },
  { name: 'Court Shoes', image: '/images/shoes 4.jpg', price: 64.99, category: 'Shoes', description: 'Court-ready grip with everyday style.' },
  { name: 'Mesh Sneakers', image: '/images/shoes 5.jpg', price: 72.5, category: 'Shoes', description: 'Breathable mesh upper with responsive cushioning.' },
  { name: 'Casual Shoes', image: '/images/shoes6.jpg', price: 57.0, category: 'Shoes', description: 'Weekend-ready shoes with a clean profile.' },
  { name: 'Street Sneakers', image: '/images/shoes7.jpg', price: 66.0, category: 'Shoes', description: 'Street style meets comfort in these staples.' },
];

async function importProducts() {
  await mongoose.connect('mongodb://localhost:27017/clothing', { useNewUrlParser: true, useUnifiedTopology: true });
  for (const prod of localProducts) {
    const exists = await Product.findOne({ name: prod.name });
    if (!exists) {
      await Product.create(prod);
      console.log('Imported:', prod.name);
    } else {
      console.log('Already exists:', prod.name);
    }
  }
  mongoose.disconnect();
}

importProducts();
