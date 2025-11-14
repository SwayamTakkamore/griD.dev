import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRepository } from '@/hooks/useRepository';
import RepoCard from '@/components/RepoCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Repository } from '@/types';

export default function Explore() {
  const { getAllRepositories, loading } = useRepository();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLicense, setSelectedLicense] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRepositories();
  }, [page, selectedLicense]);

  const loadRepositories = async () => {
    const result = await getAllRepositories({
      page,
      limit: 12,
      search: searchTerm,
      license: selectedLicense,
    });
    setRepositories(result.repositories);
    setTotalPages(result.totalPages);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadRepositories();
  };

  return (
    <>
      <Head>
        <title>Explore Repositories - griD.dev</title>
      </Head>

      <div className="bg-gh-canvas-default min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gh-fg-default mb-2">
              Explore repositories
            </h1>
            <p className="text-gh-fg-muted text-sm">
              Discover code repositories with blockchain-verified IP ownership
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search repositories..."
                className="input-gh flex-1"
              />
              <select
                value={selectedLicense}
                onChange={(e) => {
                  setSelectedLicense(e.target.value);
                  setPage(1);
                }}
                className="input-gh"
              >
                <option value="">All licenses</option>
                <option value="open">Open</option>
                <option value="restricted">Restricted</option>
                <option value="paid">Paid</option>
              </select>
              <button
                type="submit"
                className="btn-gh-primary"
              >
                Search
              </button>
            </form>
          </div>

          {/* Results */}
          {loading ? (
            <LoadingSpinner message="Loading repositories..." />
          ) : repositories.length === 0 ? (
            <div className="card-gh p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gh-fg-muted" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.5 4.5 0 1 0-8.999.001A4.5 4.5 0 0 0 11.5 7Z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-gh-fg-default mb-2">
                No repositories found
              </h3>
              <p className="text-gh-fg-muted text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="card-gh mb-6">
                <div className="px-4 py-3 border-b border-gh-border-default">
                  <h2 className="text-sm font-semibold text-gh-fg-default">
                    {repositories.length} repositories
                  </h2>
                </div>
                {repositories.map((repo, index) => (
                  <div key={repo._id} className={index !== 0 ? 'border-t border-gh-border-default' : ''}>
                    <RepoCard repo={repo} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-gh-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gh-fg-muted px-3">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn-gh-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
