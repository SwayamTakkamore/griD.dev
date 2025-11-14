import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useRepository } from '@/hooks/useRepository';
import toast from 'react-hot-toast';

export default function CreateRepo() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { createRepository, loading } = useRepository();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    licenseType: 'open',
    tags: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

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
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.name.endsWith('.zip')) {
        toast.error('Please upload a ZIP file');
        return;
      }

      // Validate file size (50MB)
      if (selectedFile.size > 52428800) {
        toast.error('File size must be less than 50MB');
        return;
      }

      setFile(selectedFile);
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (!droppedFile.name.endsWith('.zip')) {
        toast.error('Please upload a ZIP file');
        return;
      }

      if (droppedFile.size > 52428800) {
        toast.error('File size must be less than 50MB');
        return;
      }

      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !file) {
      toast.error('Please fill in all fields and select a file');
      return;
    }

    try {
      const repo = await createRepository({
        ...formData,
        file,
      });

      if (repo) {
        router.push(`/repo/${repo.repoId}`);
      }
    } catch (error) {
      console.error('Create repository error:', error);
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

      <div className="bg-gh-canvas-default min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gh-fg-default mb-2">
            Create a new repository
          </h1>
          <p className="text-gh-fg-muted text-sm mb-6">
            Upload your code as a ZIP file. It will be stored on IPFS and registered as an IP asset on Story Protocol.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="card-gh p-4">
              <label htmlFor="title" className="block text-sm font-semibold text-gh-fg-default mb-2">
                Repository name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-gh w-full"
                placeholder="my-awesome-project"
                required
              />
            </div>

            {/* Description */}
            <div className="card-gh p-4">
              <label htmlFor="description" className="block text-sm font-semibold text-gh-fg-default mb-2">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="input-gh w-full resize-none"
                placeholder="A brief description of your repository..."
                required
              />
              <p className="text-xs text-gh-fg-muted mt-2">Help others understand what your project is about</p>
            </div>

            {/* License Type */}
            <div className="card-gh p-4">
              <label htmlFor="licenseType" className="block text-sm font-semibold text-gh-fg-default mb-2">
                License type <span className="text-red-600">*</span>
              </label>
              <select
                id="licenseType"
                name="licenseType"
                value={formData.licenseType}
                onChange={handleInputChange}
                className="input-gh w-full"
              >
                <option value="open">Open - Free for everyone</option>
                <option value="restricted">Restricted - Limited access</option>
                <option value="paid">Paid - Royalty-based</option>
              </select>
            </div>

            {/* Tags */}
            <div className="card-gh p-4">
              <label htmlFor="tags" className="block text-sm font-semibold text-gh-fg-default mb-2">
                Topics
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="input-gh w-full"
                placeholder="javascript, react, web3"
              />
              <p className="text-xs text-gh-fg-muted mt-2">Add up to 5 topics (comma-separated)</p>
            </div>

            {/* File Upload */}
            <div className="card-gh p-4">
              <label className="block text-sm font-semibold text-gh-fg-default mb-2">
                Upload ZIP file <span className="text-red-600">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-gh p-8 text-center transition-colors ${
                  dragActive ? 'border-gh-accent-fg bg-gh-accent-subtle' : 'border-gh-border-default'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div>
                    <svg className="w-12 h-12 mx-auto mb-3 text-gh-success-fg" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3.5 1.75v11.5c0 .09.048.173.126.217a.75.75 0 0 0 .698-.01l3.180-1.814 3.176 1.815a.75.75 0 0 0 .724.01.75.75 0 0 0 .376-.657V1.75a.25.25 0 0 0-.25-.25h-8a.25.25 0 0 0-.25.25Z"></path>
                    </svg>
                    <p className="text-gh-fg-default font-semibold mb-1">{file.name}</p>
                    <p className="text-gh-fg-muted text-sm mb-3">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-gh-danger-fg hover:text-gh-danger-emphasis text-sm font-medium"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg className="w-12 h-12 mx-auto mb-3 text-gh-fg-muted" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3.5 1.75v11.5c0 .09.048.173.126.217a.75.75 0 0 0 .698-.01l3.180-1.814 3.176 1.815a.75.75 0 0 0 .724.01.75.75 0 0 0 .376-.657V1.75a.25.25 0 0 0-.25-.25h-8a.25.25 0 0 0-.25.25Z"></path>
                    </svg>
                    <p className="text-gh-fg-muted mb-2 text-sm">
                      Drag and drop your ZIP file here, or{' '}
                      <label className="cursor-pointer text-gh-accent-fg hover:underline font-medium">
                        choose a file
                        <input
                          type="file"
                          accept=".zip"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gh-fg-muted">Max file size: 50MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || !file}
                className="btn-gh-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating repository...' : 'Create repository'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="btn-gh-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
