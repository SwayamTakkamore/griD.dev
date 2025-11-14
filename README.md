# griD.dev 🚀

A decentralized GitHub-style platform for developers to upload, version, and showcase code repositories with blockchain-verified IP ownership using Story Protocol.

## 🌟 Features

- **Web3 Authentication**: Wallet-based login (no passwords)
- **Blockchain IP Verification**: Story Protocol integration for IP asset registration
- **Decentralized Storage**: IPFS for code snapshots
- **Off-chain Metadata**: MongoDB for fast access and queries
- **Contribution Tracking**: Log all contributors and commits
- **License Management**: Open, restricted, or paid licensing with royalty splits
- **Modern UI**: Next.js + TypeScript + Tailwind CSS

## 🏗️ Architecture

```
grid.dev/
├── frontend/          # Next.js (TypeScript) + Tailwind CSS
├── backend/           # Node.js + Express + MongoDB + Story SDK
└── README.md
```

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB (Mongoose ORM)
- Story Protocol SDK
- IPFS (ipfs-http-client)
- JWT Authentication
- dotenv

### Frontend
- Next.js 14 (TypeScript)
- Tailwind CSS
- Ethers.js for wallet connection
- Axios for API calls
- Zustand for state management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Infura IPFS project (or Pinata)
- Story Protocol API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

Visit `http://localhost:3000` to see the app!

## 📁 Project Structure

### Backend (`/backend`)
```
backend/
├── src/
│   ├── config/          # Database, IPFS, Story Protocol config
│   ├── models/          # MongoDB schemas (User, Repository, Commit)
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── services/        # Story Protocol, IPFS, Auth services
│   └── middleware/      # JWT authentication
├── .env.example
├── package.json
└── server.js
```

### Frontend (`/frontend`)
```
frontend/
├── pages/              # Next.js pages
│   ├── index.tsx       # Landing page
│   ├── dashboard.tsx   # User dashboard
│   ├── create-repo.tsx # Upload repository
│   └── repo/[id].tsx   # Repository details
├── components/         # React components
├── hooks/              # Custom React hooks
├── lib/                # API client, utilities
├── store/              # Zustand state management
├── types/              # TypeScript types
└── .env.local.example
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - Wallet-based login
- `POST /auth/verify` - Verify JWT token

### Repositories
- `POST /repo/create` - Upload and register repository
- `GET /repo/:id` - Fetch repository details
- `POST /repo/commit` - Record new commit/contribution
- `GET /repo/user/:wallet` - Get user's repositories

### User
- `GET /user/:wallet` - Fetch user profile
- `PUT /user/:wallet` - Update user profile

## 🔐 Environment Variables

### Backend (`.env`)
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/grid
IPFS_API_URL=https://ipfs.infura.io:5001
IPFS_PROJECT_ID=your_infura_project_id
IPFS_PROJECT_SECRET=your_infura_secret
STORY_API_KEY=your_story_api_key
STORY_NETWORK=mainnet
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_STORY_NETWORK=mainnet
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

## 🔄 Integration Flow

1. **User connects wallet** → Frontend requests nonce from backend
2. **User signs message** → Backend verifies signature and issues JWT
3. **User uploads repo** → Backend:
   - Stores metadata in MongoDB
   - Uploads file to IPFS
   - Registers IP on Story Protocol
   - Returns repoId + ipAssetId
4. **Frontend displays** → Repository with ownership proof and IPFS link

## 🧪 Testing the MVP

### 1. Connect Wallet
- Click "Connect Wallet" on landing page
- Sign the authentication message

### 2. Create Repository
- Go to "Create Repository"
- Upload a .zip file (max 50MB)
- Fill in title, description, license type
- Submit and wait for blockchain confirmation

### 3. View Repository
- See your repository with:
  - IP Asset ID from Story Protocol
  - IPFS CID for code storage
  - Contribution history
  - License information

## 🌐 Deployment

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Add environment variables
4. Deploy!

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### MongoDB (Atlas)
1. Create free cluster at mongodb.com
2. Add database user
3. Whitelist IP addresses
4. Copy connection string to `.env`

## 🔒 Security Best Practices

- ✅ JWT tokens for session handling
- ✅ File upload validation (max 50MB, .zip only)
- ✅ Input sanitization to prevent injection
- ✅ API keys hidden in .env
- ✅ Never expose Story API key on frontend
- ✅ Error handling for failed IPFS/Story uploads

## 🎯 Future Enhancements

- [ ] AI-based code plagiarism detection (LangChain)
- [ ] DAO voting for best projects
- [ ] Token rewards for contributors
- [ ] GitHub import integration
- [ ] Advanced analytics dashboard
- [ ] Multi-file repository browser
- [ ] Inline code viewer
- [ ] Pull request system

## 📚 Documentation

- [Story Protocol Docs](https://docs.story.foundation/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For questions or issues, please open a GitHub issue or contact the team.

---

Built with ❤️ using Story Protocol, IPFS, and Next.js
