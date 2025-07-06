'use client';

import React, { useState } from 'react';
import LeftNavigation from './LeftNavigation';
import TopNavigation from './TopNavigation';
import AssetModal from '../modals/AssetModal';
import { AssetProvider } from '../../contexts/AssetContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface Asset {
  id: number;
  name: string;
  preview: string;
  downloads: number;
  size?: string;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string>('');
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleAssetClick = (asset: Asset, type: string) => {
    setSelectedAsset(asset);
    setSelectedAssetType(type);
    setIsAssetModalOpen(true);
  };

  const handleCloseAssetModal = () => {
    setIsAssetModalOpen(false);
    setSelectedAsset(null);
    setSelectedAssetType('');
  };

  const handleCreateProject = () => {
    console.log('Create project clicked');
    // Handle create project logic
  };

  const handleUpload = () => {
    console.log('Upload completed');
    // Handle upload completion
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Top Navigation - Fixed at Top */}
      <TopNavigation 
        onCreateProject={handleCreateProject}
        onUpload={handleUpload}
        onToggleSidebar={toggleSidebar}
      />
      
      {/* Content Area with Sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Left Navigation - Starts Below Header */}
        <LeftNavigation 
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
        
        {/* Main Content Area */}
        <main className={`flex-1 min-h-0 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-0' : 'ml-0'
        }`}>
          {children}
        </main>
      </div>

      {/* Asset Modal */}
      <AssetModal
        isOpen={isAssetModalOpen}
        onClose={handleCloseAssetModal}
        asset={selectedAsset}
        assetType={selectedAssetType}
      />
    </div>
  );
} 