# griD.dev Backend

Node.js + Express backend with MongoDB, IPFS, and Story Protocol integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)
- IPFS API access (Infura/Pinata)
- Story Protocol API key

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### Configuration

Update `.env` file with your credentials:

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/grid

# IPFS (Infura)
IPFS_API_URL=https://ipfs.infura.io:5001
IPFS_PROJECT_ID=your_project_id
IPFS_PROJECT_SECRET=your_project_secret

# Story Protocol
STORY_API_KEY=your_api_key
STORY_NETWORK=testnet

# JWT
JWT_SECRET=your_secret_key
```

### Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### Run Production

```bash
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database, IPFS, Story Protocol configs
│   │   ├── database.js
│   │   ├── ipfs.js
│   │   └── story.js
│   ├── models/          # Mongoose schemas
│   │   ├── User.js
│   │   ├── Repository.js
│   │   └── Commit.js
│   ├── services/        # Business logic
│   │   ├── authService.js
│   │   ├── ipfsService.js
│   │   └── storyService.js
│   ├── controllers/     # Route handlers
│   │   ├── authController.js
│   │   ├── repoController.js
│   │   └── userController.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── repo.js
│   │   └── user.js
│   └── middleware/      # Custom middleware
│       ├── auth.js
│       └── error.js
├── server.js            # Entry point
├── package.json
└── .env
```

## 🔌 API Endpoints

### Authentication

```
POST /api/auth/nonce        - Get nonce for wallet
POST /api/auth/login        - Login with signature
GET  /api/auth/verify       - Verify JWT token
POST /api/auth/logout       - Logout
```

### Repositories

```
POST /api/repo/create       - Create repository
GET  /api/repo/:id          - Get repository by ID
GET  /api/repo/user/:wallet - Get user repositories
GET  /api/repo              - Get all repositories
POST /api/repo/commit       - Create commit
```

### Users

```
GET  /api/user/:wallet       - Get user profile
PUT  /api/user/:wallet       - Update user profile
GET  /api/user/:wallet/stats - Get user stats
```

## 🧪 Testing

Test authentication:
```bash
curl -X POST http://localhost:5000/api/auth/nonce \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x123..."}'
```

## 🚀 Deployment

### Render/Railway

1. Push to GitHub
2. Connect repository
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Ensure all variables from `.env.example` are set in your deployment platform.

## 📝 Notes

- File uploads are limited to 50MB
- Only .zip files are accepted
- JWT tokens expire after 7 days
- MongoDB indexes are created automatically
