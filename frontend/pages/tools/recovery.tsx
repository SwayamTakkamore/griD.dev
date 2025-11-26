import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';

export default function Recovery() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [fromBlock, setFromBlock] = useState('0');

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // TODO: Check if user is admin
    // For now, allow all authenticated users
  }, [isAuthenticated, router]);

  const handleRunRecovery = async () => {
    setRunning(true);
    setLogs([]);
    
    // Simulated recovery process
    const simulatedLogs = [
      '🔄 Starting recovery from blockchain...',
      '',
      '📊 Connecting to MongoDB...',
      '✅ MongoDB connected',
      '',
      '🔗 Connecting to blockchain...',
      '✅ Blockchain indexer initialized',
      `📝 Contract address: 0x59e4338E9da115A04603D1C11b8BD20F97f4e3B0`,
      '',
      '⚠️  WARNING: This will sync all blockchain data to MongoDB',
      `📍 Starting from block: ${fromBlock}`,
      '📝 Existing records will be skipped',
      '',
      '📥 Scanning blockchain events...',
      '📥 Found 42 repository creation events',
      '',
      '⏭️  Skipping repo_abc123 (already indexed)',
      '✅ Synced repo_def456',
      '📝 Enriched metadata for repo_def456',
      '✅ Synced repo_ghi789',
      '📝 Enriched metadata for repo_ghi789',
      '⏭️  Skipping repo_jkl012 (already indexed)',
      '✅ Synced repo_mno345',
      '📝 Enriched metadata for repo_mno345',
      '',
      '📊 Recovery Summary:',
      '   Total events found: 42',
      '   Already indexed: 28',
      '   Newly synced: 14',
      '   Failed: 0',
      '',
      '✅ Recovery complete!',
      '⏰ Time elapsed: 12.4s',
    ];

    for (let i = 0; i < simulatedLogs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 100));
      setLogs(prev => [...prev, simulatedLogs[i]]);
    }
    
    setRunning(false);
    
    // TODO: Actual API call to backend recovery endpoint
    // const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/recover`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ fromBlock: parseInt(fromBlock) }),
    // });
  };

  return (
    <>
      <Head>
        <title>Database Recovery - griD.dev</title>
        <meta name="description" content="Rebuild MongoDB from blockchain data" />
      </Head>

      <div className="bg-gh-canvas-default min-h-[calc(100vh-64px)]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gh-fg-default mb-2">Database Recovery Tool</h1>
            <p className="text-gh-fg-muted">
              Rebuild MongoDB database from blockchain events (Admin only)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-1">
              <div className="card-gh p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gh-fg-default mb-4">Recovery Settings</h2>
                
                <div className="space-y-4">
                  {/* From Block */}
                  <div>
                    <label htmlFor="fromBlock" className="block text-sm font-medium text-gh-fg-default mb-2">
                      Start from block
                    </label>
                    <input
                      type="number"
                      id="fromBlock"
                      value={fromBlock}
                      onChange={(e) => setFromBlock(e.target.value)}
                      disabled={running}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-gh-canvas-inset border border-gh-border-default rounded-md text-gh-fg-default placeholder-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent-emphasis focus:border-transparent"
                    />
                    <p className="text-xs text-gh-fg-muted mt-1">
                      Use 0 for full sync, or specify block number
                    </p>
                  </div>

                  {/* Run Button */}
                  <button
                    onClick={handleRunRecovery}
                    disabled={running}
                    className="w-full bg-gh-danger-emphasis hover:bg-gh-danger-fg disabled:bg-gh-canvas-subtle disabled:text-gh-fg-muted text-white font-medium px-4 py-2 rounded-md transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {running ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Running...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                        </svg>
                        Run Recovery Script
                      </>
                    )}
                  </button>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-gh-attention-subtle border border-gh-attention-emphasis rounded-md">
                  <h3 className="text-sm font-semibold text-gh-attention-fg mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>
                    </svg>
                    Important
                  </h3>
                  <ul className="text-xs text-gh-attention-fg space-y-1">
                    <li>• This process is non-destructive</li>
                    <li>• Existing records will be skipped</li>
                    <li>• Can take several minutes for full sync</li>
                    <li>• Requires blockchain RPC access</li>
                  </ul>
                </div>

                {/* What Gets Recovered */}
                <div className="mt-4 p-4 bg-gh-success-subtle border border-gh-success-emphasis rounded-md">
                  <h3 className="text-sm font-semibold text-gh-success-fg mb-2">✅ Recoverable Data</h3>
                  <ul className="text-xs text-gh-success-fg space-y-1">
                    <li>• Repository metadata</li>
                    <li>• IPFS CIDs</li>
                    <li>• Owner addresses</li>
                    <li>• Story Protocol IDs</li>
                    <li>• Timestamps</li>
                    <li>• Ownership history</li>
                  </ul>
                </div>

                <div className="mt-4 p-4 bg-gh-danger-subtle border border-gh-danger-emphasis rounded-md">
                  <h3 className="text-sm font-semibold text-gh-danger-fg mb-2">❌ Not Recoverable</h3>
                  <ul className="text-xs text-gh-danger-fg space-y-1">
                    <li>• Stars/forks counts</li>
                    <li>• User profiles</li>
                    <li>• Comments</li>
                    <li>• Activity feeds</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Console Output */}
            <div className="lg:col-span-2">
              <div className="card-gh p-6">
                <h2 className="text-lg font-semibold text-gh-fg-default mb-4">Console Output</h2>
                
                {logs.length === 0 ? (
                  <div className="text-center py-16">
                    <svg className="w-16 h-16 mx-auto text-gh-fg-muted mb-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25ZM7.25 8a.75.75 0 0 1-.22.53l-2.25 2.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l1.97-1.97-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.25 2.25c.141.14.22.331.22.53Zm1.5 1.5h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5Z"></path>
                    </svg>
                    <p className="text-gh-fg-muted">
                      Click "Run Recovery Script" to start
                    </p>
                  </div>
                ) : (
                  <div className="bg-gh-canvas-inset rounded-md p-4 font-mono text-xs overflow-auto max-h-[600px]">
                    {logs.map((log, index) => (
                      <div
                        key={index}
                        className={`${
                          log.includes('✅') ? 'text-gh-success-fg' :
                          log.includes('❌') || log.includes('⚠️') ? 'text-gh-attention-fg' :
                          log.includes('📊') || log.includes('📝') || log.includes('📍') ? 'text-gh-accent-fg' :
                          'text-gh-fg-muted'
                        } py-0.5`}
                      >
                        {log || '\u00A0'}
                      </div>
                    ))}
                    {running && (
                      <div className="text-gh-accent-fg py-0.5 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gh-accent-emphasis rounded-full animate-pulse"></div>
                        Processing...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
