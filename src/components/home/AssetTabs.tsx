'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download,
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
  onAssetClick 
}: AssetTabsProps) {
  const { uploadedAssets } = useAsset();
  const [loadedAssets, setLoadedAssets] = useState<{ [key: string]: Asset[] }>({});
  const [loading, setLoading] = useState(false);

  // Initialize assets for each type
  const initializeAssets = useCallback(() => {
    const initialAssets = {
      'Icons': generateAssets('Icon', 500, 23, 0, 24),
      'Illustrations': generateAssets('Illustration', 300, 15, 0, 24),
      'Spot Icons': generateAssets('Spot', 200, 12, 0, 24),
      'Images': generateAssets('Image', 800, 31, 0, 24),
      'Animations': generateAssets('Animation', 150, 8, 0, 24),
      '3D Models': generateAssets('3D', 100, 5, 0, 24),
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
        
        const newAssets = generateAssets(
          type === 'Spot Icons' ? 'Spot' : type === '3D Models' ? '3D' : type.slice(0, -1), // Remove 's' from plural
          baseValues[type as keyof typeof baseValues],
          increments[type as keyof typeof increments],
          startIndex,
          12
        );
        
        return {
          ...prev,
          [type]: [...currentAssets, ...newAssets]
        };
      });
      setLoading(false);
    }, 300);
  }, [loading]);

  // Handle scroll for infinite loading
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreAssets(activeTab);
    }
  }, [activeTab, loadMoreAssets]);

  // Initialize assets on mount
  useEffect(() => {
    initializeAssets();
  }, [initializeAssets]);

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