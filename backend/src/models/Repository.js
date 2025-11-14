const mongoose = require('mongoose');

const RepositorySchema = new mongoose.Schema({
  repoId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  owner: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  ownerRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  licenseType: {
    type: String,
    enum: ['open', 'restricted', 'paid'],
    default: 'open',
  },
  // IPFS data
  ipfsCid: {
    type: String,
    required: true,
  },
  ipfsUrl: {
    type: String,
  },
  // Story Protocol data
  ipAssetId: {
    type: String,
    index: true,
  },
  ipAssetTxHash: {
    type: String,
  },
  ipAssetRegistered: {
    type: Boolean,
    default: false,
  },
  // File metadata
  fileName: {
    type: String,
  },
  fileSize: {
    type: Number,
  },
  fileType: {
    type: String,
  },
  // Repository stats
  stars: {
    type: Number,
    default: 0,
  },
  forks: {
    type: Number,
    default: 0,
  },
  commits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commit',
  }],
  contributors: [{
    walletAddress: String,
    contributions: {
      type: Number,
      default: 0,
    },
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  isPublic: {
    type: Boolean,
    default: true,
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

// Generate unique repo ID
RepositorySchema.pre('save', function(next) {
  if (!this.repoId) {
    this.repoId = `repo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Add contributor or update contribution count
RepositorySchema.methods.addContributor = function(walletAddress) {
  const existingContributor = this.contributors.find(
    c => c.walletAddress.toLowerCase() === walletAddress.toLowerCase()
  );
  
  if (existingContributor) {
    existingContributor.contributions += 1;
  } else {
    this.contributors.push({
      walletAddress: walletAddress.toLowerCase(),
      contributions: 1,
    });
  }
  
  return this.save();
};

module.exports = mongoose.model('Repository', RepositorySchema);
