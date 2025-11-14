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
            <Link href="/" className="flex items-center">
              <svg height="32" width="32" viewBox="0 0 16 16" fill="currentColor" className="text-gh-fg-default">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
              <span className="ml-2 text-gh-fg-default font-semibold text-xl">griD</span>
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
