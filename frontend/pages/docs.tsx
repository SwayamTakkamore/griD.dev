import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'creating-repository', title: 'Creating Repository' },
    { id: 'commit-system', title: 'Commit System' },
    { id: 'smart-contracts', title: 'Smart Contracts' },
    { id: 'recovery', title: 'Recovery Mechanism' },
    { id: 'api-reference', title: 'API Reference' },
  ];

  return (
    <>
      <Head>
        <title>Documentation - griD.dev</title>
        <meta name="description" content="Complete documentation for griD.dev platform" />
      </Head>

      <div className="bg-gh-canvas-default min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0">
              <div className="sticky top-8">
                <h2 className="text-lg font-semibold text-gh-fg-default mb-4">Documentation</h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSection(section.id);
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-gh-canvas-subtle text-gh-fg-default font-medium'
                          : 'text-gh-fg-muted hover:text-gh-fg-default hover:bg-gh-canvas-subtle'
                      }`}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl">
              {/* Getting Started */}
              <section id="getting-started" className="mb-16">
                <h1 className="text-3xl font-bold text-gh-fg-default mb-6">Getting Started</h1>
                
                <div className="card-gh p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">Prerequisites</h2>
                  <ul className="list-disc list-inside space-y-2 text-gh-fg-muted">
                    <li>MetaMask or compatible Web3 wallet</li>
                    <li>Story Aeneid testnet configured</li>
                    <li>Test IP tokens from faucet</li>
                  </ul>
                </div>

                <div className="card-gh p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">Wallet Setup</h2>
                  <div className="space-y-4 text-gh-fg-muted">
                    <p><strong className="text-gh-fg-default">Network Details:</strong></p>
                    <div className="bg-gh-canvas-subtle p-4 rounded-md font-mono text-sm">
                      <p>Network Name: Story Aeneid Testnet</p>
                      <p>Chain ID: 1315 (0x523)</p>
                      <p>RPC URL: https://aeneid.storyrpc.io</p>
                      <p>Explorer: https://aeneid.storyscan.io</p>
                      <p>Currency: IP</p>
                    </div>
                  </div>
                </div>

                <div className="card-gh p-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">Get Test Tokens</h2>
                  <p className="text-gh-fg-muted mb-4">
                    Visit the Story Aeneid faucet to get free IP tokens for testing:
                  </p>
                  <a
                    href="https://aeneid.faucet.story.foundation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gh-btn-bg hover:bg-gh-btn-hover-bg text-gh-btn-text px-4 py-2 rounded-md transition-colors"
                  >
                    Open Testnet Faucet →
                  </a>
                </div>
              </section>

              {/* Creating Repository */}
              <section id="creating-repository" className="mb-16">
                <h1 className="text-3xl font-bold text-gh-fg-default mb-6">Creating Repository</h1>
                
                <div className="card-gh p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">Step-by-Step Guide</h2>
                  <ol className="list-decimal list-inside space-y-4 text-gh-fg-muted">
                    <li>
                      <strong className="text-gh-fg-default">Connect Wallet</strong>
                      <p className="ml-6 mt-2">Click "Connect Wallet" and approve the connection in MetaMask</p>
                    </li>
                    <li>
                      <strong className="text-gh-fg-default">Navigate to Create</strong>
                      <p className="ml-6 mt-2">Go to Dashboard → Create Repository</p>
                    </li>
                    <li>
                      <strong className="text-gh-fg-default">Fill Details</strong>
                      <p className="ml-6 mt-2">Enter repository name, description, and upload .zip file (max 50MB)</p>
                    </li>
                    <li>
                      <strong className="text-gh-fg-default">Submit</strong>
                      <p className="ml-6 mt-2">Click "Upload + Register" and confirm transaction in MetaMask</p>
                    </li>
                  </ol>
                </div>

                <div className="card-gh p-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">What Happens Behind the Scenes</h2>
                  <div className="space-y-3 text-gh-fg-muted">
                    <div className="flex items-start gap-3">
                      <span className="text-gh-success-emphasis">1.</span>
                      <span>File uploaded to IPFS via Pinata (decentralized storage)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gh-success-emphasis">2.</span>
                      <span>IP Asset registered on Story Protocol (blockchain ownership)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gh-success-emphasis">3.</span>
                      <span>Metadata saved to MongoDB (fast queries)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gh-success-emphasis">4.</span>
                      <span>Smart contract transaction (permanent on-chain record)</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Commit System */}
              <section id="commit-system" className="mb-16">
                <h1 className="text-3xl font-bold text-gh-fg-default mb-6">Commit System</h1>
                
                <div className="card-gh p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">How Commits Work</h2>
                  <p className="text-gh-fg-muted mb-4">
                    Each commit creates a new IPFS snapshot and updates the on-chain record:
                  </p>
                  <div className="bg-gh-canvas-subtle p-4 rounded-md">
                    <pre className="text-sm text-gh-fg-muted overflow-x-auto">
{`Commit Flow:
1. Upload new .zip file
2. Generate IPFS CID
3. Call updateRepository() on smart contract
4. Store metadata in MongoDB
5. Update commit history`}
                    </pre>
                  </div>
                </div>

                <div className="card-gh p-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">Commit Metadata</h2>
                  <p className="text-gh-fg-muted">Each commit stores:</p>
                  <ul className="list-disc list-inside space-y-2 text-gh-fg-muted mt-4">
                    <li>New IPFS CID (content hash)</li>
                    <li>Story Protocol IP ID</li>
                    <li>Timestamp (blockchain immutable)</li>
                    <li>Commit message</li>
                    <li>Contributor address</li>
                  </ul>
                </div>
              </section>

              {/* Smart Contracts */}
              <section id="smart-contracts" className="mb-16">
                <h1 className="text-3xl font-bold text-gh-fg-default mb-6">Smart Contracts</h1>
                
                <div className="card-gh p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">RepositoryRegistry Contract</h2>
                  <p className="text-gh-fg-muted mb-4">
                    Deployed on Story Aeneid Testnet
                  </p>
                  <div className="bg-gh-canvas-subtle p-4 rounded-md font-mono text-sm">
                    <p className="text-gh-fg-muted">Address:</p>
                    <p className="text-gh-accent-emphasis break-all">0x59e4338E9da115A04603D1C11b8BD20F97f4e3B0</p>
                  </div>
                  <a
                    href="https://github.com/SwayamTakkamore/griD.dev/blob/main/contracts/contracts/RepositoryRegistry.sol"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-gh-accent-fg hover:underline"
                  >
                    View Contract on GitHub →
                  </a>
                </div>

                <div className="card-gh p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">Key Functions</h2>
                  <div className="space-y-4">
                    <div className="bg-gh-canvas-subtle p-4 rounded-md">
                      <code className="text-gh-accent-emphasis">createRepository(repoId, ipfsCid, storyIpId)</code>
                      <p className="text-sm text-gh-fg-muted mt-2">Register new repository on-chain</p>
                    </div>
                    <div className="bg-gh-canvas-subtle p-4 rounded-md">
                      <code className="text-gh-accent-emphasis">updateRepository(repoId, newIpfsCid, newStoryIpId)</code>
                      <p className="text-sm text-gh-fg-muted mt-2">Update repository after commits</p>
                    </div>
                    <div className="bg-gh-canvas-subtle p-4 rounded-md">
                      <code className="text-gh-accent-emphasis">transferOwnership(repoId, newOwner)</code>
                      <p className="text-sm text-gh-fg-muted mt-2">Transfer repository ownership</p>
                    </div>
                    <div className="bg-gh-canvas-subtle p-4 rounded-md">
                      <code className="text-gh-accent-emphasis">getRepository(repoId)</code>
                      <p className="text-sm text-gh-fg-muted mt-2">Query repository data</p>
                    </div>
                  </div>
                </div>

                <div className="card-gh p-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">Events</h2>
                  <div className="space-y-3 text-sm">
                    <div className="bg-gh-canvas-subtle p-3 rounded-md">
                      <code className="text-gh-accent-emphasis">RepositoryCreated</code>
                      <p className="text-gh-fg-muted mt-1">Emitted when new repo is created</p>
                    </div>
                    <div className="bg-gh-canvas-subtle p-3 rounded-md">
                      <code className="text-gh-accent-emphasis">RepositoryUpdated</code>
                      <p className="text-gh-fg-muted mt-1">Emitted when repo is updated</p>
                    </div>
                    <div className="bg-gh-canvas-subtle p-3 rounded-md">
                      <code className="text-gh-accent-emphasis">OwnershipTransferred</code>
                      <p className="text-gh-fg-muted mt-1">Emitted when ownership changes</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Recovery Mechanism */}
              <section id="recovery" className="mb-16">
                <h1 className="text-3xl font-bold text-gh-fg-default mb-6">Recovery Mechanism</h1>
                
                <div className="card-gh p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">How Recovery Works</h2>
                  <p className="text-gh-fg-muted mb-4">
                    If MongoDB database is lost or corrupted, all data can be recovered from blockchain:
                  </p>
                  <div className="space-y-3 text-gh-fg-muted">
                    <div className="flex items-start gap-3">
                      <span className="text-gh-success-emphasis">→</span>
                      <span>Script scans all RepositoryCreated events from smart contract</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gh-success-emphasis">→</span>
                      <span>Rebuilds MongoDB records from blockchain data</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gh-success-emphasis">→</span>
                      <span>Enriches with IPFS metadata</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gh-success-emphasis">→</span>
                      <span>Non-destructive (skips existing records)</span>
                    </div>
                  </div>
                </div>

                <div className="card-gh p-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">Running Recovery</h2>
                  <div className="bg-gh-canvas-subtle p-4 rounded-md">
                    <pre className="text-sm text-gh-fg-muted overflow-x-auto">
{`cd backend
node scripts/recover-from-blockchain.js

# Or from specific block:
node scripts/recover-from-blockchain.js 1000000`}
                    </pre>
                  </div>
                  <p className="text-sm text-gh-fg-muted mt-4">
                    💡 Tip: Admin users can also use the web-based recovery tool at <Link href="/tools/recovery" className="text-gh-accent-fg hover:underline">/tools/recovery</Link>
                  </p>
                </div>
              </section>

              {/* API Reference */}
              <section id="api-reference" className="mb-16">
                <h1 className="text-3xl font-bold text-gh-fg-default mb-6">API Reference</h1>
                
                <div className="card-gh p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">Authentication</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gh-success-subtle text-gh-success-fg text-xs font-semibold rounded">POST</span>
                        <code className="text-sm">/api/auth/login</code>
                      </div>
                      <p className="text-sm text-gh-fg-muted">Wallet-based login with signature verification</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gh-success-subtle text-gh-success-fg text-xs font-semibold rounded">POST</span>
                        <code className="text-sm">/api/auth/verify</code>
                      </div>
                      <p className="text-sm text-gh-fg-muted">Verify JWT token</p>
                    </div>
                  </div>
                </div>

                <div className="card-gh p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">Repositories</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gh-success-subtle text-gh-success-fg text-xs font-semibold rounded">POST</span>
                        <code className="text-sm">/api/repositories</code>
                      </div>
                      <p className="text-sm text-gh-fg-muted">Create new repository</p>
                      <details className="mt-2">
                        <summary className="text-sm text-gh-accent-fg cursor-pointer hover:underline">View example</summary>
                        <div className="bg-gh-canvas-subtle p-3 rounded-md mt-2">
                          <pre className="text-xs text-gh-fg-muted overflow-x-auto">
{`curl -X POST https://grid.dev/api/repositories \\
  -H "Authorization: Bearer <token>" \\
  -F "file=@repo.zip" \\
  -F "title=My Project" \\
  -F "description=Description"`}
                          </pre>
                        </div>
                      </details>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gh-accent-subtle text-gh-accent-fg text-xs font-semibold rounded">GET</span>
                        <code className="text-sm">/api/repositories/:id</code>
                      </div>
                      <p className="text-sm text-gh-fg-muted">Get repository details</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gh-accent-subtle text-gh-accent-fg text-xs font-semibold rounded">GET</span>
                        <code className="text-sm">/api/repositories/user/:wallet</code>
                      </div>
                      <p className="text-sm text-gh-fg-muted">Get user's repositories</p>
                    </div>
                  </div>
                </div>

                <div className="card-gh p-6">
                  <h2 className="text-xl font-semibold text-gh-fg-default mb-4">User</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gh-accent-subtle text-gh-accent-fg text-xs font-semibold rounded">GET</span>
                        <code className="text-sm">/api/users/:wallet</code>
                      </div>
                      <p className="text-sm text-gh-fg-muted">Get user profile</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gh-attention-subtle text-gh-attention-fg text-xs font-semibold rounded">PUT</span>
                        <code className="text-sm">/api/users/:wallet</code>
                      </div>
                      <p className="text-sm text-gh-fg-muted">Update user profile</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Back to top */}
              <div className="text-center py-8">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-gh-accent-fg hover:underline"
                >
                  ↑ Back to top
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
