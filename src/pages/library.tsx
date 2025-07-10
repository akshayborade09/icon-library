import React, { useState } from 'react';
import LeftNavigation from '@/components/layout/LeftNavigation';
import PageHeader from '@/components/layout/PageHeader';
import FreeCollectionCards from '@/components/home/FreeCollectionCards';
import { AssetProvider } from '@/contexts/AssetContext';

export default function Library() {
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
      <div className="flex h-screen bg-background">
        {/* Left Navigation */}
        <LeftNavigation 
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader
            title="Library"
            description="Browse our collection of design assets and resources"
          />
          
          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto">
            <FreeCollectionCards />
          </main>
        </div>
      </div>
    </AssetProvider>
  );
} 