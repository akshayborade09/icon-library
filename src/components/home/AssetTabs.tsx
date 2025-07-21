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
  const [hasMoreContent, setHasMoreContent] = useState(true);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    if (loading || !hasMoreContent) return;
    
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setLoadedAssets(prev => {
        const currentAssets = prev[type] || [];
        const startIndex = currentAssets.length;
        
        // Define max limits for each type to prevent infinite loading
        const maxLimits = {
          'Icons': 500,
          'Illustrations': 300,
          'Spot Icons': 200,
          'Images': 240,
          'Animations': 150,
          '3D Models': 120
        };
        
        // Check if we've reached the limit
        if (startIndex >= maxLimits[type as keyof typeof maxLimits]) {
          setLoading(false);
          setHasMoreContent(false);
          return prev;
        }
        
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
  }, [loading, hasMoreContent]);

  // Handle scroll for infinite loading and search bar visibility
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Check if search bar is out of view
    if (searchBarRef.current && onScrollVisibilityChange) {
      const searchBarRect = searchBarRef.current.getBoundingClientRect();
      const isSearchBarVisible = searchBarRect.bottom > 0;
      onScrollVisibilityChange(!isSearchBarVisible);
    }
    
    // Throttle infinite scroll checks to prevent excessive calls
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      // Only trigger infinite scroll if:
      // 1. Not currently loading
      // 2. Has more content to load
      // 3. User is near the bottom (with a larger threshold to prevent constant triggering)
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      if (!loading && hasMoreContent && distanceFromBottom < 300) {
        loadMoreAssets(activeTab);
      }
    }, 150); // Throttle to 150ms
  }, [activeTab, loadMoreAssets, onScrollVisibilityChange, loading, hasMoreContent]);

  // Initialize assets on mount
  useEffect(() => {
    initializeAssets();
  }, [initializeAssets]);

  // Reset hasMoreContent when tab changes
  useEffect(() => {
    setHasMoreContent(true);
  }, [activeTab]);

  // Sync local search query with parent
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
        height: 'calc(100vh - 0px)',
        padding: '24px'
      }}
    >
      {/* Inline Search Bar removed - now handled by fixed TabSearch */}
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

        {/* End of Content Indicator */}
        {!loading && !hasMoreContent && getCurrentAssets().length > 0 && (
          <div className="flex justify-center items-center py-8 col-span-full">
            <span className="text-default-500 text-sm">You've reached the end of {activeTab.toLowerCase()}</span>
          </div>
        )}
      </div>
    </div>
  );
} 