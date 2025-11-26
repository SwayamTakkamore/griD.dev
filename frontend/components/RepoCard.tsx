import React from 'react';
import Link from 'next/link';
import { Repository } from '@/types';
import { PixelGem, PixelStar } from './PixelDecor';

interface RepoCardProps {
  repo: Repository;
  onBuy?: (repo: Repository) => void;
  onRequestAccess?: (repo: Repository) => void;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo, onBuy, onRequestAccess }) => {
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

  return (
    <div className="card-gh p-5 mb-4 hover:border-gh-accent-fg hover:translate-x-1 transition-all">
      <div className="flex gap-4">
        {/* Repo Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gh-accent-muted border-2 border-gh-accent-fg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
              <rect x="4" y="0" width="16" height="4" />
              <rect x="0" y="4" width="4" height="16" />
              <rect x="20" y="4" width="4" height="16" />
              <rect x="4" y="20" width="16" height="4" />
              <rect x="8" y="8" width="8" height="8" opacity="0.6" />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href={`/repo/${repo.repoId}`}
              className="text-gh-accent-fg hover:text-gh-accent-emphasis font-bold text-xl uppercase tracking-wide"
            >
              {repo.title}
            </Link>
            {repo.ipAssetRegistered && (
              <span className="pixel-badge bg-gh-success-muted text-gh-success-fg border-gh-success-fg animate-pixel-pulse">
                <PixelStar className="inline-block w-3 h-3 mr-1" />
                VERIFIED
              </span>
            )}
            <span className={`pixel-badge ${
              repo.licenseType === 'open' ? 'bg-gh-success-subtle text-gh-success-fg border-gh-success-fg' :
              repo.licenseType === 'restricted' ? 'bg-gh-attention-subtle text-gh-attention-fg border-gh-attention-fg' :
              'bg-gh-accent-subtle text-gh-accent-fg border-gh-accent-fg'
            }`}>
              {repo.licenseType}
            </span>
          </div>

          {/* Description */}
          <p className="text-gh-fg-muted text-lg mb-4 line-clamp-2 font-retro">
            {repo.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-base text-gh-fg-muted font-retro">
              {/* Tags */}
              {repo.tags && repo.tags.length > 0 && (
                <>
                  {repo.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1">
                      <PixelGem className="w-3 h-3" />
                      <span className="text-gh-accent-fg font-bold">{tag}</span>
                    </span>
                  ))}
                </>
              )}
              {/* Stars */}
              <span className="inline-flex items-center gap-2">
                <PixelStar className="w-4 h-4 text-gh-attention-fg" />
                <span className="font-bold">{repo.stars}</span>
              </span>
              {/* Forks */}
              <span className="inline-flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
                  <rect x="6" y="0" width="4" height="4" />
                  <rect x="0" y="6" width="4" height="4" />
                  <rect x="12" y="6" width="4" height="4" />
                  <rect x="6" y="12" width="4" height="4" />
                </svg>
                <span className="font-bold">{repo.forks}</span>
              </span>
            </div>

            {/* Action Buttons (if handlers provided) */}
            {(onBuy || onRequestAccess) && (
              <div className="flex gap-3">
                {onRequestAccess && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onRequestAccess(repo);
                    }}
                    className="btn-gh-secondary text-sm px-4 py-2"
                  >
                    ACCESS
                  </button>
                )}
                {onBuy && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onBuy(repo);
                    }}
                    className="btn-gh-primary text-sm px-4 py-2"
                  >
                    BUY
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
