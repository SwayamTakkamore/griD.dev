# griD.dev Frontend

Next.js 14 frontend with TypeScript, Tailwind CSS, and Web3 integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Backend API running (see backend README)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your backend URL
nano .env.local
```

### Configuration

Update `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_STORY_NETWORK=testnet
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── pages/               # Next.js pages
│   ├── _app.tsx        # App wrapper
│   ├── _document.tsx   # Document wrapper
│   ├── index.tsx       # Landing page
│   ├── dashboard.tsx   # User dashboard
│   ├── create-repo.tsx # Create repository
│   └── repo/
│       └── [id].tsx    # Repository view
├── components/          # React components
│   ├── Navbar.tsx
│   ├── RepoCard.tsx
│   ├── Layout.tsx
│   └── LoadingSpinner.tsx
├── hooks/               # Custom hooks
│   ├── useWallet.ts
│   └── useRepository.ts
├── lib/                 # Utilities
│   └── api.ts          # API client
├── store/               # Zustand stores
│   ├── authStore.ts
│   └── walletStore.ts
├── types/               # TypeScript types
│   └── index.ts
├── styles/              # Global styles
│   └── globals.css
└── public/              # Static assets
```

## 🎨 Features

### Pages

- **Landing Page** (`/`) - Introduction and features
- **Dashboard** (`/dashboard`) - User repositories
- **Create Repository** (`/create-repo`) - Upload new repository
- **Repository View** (`/repo/[id]`) - View repository details
- **Explore** (`/explore`) - Browse all repositories

### Components

- **Navbar** - Navigation with wallet connection
- **RepoCard** - Repository preview card
- **Layout** - Page layout wrapper
- **LoadingSpinner** - Loading indicator

### Hooks

- **useWallet** - Web3 wallet connection and authentication
- **useRepository** - Repository CRUD operations

### State Management

- **authStore** - User authentication state
- **walletStore** - Wallet connection state

## 🔐 Authentication Flow

1. User clicks "Connect Wallet"
2. MetaMask prompts for connection
3. Backend generates nonce
4. User signs message with nonce
5. Backend verifies signature
6. JWT token issued and stored
7. User authenticated

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect via Vercel dashboard:
1. Import GitHub repository
2. Add environment variables
3. Deploy!

### Environment Variables

Set these in Vercel:
- `NEXT_PUBLIC_BACKEND_URL` - Your backend API URL
- `NEXT_PUBLIC_STORY_NETWORK` - mainnet/testnet
- `NEXT_PUBLIC_IPFS_GATEWAY` - IPFS gateway URL

## 📝 Development Notes

- TypeScript errors during development are expected until dependencies are installed
- Run `npm install` to resolve module errors
- MetaMask is required for wallet connection
- Backend must be running for full functionality

## 🛠️ Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Run ESLint
```

## 🎯 Browser Support

- Chrome/Edge (with MetaMask)
- Firefox (with MetaMask)
- Brave (built-in wallet)
