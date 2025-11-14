import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useRepository } from '@/hooks/useRepository';
import RepoCard from '@/components/RepoCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Repository } from '@/types';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { getUserRepositories, loading } = useRepository();
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    if (user?.walletAddress) {
      loadRepositories();
    }
  }, [isAuthenticated, user]);

  const loadRepositories = async () => {
    if (user?.walletAddress) {
      const repos = await getUserRepositories(user.walletAddress);
      setRepositories(repos);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard - griD.dev</title>
      </Head>

      <div className="bg-gh-canvas-default min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          {/* User Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-[#0969da] flex items-center justify-center text-white text-2xl font-bold">
                {user.username?.[0]?.toUpperCase() || user.walletAddress?.[2]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gh-fg-default">
                  {user.username || `User ${user.walletAddress?.slice(0, 8) || ''}`}
                </h1>
                <p className="text-gh-fg-muted text-sm font-mono">{user.walletAddress}</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <span className="text-gh-fg-muted">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                </svg>
                <strong className="text-gh-fg-default">{repositories.length}</strong> repositories
              </span>
              <span className="text-gh-fg-muted">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                </svg>
                <strong className="text-gh-fg-default">{user.totalContributions}</strong> contributions
              </span>
            </div>
          </div>

          {/* Repositories Section */}
          <div className="border-t border-gh-border-default pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gh-fg-default">
                Repositories
              </h2>
              <button
                onClick={() => router.push('/create-repo')}
                className="btn-gh-primary"
              >
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M7.75 0a.75.75 0 0 1 .75.75V3h2.25a.75.75 0 0 1 0 1.5H8.5v2.25a.75.75 0 0 1-1.5 0V4.5H4.75a.75.75 0 0 1 0-1.5H7V.75A.75.75 0 0 1 7.75 0Z"></path>
                </svg>
                New
              </button>
            </div>

            {loading ? (
              <LoadingSpinner message="Loading repositories..." />
            ) : repositories.length === 0 ? (
              <div className="card-gh p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gh-fg-muted" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                </svg>
                <h3 className="text-xl font-semibold text-gh-fg-default mb-2">
                  You don't have any repositories yet
                </h3>
                <p className="text-gh-fg-muted mb-6 text-sm">
                  Create your first repository to get started with griD
                </p>
                <button
                  onClick={() => router.push('/create-repo')}
                  className="btn-gh-primary"
                >
                  Create repository
                </button>
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
