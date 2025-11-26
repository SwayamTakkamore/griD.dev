import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useRepository } from '@/hooks/useRepository';

export default function CommitUpload() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuthStore();
  const { updateRepository } = useRepository();

  const [file, setFile] = useState<File | null>(null);
  const [commitMessage, setCommitMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{
    ipfs?: boolean;
    story?: boolean;
    mongo?: boolean;
    contract?: boolean;
  }>({});
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      if (!selectedFile.name.endsWith('.zip')) {
        setError('Only .zip files are allowed');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !commitMessage.trim()) {
      setError('Please provide both file and commit message');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      // Simulated multi-step upload
      setStatus({ ipfs: false, story: false, mongo: false, contract: false });
      
      // Step 1: IPFS
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus(prev => ({ ...prev, ipfs: true }));
      
      // Step 2: Story Protocol
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus(prev => ({ ...prev, story: true }));
      
      // Step 3: MongoDB
      await new Promise(resolve => setTimeout(resolve, 800));
      setStatus(prev => ({ ...prev, mongo: true }));
      
      // Step 4: Smart Contract
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus(prev => ({ ...prev, contract: true }));

      // TODO: Actual API call
      // await updateRepository(id as string, file, commitMessage);
      
      setTimeout(() => {
        router.push(`/repo/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Commit upload failed:', err);
      setError('Failed to upload commit. Please try again.');
      setUploading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Upload Commit - griD.dev</title>
        <meta name="description" content="Upload a new commit to your repository" />
      </Head>

      <div className="bg-gh-canvas-default min-h-[calc(100vh-64px)]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Repo Info Bar */}
          <div className="mb-6">
            <a
              href={`/repo/${id}`}
              className="text-sm text-gh-accent-fg hover:underline inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>
              </svg>
              Back to Repository
            </a>
            <h1 className="text-2xl font-bold text-gh-fg-default mt-2">Upload New Commit</h1>
            <p className="text-gh-fg-muted mt-1">Repository ID: {id}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Form */}
            <div className="card-gh p-6">
              <h2 className="text-lg font-semibold text-gh-fg-default mb-4">Commit Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gh-fg-default mb-2">
                    Upload .zip file
                  </label>
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="block w-full text-sm text-gh-fg-muted
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-gh-canvas-subtle file:text-gh-fg-default
                      hover:file:bg-gh-canvas-inset
                      cursor-pointer border border-gh-border-default rounded-md p-2"
                  />
                  {file && (
                    <p className="text-xs text-gh-fg-muted mt-2">
                      Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Commit Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gh-fg-default mb-2">
                    Commit Message
                  </label>
                  <textarea
                    id="message"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    disabled={uploading}
                    placeholder="Describe your changes..."
                    className="w-full px-3 py-2 bg-gh-canvas-inset border border-gh-border-default rounded-md text-gh-fg-default placeholder-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent-emphasis focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-gh-danger-subtle border border-gh-danger-emphasis rounded-md">
                    <p className="text-sm text-gh-danger-fg">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!file || !commitMessage.trim() || uploading}
                  className="w-full bg-gh-btn-bg hover:bg-gh-btn-hover-bg disabled:bg-gh-canvas-subtle disabled:text-gh-fg-muted text-gh-btn-text font-medium px-4 py-2 rounded-md transition-colors disabled:cursor-not-allowed"
                >
                  {uploading ? 'Recording Commit...' : 'Record Commit'}
                </button>
              </form>
            </div>

            {/* Status Panel */}
            <div className="card-gh p-6">
              <h2 className="text-lg font-semibold text-gh-fg-default mb-4">Upload Status</h2>
              
              {!uploading && Object.keys(status).length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gh-fg-muted mb-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-8.5C1 2.784 1.784 2 2.75 2h6.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 9.25 14Zm-.25-1.75c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25h-6.5a.25.25 0 0 0-.25.25ZM5 6h4a.75.75 0 0 1 0 1.5H5A.75.75 0 0 1 5 6Zm0 3h4a.75.75 0 0 1 0 1.5H5A.75.75 0 0 1 5 9Z"></path>
                  </svg>
                  <p className="text-sm text-gh-fg-muted">
                    Fill in the form and submit to see upload progress
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* IPFS Upload */}
                  <div className="flex items-center gap-3">
                    {status.ipfs ? (
                      <svg className="w-5 h-5 text-gh-success-emphasis flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                      </svg>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gh-accent-emphasis border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gh-fg-default">Uploading to IPFS</p>
                      <p className="text-xs text-gh-fg-muted">Decentralized storage</p>
                    </div>
                  </div>

                  {/* Story Protocol */}
                  <div className="flex items-center gap-3">
                    {status.story ? (
                      <svg className="w-5 h-5 text-gh-success-emphasis flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                      </svg>
                    ) : status.ipfs ? (
                      <div className="w-5 h-5 border-2 border-gh-accent-emphasis border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gh-border-default rounded-full flex-shrink-0"></div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gh-fg-default">Updating Story Protocol</p>
                      <p className="text-xs text-gh-fg-muted">IP asset metadata</p>
                    </div>
                  </div>

                  {/* MongoDB */}
                  <div className="flex items-center gap-3">
                    {status.mongo ? (
                      <svg className="w-5 h-5 text-gh-success-emphasis flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                      </svg>
                    ) : status.story ? (
                      <div className="w-5 h-5 border-2 border-gh-accent-emphasis border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gh-border-default rounded-full flex-shrink-0"></div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gh-fg-default">Saving Metadata</p>
                      <p className="text-xs text-gh-fg-muted">Database update</p>
                    </div>
                  </div>

                  {/* Smart Contract */}
                  <div className="flex items-center gap-3">
                    {status.contract ? (
                      <svg className="w-5 h-5 text-gh-success-emphasis flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                      </svg>
                    ) : status.mongo ? (
                      <div className="w-5 h-5 border-2 border-gh-accent-emphasis border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gh-border-default rounded-full flex-shrink-0"></div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gh-fg-default">Writing to Blockchain</p>
                      <p className="text-xs text-gh-fg-muted">Smart contract transaction</p>
                    </div>
                  </div>

                  {/* Success Message */}
                  {status.contract && (
                    <div className="mt-6 p-4 bg-gh-success-subtle border border-gh-success-emphasis rounded-md">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                        </svg>
                        <p className="text-sm font-medium text-gh-success-fg">Commit recorded successfully!</p>
                      </div>
                      <p className="text-xs text-gh-success-fg mt-1 ml-7">Redirecting to repository...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
