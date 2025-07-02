// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const { NotFoundError, ValidationError, AuthError } = require('./errors');

// Middleware setup
app.use(bodyParser.json());

// Import custom middleware
const authenticate = require('./middleware/auth');
const logger = require('./middleware/logger');

// Use logger middleware for all routes
app.use(logger);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ error: err.message, details: err.details });
  }
  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

//  Hello World route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Import routes
const productsRouter = require('./routes/products');
app.use('/api/products', authenticate, productsRouter);

// All product routes are handled in ./routes/products via productsRouter.

// Example route implementation for GET /api/products
// (Handled in productsRouter)
// - Authentication
// - Error handling

// Error handling middleware (should be after all routes)
app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ error: err.message, details: err.details });
  }
  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;