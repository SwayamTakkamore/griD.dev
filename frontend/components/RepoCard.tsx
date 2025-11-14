import React from 'react';
import Link from 'next/link';
import { Repository } from '@/types';

interface RepoCardProps {
  repo: Repository;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getLicenseBadgeColor = (license: string) => {
    switch (license) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'restricted':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border-b border-gh-border-default py-6 hover:bg-gh-canvas-subtle transition-colors">
      <div className="flex gap-3">
        {/* Repo Icon */}
        <div className="flex-shrink-0">
          <svg className="w-4 h-4 text-gh-fg-muted mt-1" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
          </svg>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/repo/${repo.repoId}`}
              className="text-gh-accent-fg hover:underline font-semibold text-sm"
            >
              {repo.title}
            </Link>
            {repo.ipAssetRegistered && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-gh text-xs font-medium bg-gh-success-muted text-gh-success-fg border border-gh-success-emphasis/30">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                </svg>
                IP Verified
              </span>
            )}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-gh text-xs font-medium border ${
              repo.licenseType === 'open' ? 'bg-gh-success-subtle text-gh-success-fg border-gh-success-emphasis/30' :
              repo.licenseType === 'restricted' ? 'bg-gh-attention-muted text-gh-attention-fg border-gh-attention-emphasis/30' :
              'bg-gh-accent-subtle text-gh-accent-fg border-gh-accent-emphasis/30'
            }`}>
              {repo.licenseType}
            </span>
          </div>

          {/* Description */}
          <p className="text-gh-fg-muted text-xs mb-3 line-clamp-2">
            {repo.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gh-fg-muted">
            {/* Tags */}
            {repo.tags && repo.tags.length > 0 && (
              <>
                {repo.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="inline-flex items-center">
                    <span className="text-gh-accent-fg">#</span>{tag}
                  </span>
                ))}
              </>
            )}
            {/* Stars */}
            <span className="inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
              </svg>
              {repo.stars}
            </span>
            {/* Forks */}
            <span className="inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
              </svg>
              {repo.forks}
            </span>
            {/* Updated */}
            <span>Updated {formatDate(repo.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
