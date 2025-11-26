import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useRepository } from '@/hooks/useRepository';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { PixelGem, PixelStar, PixelDivider } from '@/components/PixelDecor';
import { ParallaxCave } from '@/components/ParallaxCave';

export default function CreateRepo() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { createRepository, loading } = useRepository();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    licenseType: 'open', // open | non-commercial | commercial | commercial-remix | custom
    tags: '',
    priceEth: '',
    thumbnailUrl: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    stage: 'idle' | 'processing' | 'encrypting' | 'uploading' | 'minting' | 'complete';
    message: string;
  }>({ stage: 'idle', message: '' });
  const [licenseTemplates, setLicenseTemplates] = useState([
    { name: 'Free Access', priceEth: '0', description: 'Open source access' },
    { name: 'Personal License', priceEth: '0.01', description: 'For individual developers' },
    { name: 'Commercial License', priceEth: '0.1', description: 'For commercial use' },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Validate total size (100MB limit for all files)
      const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
      if (totalSize > 104857600) {
        toast.error('Total file size must be less than 100MB');
        return;
      }

      setFiles((prev) => [...prev, ...selectedFiles]);
      toast.success(`${selectedFiles.length} file(s) added`);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      
      // Validate total size
      const totalSize = [...files, ...droppedFiles].reduce((sum, file) => sum + file.size, 0);
      if (totalSize > 104857600) {
        toast.error('Total file size must be less than 100MB');
        return;
      }

      setFiles((prev) => [...prev, ...droppedFiles]);
      toast.success(`${droppedFiles.length} file(s) added`);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const handleTemplateChange = (index: number, field: string, value: string) => {
    const updated = [...licenseTemplates];
    updated[index] = { ...updated[index], [field]: value };
    setLicenseTemplates(updated);
  };

  const addLicenseTemplate = () => {
    if (licenseTemplates.length < 5) {
      setLicenseTemplates([...licenseTemplates, { name: '', priceEth: '', description: '' }]);
    }
  };

  const removeLicenseTemplate = (index: number) => {
    if (licenseTemplates.length > 1) {
      setLicenseTemplates(licenseTemplates.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.walletAddress) {
      toast.error('Please connect your wallet first');
      router.push('/');
      return;
    }

    if (!formData.title || !formData.description || files.length === 0) {
      toast.error('Please fill in all fields and upload at least one file');
      return;
    }

    if ((formData.licenseType === 'commercial' || formData.licenseType === 'commercial-remix') && !formData.priceEth) {
      toast.error('Please set a price for commercial license');
      return;
    }

    try {
      setUploadProgress({ stage: 'processing', message: 'Creating ZIP archive...' });
      
      // Dynamic import of JSZip
      const JSZip = (await import('jszip' as any)).default;
      const zip = new JSZip();

      // Add all files to ZIP
      for (const file of files) {
        zip.file(file.name, file);
      }

      // Generate ZIP blob
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // Create File object from blob
      const zipFile = new File([zipBlob], `${formData.title.replace(/\s+/g, '-')}.zip`, {
        type: 'application/zip'
      });

      setUploadProgress({ stage: 'encrypting', message: 'Encrypting your code...' });
      
      const repo = await createRepository({
        ...formData,
        file: zipFile,
        licenseTemplates: (formData.licenseType === 'commercial' || formData.licenseType === 'commercial-remix') ? licenseTemplates : undefined,
      });

      if (repo) {
        setUploadProgress({ stage: 'complete', message: 'Repository created successfully!' });
        toast.success('Repository created and encrypted on IPFS!');
        setTimeout(() => {
          router.push(`/repo/${repo.repoId}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error('Create repository error:', error);
      setUploadProgress({ stage: 'idle', message: '' });
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create repository';
      toast.error(errorMessage);
      
      // If authentication error, show specific message
      if (error.response?.status === 401) {
        toast.error('Authentication required. Please reconnect your wallet.');
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Create Repository - griD.dev</title>
      </Head>

      <ParallaxCave />

      <div className="min-h-screen py-12 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          {/* Crafting Station Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-4 mb-4">
              <PixelGem color="#ffd700" />
              <h1 className="text-5xl font-pixel text-accent-fg uppercase tracking-wider drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
                CRAFTING STATION
              </h1>
              <PixelGem color="#00e5cc" />
            </div>
            <p className="text-2xl font-retro text-attention-fg uppercase tracking-wide animate-pixel-pulse">
              ⚒️ FORGE YOUR REPOSITORY ⚒️
            </p>
            <PixelDivider />
          </div>

          {/* Crafting Info Panel */}
          <div className="card-gh p-6 mb-8 border-4 border-attention-fg bg-gradient-to-br from-canvas-default to-canvas-subtle relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 64 64" fill="currentColor" className="text-attention-fg">
                <rect x="0" y="24" width="16" height="16"/>
                <rect x="16" y="16" width="16" height="32"/>
                <rect x="32" y="8" width="16" height="40"/>
                <rect x="48" y="16" width="16" height="32"/>
              </svg>
            </div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-16 h-16 border-4 border-accent-fg bg-canvas-inset flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🔐</span>
              </div>
              <div>
                <p className="text-xl font-pixel text-attention-fg uppercase tracking-wider mb-3">SECURE CRAFTING</p>
                <p className="text-lg font-retro text-fg-muted leading-relaxed">
                  YOUR CODE WILL BE <span className="text-success-fg font-bold">ENCRYPTED</span> BEFORE UPLOADING TO IPFS. 
                  ONLY YOU AND LICENSED USERS CAN ACCESS THE SOURCE CODE. 
                  METADATA REMAINS PUBLIC FOR DISCOVERY.
                </p>
              </div>
            </div>
          </div>

          {uploadProgress.stage !== 'idle' && (
            <div className="card-gh border-4 border-success-fg p-6 mb-8 bg-gradient-to-r from-success-subtle to-canvas-subtle">
              <div className="flex items-center gap-4">
                {/* Mining Pickaxe Animation */}
                <div className="w-20 h-20 flex items-center justify-center">
                  <svg viewBox="0 0 64 64" className="animate-swing">
                    <rect x="40" y="8" width="8" height="32" fill="#8b7355"/>
                    <rect x="32" y="32" width="8" height="8" fill="#6b5345"/>
                    <rect x="24" y="24" width="16" height="8" fill="#666"/>
                    <rect x="16" y="16" width="16" height="8" fill="#888"/>
                    <rect x="8" y="16" width="8" height="8" fill="#aaa"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-pixel text-success-fg uppercase tracking-wider mb-3 animate-pixel-pulse">
                    {uploadProgress.message}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm font-retro">
                    <span className={`pixel-badge ${uploadProgress.stage === 'processing' ? 'bg-success-fg text-canvas-default' : 'bg-canvas-inset text-fg-muted'}`}>
                      ARCHIVING
                    </span>
                    <span className="text-fg-muted text-xl">→</span>
                    <span className={`pixel-badge ${uploadProgress.stage === 'encrypting' ? 'bg-success-fg text-canvas-default' : 'bg-canvas-inset text-fg-muted'}`}>
                      ENCRYPTING
                    </span>
                    <span className="text-fg-muted text-xl">→</span>
                    <span className={`pixel-badge ${uploadProgress.stage === 'uploading' ? 'bg-success-fg text-canvas-default' : 'bg-canvas-inset text-fg-muted'}`}>
                      UPLOADING
                    </span>
                    <span className="text-fg-muted text-xl">→</span>
                    <span className={`pixel-badge ${uploadProgress.stage === 'minting' ? 'bg-success-fg text-canvas-default' : 'bg-canvas-inset text-fg-muted'}`}>
                      MINTING NFT
                    </span>
                    <span className="text-fg-muted text-xl">→</span>
                    <span className={`pixel-badge ${uploadProgress.stage === 'complete' ? 'bg-success-fg text-canvas-default' : 'bg-canvas-inset text-fg-muted'}`}>
                      COMPLETE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Recipe Ingredients Section */}
            <div className="border-4 border-accent-fg p-1 bg-canvas-inset">
              <div className="border-2 border-fg-muted p-6 bg-canvas-default">
                <div className="flex items-center gap-3 mb-6">
                  <PixelGem color="#00e5cc" />
                  <h2 className="text-2xl font-pixel text-accent-fg uppercase tracking-wider">RECIPE INGREDIENTS</h2>
                </div>

                {/* Title - Crafting Slot Style */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 border-4 border-attention-fg bg-canvas-inset flex items-center justify-center">
                      <span className="text-lg">📝</span>
                    </div>
                    <label htmlFor="title" className="text-xl font-pixel text-fg-default uppercase tracking-wider">
                      NAME <span className="text-danger-fg">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input-gh w-full text-xl font-retro uppercase tracking-wider"
                    placeholder="MY-AWESOME-PROJECT"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 border-4 border-attention-fg bg-canvas-inset flex items-center justify-center">
                      <span className="text-lg">📜</span>
                    </div>
                    <label htmlFor="description" className="text-xl font-pixel text-fg-default uppercase tracking-wider">
                      DESCRIPTION <span className="text-danger-fg">*</span>
                    </label>
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="input-gh w-full resize-none text-lg font-retro"
                    placeholder="A LEGENDARY PROJECT FORGED IN THE DEPTHS..."
                    required
                  />
                  <p className="text-base font-retro text-fg-muted mt-3 flex items-center gap-2">
                    <PixelStar /> HELP OTHERS DISCOVER YOUR CREATION
                  </p>
                </div>
              </div>
            </div>

            {/* License Type - Enchantment Selection */}
            <div className="border-4 border-attention-fg p-1 bg-canvas-inset">
              <div className="border-2 border-fg-muted p-6 bg-canvas-default">
                <div className="flex items-center gap-3 mb-6">
                  <PixelGem color="#ffd700" />
                  <h2 className="text-2xl font-pixel text-attention-fg uppercase tracking-wider">⚡ ENCHANTMENT ⚡</h2>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 border-4 border-success-fg bg-canvas-inset flex items-center justify-center">
                    <span className="text-lg">📄</span>
                  </div>
                  <label htmlFor="licenseType" className="text-xl font-pixel text-fg-default uppercase tracking-wider">
                    LICENSE TYPE <span className="text-danger-fg">*</span>
                  </label>
                </div>
                <select
                  id="licenseType"
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleInputChange}
                  className="input-gh w-full text-lg font-retro uppercase"
                >
                  <option value="open">🌟 OPEN USE - FREE FOR EVERYONE</option>
                  <option value="non-commercial">🎓 NON-COMMERCIAL - PERSONAL USE ONLY</option>
                  <option value="commercial">💰 COMMERCIAL - PAID LICENSE</option>
                  <option value="commercial-remix">🔄 COMMERCIAL REMIX - REVENUE SHARE</option>
                  <option value="custom">⚙️ CUSTOM - YOUR RULES</option>
                </select>
                <div className="mt-4 p-4 border-4 border-canvas-inset bg-canvas-subtle">
                  <div className="text-lg font-retro text-fg-muted space-y-2">
                    {formData.licenseType === 'open' && (
                      <p className="flex items-start gap-2"><span className="text-success-fg text-xl">✓</span> ANYONE CAN VIEW, DOWNLOAD, USE, AND MODIFY YOUR CODE WITHOUT RESTRICTIONS</p>
                    )}
                    {formData.licenseType === 'non-commercial' && (
                      <p className="flex items-start gap-2"><span className="text-success-fg text-xl">✓</span> FREE FOR PERSONAL/EDUCATIONAL USE. COMMERCIAL USE REQUIRES APPROVAL.</p>
                    )}
                    {formData.licenseType === 'commercial' && (
                      <p className="flex items-start gap-2"><span className="text-success-fg text-xl">✓</span> USERS PURCHASE LICENSE TO USE IN COMMERCIAL PROJECTS. ONE-TIME PAYMENT.</p>
                    )}
                    {formData.licenseType === 'commercial-remix' && (
                      <p className="flex items-start gap-2"><span className="text-success-fg text-xl">✓</span> USERS CAN REMIX AND SELL DERIVATIVES. YOU EARN % OF THEIR REVENUE VIA STORY PROTOCOL.</p>
                    )}
                    {formData.licenseType === 'custom' && (
                      <p className="flex items-start gap-2"><span className="text-success-fg text-xl">✓</span> DEFINE CUSTOM TERMS WITH CHECKBOXES BELOW (AI TRAINING, ATTRIBUTION, ETC.)</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing (for paid licenses) */}
            {(formData.licenseType === 'commercial' || formData.licenseType === 'commercial-remix') && (
              <div className="card-gh p-4 space-y-4">
                <div>
                  <label htmlFor="priceEth" className="block text-sm font-semibold text-gh-fg-default mb-2">
                    Base price (ETH) <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="priceEth"
                      name="priceEth"
                      value={formData.priceEth}
                      onChange={handleInputChange}
                      step="0.001"
                      min="0"
                      className="input-gh w-full pr-12"
                      placeholder="0.01"
                      required={formData.licenseType === 'commercial' || formData.licenseType === 'commercial-remix'}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gh-fg-muted text-sm">ETH</span>
                  </div>
                  {formData.priceEth && (
                    <p className="text-xs text-gh-fg-muted mt-2">
                      ≈ ${(parseFloat(formData.priceEth) * 3500).toFixed(2)} USD (estimated)
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gh-fg-default">
                      License templates
                    </label>
                    {licenseTemplates.length < 5 && (
                      <button
                        type="button"
                        onClick={addLicenseTemplate}
                        className="text-xs text-gh-accent-fg hover:text-gh-accent-emphasis font-medium"
                      >
                        + Add tier
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gh-fg-muted mb-3">
                    Create multiple pricing tiers (e.g., Personal, Commercial). Buyers choose which license to purchase.
                  </p>
                  <div className="space-y-3">
                    {licenseTemplates.map((template, index) => (
                      <div key={index} className="border border-gh-border-default rounded-gh p-3 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gh-fg-muted">Tier {index + 1}</span>
                          {licenseTemplates.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLicenseTemplate(index)}
                              className="text-xs text-gh-danger-fg hover:text-gh-danger-emphasis"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={template.name}
                          onChange={(e) => handleTemplateChange(index, 'name', e.target.value)}
                          placeholder="Template name (e.g., Personal License)"
                          className="input-gh w-full text-sm"
                        />
                        <div className="relative">
                          <input
                            type="number"
                            value={template.priceEth}
                            onChange={(e) => handleTemplateChange(index, 'priceEth', e.target.value)}
                            step="0.001"
                            min="0"
                            placeholder="Price in ETH"
                            className="input-gh w-full text-sm pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gh-fg-muted text-xs">ETH</span>
                        </div>
                        <textarea
                          value={template.description}
                          onChange={(e) => handleTemplateChange(index, 'description', e.target.value)}
                          placeholder="Description (e.g., For individual developers)"
                          rows={2}
                          className="input-gh w-full text-sm resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gh-attention-subtle border border-gh-attention-muted rounded-gh p-3">
                  <p className="text-xs text-gh-fg-default">
                    <span className="font-semibold">Revenue split:</span> 90% to you, 10% platform fee
                  </p>
                </div>
              </div>
            )}

            {/* Custom License Modules */}
            {formData.licenseType === 'custom' && (
              <div className="card-gh p-4">
                <label className="block text-sm font-semibold text-gh-fg-default mb-3">
                  Custom License Modules
                </label>
                <p className="text-xs text-gh-fg-muted mb-4">
                  Select the permissions you want to grant to users who access your code
                </p>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5" defaultChecked />
                    <div>
                      <p className="text-sm text-gh-fg-default font-medium">Allow AI Training</p>
                      <p className="text-xs text-gh-fg-muted">Code can be used to train AI models</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5" defaultChecked />
                    <div>
                      <p className="text-sm text-gh-fg-default font-medium">Allow Commercial Use</p>
                      <p className="text-xs text-gh-fg-muted">Code can be used in commercial projects</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5" defaultChecked />
                    <div>
                      <p className="text-sm text-gh-fg-default font-medium">Require Attribution</p>
                      <p className="text-xs text-gh-fg-muted">Users must credit you when using the code</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5" />
                    <div>
                      <p className="text-sm text-gh-fg-default font-medium">Allow Remixing</p>
                      <p className="text-xs text-gh-fg-muted">Users can create derivative works</p>
                    </div>
                  </label>
                  <div className="pt-2">
                    <label className="block text-sm text-gh-fg-default font-medium mb-2">Expiration Date (optional)</label>
                    <input 
                      type="date" 
                      className="input-gh w-full text-sm"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-gh-fg-muted mt-1">Leave blank for perpetual license</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gh-fg-default font-medium mb-2">License Fee (optional)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        className="input-gh w-full pr-12"
                        placeholder="0.00"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gh-fg-muted text-sm">ETH</span>
                    </div>
                    <p className="text-xs text-gh-fg-muted mt-1">One-time fee for accessing the code</p>
                  </div>
                </div>
              </div>
            )}

            {/* Optional Materials */}
            <div className="border-4 border-fg-muted p-1 bg-canvas-inset">
              <div className="border-2 border-canvas-inset p-6 bg-canvas-default">
                <div className="flex items-center gap-3 mb-6">
                  <PixelStar />
                  <h2 className="text-2xl font-pixel text-fg-default uppercase tracking-wider">OPTIONAL MATERIALS</h2>
                </div>

                {/* Thumbnail */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 border-4 border-fg-muted bg-canvas-inset flex items-center justify-center">
                      <span className="text-lg">🖼️</span>
                    </div>
                    <label htmlFor="thumbnailUrl" className="text-xl font-pixel text-fg-default uppercase tracking-wider">
                      THUMBNAIL URL
                    </label>
                  </div>
                  <input
                    type="url"
                    id="thumbnailUrl"
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleInputChange}
                    className="input-gh w-full text-lg font-retro"
                    placeholder="https://example.com/image.png"
                  />
                  <p className="text-base font-retro text-fg-muted mt-2">IMAGE FOR REPOSITORY CARDS (1200x630PX)</p>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 border-4 border-fg-muted bg-canvas-inset flex items-center justify-center">
                      <span className="text-lg">🏷️</span>
                    </div>
                    <label htmlFor="tags" className="text-xl font-pixel text-fg-default uppercase tracking-wider">
                      TAGS
                    </label>
                  </div>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="input-gh w-full text-lg font-retro uppercase"
                    placeholder="JAVASCRIPT, REACT, WEB3"
                  />
                  <p className="text-base font-retro text-fg-muted mt-2 flex items-center gap-2">
                    <PixelGem color="#7dfc00" /> UP TO 5 TAGS (COMMA-SEPARATED)
                  </p>
                </div>
              </div>
            </div>

            {/* File Upload - Material Collection */}
            <div className="border-4 border-accent-fg p-1 bg-canvas-inset">
              <div className="border-2 border-fg-muted p-6 bg-canvas-default">
                <div className="flex items-center gap-3 mb-6">
                  <PixelGem color="#ff3864" />
                  <h2 className="text-2xl font-pixel text-accent-fg uppercase tracking-wider">MATERIAL COLLECTION</h2>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 border-4 border-danger-fg bg-canvas-inset flex items-center justify-center">
                    <span className="text-lg">📦</span>
                  </div>
                  <label className="text-xl font-pixel text-fg-default uppercase tracking-wider">
                    UPLOAD FILES <span className="text-danger-fg">*</span>
                  </label>
                </div>
                <div
                  className={`border-4 p-12 text-center transition-all ${
                    dragActive 
                      ? 'border-accent-fg bg-accent-subtle shadow-[8px_8px_0px_rgba(0,229,204,0.3)]' 
                      : 'border-dashed border-fg-muted bg-canvas-inset hover:border-accent-fg'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {/* Pixel Chest Icon */}
                  <div className="w-24 h-24 mx-auto mb-6 relative">
                    <svg viewBox="0 0 64 64" className={dragActive ? 'animate-float' : ''}>
                      <rect x="8" y="20" width="48" height="32" fill="#8b7355" stroke="#000" strokeWidth="2"/>
                      <rect x="12" y="24" width="40" height="24" fill="#a0826d" stroke="#000" strokeWidth="2"/>
                      <rect x="28" y="32" width="8" height="8" fill="#ffd700" stroke="#000" strokeWidth="2"/>
                      <rect x="0" y="16" width="64" height="4" fill="#6b5345"/>
                      <rect x="0" y="52" width="64" height="4" fill="#6b5345"/>
                    </svg>
                  </div>
                  <p className="text-2xl font-pixel text-fg-default mb-4 uppercase tracking-wider">
                    {dragActive ? '⬇️ DROP YOUR LOOT ⬇️' : '📂 DRAG & DROP FILES'}
                  </p>
                  <p className="text-xl font-retro text-fg-muted mb-3">
                    OR{' '}
                    <label className="cursor-pointer text-accent-fg hover:text-accent-emphasis font-bold uppercase underline">
                      BROWSE FILES
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <div className="flex flex-col gap-2 text-lg font-retro text-fg-muted mt-6">
                    <p>✓ AUTOMATICALLY ARCHIVED INTO ZIP</p>
                    <p className="text-attention-fg font-bold">⚠️ MAX TOTAL SIZE: 100MB</p>
                  </div>
                </div>

                {/* File Inventory */}
                {files.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4 p-4 border-4 border-success-fg bg-success-subtle">
                      <div className="flex items-center gap-3">
                        <PixelGem color="#7dfc00" />
                        <span className="text-xl font-pixel text-success-fg uppercase tracking-wider">
                          {files.length} MATERIALS COLLECTED
                        </span>
                      </div>
                      <span className="text-xl font-pixel text-fg-default">
                        TOTAL: {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto space-y-3 p-4 border-4 border-canvas-inset bg-canvas-subtle">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-4 border-fg-muted bg-canvas-default p-4 hover:border-accent-fg hover:translate-x-1 transition-all"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-12 h-12 border-4 border-attention-fg bg-canvas-inset flex items-center justify-center flex-shrink-0">
                              <span className="text-xl">📄</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-lg font-retro text-fg-default truncate font-bold uppercase">{file.name}</p>
                              <p className="text-base font-retro text-fg-muted">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="ml-4 w-12 h-12 border-4 border-danger-fg bg-danger-subtle hover:bg-danger-fg hover:text-canvas-default flex items-center justify-center flex-shrink-0 transition-colors"
                            title="Remove file"
                          >
                            <span className="text-2xl font-bold">✖</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFiles([])}
                      className="mt-4 px-6 py-3 border-4 border-danger-fg bg-danger-subtle hover:bg-danger-fg hover:text-canvas-default text-lg font-pixel uppercase tracking-wider transition-colors"
                    >
                      🗑️ CLEAR ALL MATERIALS
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Craft Button - Final Forge */}
            <div className="border-4 border-success-fg p-8 bg-gradient-to-br from-success-subtle to-canvas-default text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <PixelGem color="#ffd700" />
                <h2 className="text-3xl font-pixel text-success-fg uppercase tracking-wider animate-pixel-pulse">
                  ⚒️ READY TO FORGE? ⚒️
                </h2>
                <PixelGem color="#ffd700" />
              </div>
              <div className="flex gap-6 justify-center">
                <button
                  type="submit"
                  disabled={loading || files.length === 0 || uploadProgress.stage !== 'idle'}
                  className="px-12 py-6 text-2xl font-pixel uppercase tracking-wider border-4 border-success-fg bg-success-fg text-canvas-default hover:bg-success-emphasis hover:border-success-emphasis disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-success-fg shadow-[8px_8px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3"
                >
                  {uploadProgress.stage !== 'idle' ? (
                    <>
                      <svg viewBox="0 0 24 24" className="w-8 h-8 animate-swing">
                        <rect x="14" y="2" width="2" height="12" fill="currentColor"/>
                        <rect x="10" y="12" width="2" height="2" fill="currentColor"/>
                        <rect x="8" y="10" width="4" height="2" fill="currentColor"/>
                        <rect x="6" y="8" width="4" height="2" fill="currentColor"/>
                      </svg>
                      {uploadProgress.message.toUpperCase()}
                    </>
                  ) : loading ? (
                    '⚡ FORGING... ⚡'
                  ) : (
                    <>
                      ⚒️ CRAFT REPOSITORY ⚒️
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-6 text-2xl font-pixel uppercase tracking-wider border-4 border-fg-muted bg-canvas-subtle hover:bg-canvas-inset hover:border-fg-default disabled:opacity-50 disabled:cursor-not-allowed shadow-[8px_8px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:translate-x-1 hover:translate-y-1 transition-all"
                  disabled={uploadProgress.stage !== 'idle'}
                >
                  ❌ CANCEL
                </button>
              </div>
              {files.length === 0 && (
                <p className="text-lg font-retro text-danger-fg mt-6 animate-pixel-pulse">
                  ⚠️ YOU NEED TO COLLECT MATERIALS FIRST! ⚠️
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
