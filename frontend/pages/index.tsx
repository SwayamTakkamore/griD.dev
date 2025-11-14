import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useWallet } from '@/hooks/useWallet';
import { useRouter } from 'next/router';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { connectAndAuth } = useWallet();
  const router = useRouter();

  const handleConnect = async () => {
    await connectAndAuth();
    // Redirect to dashboard after successful connection
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  };

  return (
    <>
      <Head>
        <title>griD.dev - Decentralized GitHub with Story Protocol</title>
        <meta
          name="description"
          content="Upload, version, and showcase your code with blockchain-verified IP ownership"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section - Introduction (Always show this) */}
      <div className="bg-gh-canvas-default min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="mb-8">
              <svg height="120" width="120" viewBox="0 0 16 16" fill="currentColor" className="text-[#0969da] mx-auto mb-6">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gh-fg-default mb-6 leading-tight">
              Welcome to <span className="text-[#0969da]">griD</span>
            </h1>
            
            <p className="text-xl text-gh-fg-muted mb-4 max-w-2xl mx-auto leading-relaxed">
              The decentralized code hosting platform with blockchain-verified IP ownership
            </p>
            
          <p className="text-lg text-gh-fg-muted mb-8 max-w-2xl mx-auto">
            Connect your MetaMask wallet to get started. Your code will be stored on IPFS and 
            registered as an IP asset on Story Protocol Aeneid Testnet.
          </p>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded-gh text-sm text-gh-fg-muted mb-6">
              <svg className="w-4 h-4 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
              </svg>
              Network: Story Aeneid Testnet
            </div>
          </div>            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleConnect}
                className="btn-gh-primary text-lg px-8 py-3 inline-flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.05 9.52l-4.91-7.89c-.38-.61-1.02-.98-1.71-.98H8.57c-.69 0-1.33.37-1.71.98L1.95 9.52c-.26.42-.39.9-.39 1.39v8.52c0 1.1.9 2 2 2h16.88c1.1 0 2-.9 2-2v-8.52c0-.49-.13-.97-.39-1.39zm-6.88 8.41l-1.93.56-.54-1.92 2.47-.68zm-2.05-2.49l1.45-3.95 1.43 3.89-2.88.79zm-2.21-.48l-.54 1.92-1.93-.56.62-1.67 1.85.31zm-.84-2.9l.81 2.17-1.85-.31-.14-.37 1.18-3.22zM20.44 19c0 .55-.45 1-1 1H4.56c-.55 0-1-.45-1-1v-8.09c0-.16.04-.32.13-.46l4.91-7.89c.13-.2.35-.32.6-.32h6.8c.25 0 .47.12.6.32l4.91 7.89c.09.14.13.3.13.46V19z"/>
                  <path d="M9.45 13.13L8.27 16.35l1.93.56.54-1.92 1.85.31-.81-2.17-1.33.36-.84-2.36zM14.55 13.13l.84 2.36-1.33-.36.81 2.17 1.85-.31-.54 1.92 1.93-.56-1.18-3.22z"/>
                </svg>
                Connect MetaMask Wallet
              </button>
              
              <p className="text-sm text-gh-fg-muted">
                Don't have MetaMask?{' '}
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gh-accent-fg hover:underline"
                >
                  Install it here
                </a>
              </p>
            </div>

            {/* Features Preview */}
            <div className="mt-16 grid md:grid-cols-3 gap-6 text-left">
              <div className="p-4 border border-gh-border-default rounded-gh">
                <div className="w-10 h-10 rounded-gh bg-[#1f883d] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gh-fg-default mb-2">IP Protection</h3>
                <p className="text-sm text-gh-fg-muted">
                  Blockchain-verified proof of ownership on Story Protocol
                </p>
              </div>
              
              <div className="p-4 border border-gh-border-default rounded-gh">
                <div className="w-10 h-10 rounded-gh bg-[#0969da] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gh-fg-default mb-2">IPFS Storage</h3>
                <p className="text-sm text-gh-fg-muted">
                  Decentralized, censorship-resistant code storage
                </p>
              </div>
              
              <div className="p-4 border border-gh-border-default rounded-gh">
                <div className="w-10 h-10 rounded-gh bg-[#8250df] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"></path>
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gh-fg-default mb-2">Web3 Native</h3>
                <p className="text-sm text-gh-fg-muted">
                  No passwords, just wallet signatures
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
