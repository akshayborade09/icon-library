import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LeftNavigation from '@/components/layout/LeftNavigation';
import PageHeader from '@/components/layout/PageHeader';
import AssetTabs from '@/components/home/AssetTabs';
import TabSearch from '@/components/layout/TabSearch';
import AssetUpload from '@/components/AssetUpload';
import { AssetProvider, useAsset } from '@/contexts/AssetContext';
import { Button } from '@heroui/react';
import { Plus, Upload } from 'lucide-react';

interface Asset {
  id: number;
  name: string;
  preview: string;
  downloads: number;
  size?: string;
}

interface HomePageProps {
  activeTab: string;
  selectedSize?: string;
  sortBy?: string;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onSizeChange?: (size: string) => void;
  onSortChange?: (sort: string) => void;
  onScrollVisibilityChange?: (visible: boolean) => void;
}

function HomePage({ 
  activeTab, 
  selectedSize = 'all',
  sortBy = 'popular',
  searchQuery = '',
  onSearch,
  onSizeChange,
  onSortChange,
  onScrollVisibilityChange
}: HomePageProps) {
  const handleAssetClick = (asset: Asset, type: string) => {
    console.log('Asset clicked:', asset, type);
    // Handle asset click functionality here
  };

  return (
    <>
      {/* Asset Content */}
      <div className="mx-auto">
        <AssetTabs 
          activeTab={activeTab}
          selectedSize={selectedSize}
          sortBy={sortBy}
          searchQuery={searchQuery}
          onAssetClick={handleAssetClick}
          onSearch={onSearch}
          onSizeChange={onSizeChange}
          onSortChange={onSortChange}
          onScrollVisibilityChange={onScrollVisibilityChange}
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
      <div className="bg-success-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3 backdrop-blur-md border border-success-600">
        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-success-500 rounded-full"></div>
        </div>
        <span className="font-medium">Assets uploaded successfully!</span>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQueries, setSearchQueries] = useState<{[key: string]: string}>({
    'Icons': '',
    'Illustrations': '',
    'Spot Icons': '',
    'Images': '',
    'Animations': '',
    '3D Models': ''
  });
  
  // Get active tab from URL query parameter, default to 'Icons'
  const getActiveTabFromUrl = () => {
    const urlTab = router.query.tab as string;
    // Capitalize first letter to match existing tab format
    if (urlTab) {
      return urlTab.charAt(0).toUpperCase() + urlTab.slice(1);
    }
    return 'Icons';
  };

  const [activeTab, setActiveTab] = useState('Icons');

  // Only allow toggling via the toggleSidebar function
  const toggleSidebar = () => {
    // setSidebarCollapsed((prev) => !prev); // This line is removed
  };

  const handleSearch = (query: string) => {
    setSearchQueries(prev => ({
      ...prev,
      [activeTab]: query
    }));
  };

  // Update activeTab when URL changes and set default tab if none specified
  useEffect(() => {
    if (router.isReady) {
      const tabFromUrl = getActiveTabFromUrl();
      const previousTab = activeTab;
      
      // Only update if tab actually changed
      if (tabFromUrl !== previousTab) {
        setActiveTab(tabFromUrl);
        
        // Clear search for the new tab when switching via navigation
        setSearchQueries(prev => ({
          ...prev,
          [tabFromUrl]: ''
        }));
      }
      
      // If no tab is specified in URL, redirect to icons tab
      if (!router.query.tab) {
        router.replace({
          pathname: '/',
          query: { ...router.query, tab: 'icons' }
        }, undefined, { shallow: true });
      }
    }
  }, [router.isReady, router.query.tab, router, activeTab]);

  // Update URL when tab changes programmatically
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    
    // Clear search for the new tab
    setSearchQueries(prev => ({
      ...prev,
      [newTab]: ''
    }));
    
    const tabParam = newTab.toLowerCase();
    router.push({
      pathname: '/',
      query: { ...router.query, tab: tabParam }
    }, undefined, { shallow: true });
  };

  const handleAssetClick = (asset: Asset, type: string) => {
    console.log('Asset clicked:', asset, type);
  };

  const handleCreateProject = () => {
    setIsCreateProjectOpen(true);
  };

  const handleUpload = () => {
    setIsUploadOpen(true);
  };

  return (
    <AssetProvider 
      handleAssetClick={handleAssetClick}
      handleCreateProject={handleCreateProject}
    >
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar - Full height */}
        <LeftNavigation />
        
        {/* Main content area - No top header */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Header */}
          <PageHeader
            title="Dashboard"
            description="Browse and manage your design assets"
            actions={
              <>
                {/* Create Project Button */}
                <Button 
                  onClick={handleCreateProject}
                  variant="bordered"
                  size="md"
                  className="h-10 px-4 font-semibold border-1 border-gray-200 rounded-full hover:bg-gray-200"
                  startContent={
                    <Plus className="h-5 w-5 transition-transform duration-200" strokeWidth={2} />
                  }
                >
                  <span className="hidden sm:inline">Create Project</span>
                </Button>

                {/* Upload Button */}
                <Button 
                  onClick={handleUpload}
                  color="primary"
                  size="md"
                  className="h-10 px-4 font-semibold border-1 border-gray-200 rounded-full hover:bg-primary-600"
                  startContent={
                    <Upload className="h-4 w-4 transition-transform duration-200" strokeWidth={2} />
                  }
                >
                  <span className="hidden sm:inline">Upload</span>
                </Button>
              </>
            }
          />

          {/* Header Search Bar - Always visible */}
          <TabSearch 
            activeTab={activeTab}
            onSearch={handleSearch}
            searchQuery={searchQueries[activeTab]}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          
          {/* Page content */}
          <main className="flex-1 overflow-hidden">
            <HomePage 
              activeTab={activeTab} 
              selectedSize={selectedSize}
              sortBy={sortBy}
              searchQuery={searchQueries[activeTab]}
              onSearch={handleSearch}
              onSizeChange={setSelectedSize}
              onSortChange={setSortBy}
              // Removed onScrollVisibilityChange
            />
            <SuccessToast />
          </main>
        </div>
      </div>

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
    </AssetProvider>
  );
}
