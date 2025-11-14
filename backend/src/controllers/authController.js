const authService = require('../services/authService');

// @desc    Get nonce for wallet
// @route   POST /api/auth/nonce
// @access  Public
exports.getNonce = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required',
      });
    }

    const nonce = await authService.generateNonce(walletAddress);

    res.status(200).json({
      success: true,
      nonce,
    });
  } catch (error) {
    console.error('Get nonce error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate nonce',
    });
  }
};

// @desc    Login with wallet signature
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address and signature are required',
      });
    }

    // Verify signature
    const user = await authService.verifySignature(walletAddress, signature);

    // Generate JWT token
    const token = authService.generateToken(walletAddress);

    res.status(200).json({
      success: true,
      token,
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
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Authentication failed',
    });
  }
};

// @desc    Verify JWT token
// @route   GET /api/auth/verify
// @access  Private
exports.verifyToken = async (req, res) => {
  try {
    const user = await authService.getUserByWallet(req.user.walletAddress);

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
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      error: 'Token verification failed',
    });
  }
};

// @desc    Logout (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
