require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const connectDB = require('./src/config/database');
const { initStoryClient } = require('./src/config/story');
const { errorHandler, notFound } = require('./src/middleware/error');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Initialize Story Protocol (optional, will warn if not configured)
initStoryClient();

// Initialize Blockchain Indexer (listens to contract events)
// Disabled for now due to RPC timeouts - can be enabled when needed
// const blockchainIndexer = require('./src/services/blockchainIndexer');
// blockchainIndexer.initialize().then((initialized) => {
//   if (initialized) {
//     blockchainIndexer.startListening();
//     // Optionally sync historical events (comment out after first run)
//     // blockchainIndexer.syncHistoricalEvents(0);
//   }
// });

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware configuration (not applied globally to avoid conflict with multer)
const fileUploadMiddleware = fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800 // 50MB default
  },
  abortOnLimit: true,
  responseOnLimit: 'File size exceeds the maximum allowed limit',
});

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/repo', fileUploadMiddleware, require('./src/routes/repo')); // Apply fileUpload only to old repo routes
app.use('/api/user', require('./src/routes/user'));

// New encryption routes (loaded dynamically to handle TypeScript)
try {
  require('ts-node/register');
  const tsRoutes = require('./src/routes/encryptedRepo');
  app.use('/api', tsRoutes);
  console.log('✅ Encrypted repository routes loaded');
} catch (error) {
  console.warn('⚠️  Could not load encrypted routes. Install ts-node or compile TypeScript files.');
  console.warn('   Run: npm install --save-dev ts-node');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'griD API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to griD.dev API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      repositories: '/api/repo',
      users: '/api/user',
      health: '/health',
    },
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║                                           ║
  ║      🚀 griD.dev API Server              ║
  ║                                           ║
  ║      Port: ${PORT}                          ║
  ║      Environment: ${process.env.NODE_ENV || 'development'}          ║
  ║      MongoDB: Connected                   ║
  ║                                           ║
  ╚═══════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Don't exit in development
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

module.exports = app;
