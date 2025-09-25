// importLocalProducts.js
// Run this script with: node importLocalProducts.js
// This will import all local catalog products into your MongoDB database so they can be checked out.

const mongoose = require('mongoose');
const Product = require('./models/Product');

const localProducts = [
  { name: "Men's Jeans", image: '/images/mens-jeans.jpg', price: 39.99, listPrice: 49.99, category: 'Men', rating: 4.4, reviews: 70805, isBestSeller: true, desc: 'Premium denim with stretch for everyday comfort.' },
  { name: "Boys' Jeans", image: '/images/boyz jeans.jpg', price: 24.99, listPrice: 34.99, category: 'Boys', rating: 4.2, reviews: 1805, desc: 'Durable and comfy jeans for kids on the move.' },
  { name: 'Cozy Sweater', image: '/images/sweater.jpg', price: 29.99, listPrice: 39.99, category: 'Women', rating: 4.6, reviews: 15094, desc: 'Soft knit with a relaxed fit to keep you warm.' },
  { name: 'Classic Suit', image: '/images/suit.jpg', price: 129.99, listPrice: 159.99, category: 'Men', rating: 4.7, reviews: 4364, isOverallPick: true, desc: 'Tailored silhouette with stretch fabric for all-day wear.' },
  { name: 'Summer Dress', image: '/images/dresses.jpg', price: 49.99, listPrice: 59.99, category: 'Women', rating: 4.3, reviews: 874, desc: 'Breezy and flattering, perfect for sunny days.' },
  { name: 'Casual Shirt', image: '/images/shirt.jpg', price: 19.99, listPrice: 24.99, category: 'Men', rating: 4.1, reviews: 3421, desc: 'Breathable cotton blend for effortless style.' },
  { name: 'Best Of All Set', image: '/images/beest of all.jpg', price: 54.99, listPrice: 69.99, category: 'Women', rating: 4.5, reviews: 612, desc: 'Mix-and-match set designed to elevate your look.' },
  { name: 'Sneakers', image: '/images/shoes 1.jpg', price: 59.99, listPrice: 79.99, category: 'Shoes', rating: 4.6, reviews: 2310, desc: 'Everyday sneakers with cushioned support.' },
  { name: 'Running Shoes', image: '/images/shoes2.jpg', price: 69.99, listPrice: 89.99, category: 'Shoes', rating: 4.4, reviews: 1543, desc: 'Lightweight runners built for speed and comfort.' },
  { name: 'Trainers', image: '/images/shoes3.jpg', price: 62.49, listPrice: 74.99, category: 'Shoes', rating: 4.2, reviews: 845, desc: 'Versatile trainers for gym and street.' },
  { name: 'Court Shoes', image: '/images/shoes 4.jpg', price: 64.99, listPrice: 84.99, category: 'Shoes', rating: 4.3, reviews: 541, desc: 'Court-ready grip with everyday style.' },
  { name: 'Mesh Sneakers', image: '/images/shoes 5.jpg', price: 72.5, listPrice: 89.99, category: 'Shoes', rating: 4.5, reviews: 999, desc: 'Breathable mesh upper with responsive cushioning.' },
  { name: 'Casual Shoes', image: '/images/shoes6.jpg', price: 57.0, listPrice: 69.99, category: 'Shoes', rating: 4.0, reviews: 432, desc: 'Weekend-ready shoes with a clean profile.' },
  { name: 'Street Sneakers', image: '/images/shoes7.jpg', price: 66.0, listPrice: 84.0, category: 'Shoes', rating: 4.3, reviews: 1288, desc: 'Street style meets comfort in these staples.' },
];

async function main() {
  await mongoose.connect('mongodb+srv://wolfwiganz_db_user:BaaDyman321@cluster0.tlnggkf.mongodb.net/wolfwiganz_db_user?retryWrites=true&w=majority&appName=Cluster0');
  for (const prod of localProducts) {
    // Avoid duplicates by name
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

main().catch(err => { console.error(err); });
