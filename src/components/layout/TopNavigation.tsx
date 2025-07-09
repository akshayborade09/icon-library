'use client';

import React from 'react';
import { Image, Palette, Sparkles, Camera, Play, Box } from 'lucide-react';

interface TopNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

// SSR-safe icon mapping function
const getTabIcon = (name: string) => {
  switch (name) {
    case 'Icons': return Image;
    case 'Illustrations': return Palette;
    case 'Spot Icons': return Sparkles;
    case 'Images': return Camera;
    case 'Animations': return Play;
    case '3D Models': return Box;
    default: return Image;
  }
};

export default function TopNavigation({ 
  activeTab = 'Icons',
  onTabChange 
}: TopNavigationProps) {


  const assetTypes = [
    { name: 'Icons' },
    { name: 'Illustrations' },
    { name: 'Spot Icons' },
    { name: 'Images' },
    { name: 'Animations' },
    { name: '3D Models' },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Empty space */}
          <div className="flex items-center gap-2 px-4">
          </div>
          
          {/* Center: Tab Navigation */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
              {assetTypes.map((type) => {
                const Icon = getTabIcon(type.name);
                const isActive = activeTab === type.name;
                return (
                  <button
                    key={type.name}
                    onClick={() => onTabChange?.(type.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Empty space */}
          <div className="flex items-center gap-2 px-4">
          </div>
        </div>
      </header>


    </>
  );
} 