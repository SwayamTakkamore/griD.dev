// Blockchain Verification Badge Component
import { useState } from 'react';
import { PixelGem } from './PixelDecor';

interface VerificationBadgeProps {
  ipAssetId?: string;
  lastSynced?: string;
  blockchainVerified?: boolean;
  repoId?: string;
}

export function VerificationBadge({ 
  ipAssetId, 
  lastSynced, 
  blockchainVerified = false,
  repoId 
}: VerificationBadgeProps) {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(blockchainVerified);
  const [lastChecked, setLastChecked] = useState<Date | null>(
    lastSynced ? new Date(lastSynced) : null
  );

  const handleVerify = async () => {
    if (!ipAssetId || verifying) return;

    setVerifying(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sync/verify/${ipAssetId}`
      );
      const data = await response.json();

      if (data.success && data.verification.verified) {
        setVerified(true);
        setLastChecked(new Date());
      } else {
        setVerified(false);
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleSync = async () => {
    if (!repoId || verifying) return;

    setVerifying(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/repo/${repoId}/sync`,
        { method: 'POST' }
      );
      const data = await response.json();

      if (data.success) {
        setVerified(true);
        setLastChecked(new Date());
        // Reload page to show updated data
        window.location.reload();
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setVerifying(false);
    }
  };

  const getTimeSinceSync = () => {
    if (!lastChecked) return 'Never';
    
    const seconds = Math.floor((Date.now() - lastChecked.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (!ipAssetId) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gh-attention-subtle border-2 border-gh-attention-emphasis rounded-gh text-sm">
        <span className="text-gh-attention-fg">⚠️ Not on blockchain</span>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col gap-2">
      <div className={`inline-flex items-center gap-2 px-4 py-2 border-2 rounded-gh text-sm ${
        verified 
          ? 'bg-gh-success-subtle border-gh-success-emphasis' 
          : 'bg-gh-canvas-subtle border-gh-border-default'
      }`}>
        <PixelGem className={verified ? 'text-gh-success-fg' : 'text-gh-fg-muted'} />
        <div className="flex flex-col">
          <span className={verified ? 'text-gh-success-fg font-bold' : 'text-gh-fg-muted'}>
            {verified ? '✅ Blockchain Verified' : '⏳ Cache Only'}
          </span>
          <span className="text-xs text-gh-fg-muted">
            Last synced: {getTimeSinceSync()}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleVerify}
          disabled={verifying}
          className="px-3 py-1 bg-gh-accent-emphasis text-white text-xs rounded-gh hover:bg-gh-accent-fg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {verifying ? '🔄 Verifying...' : '🔐 Verify Now'}
        </button>

        <button
          onClick={handleSync}
          disabled={verifying}
          className="px-3 py-1 bg-gh-canvas-subtle border border-gh-border-default text-gh-fg-default text-xs rounded-gh hover:bg-gh-canvas-inset disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {verifying ? '🔄 Syncing...' : '🔄 Sync from Blockchain'}
        </button>
      </div>

      <div className="text-xs text-gh-fg-muted bg-gh-canvas-inset p-2 rounded-gh border border-gh-border-muted">
        <strong>🔒 Decentralized Architecture:</strong>
        <br />
        • Primary: Story Protocol (Blockchain)
        <br />
        • Cache: MongoDB (30-day TTL)
        <br />
        • Storage: IPFS (Encrypted)
      </div>
    </div>
  );
}

// Repository List Item with Verification Status
interface RepoListItemProps {
  repo: any;
  onClick?: () => void;
}

export function RepoListItemWithVerification({ repo, onClick }: RepoListItemProps) {
  return (
    <div 
      onClick={onClick}
      className="p-4 bg-gh-canvas-default border-2 border-gh-border-default rounded-gh hover:border-gh-accent-emphasis transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gh-fg-default mb-2">
            {repo.title}
          </h3>
          <p className="text-gh-fg-muted text-sm mb-3">
            {repo.description?.substring(0, 100)}
            {repo.description?.length > 100 && '...'}
          </p>
          
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-2 py-1 bg-gh-accent-subtle text-gh-accent-fg text-xs rounded-gh border border-gh-accent-emphasis">
              {repo.licenseType?.toUpperCase() || 'OPEN'}
            </span>
            
            {repo.blockchainVerified && (
              <span className="px-2 py-1 bg-gh-success-subtle text-gh-success-fg text-xs rounded-gh border border-gh-success-emphasis flex items-center gap-1">
                <PixelGem className="text-gh-success-fg" />
                Verified
              </span>
            )}

            {!repo.blockchainVerified && repo.ipAssetId && (
              <span className="px-2 py-1 bg-gh-canvas-subtle text-gh-fg-muted text-xs rounded-gh border border-gh-border-muted">
                ⏳ Cached
              </span>
            )}

            <span className="text-xs text-gh-fg-muted">
              {new Date(repo.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {repo.ipAssetId && (
          <div className="ml-4">
            <div className="p-2 bg-gh-canvas-subtle rounded-gh border border-gh-border-default">
              <div className="text-xs text-gh-fg-muted mb-1">IP Asset ID</div>
              <code className="text-xs text-gh-accent-fg">
                {repo.ipAssetId.substring(0, 8)}...
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
