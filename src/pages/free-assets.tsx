import React, { useState } from 'react';
import LeftNavigation from '@/components/layout/LeftNavigation';
import PageHeader from '@/components/layout/PageHeader';
import { AssetProvider } from '@/contexts/AssetContext';

export default function FreeAssets() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleAssetClick = (asset: any, type: string) => {
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
      <div className="flex h-screen bg-gray-50">
        {/* Left Navigation */}
        <LeftNavigation 
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader
            title="Free Assets"
            description="Download high-quality design assets at no cost"
          />
          
          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto px-6 py-8">
            <div className="max-w-[1400px] mx-auto px-10">
              {/* Placeholder content */}
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">🎨</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Free Assets Coming Soon</h3>
                <p className="text-gray-500 mb-6">
                  We're preparing a collection of high-quality free design assets for you.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AssetProvider>
  );
} 