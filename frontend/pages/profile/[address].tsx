import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRepository } from '@/hooks/useRepository';
import RepoCard from '@/components/RepoCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Repository } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { address } = router.query;
  const { getUserRepositories, loading } = useRepository();
  const [repositories, setRepositories] = useState<Repository[]>([]);

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

      <div className="bg-gh-canvas-default min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-[#0969da] flex items-center justify-center text-white text-2xl font-bold">
                {address?.[2]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gh-fg-default">
                  {address ? formatAddress(address as string) : 'Unknown User'}
                </h1>
                <p className="text-gh-fg-muted text-sm font-mono">{address}</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <span className="text-gh-fg-muted">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                </svg>
                <strong className="text-gh-fg-default">{repositories.length}</strong> repositories
              </span>
            </div>
          </div>

          {/* Repositories Section */}
          <div className="border-t border-gh-border-default pt-6">
            <h2 className="text-base font-semibold text-gh-fg-default mb-4">
              Repositories
            </h2>

            {repositories.length === 0 ? (
              <div className="card-gh p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gh-fg-muted" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                </svg>
                <h3 className="text-xl font-semibold text-gh-fg-default mb-2">
                  No repositories yet
                </h3>
                <p className="text-gh-fg-muted text-sm">
                  This user hasn't created any repositories
                </p>
              </div>
            ) : (
              <div className="card-gh">
                {repositories.map((repo, index) => (
                  <div key={repo._id} className={index !== 0 ? 'border-t border-gh-border-default' : ''}>
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
