'use client';

import React, { useState } from 'react';
import { Plus, Upload, Menu, X, Image, Palette, Sparkles, Camera, Play, Box } from 'lucide-react';
import AssetUpload from '@/components/AssetUpload';

interface TopNavigationProps {
  onCreateProject?: () => void;
  onUpload?: () => void;
  onToggleSidebar?: () => void;
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
  onToggleSidebar,
  activeTab = 'Icons',
  onTabChange 
}: TopNavigationProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

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
          {/* Left: Menu Toggle */}
          <div className="flex items-center gap-2 px-4">
            <button
              onClick={onToggleSidebar}
              className="group p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Menu className="h-5 w-5 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-2 transition-colors duration-300 hover:bg-gray-400" />
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
              onClick={onCreateProject}
              className="group h-9 px-3 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 hover:shadow-sm active:scale-95"
            >
              <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              <span className="hidden sm:inline font-medium">Create Project</span>
            </button>

            {/* Upload Button */}
            <button 
              onClick={() => setShowUploadDialog(true)}
              className="group h-9 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Upload className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline font-medium">Upload</span>
            </button>
          </div>
        </div>
      </header>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in-0 duration-300">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-60 transition-all duration-300"
            onClick={() => setShowUploadDialog(false)}
          />
          
          {/* Dialog Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 hover:shadow-2xl transition-shadow">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-200">Upload Assets</h2>
                <p className="text-gray-600 mt-1 hover:text-gray-700 transition-colors duration-200">Upload your digital assets including icons, illustrations, animations, and 3D models.</p>
              </div>
              <button
                onClick={() => setShowUploadDialog(false)}
                className="group p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-90"
              >
                <X className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
              </button>
            </div>
            
            {/* Dialog Body */}
            <div className="p-6 overflow-y-auto hover:bg-gray-50/30 transition-colors duration-300">
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