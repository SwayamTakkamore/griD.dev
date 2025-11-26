import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';

export default function Verify() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Wait a bit for the auth to complete
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (isAuthenticated) {
          setStatus('success');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyAuth();
  }, [isAuthenticated, router]);

  const handleRetry = () => {
    router.push('/auth/login');
  };

  return (
    <>
      <Head>
        <title>Verifying - griD.dev</title>
        <meta name="description" content="Verifying your wallet signature" />
      </Head>

      <div className="bg-gh-canvas-default min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <div className="card-gh p-8 text-center">
            {status === 'verifying' && (
              <>
                {/* Spinner */}
                <div className="mb-6">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gh-border-default border-t-gh-accent-emphasis"></div>
                </div>
                <h1 className="text-2xl font-bold text-gh-fg-default mb-2">
                  Verifying Wallet...
                </h1>
                <p className="text-gh-fg-muted">
                  Please wait while we verify your signature
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                {/* Success Icon */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gh-success-subtle">
                    <svg className="w-8 h-8 text-gh-success-emphasis" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                    </svg>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gh-fg-default mb-2">
                  Verification Successful!
                </h1>
                <p className="text-gh-fg-muted">
                  Redirecting to dashboard...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                {/* Error Icon */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gh-danger-subtle">
                    <svg className="w-8 h-8 text-gh-danger-emphasis" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
                    </svg>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gh-fg-default mb-2">
                  Verification Failed
                </h1>
                <p className="text-gh-fg-muted mb-6">
                  Failed to verify your wallet signature. Please try again.
                </p>
                <button
                  onClick={handleRetry}
                  className="bg-gh-btn-bg hover:bg-gh-btn-hover-bg text-gh-btn-text font-medium px-6 py-2 rounded-md transition-colors"
                >
                  Retry Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
