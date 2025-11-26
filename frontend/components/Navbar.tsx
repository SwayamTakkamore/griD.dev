import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useWallet } from '@/hooks/useWallet';
import { PixelGem, PixelStar } from './PixelDecor';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isConnected, address, connectAndAuth, disconnect } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleLogout = () => {
    logout();
    disconnect();
    setShowDropdown(false);
    router.push('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gh-canvas-default border-b-4 border-gh-border-default px-4 py-3 shadow-gh">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo - Inventory Slot Style */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-14 h-14 bg-white border border-black rounded-lg flex items-center justify-center group-hover:shadow-md transition-all overflow-hidden p-2">
                <img 
                  src="/logo.svg" 
                  alt="griD.dev Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error('Logo failed to load');
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-2xl font-pixel text-gh-accent-fg hidden md:block tracking-wider">griD.dev</span>
            </Link>
          </div>

          {/* Navigation Links - Inventory Hotbar Style */}
          <nav className="flex items-center gap-2">
            {/* Explore */}
            <Link
              href="/explore"
              className="px-6 py-3 bg-gh-canvas-subtle border-4 border-gh-border-default hover:border-gh-accent-fg shadow-gh transition-all hover:translate-y-[-2px] group"
            >
              <span className="text-lg font-bold text-gh-accent-fg group-hover:text-gh-accent-emphasis uppercase tracking-wider">
                EXPLORE
              </span>
            </Link>

            {/* About */}
            <Link
              href="/about"
              className="px-6 py-3 bg-gh-canvas-subtle border-4 border-gh-border-default hover:border-gh-attention-fg shadow-gh transition-all hover:translate-y-[-2px] group"
            >
              <span className="text-lg font-bold text-gh-attention-fg group-hover:text-gh-attention-emphasis uppercase tracking-wider">
                ABOUT
              </span>
            </Link>

            {isAuthenticated && (
              <>
                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-gh-canvas-subtle border-4 border-gh-border-default hover:border-gh-success-fg shadow-gh transition-all hover:translate-y-[-2px] group"
                >
                  <span className="text-lg font-bold text-gh-success-fg group-hover:text-gh-success-emphasis uppercase tracking-wider">
                    DASHBOARD
                  </span>
                </Link>

                {/* Create Repo */}
                <Link
                  href="/create-repo"
                  className="px-6 py-3 bg-gh-success-muted border-4 border-gh-success-fg hover:border-gh-success-emphasis shadow-gh transition-all hover:translate-y-[-2px] animate-pixel-pulse"
                >
                  <span className="text-lg font-bold text-gh-success-emphasis uppercase tracking-wider">
                    CREATE
                  </span>
                </Link>
              </>
            )}

            {/* Wallet Connect / User Menu - Coin Pouch Style */}
            <div className="flex items-center ml-4 gap-2">
              {!isAuthenticated ? (
                <button
                  onClick={connectAndAuth}
                  className="btn-gh-primary px-6 py-3 text-lg inline-flex items-center gap-2 shadow-gh-md"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
                    <rect x="4" y="0" width="12" height="4" />
                    <rect x="0" y="4" width="4" height="12" />
                    <rect x="16" y="4" width="4" height="12" />
                    <rect x="4" y="16" width="12" height="4" />
                    <rect x="6" y="6" width="8" height="8" opacity="0.7" />
                  </svg>
                  CONNECT
                </button>
              ) : (
                <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                  {/* Notification Bell - Item Slot */}
                  <button className="w-12 h-12 bg-gh-canvas-subtle border-4 border-gh-border-default hover:border-gh-attention-fg flex items-center justify-center shadow-gh transition-all relative">
                    <svg width="20" height="20" viewBox="0 0 20 20" className="text-gh-attention-fg" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
                      <rect x="8" y="0" width="4" height="4" />
                      <rect x="4" y="4" width="12" height="4" />
                      <rect x="2" y="8" width="16" height="8" />
                      <rect x="6" y="16" width="8" height="4" />
                    </svg>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gh-danger-fg border-2 border-gh-canvas-default flex items-center justify-center text-xs font-bold">
                      0
                    </span>
                  </button>
                  
                  {/* User Avatar - Character Portrait */}
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-14 h-14 bg-gh-accent-muted border-4 border-gh-accent-fg hover:border-gh-accent-emphasis flex items-center justify-center shadow-gh transition-all"
                  >
                    <span className="text-2xl font-pixel text-gh-accent-emphasis">
                      {user?.username?.[0]?.toUpperCase() || address?.[2]?.toUpperCase() || 'U'}
                    </span>
                  </button>

                  {/* Dropdown Menu - Inventory Panel Style */}
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-3 w-80 bg-gh-canvas-default border-4 border-gh-border-default shadow-gh-lg z-50">
                      {/* User Info Header - Character Stats */}
                      <div className="px-5 py-4 bg-gh-canvas-subtle border-b-4 border-gh-border-default">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gh-accent-muted border-2 border-gh-accent-fg flex items-center justify-center">
                            <span className="text-2xl font-pixel text-gh-accent-emphasis">
                              {user?.username?.[0]?.toUpperCase() || address?.[2]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-xl font-bold text-gh-fg-default uppercase tracking-wide">
                              {user?.username || 'Adventurer'}
                            </p>
                            <p className="text-sm text-gh-fg-muted font-retro">
                              {formatAddress(user?.walletAddress || address || '')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <PixelGem className="w-4 h-4" />
                          <div className="flex-1 h-3 bg-gh-canvas-inset border-2 border-gh-border-muted">
                            <div className="h-full bg-gh-accent-fg" style={{ width: '100%' }}></div>
                          </div>
                          <span className="text-xs font-bold text-gh-accent-fg">LEVEL 1</span>
                        </div>
                      </div>

                      {/* Menu Items - Inventory Slots */}
                      <div className="p-3 space-y-2">
                        <Link
                          href={`/profile/${user?.walletAddress}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 bg-gh-canvas-subtle border-2 border-gh-border-default hover:border-gh-accent-fg hover:bg-gh-canvas-inset transition-all"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gh-accent-fg" style={{ imageRendering: 'pixelated' }}>
                            <rect x="6" y="0" width="8" height="4" />
                            <rect x="4" y="4" width="12" height="12" />
                            <rect x="8" y="8" width="4" height="4" opacity="0.7" />
                          </svg>
                          <span className="text-lg font-bold uppercase tracking-wide">PROFILE</span>
                        </Link>

                        <Link
                          href="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 bg-gh-canvas-subtle border-2 border-gh-border-default hover:border-gh-success-fg hover:bg-gh-canvas-inset transition-all"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gh-success-fg" style={{ imageRendering: 'pixelated' }}>
                            <rect x="2" y="4" width="16" height="12" />
                            <rect x="0" y="8" width="20" height="2" opacity="0.5" />
                            <rect x="8" y="10" width="4" height="4" opacity="0.7" />
                          </svg>
                          <span className="text-lg font-bold uppercase tracking-wide">DASHBOARD</span>
                        </Link>

                        <Link
                          href="/docs"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 bg-gh-canvas-subtle border-2 border-gh-border-default hover:border-gh-attention-fg hover:bg-gh-canvas-inset transition-all"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gh-attention-fg" style={{ imageRendering: 'pixelated' }}>
                            <rect x="4" y="0" width="12" height="4" />
                            <rect x="2" y="4" width="16" height="12" />
                            <rect x="6" y="8" width="8" height="2" opacity="0.7" />
                            <rect x="6" y="12" width="6" height="2" opacity="0.7" />
                          </svg>
                          <span className="text-lg font-bold uppercase tracking-wide">GUIDE</span>
                        </Link>
                      </div>

                      <div className="border-t-4 border-gh-border-default"></div>

                      {/* Logout - Danger Slot */}
                      <div className="p-3">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 bg-gh-danger-muted border-2 border-gh-danger-fg hover:border-gh-danger-emphasis hover:bg-gh-danger-emphasis/20 transition-all w-full"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gh-danger-emphasis" style={{ imageRendering: 'pixelated' }}>
                            <rect x="0" y="4" width="8" height="12" />
                            <rect x="12" y="8" width="8" height="4" />
                            <rect x="14" y="6" width="4" height="2" />
                            <rect x="14" y="12" width="4" height="2" />
                          </svg>
                          <span className="text-lg font-bold uppercase tracking-wide text-gh-danger-emphasis">LOGOUT</span>
                        </button>
                      </div>
                    </div>
                  )}
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
