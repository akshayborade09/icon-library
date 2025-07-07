import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AssetTabs from '@/components/home/AssetTabs';
import TabSearch from '@/components/layout/TabSearch';

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

export default function Home() {
  const [activeTab, setActiveTab] = useState('Icons');

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <HomePage activeTab={activeTab} />
    </MainLayout>
  );
}
