const express = require('express');
const router = express.Router();
const {
  createRepository,
  getRepository,
  getUserRepositories,
  createCommit,
  getAllRepositories,
} = require('../controllers/repoController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllRepositories);
router.get('/:id', getRepository);
router.get('/user/:wallet', getUserRepositories);

// Protected routes
router.post('/create', protect, createRepository);
router.post('/commit', protect, createCommit);

module.exports = router;
