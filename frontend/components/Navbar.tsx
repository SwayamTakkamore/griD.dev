import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useWallet } from '@/hooks/useWallet';

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { isConnected, address, connectAndAuth, disconnect } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="bg-gh-canvas-default border-b border-gh-border-default px-4 py-4">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo & Search */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/logo.svg" 
                alt="griD.dev Logo" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-4">
            <Link
              href="/explore"
              className="text-gh-fg-default hover:text-gh-fg-default/80 font-semibold text-sm px-2"
            >
              Explore
            </Link>

            <Link
              href="/about"
              className="text-gh-fg-default hover:text-gh-fg-default/80 font-semibold text-sm px-2"
            >
              About
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gh-fg-default hover:text-gh-fg-default/80 font-semibold text-sm px-2"
                >
                  Dashboard
                </Link>
                <Link
                  href="/create-repo"
                  className="text-gh-fg-default hover:text-gh-fg-default/80 font-semibold text-sm px-2"
                >
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M7.75 0a.75.75 0 0 1 .75.75V3h2.25a.75.75 0 0 1 0 1.5H8.5v2.25a.75.75 0 0 1-1.5 0V4.5H4.75a.75.75 0 0 1 0-1.5H7V.75A.75.75 0 0 1 7.75 0Z"></path>
                    </svg>
                    New
                  </span>
                </Link>
              </>
            )}

            {/* Wallet Connect / User Menu */}
            <div className="flex items-center ml-2">
              {!isAuthenticated ? (
                <button
                  onClick={connectAndAuth}
                  className="bg-gh-canvas-default hover:bg-gh-canvas-subtle text-gh-fg-default font-medium px-4 py-1.5 rounded-gh border border-gh-border-default text-sm transition-colors"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="relative p-1.5 hover:bg-gh-canvas-subtle rounded-gh transition-colors">
                    <svg className="w-5 h-5 text-gh-fg-default" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16ZM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.519 1.519 0 0 1 13.482 13H2.518a1.516 1.516 0 0 1-1.263-2.36l1.703-2.554A.255.255 0 0 0 3 7.947Zm5-3.5A3.5 3.5 0 0 0 4.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.017.017 0 0 0-.003.01l.001.006c0 .002.002.004.004.006l.006.004.007.001h10.964l.007-.001.006-.004.004-.006.001-.007a.017.017 0 0 0-.003-.01l-1.703-2.554a1.745 1.745 0 0 1-.294-.97V5A3.5 3.5 0 0 0 8 1.5Z"></path>
                    </svg>
                  </button>
                  
                  <Link
                    href={`/profile/${user?.walletAddress}`}
                    className="flex items-center hover:bg-gh-canvas-subtle rounded-gh p-1 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#0969da] flex items-center justify-center text-white text-xs font-semibold">
                      {user?.username?.[0]?.toUpperCase() || address?.[2]?.toUpperCase() || 'U'}
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
