const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/:wallet', getUserProfile);
router.get('/:wallet/stats', getUserStats);

// Protected routes
router.put('/:wallet', protect, updateUserProfile);

module.exports = router;
