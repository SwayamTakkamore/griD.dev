import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - griD.dev</title>
        <meta name="description" content="griD.dev Privacy Policy - How we handle your data" />
      </Head>

      <div className="bg-gh-canvas-default min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="text-sm text-gh-accent-fg hover:underline inline-flex items-center gap-1 mb-4"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>
              </svg>
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gh-fg-default mb-3">Privacy Policy</h1>
            <p className="text-gh-fg-muted">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="card-gh p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">Introduction</h2>
              <p className="text-gh-fg-muted leading-relaxed mb-3">
                Welcome to griD.dev ("we," "our," or "us"). We are committed to protecting your privacy 
                and being transparent about how we handle your data. This Privacy Policy explains our 
                practices regarding the collection, use, and disclosure of information when you use our 
                decentralized code hosting platform.
              </p>
              <div className="bg-gh-accent-subtle border border-gh-accent-emphasis rounded-gh p-4 text-sm">
                <p className="text-gh-accent-fg">
                  <strong>Important:</strong> griD.dev is a decentralized application. Much of your data is 
                  stored on public blockchains (Story Protocol) and decentralized file systems (IPFS), 
                  which are inherently transparent and immutable.
                </p>
              </div>
            </section>

            {/* What We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">1. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-gh-fg-default mb-3 mt-4">1.1 Blockchain Data (Public)</h3>
              <p className="text-gh-fg-muted mb-3">
                When you use griD.dev, the following information is stored on public blockchains and IPFS:
              </p>
              <ul className="list-disc list-inside text-gh-fg-muted space-y-2 ml-4">
                <li>Your wallet address (public identifier)</li>
                <li>Repository metadata (title, description, tags, license type)</li>
                <li>Repository code files uploaded to IPFS (public or private based on your choice)</li>
                <li>IPFS Content Identifiers (CIDs) for your uploaded files</li>
                <li>IP Asset IDs registered on Story Protocol</li>
                <li>Timestamps of all transactions and uploads</li>
                <li>Contribution history and commit records</li>
              </ul>
              <div className="bg-gh-attention-subtle border border-gh-attention-emphasis rounded-gh p-3 text-sm mt-3">
                <p className="text-gh-attention-fg">
                  ⚠️ <strong>Note:</strong> Data stored on blockchain and IPFS is permanent and publicly 
                  accessible. We cannot delete or modify this data once it's been uploaded.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gh-fg-default mb-3 mt-6">1.2 Off-Chain Data (MongoDB)</h3>
              <p className="text-gh-fg-muted mb-3">
                We cache certain metadata in our MongoDB database for performance and user experience:
              </p>
              <ul className="list-disc list-inside text-gh-fg-muted space-y-2 ml-4">
                <li>Username and profile information</li>
                <li>Repository search indexes</li>
                <li>User activity statistics (stars, forks, contributions)</li>
                <li>Session data for logged-in users</li>
              </ul>
              <p className="text-gh-fg-muted mt-3">
                This data can be deleted upon request, but note that blockchain records remain permanent.
              </p>

              <h3 className="text-lg font-semibold text-gh-fg-default mb-3 mt-6">1.3 Automatically Collected Data</h3>
              <ul className="list-disc list-inside text-gh-fg-muted space-y-2 ml-4">
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>IP address (not stored, used only for rate limiting)</li>
                <li>Usage patterns and interaction logs</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">2. How We Use Your Information</h2>
              <p className="text-gh-fg-muted mb-3">We use the collected information to:</p>
              <ul className="list-disc list-inside text-gh-fg-muted space-y-2 ml-4">
                <li>Provide and maintain the griD.dev platform</li>
                <li>Register your repositories as IP assets on Story Protocol</li>
                <li>Store your code files on IPFS for decentralized access</li>
                <li>Enable search, discovery, and filtering of repositories</li>
                <li>Display user profiles and contribution statistics</li>
                <li>Prevent abuse and ensure platform security</li>
                <li>Improve our services and develop new features</li>
                <li>Communicate important updates and changes</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">3. Data Sharing and Disclosure</h2>
              
              <h3 className="text-lg font-semibold text-gh-fg-default mb-3">3.1 Public Blockchain Data</h3>
              <p className="text-gh-fg-muted mb-3">
                All data stored on Story Protocol blockchain and IPFS is public by design. Anyone can:
              </p>
              <ul className="list-disc list-inside text-gh-fg-muted space-y-2 ml-4">
                <li>View your wallet address and transaction history</li>
                <li>Access repository metadata and IP asset registrations</li>
                <li>Download code files from IPFS using the CID</li>
                <li>Verify ownership and licensing information on-chain</li>
              </ul>

              <h3 className="text-lg font-semibold text-gh-fg-default mb-3 mt-6">3.2 Third-Party Services</h3>
              <p className="text-gh-fg-muted mb-3">We use the following third-party services:</p>
              <ul className="list-disc list-inside text-gh-fg-muted space-y-2 ml-4">
                <li><strong>Pinata (IPFS):</strong> For decentralized file storage</li>
                <li><strong>Story Protocol:</strong> For IP asset registration on blockchain</li>
                <li><strong>MetaMask/Web3 Wallets:</strong> For wallet authentication</li>
                <li><strong>MongoDB Atlas:</strong> For database hosting (optional cloud service)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gh-fg-default mb-3 mt-6">3.3 Legal Requirements</h3>
              <p className="text-gh-fg-muted">
                We may disclose your information if required by law, subpoena, or other legal process, 
                or if we believe disclosure is necessary to protect our rights or the safety of others.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">4. Data Security</h2>
              <p className="text-gh-fg-muted mb-3">
                We implement reasonable security measures to protect your off-chain data:
              </p>
              <ul className="list-disc list-inside text-gh-fg-muted space-y-2 ml-4">
                <li>Encrypted database connections</li>
                <li>Secure API endpoints with authentication</li>
                <li>Regular security audits and updates</li>
                <li>Rate limiting to prevent abuse</li>
              </ul>
              <p className="text-gh-fg-muted mt-3">
                However, blockchain and IPFS data are secured by their respective networks. We cannot 
                guarantee absolute security of on-chain or decentralized data.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">5. Your Rights and Choices</h2>
              
              <h3 className="text-lg font-semibold text-gh-fg-default mb-3">5.1 Access and Control</h3>
              <ul className="list-disc list-inside text-gh-fg-muted space-y-2 ml-4">
                <li><strong>Wallet Control:</strong> You control your wallet and can disconnect at any time</li>
                <li><strong>Data Access:</strong> You can view all your blockchain data using block explorers</li>
                <li><strong>Profile Deletion:</strong> Request deletion of off-chain profile data via email</li>
                <li><strong>Repository Management:</strong> You can transfer or manage repository ownership on-chain</li>
              </ul>

              <h3 className="text-lg font-semibold text-gh-fg-default mb-3 mt-6">5.2 Limitations</h3>
              <div className="bg-gh-attention-subtle border border-gh-attention-emphasis rounded-gh p-4">
                <p className="text-gh-attention-fg text-sm">
                  <strong>Important Limitation:</strong> We cannot delete or modify data already published 
                  to blockchain or IPFS. This includes repository files, metadata, and transaction records. 
                  Please carefully consider what you upload, as it will be permanent and public.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">6. Children's Privacy</h2>
              <p className="text-gh-fg-muted">
                griD.dev is not intended for users under the age of 13 (or the minimum age in your jurisdiction). 
                We do not knowingly collect information from children. If you believe we have collected data 
                from a child, please contact us immediately.
              </p>
            </section>

            {/* International Users */}
            <section>
              <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">7. International Users</h2>
              <p className="text-gh-fg-muted mb-3">
                griD.dev is a decentralized platform accessible globally. By using our services, you 
                acknowledge that:
              </p>
              <ul className="list-disc list-inside text-gh-fg-muted space-y-2 ml-4">
                <li>Your data may be processed in different jurisdictions</li>
                <li>Blockchain data is distributed globally across network nodes</li>
                <li>IPFS data may be stored on nodes in various countries</li>
                <li>Data protection laws may vary by region</li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">8. Cookies and Tracking</h2>
              <p className="text-gh-fg-muted mb-3">
                We use minimal tracking technologies:
              </p>
              <ul className="list-disc list-inside text-gh-fg-muted space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> For session management and authentication</li>
                <li><strong>Local Storage:</strong> To save user preferences and wallet connection state</li>
                <li><strong>No Third-Party Analytics:</strong> We do not use Google Analytics or similar services</li>
              </ul>
              <p className="text-gh-fg-muted mt-3">
                You can clear cookies and local storage at any time through your browser settings.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">9. Changes to This Policy</h2>
              <p className="text-gh-fg-muted">
                We may update this Privacy Policy from time to time. We will notify users of significant 
                changes by posting a notice on our homepage or through other appropriate channels. Continued 
                use of griD.dev after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gh-fg-default mb-4">10. Contact Us</h2>
              <p className="text-gh-fg-muted mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or your data, 
                please contact us:
              </p>
              <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-gh p-4">
                <p className="text-gh-fg-default text-sm mb-2">
                  <strong>Email:</strong> <a href="mailto:privacy@grid.dev" className="text-gh-accent-fg hover:underline">privacy@grid.dev</a>
                </p>
                <p className="text-gh-fg-default text-sm mb-2">
                  <strong>GitHub Issues:</strong> <a href="https://github.com/your-org/grid/issues" target="_blank" rel="noopener noreferrer" className="text-gh-accent-fg hover:underline">Report privacy concerns</a>
                </p>
                <p className="text-gh-fg-muted text-xs mt-3">
                  For urgent data deletion requests or security concerns, please mark your email as [URGENT].
                </p>
              </div>
            </section>

            {/* Decentralization Notice */}
            <section className="border-t border-gh-border-default pt-6 mt-6">
              <div className="bg-gh-accent-subtle border-2 border-gh-accent-emphasis rounded-gh p-6">
                <h3 className="text-lg font-semibold text-gh-accent-fg mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25ZM8 4a.75.75 0 0 1 .75.75v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5A.75.75 0 0 1 8 4Z"></path>
                  </svg>
                  Understanding Decentralization
                </h3>
                <p className="text-gh-fg-default text-sm leading-relaxed">
                  griD.dev is built on decentralized technologies (blockchain and IPFS). This means that 
                  much of your data is <strong>not controlled by us</strong> but by distributed networks. 
                  While this provides benefits like censorship resistance and permanent availability, it 
                  also means that once data is published, it <strong>cannot be deleted or modified</strong>. 
                  Please be mindful of what you share on griD.dev.
                </p>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="text-center pt-6 border-t border-gh-border-default">
              <p className="text-sm text-gh-fg-muted">
                By using griD.dev, you acknowledge that you have read, understood, and agree to this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
