const express = require('express');
const router = express.Router();
const {
  getNonce,
  login,
  verifyToken,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/nonce', getNonce);
router.post('/login', login);

// Protected routes
router.get('/verify', protect, verifyToken);
router.post('/logout', protect, logout);

module.exports = router;
