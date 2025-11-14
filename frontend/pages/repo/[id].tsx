import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRepository } from '@/hooks/useRepository';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Repository } from '@/types';

export default function RepoPage() {
  const router = useRouter();
  const { id } = router.query;
  const { getRepository, loading } = useRepository();
  const [repo, setRepo] = useState<Repository | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadRepository(id);
    }
  }, [id]);

  const loadRepository = async (repoId: string) => {
    try {
      const repository = await getRepository(repoId);
      setRepo(repository);
    } catch (error) {
      console.error('Failed to load repository:', error);
      router.push('/dashboard');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (loading || !repo) {
    return <LoadingSpinner message="Loading repository..." />;
  }

  return (
    <>
      <Head>
        <title>{repo.title} - griD</title>
      </Head>

      <div className="bg-gh-canvas-default min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-6">
          {/* Repository Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-gh-fg-muted" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
              </svg>
              <span className="text-gh-fg-muted text-sm">{formatAddress(repo.owner)} /</span>
              <h1 className="text-xl font-semibold text-gh-accent-fg">
                {repo.title}
              </h1>
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
            
            <p className="text-gh-fg-muted text-sm mb-4">{repo.description}</p>

            {/* Navigation Tabs */}
            <div className="border-b border-gh-border-default">
              <nav className="flex gap-4 -mb-px">
                <button className="px-4 py-2 text-sm font-semibold text-gh-fg-default border-b-2 border-gh-accent-emphasis">
                  <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Z"></path>
                  </svg>
                  Code
                </button>
              </nav>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 mb-6 text-sm">
            <button className="flex items-center gap-1 text-gh-fg-muted hover:text-gh-accent-fg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
              </svg>
              <strong>{repo.stars}</strong> stars
            </button>
            <button className="flex items-center gap-1 text-gh-fg-muted hover:text-gh-accent-fg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
              </svg>
              <strong>{repo.forks}</strong> forks
            </button>
            <span className="text-gh-fg-muted">
              <strong>{repo.contributors?.length || 0}</strong> contributors
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* About */}
              <div className="card-gh p-4">
                <h2 className="text-base font-semibold text-gh-fg-default mb-3">About</h2>
                <p className="text-sm text-gh-fg-muted mb-4">{repo.description}</p>
                {repo.tags && repo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {repo.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-gh text-xs font-medium bg-gh-accent-subtle text-gh-accent-fg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* IP Asset Information */}
              {repo.ipAssetRegistered && (
                <div className="card-gh p-4 border-l-4 border-gh-success-emphasis">
                  <h2 className="text-base font-semibold text-gh-fg-default mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                    </svg>
                    IP Asset Verified on Story Protocol
                  </h2>
                  <p className="text-sm text-gh-fg-muted mb-3">
                    This repository is registered as an IP asset on Story Protocol blockchain with immutable proof of ownership.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="bg-gh-canvas-subtle p-3 rounded-gh">
                      <span className="text-gh-fg-muted">IP Asset ID:</span>
                      <p className="font-mono text-gh-fg-default break-all mt-1">{repo.ipAssetId}</p>
                    </div>
                    {repo.ipAssetTxHash && (
                      <div className="bg-gh-canvas-subtle p-3 rounded-gh">
                        <span className="text-gh-fg-muted">Transaction Hash:</span>
                        <p className="font-mono text-gh-fg-default break-all mt-1">{repo.ipAssetTxHash}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* IPFS Information */}
              <div className="card-gh p-4">
                <h2 className="text-base font-semibold text-gh-fg-default mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                  </svg>
                  Decentralized Storage (IPFS)
                </h2>
                <div className="bg-gh-canvas-subtle p-3 rounded-gh mb-3">
                  <span className="text-xs text-gh-fg-muted">IPFS CID:</span>
                  <p className="font-mono text-sm text-gh-fg-default break-all mt-1">{repo.ipfsCid}</p>
                </div>
                <a
                  href={repo.ipfsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gh-primary inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.106.157-.106.294a4.78 4.78 0 0 1 0 .772c0 .137.057.246.106.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.106-.157.106-.294a4.771 4.771 0 0 1 0-.772c0-.137-.057-.246-.106-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"></path>
                  </svg>
                  Download from IPFS
                </a>
              </div>

              {/* Contributors */}
              {repo.contributors && repo.contributors.length > 0 && (
                <div className="card-gh p-4">
                  <h2 className="text-base font-semibold text-gh-fg-default mb-3">
                    Contributors {repo.contributors.length}
                  </h2>
                  <div className="space-y-2">
                    {repo.contributors.map((contributor, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#0969da] flex items-center justify-center text-white text-sm font-semibold">
                            {contributor.walletAddress?.[2]?.toUpperCase() || 'U'}
                          </div>
                          <span className="font-mono text-sm text-gh-fg-default">
                            {formatAddress(contributor.walletAddress)}
                          </span>
                        </div>
                        <span className="text-xs text-gh-fg-muted">
                          {contributor.contributions} commit{contributor.contributions !== 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* About */}
              <div className="card-gh p-4">
                <h3 className="text-sm font-semibold text-gh-fg-default mb-3">About</h3>
                <div className="space-y-3 text-sm">
                  {repo.fileName && (
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gh-fg-muted mt-0.5" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z"></path>
                      </svg>
                      <div className="flex-1">
                        <span className="text-gh-fg-muted text-xs">Filename</span>
                        <p className="text-gh-fg-default font-mono text-xs break-all">{repo.fileName}</p>
                      </div>
                    </div>
                  )}
                  {repo.fileSize && (
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gh-fg-muted mt-0.5" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                      </svg>
                      <div className="flex-1">
                        <span className="text-gh-fg-muted text-xs">Size</span>
                        <p className="text-gh-fg-default">{(repo.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gh-fg-muted mt-0.5" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                    </svg>
                    <div className="flex-1">
                      <span className="text-gh-fg-muted text-xs">Created</span>
                      <p className="text-gh-fg-default">{formatDate(repo.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card-gh p-4">
                <button
                  className="btn-gh-secondary w-full mb-2"
                  onClick={() => router.push('/dashboard')}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
