import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LeftNavigation from '../../components/layout/LeftNavigation';
import { AssetProvider } from '../../contexts/AssetContext';
import { Search, ChevronLeft } from 'lucide-react';
import AssetModal from '../../components/modals/AssetModal';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  assetCount: number;
}

interface Asset {
  id: string;
  name: string;
  thumbnail: string;
  size: string;
  category: 'icon' | 'illustration' | 'image' | 'animation';
  downloads: number;
  projectId: string;
}

interface ContextAsset {
  id: number;
  name: string;
  preview: string;
  downloads: number;
  size?: string;
}

const PROJECT_TABS = [
  { id: 'icons', label: 'Icons' },
  { id: 'illustrations', label: 'Illustrations' },
  { id: 'images', label: 'Images' },
  { id: 'animations', label: 'Animations' }
];

const ICON_SIZES = ['16x16', '20x20', '24x24'];

// Mock assets for the project
const MOCK_PROJECT_ASSETS: Asset[] = [
  // 16x16 Icons
  { id: '1', name: 'Shopping Cart', thumbnail: '/api/placeholder/16/16', size: '16x16', category: 'icon', downloads: 245, projectId: '1' },
  { id: '2', name: 'User Profile', thumbnail: '/api/placeholder/16/16', size: '16x16', category: 'icon', downloads: 189, projectId: '1' },
  { id: '3', name: 'Search', thumbnail: '/api/placeholder/16/16', size: '16x16', category: 'icon', downloads: 301, projectId: '1' },
  { id: '4', name: 'Heart', thumbnail: '/api/placeholder/16/16', size: '16x16', category: 'icon', downloads: 156, projectId: '1' },
  
  // 20x20 Icons  
  { id: '5', name: 'Star', thumbnail: '/api/placeholder/20/20', size: '20x20', category: 'icon', downloads: 278, projectId: '1' },
  { id: '6', name: 'Bell', thumbnail: '/api/placeholder/20/20', size: '20x20', category: 'icon', downloads: 134, projectId: '1' },
  { id: '7', name: 'Mail', thumbnail: '/api/placeholder/20/20', size: '20x20', category: 'icon', downloads: 201, projectId: '1' },
  { id: '8', name: 'Settings', thumbnail: '/api/placeholder/20/20', size: '20x20', category: 'icon', downloads: 167, projectId: '1' },
  
  // 24x24 Icons
  { id: '9', name: 'Home', thumbnail: '/api/placeholder/24/24', size: '24x24', category: 'icon', downloads: 312, projectId: '1' },
  { id: '10', name: 'Menu', thumbnail: '/api/placeholder/24/24', size: '24x24', category: 'icon', downloads: 198, projectId: '1' },
  { id: '11', name: 'Close', thumbnail: '/api/placeholder/24/24', size: '24x24', category: 'icon', downloads: 256, projectId: '1' },
  { id: '12', name: 'Plus', thumbnail: '/api/placeholder/24/24', size: '24x24', category: 'icon', downloads: 187, projectId: '1' },
  
  // Illustrations
  { id: '13', name: 'Shopping Scene', thumbnail: '/api/placeholder/200/150', size: '400x300', category: 'illustration', downloads: 89, projectId: '1' },
  { id: '14', name: 'Payment Success', thumbnail: '/api/placeholder/200/150', size: '400x300', category: 'illustration', downloads: 67, projectId: '1' },
  { id: '15', name: 'Empty Cart', thumbnail: '/api/placeholder/200/150', size: '400x300', category: 'illustration', downloads: 123, projectId: '1' },
  
  // Images
  { id: '16', name: 'Product Hero', thumbnail: '/api/placeholder/200/150', size: '1200x800', category: 'image', downloads: 54, projectId: '1' },
  { id: '17', name: 'Banner Image', thumbnail: '/api/placeholder/200/150', size: '1200x600', category: 'image', downloads: 76, projectId: '1' },
  
  // Animations
  { id: '18', name: 'Loading Spinner', thumbnail: '/api/placeholder/200/150', size: '400x400', category: 'animation', downloads: 142, projectId: '1' },
  { id: '19', name: 'Button Hover', thumbnail: '/api/placeholder/200/150', size: '300x100', category: 'animation', downloads: 98, projectId: '1' },
  { id: '20', name: 'Page Transition', thumbnail: '/api/placeholder/200/150', size: '800x600', category: 'animation', downloads: 112, projectId: '1' },
];

function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get active tab from URL query parameter, default to 'icons'
  const activeTab = (router.query.tab as string) || 'icons';

  // Redirect to icons tab by default if no tab is specified
  useEffect(() => {
    if (router.isReady && !router.query.tab) {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, tab: 'icons' }
      });
    }
  }, [router.isReady, router.query.tab, router]);

  // Refs no longer needed since tabs are handled by sidebar navigation

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock project data
  useEffect(() => {
    if (id) {
      const mockProject: Project = {
        id: id as string,
        name: 'E-commerce Icons',
        description: 'Complete set of icons for online shopping platform',
        createdAt: '2024-01-15',
        assetCount: 24
      };
      setProject(mockProject);
    }
  }, [id]);

  // Filter assets for this project
  const projectAssets = MOCK_PROJECT_ASSETS.filter((asset: Asset) => asset.projectId === id);
  
  // Group assets by type and filter by search
  const filteredAssets = projectAssets.filter((asset: Asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const iconAssets = filteredAssets.filter((asset: Asset) => asset.category === 'icon');
  const illustrationAssets = filteredAssets.filter((asset: Asset) => asset.category === 'illustration');
  const imageAssets = filteredAssets.filter((asset: Asset) => asset.category === 'image');
  const animationAssets = filteredAssets.filter((asset: Asset) => asset.category === 'animation');

  // Group icons by size
  const iconsBySize = ICON_SIZES.reduce((acc, size) => {
    acc[size] = iconAssets.filter((icon: Asset) => icon.size === size);
    return acc;
  }, {} as Record<string, Asset[]>);

  // Calculate which tabs have results
  const tabsWithResults = PROJECT_TABS.filter(tab => {
    switch (tab.id) {
      case 'icons':
        return iconAssets.length > 0;
      case 'illustrations':
        return illustrationAssets.length > 0;
      case 'images':
        return imageAssets.length > 0;
      case 'animations':
        return animationAssets.length > 0;
      default:
        return false;
    }
  });

  // Check if any assets were found
  const hasAnyResults = filteredAssets.length > 0;

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  // Auto-switch to first available tab if current tab has no results
  useEffect(() => {
    if (tabsWithResults.length > 0 && !tabsWithResults.find(tab => tab.id === activeTab)) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, tab: tabsWithResults[0].id }
      });
    }
  }, [tabsWithResults, activeTab, router]);

  const renderAssetGrid = (assets: Asset[], columns = 'grid-cols-8') => (
    <div className={`grid ${columns} gap-4`}>
      {assets.map((asset) => (
        <div
          key={asset.id}
          onClick={() => handleAssetClick(asset)}
          className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer aspect-square flex items-center justify-center"
        >
          <img
            src={asset.thumbnail}
            alt={asset.name}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-xs text-gray-700 font-medium truncate bg-white bg-opacity-90 px-2 py-1 rounded">
              {asset.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderIllustrationGrid = (assets: Asset[]) => (
    <div className="grid grid-cols-4 gap-6">
      {assets.map((asset) => (
        <div
          key={asset.id}
          onClick={() => handleAssetClick(asset)}
          className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden">
            <img
              src={asset.thumbnail}
              alt={asset.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <p className="text-sm font-medium text-gray-900 truncate">{asset.name}</p>
        </div>
      ))}
    </div>
  );

  if (!project) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <LeftNavigation collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <div className="flex-1 overflow-hidden">
          <main className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="grid grid-cols-8 gap-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <LeftNavigation collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="p-6 pb-0">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <button
                  onClick={() => router.push('/projects')}
                  className="hover:text-gray-700 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Projects
                </button>
                <span>/</span>
                <span className="text-gray-900 font-medium">{project.name}</span>
              </div>

              {/* Project Title & Search */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                </div>
                
                {/* Search */}
                <div className="relative w-80">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

{/* Tab navigation removed - now handled by sidebar */}
            </div>
          </div>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {!hasAnyResults ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No assets found</h3>
                <p className="text-gray-500 mb-4 max-w-md">
                  {searchQuery 
                    ? `No assets match "${searchQuery}". Try adjusting your search terms.`
                    : 'This project doesn\'t contain any assets yet.'
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Icons Tab Content */}
                {activeTab === 'icons' && iconAssets.length > 0 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Icons</h2>
                      <span className="text-sm text-gray-500">
                        {iconAssets.length} icons
                      </span>
                    </div>
                    {ICON_SIZES.map((size) => (
                      <div key={size}>
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-lg font-medium text-gray-900">{size}</h3>
                          <span className="text-sm text-gray-500">
                            {iconsBySize[size]?.length || 0} icons
                          </span>
                        </div>
                        {iconsBySize[size]?.length > 0 ? (
                          renderAssetGrid(iconsBySize[size])
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No {size} icons found
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Illustrations Tab Content */}
                {activeTab === 'illustrations' && illustrationAssets.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Illustrations</h2>
                      <span className="text-sm text-gray-500">
                        {illustrationAssets.length} illustrations
                      </span>
                    </div>
                    {renderIllustrationGrid(illustrationAssets)}
                  </div>
                )}

                {/* Images Tab Content */}
                {activeTab === 'images' && imageAssets.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Images</h2>
                      <span className="text-sm text-gray-500">
                        {imageAssets.length} images
                      </span>
                    </div>
                    {renderIllustrationGrid(imageAssets)}
                  </div>
                )}

                {/* Animations Tab Content */}
                {activeTab === 'animations' && animationAssets.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Animations</h2>
                      <span className="text-sm text-gray-500">
                        {animationAssets.length} animations
                      </span>
                    </div>
                    {renderIllustrationGrid(animationAssets)}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Asset Modal */}
      {selectedAsset && (
        <AssetModal
          asset={selectedAsset}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAsset(null);
          }}
        />
      )}
    </>
  );
}

export default function ProjectDetail() {
  const handleAssetClick = (asset: ContextAsset, type: string) => {
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
      <ProjectDetailPage />
    </AssetProvider>
  );
} 