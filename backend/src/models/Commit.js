const mongoose = require('mongoose');

const CommitSchema = new mongoose.Schema({
  commitId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  repositoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true,
    index: true,
  },
  repoId: {
    type: String,
    required: true,
    index: true,
  },
  author: {
    type: String,
    required: true,
    lowercase: true,
  },
  authorRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
    maxlength: 500,
  },
  description: {
    type: String,
    maxlength: 2000,
  },
  // IPFS data for this commit
  ipfsCid: {
    type: String,
    required: true,
  },
  ipfsUrl: {
    type: String,
  },
  // File metadata
  fileName: {
    type: String,
  },
  fileSize: {
    type: Number,
  },
  // Commit metadata
  filesChanged: {
    type: Number,
    default: 0,
  },
  additions: {
    type: Number,
    default: 0,
  },
  deletions: {
    type: Number,
    default: 0,
  },
  // Parent commit for version tracking
  parentCommit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commit',
  },
  commitNumber: {
    type: Number,
    default: 1,
  },
  // Blockchain verification
  verified: {
    type: Boolean,
    default: false,
  },
  txHash: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Generate unique commit ID
CommitSchema.pre('save', function(next) {
  if (!this.commitId) {
    this.commitId = `commit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

module.exports = mongoose.model('Commit', CommitSchema);
