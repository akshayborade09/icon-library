import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import FreeCollectionCards from '@/components/home/FreeCollectionCards';
import { AssetProvider } from '@/contexts/AssetContext';

export default function Library() {
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
      <MainLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="max-w-[1196px] mx-auto px-6 pt-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Library</h1>
              <p className="text-muted-foreground">
                Browse our collection of design assets and resources
              </p>
            </div>
          </div>

          {/* Collections - Full Width */}
          <FreeCollectionCards />
        </div>
      </MainLayout>
    </AssetProvider>
  );
} 