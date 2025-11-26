import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { ethers } from 'ethers';

interface LicenseTemplate {
  id: string;
  name: string;
  description: string;
  priceWei: string;
  terms: any;
}

interface BuyLicenseModalProps {
  repoId: string;
  templates: LicenseTemplate[];
  onClose: () => void;
  onSuccess: (licenseId: string) => void;
}

export default function BuyLicenseModal({ repoId, templates, onClose, onSuccess }: BuyLicenseModalProps) {
  const { address, provider } = useWallet();
  const [selectedTemplate, setSelectedTemplate] = useState<LicenseTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handlePurchase = async () => {
    if (!selectedTemplate || !provider || !address) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Contract address from env
      const licenseManagerAddress = process.env.NEXT_PUBLIC_LICENSE_MANAGER_ADDRESS;
      if (!licenseManagerAddress) throw new Error('License Manager address not configured');
      
      const abi = [
        'function purchaseLicense(uint256 repoId, uint256 templateId) payable returns (uint256)'
      ];
      
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(licenseManagerAddress, abi, signer);
      
      // Call purchaseLicense
      console.log('Purchasing license...');
      const tx = await contract.purchaseLicense(repoId, selectedTemplate.id, {
        value: selectedTemplate.priceWei
      });
      
      console.log('Transaction sent:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Extract licenseId from event
      const event = receipt.logs.find((log: any) => log.topics[0] === ethers.id('LicenseMinted(uint256,uint256,address,uint256)'));
      const licenseId = event ? ethers.BigNumber.from(event.topics[1]).toString() : 'unknown';
      
      onSuccess(licenseId);
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gh-fg-default">Buy License</h2>
          <button onClick={onClose} className="text-gh-fg-muted hover:text-gh-fg-default">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
            </svg>
          </button>
        </div>
        
        {!address ? (
          <div className="text-center py-6">
            <p className="text-gh-fg-muted mb-4">Connect your wallet to purchase a license</p>
            <button className="btn-gh-primary">Connect Wallet</button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {templates.map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-4 border rounded-gh cursor-pointer transition ${
                    selectedTemplate?.id === template.id
                      ? 'border-gh-accent-emphasis bg-gh-accent-subtle'
                      : 'border-gh-border-default hover:border-gh-accent-fg'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gh-fg-default">{template.name}</h3>
                    <span className="text-sm font-medium text-gh-accent-fg">
                      {ethers.formatEther(template.priceWei)} ETH
                    </span>
                  </div>
                  <p className="text-sm text-gh-fg-muted">{template.description}</p>
                </div>
              ))}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-gh-danger-subtle border border-gh-danger-emphasis rounded-gh text-sm text-gh-danger-fg">
                {error}
              </div>
            )}
            
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-gh-secondary flex-1">Cancel</button>
              <button
                onClick={handlePurchase}
                disabled={!selectedTemplate || loading}
                className="btn-gh-primary flex-1"
              >
                {loading ? 'Processing...' : 'Purchase License'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
