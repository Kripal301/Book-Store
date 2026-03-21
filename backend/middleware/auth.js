  const jwt = require('jsonwebtoken');
  const User = require('../models/User');

  // Protect routes - verify JWT token
  exports.protect = async (req, res, next) => {
    let token;

    // Check for Bearer token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Also check for token in cookies (for browser apps)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired, please login again'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  };

  // Grant access to admin only
  exports.admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Not authorized as an admin'
      });
    }
  };