const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user id to request (without full user lookup for performance)
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized, token invalid' });
  }
};
