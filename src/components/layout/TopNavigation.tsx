'use client';

import React, { useState } from 'react';
import { Plus, Upload, X, Image, Palette, Sparkles, Camera, Play, Box } from 'lucide-react';
import AssetUpload from '../AssetUpload';

interface TopNavigationProps {
  onCreateProject?: () => void;
  onUpload?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

// SSR-safe icon mapping function
const getTabIcon = (name: string) => {
  switch (name) {
    case 'Icons': return Image;
    case 'Illustrations': return Palette;
    case 'Spot Icons': return Sparkles;
    case 'Images': return Camera;
    case 'Animations': return Play;
    case '3D Models': return Box;
    default: return Image;
  }
};

export default function TopNavigation({ 
  onCreateProject, 
  onUpload,
  activeTab = 'Icons',
  onTabChange 
}: TopNavigationProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

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

  const assetTypes = [
    { name: 'Icons' },
    { name: 'Illustrations' },
    { name: 'Spot Icons' },
    { name: 'Images' },
    { name: 'Animations' },
    { name: '3D Models' },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Empty space */}
          <div className="flex items-center gap-2 px-4">
          </div>
          
          {/* Center: Tab Navigation */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
              {assetTypes.map((type) => {
                const Icon = getTabIcon(type.name);
                const isActive = activeTab === type.name;
                return (
                  <button
                    key={type.name}
                    onClick={() => onTabChange?.(type.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 px-4">
            {/* Create Project Button */}
            <button 
              onClick={() => setIsCreateProjectOpen(true)}
              className="group h-9 px-3 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 hover:shadow-sm active:scale-95"
            >
              <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              <span className="hidden sm:inline font-medium">Create Project</span>
            </button>

            {/* Upload Button */}
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="group h-9 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Upload className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline font-medium">Upload</span>
            </button>
          </div>
        </div>
      </header>

      {/* Upload Dialog */}
      <AssetUpload 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        mode="upload"
      />

      {/* Create Project Dialog */}
      <AssetUpload 
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        mode="create-project"
      />
    </>
  );
} 