function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  
  if (!name || !description || !price || !category || typeof inStock !== 'boolean') {
    const error = new Error('Missing or invalid fields');
    error.status = 400;
    return next(error);
  }
  
  if (typeof price !== 'number' || price <= 0) {
    const error = new Error('Price must be a positive number');
    error.status = 400;
    return next(error);
  }
  
  next();
}

module.exports = validateProduct;