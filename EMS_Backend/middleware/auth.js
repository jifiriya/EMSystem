const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pulsehr_secret_key_2026_super_secure';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || !['Admin', 'HR Manager'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrative privileges required.'
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, JWT_SECRET };
