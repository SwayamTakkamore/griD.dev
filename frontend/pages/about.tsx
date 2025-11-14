import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About - griD</title>
        <meta
          name="description"
          content="Learn about griD - the decentralized code repository platform with blockchain-verified IP ownership"
        />
      </Head>

      <div className="bg-gh-canvas-default min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gh-fg-default mb-6">
              About griD
            </h1>
            
            <div className="space-y-6 text-gh-fg-muted">
              <p className="text-lg leading-relaxed">
                griD is a revolutionary decentralized code hosting platform that combines the best of 
                traditional version control with blockchain technology and decentralized storage.
              </p>

              <div className="card-gh p-6">
                <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">Our Mission</h2>
                <p className="leading-relaxed">
                  We believe that code is intellectual property that deserves immutable proof of ownership and 
                  creation. griD integrates with Story Protocol to provide blockchain-verified IP registration 
                  for every repository, ensuring that developers can prove their work and protect their rights.
                </p>
              </div>

              <div className="card-gh p-6">
                <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">Key Features</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gh-success-emphasis mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                    </svg>
                    <div>
                      <strong className="text-gh-fg-default">IP Protection:</strong> Every repository is registered 
                      as an IP asset on Story Protocol blockchain, providing immutable proof of ownership.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gh-success-emphasis mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                    </svg>
                    <div>
                      <strong className="text-gh-fg-default">Decentralized Storage:</strong> Your code is stored on 
                      IPFS, making it censorship-resistant and always available.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gh-success-emphasis mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                    </svg>
                    <div>
                      <strong className="text-gh-fg-default">Web3 Authentication:</strong> Connect with your wallet 
                      - no passwords, no emails, just cryptographic signatures.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gh-success-emphasis mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                    </svg>
                    <div>
                      <strong className="text-gh-fg-default">Flexible Licensing:</strong> Choose between open, 
                      restricted, or paid licensing models with automated royalty distribution.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gh-success-emphasis mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
                    </svg>
                    <div>
                      <strong className="text-gh-fg-default">Contribution Tracking:</strong> All contributions are 
                      tracked on-chain, building verifiable reputation.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="card-gh p-6">
                <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">Technology Stack</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gh-fg-default mb-2">Frontend</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Next.js 14</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS</li>
                      <li>• Ethers.js</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gh-fg-default mb-2">Backend</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Node.js & Express</li>
                      <li>• MongoDB</li>
                      <li>• IPFS Storage</li>
                      <li>• Story Protocol SDK</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card-gh p-6 bg-gh-accent-subtle border-gh-accent-emphasis/30">
                <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">Get Started</h2>
                <p className="mb-4">
                  Ready to protect your code with blockchain-verified IP ownership? Connect your wallet and 
                  start uploading your repositories today.
                </p>
                <div className="flex gap-3">
                  <Link href="/explore" className="btn-gh-primary">
                    Explore Repositories
                  </Link>
                  <Link href="/create-repo" className="btn-gh-secondary">
                    Create Repository
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
