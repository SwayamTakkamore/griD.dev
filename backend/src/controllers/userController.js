const User = require('../models/User');
const authService = require('../services/authService');

// @desc    Get user profile
// @route   GET /api/user/:wallet
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const { wallet } = req.params;

    const user = await User.findOne({ 
      walletAddress: wallet.toLowerCase() 
    }).populate({
      path: 'repositories',
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        totalContributions: user.totalContributions,
        repositories: user.repositories,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/:wallet
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { wallet } = req.params;
    const walletAddress = req.user.walletAddress;

    // Check if user is updating their own profile
    if (wallet.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this profile',
      });
    }

    const { username, email, bio, avatar } = req.body;

    const user = await authService.updateUserProfile(walletAddress, {
      username,
      email,
      bio,
      avatar,
    });

    res.status(200).json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        totalContributions: user.totalContributions,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update profile',
    });
  }
};

// @desc    Get user stats
// @route   GET /api/user/:wallet/stats
// @access  Public
exports.getUserStats = async (req, res) => {
  try {
    const { wallet } = req.params;

    const user = await User.findOne({ 
      walletAddress: wallet.toLowerCase() 
    }).populate('repositories');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const stats = {
      totalRepositories: user.repositories.length,
      totalContributions: user.totalContributions,
      totalStars: user.repositories.reduce((sum, repo) => sum + repo.stars, 0),
      totalForks: user.repositories.reduce((sum, repo) => sum + repo.forks, 0),
      totalCommits: user.repositories.reduce((sum, repo) => sum + repo.commits.length, 0),
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user stats',
    });
  }
};
