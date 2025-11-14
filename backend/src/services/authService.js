const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const User = require('../models/User');

class AuthService {
  // Generate JWT token
  generateToken(walletAddress) {
    return jwt.sign(
      { walletAddress: walletAddress.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Generate nonce for user
  async generateNonce(walletAddress) {
    try {
      const address = walletAddress.toLowerCase();
      let user = await User.findOne({ walletAddress: address });

      if (!user) {
        // Create new user with nonce
        user = new User({
          walletAddress: address,
          nonce: Math.floor(Math.random() * 1000000).toString(),
        });
        await user.save();
      } else {
        // Update nonce for existing user
        user.nonce = Math.floor(Math.random() * 1000000).toString();
        await user.save();
      }

      return user.nonce;
    } catch (error) {
      throw new Error(`Failed to generate nonce: ${error.message}`);
    }
  }

  // Verify signature
  async verifySignature(walletAddress, signature) {
    try {
      const address = walletAddress.toLowerCase();
      const user = await User.findOne({ walletAddress: address });

      if (!user) {
        throw new Error('User not found');
      }

      // Create the message that was signed
      const message = `Sign this message to authenticate with griD.dev\n\nNonce: ${user.nonce}`;

      // Verify the signature
      const recoveredAddress = ethers.verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== address) {
        throw new Error('Invalid signature');
      }

      // Generate new nonce after successful verification
      user.generateNonce();
      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Signature verification failed: ${error.message}`);
    }
  }

  // Get user by wallet address
  async getUserByWallet(walletAddress) {
    try {
      const user = await User.findOne({ 
        walletAddress: walletAddress.toLowerCase() 
      }).populate('repositories');
      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Update user profile
  async updateUserProfile(walletAddress, profileData) {
    try {
      const user = await User.findOneAndUpdate(
        { walletAddress: walletAddress.toLowerCase() },
        { 
          $set: {
            username: profileData.username,
            email: profileData.email,
            bio: profileData.bio,
            avatar: profileData.avatar,
          }
        },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }
}

module.exports = new AuthService();
