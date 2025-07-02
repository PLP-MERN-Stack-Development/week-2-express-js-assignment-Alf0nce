function authenticate(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  // In a real app, you'd validate against a database
  if (!apiKey || apiKey !== 'secret-api-key') {
    const error = new Error('Unauthorized');
    error.status = 401;
    return next(error);
  }
  
  next();
}

module.exports = authenticate;