'use client';

import React, { useState } from 'react';
import { Search, Plus, Upload, Menu, X } from 'lucide-react';
import AssetUpload from '@/components/AssetUpload';

interface TopNavigationProps {
  onCreateProject?: () => void;
  onUpload?: () => void;
  onToggleSidebar?: () => void;
}

export default function TopNavigation({ onCreateProject, onUpload, onToggleSidebar }: TopNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  interface AssetFile {
    id: string;
    file: File;
    status: string;
  }

  const handleUploadComplete = (files: AssetFile[]) => {
    console.log('Upload completed:', files);
    setShowUploadDialog(false);
    if (onUpload) onUpload();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 backdrop-blur supports-[backdrop-filter]:bg-white/95">
        <div className="flex h-16 items-center">
          {/* Left: Menu Toggle */}
          <div className="flex items-center gap-2 px-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-2" />
          </div>
          
          {/* Center: Search */}
          <div className="flex-1 flex justify-center px-4">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search assets, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 px-4">
            {/* Create Project Button */}
            <button 
              onClick={onCreateProject}
              className="h-9 px-3 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Project</span>
            </button>

            {/* Upload Button */}
            <button 
              onClick={() => setShowUploadDialog(true)}
              className="h-9 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
        </div>
      </header>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowUploadDialog(false)}
          />
          
          {/* Dialog Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Upload Assets</h2>
                <p className="text-gray-600 mt-1">Upload your digital assets including icons, illustrations, animations, and 3D models.</p>
              </div>
              <button
                onClick={() => setShowUploadDialog(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Dialog Body */}
            <div className="p-6 overflow-y-auto">
              <AssetUpload 
                onUpload={handleUploadComplete}
                maxFiles={20}
                className="mt-4"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 