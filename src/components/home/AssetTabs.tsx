'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Download,
  Search,
  ChevronDown,
} from 'lucide-react';
import { Button, Input } from '@heroui/react';
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
      className="ml-auto overflow-y-auto scrollbar-thin scrollbar-thumb-default-300 dark:scrollbar-thumb-default-500 scrollbar-track-default-100 dark:scrollbar-track-default-200 bg-background"
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
            <form onSubmit={handleLocalSearchSubmit}>
              <Input
                type="search"
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={localSearchQuery}
                onChange={(e) => handleLocalSearch(e.target.value)}
                startContent={<Search className="h-4 w-4 text-default-400" strokeWidth={2} />}
                variant="bordered"
                radius="lg"
                classNames={{
                  base: "w-full",
                  mainWrapper: "h-full",
                  input: "text-small",
                  inputWrapper: "h-12 bg-default-50 dark:bg-default-100 border-default-200 dark:border-default-300 data-[hover=true]:border-default-400 group-data-[focus=true]:border-primary-500"
                }}
              />
            </form>
          </div>

          {/* Filters and Sort - Only show for Icons */}
          {activeTab === 'Icons' && (
            <div className="flex items-center gap-3">
              {/* Size Filter */}
              <div className="relative">
                <Button
                  onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                  variant="bordered"
                  radius="lg"
                  endContent={<ChevronDown className="h-4 w-4" strokeWidth={2} />}
                  className="min-w-[100px] bg-default-50 dark:bg-default-100 border-default-200 dark:border-default-300 text-default-700 dark:text-default-600 data-[hover=true]:bg-default-100 dark:data-[hover=true]:bg-default-200 data-[hover=true]:border-default-400"
                >
                  Size: {selectedSize === 'all' ? 'All' : selectedSize}
                </Button>
                
                {sizeDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-content1 border border-default-200 dark:border-default-300 rounded-large z-10 min-w-[120px] overflow-hidden">
                    {['all', '16px', '24px', '32px'].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          onSizeChange?.(size);
                          setSizeDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-small text-default-700 dark:text-default-600 hover:bg-default-100 dark:hover:bg-default-200 transition-colors"
                      >
                        {size === 'all' ? 'All Sizes' : size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <Button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  variant="bordered"
                  radius="lg"
                  endContent={<ChevronDown className="h-4 w-4" strokeWidth={2} />}
                  className="min-w-[120px] bg-default-50 dark:bg-default-100 border-default-200 dark:border-default-300 text-default-700 dark:text-default-600 data-[hover=true]:bg-default-100 dark:data-[hover=true]:bg-default-200 data-[hover=true]:border-default-400"
                >
                  Sort: {sortBy === 'popular' ? 'Popular' : sortBy === 'newest' ? 'Newest' : 'Downloads'}
                </Button>
                
                {sortDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-content1 border border-default-200 dark:border-default-300 rounded-large z-10 min-w-[120px] overflow-hidden">
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
                        className="block w-full text-left px-4 py-3 text-small text-default-700 dark:text-default-600 hover:bg-default-100 dark:hover:bg-default-200 transition-colors"
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
                <Button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  variant="bordered"
                  radius="lg"
                  endContent={<ChevronDown className="h-4 w-4" strokeWidth={2} />}
                  className="min-w-[120px] bg-default-50 dark:bg-default-100 border-default-200 dark:border-default-300 text-default-700 dark:text-default-600 data-[hover=true]:bg-default-100 dark:data-[hover=true]:bg-default-200 data-[hover=true]:border-default-400"
                >
                  Sort: {sortBy === 'popular' ? 'Popular' : sortBy === 'newest' ? 'Newest' : 'Downloads'}
                </Button>
                
                {sortDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-content1 border border-default-200 dark:border-default-300 rounded-large z-10 min-w-[120px] overflow-hidden">
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
                        className="block w-full text-left px-4 py-3 text-small text-default-700 dark:text-default-600 hover:bg-default-100 dark:hover:bg-default-200 transition-colors"
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
      <div className="infinite-icon-grid max-w-[1400px] mx-auto">
        {getCurrentAssets().map((asset) => (
          <div
            key={asset.id}
            onClick={() => handleAssetClick(asset, activeTab)}
            className="group bg-content1 border border-default-200 dark:border-default-300 rounded-large hover:bg-content2 dark:hover:bg-default-100 hover:border-default-400 dark:hover:border-default-500 transition-all duration-200 cursor-pointer overflow-hidden w-full"
          >
            {/* Asset Preview */}
            <div className="aspect-square bg-default-50 dark:bg-default-100 flex items-center justify-center relative overflow-hidden">
              <div className="text-4xl text-default-600 dark:text-default-500">
                {asset.preview}
              </div>
            </div>
            
            {/* Asset Info */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-small font-medium text-default-900 dark:text-default-100 truncate">
                  {asset.name}
                </h4>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-default-500 hover:text-primary-500"
                >
                  <Download className="h-4 w-4" strokeWidth={2} />
                </Button>
              </div>
              <div className="flex items-center justify-between text-tiny text-default-500 mt-2">
                <span className="font-medium">{asset.downloads.toLocaleString()} downloads</span>
                {asset.size && (
                  <span className="px-2 py-1 bg-default-100 dark:bg-default-200 text-default-600 dark:text-default-700 rounded-medium font-medium">
                    {asset.size}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12 col-span-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-default-200 dark:border-default-300 border-t-primary-500"></div>
            <span className="ml-3 text-default-600 dark:text-default-500 font-medium">Loading more {activeTab.toLowerCase()}...</span>
          </div>
        )}
      </div>
    </div>
  );
} 