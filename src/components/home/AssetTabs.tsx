'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Download,
  Search,
  ChevronDown,
} from 'lucide-react';
import { useAsset } from '@/contexts/AssetContext';

interface Asset {
  id: number;
  name: string;
  preview: string;
  downloads: number;
  size?: string;
}

interface AssetTabsProps {
  activeTab: string;
  selectedSize?: string;
  sortBy?: string;
  searchQuery?: string;
  onAssetClick?: (asset: Asset, type: string) => void;
  onSearch?: (query: string) => void;
  onSizeChange?: (size: string) => void;
  onSortChange?: (sort: string) => void;
  onScrollVisibilityChange?: (visible: boolean) => void;
}

// SSR-safe asset generation with infinite capability
const generateAssets = (type: string, baseValue: number, increment: number, startIndex: number = 0, length: number = 24): Asset[] => {
  const iconEmojis = ['🎨', '🖌️', '✏️', '🖍️', '🖊️', '✒️', '🖋️', '📐', '📏', '📌', '📍', '🎯'];
  const illustrationEmojis = ['🖼️', '🎭', '🎪', '🎨', '🖌️', '🌈', '🎭', '🎪', '🎨', '🌟', '⭐', '✨'];
  const spotEmojis = ['⭐', '✨', '💫', '🌟', '🔥', '💎', '🏆', '👑', '🎖️', '🏅', '🥇', '🌠'];
  const imageEmojis = ['📸', '📷', '🖼️', '🌅', '🌄', '🌇', '🌆', '🏞️', '🎞️', '📹', '🎥', '📺'];
  const animationEmojis = ['🎬', '🎭', '🎪', '🎨', '🎯', '🎲', '🎳', '🎮', '🕹️', '🎰', '🎱', '🎪'];
  const threeDEmojis = ['🎲', '📦', '🧊', '🔲', '⬛', '🔳', '⬜', '🔘', '🎯', '🎪', '🎭', '🎨'];

  const emojiMap = {
    'Icon': iconEmojis,
    'Illustration': illustrationEmojis,
    'Spot': spotEmojis,
    'Image': imageEmojis,
    'Animation': animationEmojis,
    '3D': threeDEmojis
  };

  const emojis = emojiMap[type as keyof typeof emojiMap] || iconEmojis;

  return Array.from({ length }, (_, i) => {
    const actualIndex = startIndex + i;
    return {
      id: actualIndex + 1,
      name: `${type} ${actualIndex + 1}`,
      preview: emojis[actualIndex % emojis.length],
      downloads: baseValue + (actualIndex * increment),
      size: type === 'Icon' ? ['16px', '24px', '32px'][actualIndex % 3] : undefined,
    };
  });
};

// Asset generation helper function

export default function AssetTabs({ 
  activeTab, 
  selectedSize = 'all',
  sortBy = 'popular',
  searchQuery = '',
  onAssetClick,
  onSearch,
  onSizeChange,
  onSortChange,
  onScrollVisibilityChange
}: AssetTabsProps) {
  const { uploadedAssets } = useAsset();
  const [loadedAssets, setLoadedAssets] = useState<{ [key: string]: Asset[] }>({});
  const [loading, setLoading] = useState(false);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Initialize assets for each type
  const initializeAssets = useCallback(() => {
    const initialAssets = {
      'Icons': generateAssets('Icon', 500, 23, 0, 96),
      'Illustrations': generateAssets('Illustration', 300, 15, 0, 72),
      'Spot Icons': generateAssets('Spot', 200, 12, 0, 48),
      'Images': generateAssets('Image', 800, 31, 0, 60),
      'Animations': generateAssets('Animation', 150, 8, 0, 36),
      '3D Models': generateAssets('3D', 100, 5, 0, 30),
    };
    setLoadedAssets(initialAssets);
  }, []);

  // Load more assets for infinite scroll
  const loadMoreAssets = useCallback((type: string) => {
    if (loading) return;
    
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setLoadedAssets(prev => {
        const currentAssets = prev[type] || [];
        const startIndex = currentAssets.length;
        const baseValues = {
          'Icons': 500,
          'Illustrations': 300,
          'Spot Icons': 200,
          'Images': 800,
          'Animations': 150,
          '3D Models': 100
        };
        const increments = {
          'Icons': 23,
          'Illustrations': 15,
          'Spot Icons': 12,
          'Images': 31,
          'Animations': 8,
          '3D Models': 5
        };
        
        const loadMoreCounts = {
          'Icons': 24,
          'Illustrations': 18,
          'Spot Icons': 12,
          'Images': 15,
          'Animations': 9,
          '3D Models': 6
        };
        
        const newAssets = generateAssets(
          type === 'Spot Icons' ? 'Spot' : type === '3D Models' ? '3D' : type.slice(0, -1), // Remove 's' from plural
          baseValues[type as keyof typeof baseValues],
          increments[type as keyof typeof increments],
          startIndex,
          loadMoreCounts[type as keyof typeof loadMoreCounts]
        );
        
        return {
          ...prev,
          [type]: [...currentAssets, ...newAssets]
        };
      });
      setLoading(false);
    }, 300);
  }, [loading]);

  // Handle scroll for infinite loading and search bar visibility
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Check if search bar is out of view
    if (searchBarRef.current && onScrollVisibilityChange) {
      const searchBarRect = searchBarRef.current.getBoundingClientRect();
      const isSearchBarVisible = searchBarRect.bottom > 0;
      onScrollVisibilityChange(!isSearchBarVisible);
    }
    
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreAssets(activeTab);
    }
  }, [activeTab, loadMoreAssets, onScrollVisibilityChange]);

  // Initialize assets on mount
  useEffect(() => {
    initializeAssets();
  }, [initializeAssets]);

  // Sync local search query with parent
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleLocalSearch = (value: string) => {
    setLocalSearchQuery(value);
    onSearch?.(value);
  };

  const handleLocalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearchQuery);
  };

  const handleAssetClick = (asset: Asset, type: string) => {
    if (onAssetClick) {
      onAssetClick(asset, type);
    }
  };

  const getCurrentAssets = () => {
    let assets = loadedAssets[activeTab] || [];
    
    // Add uploaded assets based on active tab
    const getUploadedAssetsForTab = () => {
      const tabCategoryMap: { [key: string]: string } = {
        'Icons': 'icon',
        'Illustrations': 'illustration', 
        'Images': 'image',
        '3D Models': '3d'
      };
      
      const targetCategory = tabCategoryMap[activeTab];
      if (!targetCategory) return [];
      
      return uploadedAssets
        .filter(asset => asset.category === targetCategory)
        .map(asset => ({
          id: parseInt(asset.id, 36), // Convert string ID to number for compatibility
          name: asset.name,
          preview: asset.preview,
          downloads: asset.downloads,
          size: asset.size
        }));
    };
    
    // Combine uploaded assets with generated assets
    const uploadedForTab = getUploadedAssetsForTab();
    assets = [...uploadedForTab, ...assets];
    
    // Apply size filter for Icons
    if (activeTab === 'Icons' && selectedSize !== 'all') {
      assets = assets.filter(asset => asset.size === selectedSize);
    }
    
    // Apply search filter
    if (searchQuery) {
      assets = assets.filter(asset => 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting - Always sort by name in ascending order first
    assets = [...assets].sort((a, b) => {
      // Primary sort: Alphabetical by name (A-Z)
      const nameCompare = a.name.localeCompare(b.name);
      if (nameCompare !== 0) return nameCompare;
      
      // Secondary sort: Apply user's selected sort criteria
      switch (sortBy) {
        case 'downloads':
          return b.downloads - a.downloads;
        case 'newest':
          return b.id - a.id;
        case 'popular':
        default:
          return b.downloads - a.downloads;
      }
    });
    
    return assets;
  };

  return (
    <div 
      className="ml-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      onScroll={handleScroll}
      style={{
        height: 'calc(100vh - 132px)',
        padding: '24px'
      }}
    >
      {/* Inline Search Bar */}
      <div ref={searchBarRef} className="mb-6">
        <div className="flex items-center max-w-[1400px] mx-auto gap-4 px-10">
          {/* Search */}
          <div className="flex-1">
            <form onSubmit={handleLocalSearchSubmit} className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-all duration-200 group-hover:text-blue-500 group-focus-within:text-blue-500" />
              <input
                type="search"
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={localSearchQuery}
                onChange={(e) => handleLocalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
              />
            </form>
          </div>

          {/* Filters and Sort - Only show for Icons */}
          {activeTab === 'Icons' && (
            <div className="flex items-center gap-3">
              {/* Size Filter */}
              <div className="relative">
                <button
                  onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:border-gray-400 transition-colors bg-white"
                >
                  Size: {selectedSize === 'all' ? 'All' : selectedSize}
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {sizeDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                    {['all', '16px', '24px', '32px'].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          onSizeChange?.(size);
                          setSizeDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {size === 'all' ? 'All Sizes' : size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:border-gray-400 transition-colors bg-white"
                >
                  Sort: {sortBy === 'popular' ? 'Popular' : sortBy === 'newest' ? 'Newest' : 'Downloads'}
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {sortDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                    {[
                      { value: 'popular', label: 'Popular' },
                      { value: 'newest', label: 'Newest' },
                      { value: 'downloads', label: 'Downloads' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortChange?.(option.value);
                          setSortDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Filter & Sort for other tabs */}
          {activeTab !== 'Icons' && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:border-gray-400 transition-colors bg-white"
                >
                  Sort: {sortBy === 'popular' ? 'Popular' : sortBy === 'newest' ? 'Newest' : 'Downloads'}
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {sortDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                    {[
                      { value: 'popular', label: 'Popular' },
                      { value: 'newest', label: 'Newest' },
                      { value: 'downloads', label: 'Downloads' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortChange?.(option.value);
                          setSortDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Icon Grid */}
      <div className="infinite-icon-grid px-16">
        {getCurrentAssets().map((asset) => (
          <div
            key={asset.id}
            onClick={() => handleAssetClick(asset, activeTab)}
            className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden w-full max-w-[220px]"
          >
            {/* Asset Preview */}
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {asset.preview}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300" />
            </div>
            
            {/* Asset Info */}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {asset.name}
                </h4>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>{asset.downloads.toLocaleString()} downloads</span>
                {asset.size && <span>{asset.size}</span>}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8 col-span-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading more {activeTab.toLowerCase()}...</span>
          </div>
        )}
      </div>
    </div>
  );
} 