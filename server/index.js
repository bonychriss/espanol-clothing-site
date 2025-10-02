const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Load environment variables from .env file
dotenv.config();

// Log environment info
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', process.env.PORT || 10000);
console.log('MongoDB URI exists:', !!process.env.MONGO_URI);

const app = express();

// CORS configuration for separate frontend deployment
const corsOptions = {
  origin: true, // Temporarily allow all origins for debugging
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.get('Origin')}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch(err => {
  console.error('Initial MongoDB connection error:', err.message);
  console.error('Please ensure your IP is whitelisted in MongoDB Atlas and your MONGO_URI is correct in the .env file.');
  process.exit(1); // Exit the process with a failure code
});

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Clothing Store API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  res.status(200).json(healthCheck);
});
app.get('/api/health', (req, res) => {
  // Check database connection state
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    res.status(200).json({ status: 'ok', database: 'connected' });
  } else {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// --- Admin User Seeding ---
// This function runs on server startup to ensure the admin user exists.
const seedAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log('Admin credentials not found in .env file. Skipping admin seed.');
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({ name: 'Sabor Admin', email: adminEmail, password: hashedPassword, role: 'admin' });
      console.log('Admin user created successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};
mongoose.connection.once('open', () => {
  console.log('MongoDB connected...');
  seedAdminUser();
});

// TODO: Add routes for products, users, cart, orders
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/featured-images', require('./routes/featuredImages'));
app.use('/api/best-picks', require('./routes/bestPicks'));

const path = require('path');

// Serve uploaded images (you may want to use cloud storage like Cloudinary in production)
app.use('/images', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 10000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});

// Set timeouts to prevent 502 errors on Render
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000; // 120 seconds

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});
