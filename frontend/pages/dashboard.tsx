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
          {/* Welcome Banner */}
          <div className="card-gh p-6 mb-6 bg-gradient-to-r from-gh-canvas-default to-gh-canvas-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gh-fg-default mb-2">
                  Welcome, {user.username || user.walletAddress?.slice(0, 8)}
                </h1>
                <p className="text-gh-fg-muted text-sm font-mono">{user.walletAddress}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#0969da] flex items-center justify-center text-white text-2xl font-bold">
                {user.username?.[0]?.toUpperCase() || user.walletAddress?.[2]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card-gh p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gh-fg-muted text-sm">Repositories</span>
                <svg className="w-5 h-5 text-gh-fg-muted" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z"></path>
                </svg>
              </div>
              <p className="text-3xl font-bold text-gh-fg-default">{repositories.length}</p>
            </div>

            <div className="card-gh p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gh-fg-muted text-sm">Stars</span>
                <svg className="w-5 h-5 text-gh-fg-muted" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                </svg>
              </div>
              <p className="text-3xl font-bold text-gh-fg-default">
                {repositories.reduce((sum, repo) => sum + (repo.stars || 0), 0)}
              </p>
            </div>

            <div className="card-gh p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gh-fg-muted text-sm">Contributions</span>
                <svg className="w-5 h-5 text-gh-fg-muted" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                </svg>
              </div>
              <p className="text-3xl font-bold text-gh-fg-default">{user.totalContributions || 0}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-gh p-6 mb-8">
            <h2 className="text-lg font-semibold text-gh-fg-default mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/create-repo')}
                className="flex items-center gap-3 p-4 bg-gh-canvas-subtle hover:bg-gh-canvas-inset rounded-md transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gh-success-subtle flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7.75 0a.75.75 0 0 1 .75.75V3h2.25a.75.75 0 0 1 0 1.5H8.5v2.25a.75.75 0 0 1-1.5 0V4.5H4.75a.75.75 0 0 1 0-1.5H7V.75A.75.75 0 0 1 7.75 0Z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gh-fg-default">Create Repository</p>
                  <p className="text-xs text-gh-fg-muted">Upload a new project</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/explore')}
                className="flex items-center gap-3 p-4 bg-gh-canvas-subtle hover:bg-gh-canvas-inset rounded-md transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gh-accent-subtle flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gh-accent-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.5 4.5 0 1 0-8.997.001A4.5 4.5 0 0 0 11.5 7Z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gh-fg-default">Explore Repos</p>
                  <p className="text-xs text-gh-fg-muted">Discover projects</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/tools/recovery')}
                className="flex items-center gap-3 p-4 bg-gh-canvas-subtle hover:bg-gh-canvas-inset rounded-md transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gh-attention-subtle flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gh-attention-emphasis" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gh-fg-default">Recovery Tool</p>
                  <p className="text-xs text-gh-fg-muted">Rebuild from blockchain</p>
                </div>
              </button>
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
