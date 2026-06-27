const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check for token in Authorization header (Bearer token)
  const authHeader = req.header('Authorization');
  let token = authHeader && authHeader.split(' ')[1];
  
  // Fallback to query parameter for browser downloads (CSV export)
  if (!token && req.query && req.query.token) {
    token = req.query.token;
  }
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_fallback');
    req.user = decoded; // add user payload to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
