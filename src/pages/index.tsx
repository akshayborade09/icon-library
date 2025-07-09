import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LeftNavigation from '@/components/layout/LeftNavigation';
import PageHeader from '@/components/layout/PageHeader';
import AssetTabs from '@/components/home/AssetTabs';
import TabSearch from '@/components/layout/TabSearch';
import AssetUpload from '@/components/AssetUpload';
import { AssetProvider, useAsset } from '@/contexts/AssetContext';
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
  const router = useRouter();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar - Full height */}
        <LeftNavigation collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        
        {/* Main content area - No top header */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Header */}
          <PageHeader
            title="Dashboard"
            description="Browse and manage your design assets"
            actions={
              <>
                {/* Create Project Button */}
                <button 
                  onClick={handleCreateProject}
                  className="group h-9 px-3 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 hover:shadow-sm active:scale-95"
                >
                  <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                  <span className="hidden sm:inline font-medium">Create Project</span>
                </button>

                {/* Upload Button */}
                <button 
                  onClick={handleUpload}
                  className="group h-9 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Upload className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                  <span className="hidden sm:inline font-medium">Upload</span>
                </button>
              </>
            }
          />

          {/* Header Search Bar - Only show when scrolled */}
          {showHeaderSearch && (
            <TabSearch 
              activeTab={activeTab}
              onSearch={handleSearch}
              searchQuery={searchQueries[activeTab]}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          )}
          
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
              onScrollVisibilityChange={setShowHeaderSearch}
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
