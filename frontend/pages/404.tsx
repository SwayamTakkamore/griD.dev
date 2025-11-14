import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404: This page could not be found - griD</title>
      </Head>

      <div className="bg-gh-canvas-default min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <svg
            className="w-32 h-32 mx-auto mb-6 text-gh-fg-muted"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.5 4.5 0 1 0-8.999.001A4.5 4.5 0 0 0 11.5 7Z"></path>
          </svg>
          
          <h1 className="text-4xl font-bold text-gh-fg-default mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gh-fg-default mb-4">
            This is not the web page you are looking for.
          </h2>
          <p className="text-gh-fg-muted mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Try going back to the home page.
          </p>
          
          <div className="flex gap-3 justify-center">
            <Link href="/" className="btn-gh-primary">
              Go home
            </Link>
            <Link href="/explore" className="btn-gh-secondary">
              Explore repositories
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
