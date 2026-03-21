// routes/auth.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ✅ Validation middleware (as array)
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const signupValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// ✅ LOGIN ROUTE - Spread validation array with ...
router.post('/login', ...loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ SIGNUP ROUTE - Spread validation array with ...
router.post('/signup', ...signupValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, password, address, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      phone,
      isAdmin: false,
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET CURRENT USER ROUTE
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    console.log('🔍 /me: Auth header present?', !!authHeader);
    console.log('🔍 /me: Auth header starts with Bearer?', authHeader?.startsWith('Bearer'));
    
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      console.log('❌ /me: Missing/malformed Authorization header');
      return res.status(401).json({ message: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔍 /me: Token received (first 30 chars):', token?.substring(0, 30) + '...');
    
    // Debug JWT_SECRET
    console.log('🔍 /me: JWT_SECRET loaded?', !!process.env.JWT_SECRET);
    console.log('🔍 /me: JWT_SECRET length:', process.env.JWT_SECRET?.length);
    
    // Try to verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ /me: Token decoded, User ID:', decoded.id);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('❌ /me: User not found for ID:', decoded.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ /me: Success - User:', user.email);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address,
        phone: user.phone,
      },
    });
  } catch (error) {
    // 🔴 Log EXACT error for debugging
    console.error('❌ /me: JWT verification FAILED:', {
      name: error.name,
      message: error.message,
      expiredAt: error.expiredAt,
    });
    
    res.status(401).json({ message: 'Not authorized' });
  }
});

// DEBUG: Test token validity
router.get('/test-token', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔍 Auth Header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(400).json({ 
        message: 'No Bearer token', 
        header: authHeader 
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔍 Token:', token.substring(0, 30) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔍 Decoded:', decoded);

    const user = await User.findById(decoded.id).select('-password');
    console.log('🔍 User:', user?.email, user?.isAdmin);

    res.json({
      success: true,
      message: 'Token is valid!',
      decoded,
      user: user ? { email: user.email, isAdmin: user.isAdmin } : null
    });
  } catch (error) {
    console.error('❌ Error:', error.name, error.message);
    res.status(401).json({
      success: false,
      message: 'Token invalid',
      error: error.name,
      errorMessage: error.message
    });
  }
});

// DEBUG: Verify token
router.get('/verify-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    res.json({
      success: true,
      message: 'Token is valid',
      decoded,
      user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalid',
      error: error.message,
      errorName: error.name
    });
  }
});
module.exports = router;