import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AssetTabs from '@/components/home/AssetTabs';
import TabSearch from '@/components/layout/TabSearch';
import { AssetProvider, useAsset } from '@/contexts/AssetContext';

interface Asset {
  id: number;
  name: string;
  preview: string;
  downloads: number;
  size?: string;
}

interface HomePageProps {
  activeTab: string;
}

function HomePage({ activeTab }: HomePageProps) {
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAssetClick = (asset: Asset, type: string) => {
    console.log('Asset clicked:', asset, type);
    // Handle asset click functionality here
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      {/* Tab-specific Search */}
      <TabSearch 
        activeTab={activeTab}
        onSearch={handleSearch}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Asset Content */}
      <div className="mx-auto">
        <AssetTabs 
          activeTab={activeTab}
          selectedSize={selectedSize}
          sortBy={sortBy}
          searchQuery={searchQuery}
          onAssetClick={handleAssetClick}
        />
      </div>
    </>
  );
}

function SuccessToast() {
  const { showSuccessToast, setShowSuccessToast } = useAsset();
  
  if (!showSuccessToast) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
        </div>
        <span className="font-medium">Assets uploaded successfully!</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('Icons');

  const handleAssetClick = (asset: Asset, type: string) => {
    console.log('Asset clicked:', asset, type);
  };

  const handleCreateProject = () => {
    console.log('Create project clicked');
  };

  return (
    <AssetProvider 
      handleAssetClick={handleAssetClick}
      handleCreateProject={handleCreateProject}
    >
      <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <HomePage activeTab={activeTab} />
        <SuccessToast />
      </MainLayout>
    </AssetProvider>
  );
}
