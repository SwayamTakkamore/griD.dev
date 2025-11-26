import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useWallet } from '@/hooks/useWallet';
import { useRouter } from 'next/router';
import { PixelStar, PixelGem, PixelCrystal, PixelDivider } from '@/components/PixelDecor';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { connectAndAuth } = useWallet();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [mounted, isAuthenticated, router]);

  const handleConnect = async () => {
    await connectAndAuth();
    // Redirect to dashboard after successful connection
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  };

  // Don't render landing page if authenticated (prevents flash)
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>griD.dev - Decentralized Code Vault</title>
        <meta
          name="description"
          content="Upload, protect, and trade your code as blockchain-verified IP assets"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      {/* Hero Section */}
      <div className="bg-gh-canvas-default min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden">
        {/* Floating Crystals */}
        <div className="absolute top-20 left-10 opacity-50">
          <PixelCrystal />
        </div>
        <div className="absolute top-40 right-20 opacity-50">
          <PixelCrystal />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-50">
          <PixelCrystal />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16 text-center relative z-10">
            <div className="mb-8 flex justify-center gap-4">
              <PixelStar className="text-gh-attention-fg animate-pixel-pulse" />
              <PixelStar className="text-gh-success-fg animate-pixel-pulse" style={{ animationDelay: '0.5s' }} />
              <PixelStar className="text-gh-accent-fg animate-pixel-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-pixel text-gh-fg-default mb-8 leading-tight tracking-wider drop-shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
              <span className="text-gh-accent-fg">griD</span>.dev
            </h1>
            
            <p className="text-3xl text-gh-accent-fg mb-4 font-retro uppercase tracking-wide animate-pixel-pulse">
              ⚡ Decentralized Code Vault ⚡
            </p>
            
          <p className="text-2xl text-gh-fg-muted mb-8 max-w-2xl mx-auto font-retro">
            Protect your code treasures with blockchain magic.
            Encrypted IPFS storage meets Story Protocol IP rights!
          </p>

          <PixelDivider />

          <div className="mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gh-canvas-subtle border-4 border-gh-border-default rounded-gh text-xl text-gh-success-fg mb-6 shadow-gh">
              <PixelGem />
              <span className="font-bold uppercase">Story Aeneid Testnet</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
              <button
                onClick={handleConnect}
                className="btn-gh-primary text-2xl px-10 py-4 inline-flex items-center gap-4 animate-float shadow-gh-lg hover:shadow-gh-md"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
                  <rect x="8" y="4" width="16" height="4" />
                  <rect x="4" y="8" width="4" height="16" />
                  <rect x="24" y="8" width="4" height="16" />
                  <rect x="8" y="24" width="16" height="4" />
                  <rect x="12" y="12" width="8" height="8" opacity="0.7" />
                </svg>
                CONNECT WALLET
              </button>
              
              <p className="text-xl text-gh-fg-muted font-retro">
                No MetaMask?{' '}
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gh-attention-fg hover:text-gh-attention-emphasis underline font-bold"
                >
                  [DOWNLOAD HERE]
                </a>
              </p>
            </div>

            {/* Features Grid */}
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              <div className="card-gh p-6 text-left hover:border-gh-success-fg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <PixelGem color="#7dfc00" className="text-2xl" />
                  <h3 className="text-2xl font-bold text-gh-success-fg uppercase">IP Protection</h3>
                </div>
                <p className="text-lg text-gh-fg-muted font-retro">
                  Blockchain-verified proof of ownership on Story Protocol
                </p>
              </div>
              
              <div className="card-gh p-6 text-left hover:border-gh-accent-fg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <PixelGem color="#00e5cc" className="text-2xl" />
                  <h3 className="text-2xl font-bold text-gh-accent-fg uppercase">Encrypted IPFS</h3>
                </div>
                <p className="text-lg text-gh-fg-muted font-retro">
                  AES-256 encrypted storage on decentralized network. Private & censorship-resistant!
                </p>
              </div>
              
              <div className="card-gh p-6 text-left hover:border-gh-attention-fg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <PixelGem color="#ffd700" className="text-2xl" />
                  <h3 className="text-2xl font-bold text-gh-attention-fg uppercase">Web3 Native</h3>
                </div>
                <p className="text-lg text-gh-fg-muted font-retro">
                  Wallet-based auth. No passwords, no emails, just cryptographic magic!
                </p>
              </div>
            </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gh-canvas-subtle">
        <div className="max-w-[1280px] mx-auto px-4">
          <h2 className="text-3xl font-bold text-gh-fg-default mb-12">
            Productivity and collaboration, powered by Story Protocol
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-gh p-6 hover:border-gh-accent-fg/50">
              <div className="w-12 h-12 rounded-gh bg-[#1f883d] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gh-fg-default mb-3">IP Protection</h3>
              <p className="text-gh-fg-muted text-sm">
                Register your code as an IP asset on Story Protocol. Get blockchain-verified proof of ownership and creation timestamp.
              </p>
            </div>
            <div className="card-gh p-6 hover:border-gh-accent-fg/50">
              <div className="w-12 h-12 rounded-gh bg-[#0969da] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gh-fg-default mb-3">Decentralized Storage</h3>
              <p className="text-gh-fg-muted text-sm">
                Your code is stored on IPFS for permanent, censorship-resistant access. No single point of failure or vendor lock-in.
              </p>
            </div>
            <div className="card-gh p-6 hover:border-gh-accent-fg/50">
              <div className="w-12 h-12 rounded-gh bg-[#8250df] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gh-fg-default mb-3">Contribution Tracking</h3>
              <p className="text-gh-fg-muted text-sm">
                All contributions are tracked on-chain. Build your reputation and prove your work with immutable blockchain records.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gh-canvas-default border-t border-gh-border-default">
        <div className="max-w-[1280px] mx-auto px-4">
          <h2 className="text-3xl font-bold text-gh-fg-default mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-left">
              <div className="w-12 h-12 bg-[#0969da] text-white rounded-gh flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-semibold text-gh-fg-default mb-2">Connect Wallet</h3>
              <p className="text-gh-fg-muted text-sm">
                Sign in with your Web3 wallet (MetaMask, WalletConnect, etc.)
              </p>
            </div>
            <div className="text-left">
              <div className="w-12 h-12 bg-[#0969da] text-white rounded-gh flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-semibold text-gh-fg-default mb-2">Upload Code</h3>
              <p className="text-gh-fg-muted text-sm">
                Upload your repository as a ZIP file with title and description
              </p>
            </div>
            <div className="text-left">
              <div className="w-12 h-12 bg-[#0969da] text-white rounded-gh flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-semibold text-gh-fg-default mb-2">Register IP</h3>
              <p className="text-gh-fg-muted text-sm">
                Your code is registered as an IP asset on Story Protocol blockchain
              </p>
            </div>
            <div className="text-left">
              <div className="w-12 h-12 bg-[#0969da] text-white rounded-gh flex items-center justify-center text-xl font-bold mb-4">
                4
              </div>
              <h3 className="text-base font-semibold text-gh-fg-default mb-2">Share & Track</h3>
              <p className="text-gh-fg-muted text-sm">
                Share your work and track all contributions with blockchain proof
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Overview Section */}
      <div className="py-16 bg-gh-canvas-subtle border-t border-gh-border-default">
        <div className="max-w-[1280px] mx-auto px-4">
          <h2 className="text-3xl font-bold text-gh-fg-default mb-4 text-center">
            Architecture Overview
          </h2>
          <p className="text-lg text-gh-fg-muted mb-12 text-center max-w-3xl mx-auto">
            griD combines three powerful technologies to create a truly decentralized code hosting platform
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Blockchain Layer */}
            <div className="card-gh p-6 border-2 border-gh-border-default hover:border-gh-accent-emphasis/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-gh bg-[#8250df] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0Zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gh-fg-default">Blockchain Layer</h3>
              </div>
              <p className="text-sm text-gh-fg-muted mb-4">
                <strong className="text-gh-fg-default">Story Protocol</strong> registers repositories as IP assets, 
                providing immutable proof of ownership and licensing on Story Aeneid Testnet.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-gh-fg-muted">
                  <svg className="w-3 h-3 mt-0.5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>Smart contract deployment</span>
                </div>
                <div className="flex items-start gap-2 text-gh-fg-muted">
                  <svg className="w-3 h-3 mt-0.5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>IP asset registration</span>
                </div>
                <div className="flex items-start gap-2 text-gh-fg-muted">
                  <svg className="w-3 h-3 mt-0.5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>Ownership verification</span>
                </div>
                <div className="flex items-start gap-2 text-gh-fg-muted">
                  <svg className="w-3 h-3 mt-0.5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>Contribution tracking</span>
                </div>
              </div>
            </div>

            {/* IPFS Layer */}
            <div className="card-gh p-6 border-2 border-gh-border-default hover:border-gh-accent-emphasis/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-gh bg-[#0969da] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gh-fg-default">IPFS Layer</h3>
              </div>
              <p className="text-sm text-gh-fg-muted mb-4">
                <strong className="text-gh-fg-default">Pinata (IPFS)</strong> stores the actual code files in a 
                decentralized, content-addressed system for permanent availability.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-gh-fg-muted">
                  <svg className="w-3 h-3 mt-0.5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>Decentralized file storage</span>
                </div>
                <div className="flex items-start gap-2 text-gh-fg-muted">
                  <svg className="w-3 h-3 mt-0.5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>Content addressing (CID)</span>
                </div>
                <div className="flex items-start gap-2 text-gh-fg-muted">
                  <svg className="w-3 h-3 mt-0.5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>Censorship resistance</span>
                </div>
                <div className="flex items-start gap-2 text-gh-fg-muted">
                  <svg className="w-3 h-3 mt-0.5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>Global availability</span>
                </div>
              </div>
            </div>

            {/* MongoDB Layer */}
            <div className="card-gh p-6 border-2 border-gh-border-default hover:border-gh-accent-emphasis/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-gh bg-[#1f883d] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25ZM3.5 4.75c0-.414.336-.75.75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75ZM4.25 7a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gh-fg-default">MongoDB Layer</h3>
              </div>
              <p className="text-sm text-gh-fg-muted mb-4">
                <strong className="text-gh-fg-default">MongoDB</strong> caches metadata for fast queries, 
                acting as an indexer while blockchain remains the source of truth.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-gh-fg-muted">
                  <svg className="w-3 h-3 mt-0.5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>Fast metadata queries</span>
                </div>
                <div className="flex items-start gap-2 text-gh-fg-muted">
                  <svg className="w-3 h-3 mt-0.5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>Search and filtering</span>
                </div>
                <div className="flex items-start gap-2 text-gh-fg-muted">
                  <svg className="w-3 h-3 mt-0.5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>User profiles & stats</span>
                </div>
                <div className="flex items-start gap-2 text-gh-fg-muted">
                  <svg className="w-3 h-3 mt-0.5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>Blockchain recovery capable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Flow Diagram */}
          <div className="card-gh p-6 bg-gh-canvas-inset">
            <h3 className="text-base font-semibold text-gh-fg-default mb-4 text-center">
              Repository Upload Flow
            </h3>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="px-3 py-2 bg-gh-accent-subtle text-gh-accent-fg rounded-gh text-sm font-semibold border border-gh-accent-emphasis">
                  User uploads ZIP
                </div>
                <svg className="w-6 h-6 text-gh-fg-muted" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.03 8.28a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Z"></path>
                </svg>
              </div>
              
              <div className="px-3 py-2 bg-[#0969da] text-white rounded-gh text-sm font-semibold">
                1. IPFS Upload
              </div>
              <span className="text-gh-fg-muted">→</span>
              
              <div className="px-3 py-2 bg-[#8250df] text-white rounded-gh text-sm font-semibold">
                2. Story Protocol
              </div>
              <span className="text-gh-fg-muted">→</span>
              
              <div className="px-3 py-2 bg-[#1f883d] text-white rounded-gh text-sm font-semibold">
                3. MongoDB Cache
              </div>
              <span className="text-gh-fg-muted">→</span>
              
              <div className="px-3 py-2 bg-gh-success-subtle text-gh-success-fg rounded-gh text-sm font-semibold border border-gh-success-emphasis">
                Repository Live ✓
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gh-canvas-subtle border-t border-gh-border-default">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-gh-fg-default mb-4">
            Ready to protect your code?
          </h2>
          <p className="text-xl text-gh-fg-muted mb-8">
            Join developers worldwide using griD to secure their intellectual property.
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => window.location.href = '/explore'}
              className="btn-gh-primary text-base px-8 py-3"
            >
              Get started for free
            </button>
          )}
        </div>
      </div>
    </>
  );
}
