const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  username: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  avatar: {
    type: String,
  },
  nonce: {
    type: String,
    required: true,
  },
  repositories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
  }],
  totalContributions: {
    type: Number,
    default: 0,
  },
  // Cache metadata - MongoDB is ONLY a cache for user profiles
  lastSyncedAt: {
    type: Date,
    default: Date.now,
    index: { expires: '30d' }, // TTL: Auto-delete after 30 days
  },
  cacheSource: {
    type: String,
    enum: ['blockchain', 'manual', 'ipfs'],
    default: 'manual',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Generate a random nonce for wallet signature
UserSchema.methods.generateNonce = function() {
  this.nonce = Math.floor(Math.random() * 1000000).toString();
  return this.nonce;
};

// Update timestamp on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema);
