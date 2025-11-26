import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWallet } from '@/hooks/useWallet';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const router = useRouter();
  const { connectAndAuth, isConnected } = useWallet();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleConnect = async () => {
    try {
      await connectAndAuth();
      router.push('/auth/verify');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Login - griD.dev</title>
        <meta name="description" content="Login to griD.dev with your Web3 wallet" />
      </Head>

      <div className="bg-gh-canvas-default min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <div className="card-gh p-8 text-center">
            {/* Logo */}
            <div className="mb-6">
              <img 
                src="/logo.svg" 
                alt="griD.dev" 
                className="h-20 w-auto mx-auto"
              />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gh-fg-default mb-2">
              Login via Wallet
            </h1>
            <p className="text-gh-fg-muted mb-8">
              Sign the authentication message to login securely
            </p>

            {/* Connect Button */}
            <button
              onClick={handleConnect}
              className="w-full bg-gh-btn-bg hover:bg-gh-btn-hover-bg text-gh-btn-text font-medium px-6 py-3 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 40 40" fill="none">
                <path d="M37.1 15.1l-14-14C22.5.4 21.8 0 21 0s-1.5.4-2.1 1.1l-14 14c-.6.6-1 1.4-1 2.3 0 1.7 1.4 3.1 3.1 3.1h1.9v13.6c0 1.7 1.4 3.1 3.1 3.1h5.8v-9.9h5.6v9.9h5.8c1.7 0 3.1-1.4 3.1-3.1V20.5h1.9c1.7 0 3.1-1.4 3.1-3.1 0-.9-.4-1.7-1.1-2.3z" fill="currentColor"/>
              </svg>
              Connect MetaMask
            </button>

            {/* Info */}
            <div className="mt-8 pt-6 border-t border-gh-border-default">
              <h3 className="text-sm font-semibold text-gh-fg-default mb-3">
                Why Web3 Login?
              </h3>
              <ul className="text-xs text-gh-fg-muted space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gh-success-emphasis mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>No password required - your wallet is your identity</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gh-success-emphasis mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>Cryptographic signature for secure authentication</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gh-success-emphasis mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                  </svg>
                  <span>Full control - you own your data and identity</span>
                </li>
              </ul>
            </div>

            {/* Back link */}
            <div className="mt-6">
              <a href="/" className="text-sm text-gh-accent-fg hover:underline">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
