// routes
const authenticate = require('../middleware/auth');
const validateProduct = require('../middleware/validation');
const logger = require('../middleware/logger');

// Express router setup
const express = require('express');
const app = express();


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

let nextId = 3;

// GET all products
app.get('/', (req, res) => {
  res.json(products);
});

// GET single product
app.get('/:id', (req, res, next) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    return next(error);
  }
  res.json(product);
});

// POST create product
app.post('/', validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  
  if (!name || !description || !price || !category || typeof inStock !== 'boolean') {
    const error = new Error('Missing or invalid fields');
    error.status = 400;
    return next(error);
  }

  const newProduct = {
    id: nextId++,
    name,
    description,
    price,
    category,
    inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update product
app.put('/:id', validateProduct, (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    return next(error);
  }

  const { name, description, price, category, inStock } = req.body;
  
  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (category) product.category = category;
  if (typeof inStock === 'boolean') product.inStock = inStock;

  res.json(product);
});

// DELETE product
app.delete('/:id', (req, res, next) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    const error = new Error('Product not found');
    error.status = 404;
    return next(error);
  }

  products = products.filter(p => p.id !== parseInt(req.params.id));
  res.status(204).end();
});

// Add these routes to products.js

// Filter products by category
app.get('/category/:category', (req, res) => {
  const filteredProducts = products.filter(
    p => p.category.toLowerCase() === req.params.category.toLowerCase()
  );
  res.json(filteredProducts);
});

// Pagination for product listing
app.get('/page/:pageNumber', (req, res) => {
  const page = parseInt(req.params.pageNumber) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const results = products.slice(startIndex, endIndex);
  
  res.json({
    page,
    limit,
    total: products.length,
    results
  });
});

// Search products by name
app.get('/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  const results = products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.description.toLowerCase().includes(query)
  );
  
  res.json(results);
});

// Product statistics
app.get('/stats', (req, res) => {
  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
    categories: {}
  };
  
  products.forEach(product => {
    if (!stats.categories[product.category]) {
      stats.categories[product.category] = 0;
    }
    stats.categories[product.category]++;
  });
  
  res.json(stats);
});

module.exports = app;