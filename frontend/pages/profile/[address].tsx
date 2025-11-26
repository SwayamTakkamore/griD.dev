import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRepository } from '@/hooks/useRepository';
import RepoCard from '@/components/RepoCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Repository } from '@/types';
import { PixelGem, PixelStar, PixelDivider } from '@/components/PixelDecor';

export default function ProfilePage() {
  const router = useRouter();
  const { address } = router.query;
  const { getUserRepositories, loading } = useRepository();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [bio, setBio] = useState('⛏️ Mining the deepest caves for legendary code artifacts...');
  const [isEditingBio, setIsEditingBio] = useState(false);

  useEffect(() => {
    if (address && typeof address === 'string') {
      loadRepositories(address);
    }
  }, [address]);

  const loadRepositories = async (walletAddress: string) => {
    try {
      const repos = await getUserRepositories(walletAddress);
      setRepositories(repos);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <>
      <Head>
        <title>{address ? formatAddress(address as string) : 'Profile'} - griD</title>
      </Head>

      <div className="min-h-screen py-12">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* Profile Header - Character Card Style */}
          <div className="card-gh p-6 mb-6">
            <div className="flex items-start gap-4 mb-6">
              {/* Character Portrait */}
              <div className="w-16 h-16 border-4 border-accent-fg bg-accent-muted flex items-center justify-center shadow-gh flex-shrink-0">
                <span className="text-3xl font-pixel text-accent-emphasis">
                  {address?.[2]?.toUpperCase() || 'U'}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-pixel text-accent-fg uppercase tracking-wider">
                    CODE MINER
                  </h1>
                  <PixelStar />
                  <div className="pixel-badge bg-success-fg text-canvas-default text-sm">
                    LVL {repositories.length + 1}
                  </div>
                </div>
                
                {/* XP Bar */}
                <div className="flex items-center gap-2 mb-3">
                  <PixelGem color="#00e5cc" />
                  <div className="flex-1 h-3 border-2 border-accent-fg bg-canvas-inset">
                    <div className="h-full bg-accent-fg" style={{ width: `${Math.min((repositories.length * 20) + 15, 100)}%` }}></div>
                  </div>
                  <span className="text-sm font-pixel text-accent-fg">{repositories.length * 20 + 15} XP</span>
                </div>

                <p className="text-base font-retro text-fg-muted">
                  ⛏️ Mining the deepest caves for legendary code artifacts...
                </p>
              </div>
            </div>

            {/* Profile Stats Grid - Compact Inventory Slots */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Wallet Address Slot */}
              <div className="md:col-span-2 border-4 border-attention-fg p-3 bg-canvas-subtle hover:border-attention-emphasis transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 border-2 border-attention-fg bg-canvas-inset flex items-center justify-center">
                    <span className="text-lg">👛</span>
                  </div>
                  <span className="text-sm font-pixel text-attention-fg uppercase">WALLET ID</span>
                </div>
                <p className="text-xs font-retro text-fg-muted break-all leading-relaxed">
                  {address}
                </p>
              </div>

              {/* Repos Owned Slot */}
              <div className="border-4 border-success-fg p-3 bg-canvas-subtle hover:border-success-emphasis transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 border-2 border-success-fg bg-canvas-inset flex items-center justify-center">
                    <span className="text-lg">📦</span>
                  </div>
                  <span className="text-sm font-pixel text-success-fg uppercase">VAULTS</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-pixel text-success-fg">{repositories.length}</span>
                  <span className="text-sm font-retro text-fg-muted">OWNED</span>
                </div>
              </div>

              {/* Member Since Slot */}
              <div className="border-4 border-accent-fg p-3 bg-canvas-subtle hover:border-accent-emphasis transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 border-2 border-accent-fg bg-canvas-inset flex items-center justify-center">
                    <span className="text-lg">📅</span>
                  </div>
                  <span className="text-sm font-pixel text-accent-fg uppercase">JOINED</span>
                </div>
                <p className="text-base font-pixel text-accent-fg leading-tight">
                  {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Bio Section - Editable */}
            <div className="mt-4 p-4 border-4 border-canvas-inset bg-canvas-inset">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📜</span>
                  <span className="text-sm font-pixel text-fg-default uppercase">MINER'S LOG</span>
                </div>
                <button
                  onClick={() => setIsEditingBio(!isEditingBio)}
                  className="px-3 py-1 border-2 border-accent-fg bg-canvas-default hover:bg-accent-subtle text-xs font-pixel text-accent-fg uppercase transition-colors"
                >
                  {isEditingBio ? '💾 SAVE' : '✏️ EDIT'}
                </button>
              </div>
              {isEditingBio ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input-gh w-full text-base font-retro resize-none"
                  rows={4}
                  maxLength={300}
                  placeholder="Write your miner's story..."
                />
              ) : (
                <p className="text-base font-retro text-fg-muted leading-relaxed">
                  {bio}
                </p>
              )}
              {isEditingBio && (
                <p className="text-xs font-retro text-fg-muted mt-2 text-right">
                  {bio.length}/300 characters
                </p>
              )}
            </div>
          </div>

          {/* Repositories Section - Treasure Vault */}
          <div className="card-gh p-4">
            <div className="flex items-center gap-3 mb-4">
              <PixelGem color="#ffd700" />
              <h2 className="text-2xl font-pixel text-attention-fg uppercase tracking-wider">
                📦 TREASURE VAULT
              </h2>
              <PixelGem color="#ffd700" />
              <span className="ml-auto text-base font-pixel text-fg-muted">
                {repositories.length} VAULT{repositories.length !== 1 ? 'S' : ''}
              </span>
            </div>

            {repositories.length === 0 ? (
              <div className="border-4 border-fg-muted p-12 text-center bg-canvas-subtle">
                {/* Empty Chest */}
                <div className="w-24 h-24 mx-auto mb-6 opacity-20">
                  <svg viewBox="0 0 64 64">
                    <rect x="8" y="20" width="48" height="32" fill="#8b7355" stroke="#000" strokeWidth="2"/>
                    <rect x="12" y="24" width="40" height="24" fill="#a0826d" stroke="#000" strokeWidth="2"/>
                    <rect x="28" y="32" width="8" height="8" fill="#666" stroke="#000" strokeWidth="2"/>
                    <rect x="0" y="16" width="64" height="4" fill="#6b5345"/>
                    <rect x="0" y="52" width="64" height="4" fill="#6b5345"/>
                  </svg>
                </div>
                <h3 className="text-xl font-pixel text-fg-muted mb-3 uppercase tracking-wider">
                  EMPTY VAULT
                </h3>
                <p className="text-lg font-retro text-fg-muted">
                  No treasures collected yet...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {repositories.map((repo, index) => (
                  <div key={repo._id}>
                    <RepoCard repo={repo} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
