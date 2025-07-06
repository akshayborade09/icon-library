'use client';

import React, { useState } from 'react';
import { 
  Folder, 
  Image, 
  Palette, 
  Sparkles, 
  Camera, 
  Play, 
  Box,
  ChevronDown,
  Download,
  Clock,
  Users,
  ArrowRight
} from 'lucide-react';

interface Asset {
  id: number;
  name: string;
  preview: string;
  downloads: number;
  size?: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  assetCount: number;
  memberCount: number;
  lastUpdated: string;
  color: string;
  thumbnail: string;
}

interface AssetTabsProps {
  onAssetClick?: (asset: Asset, type: string) => void;
  onCreateProject?: () => void;
}

// Mock projects data
const mockProjects: Project[] = [
  {
    id: 1,
    name: "E-commerce UI Kit",
    description: "Complete UI components for online stores",
    assetCount: 45,
    memberCount: 3,
    lastUpdated: "2 hours ago",
    color: "from-blue-400 to-blue-600",
    thumbnail: "🛒"
  },
  {
    id: 2,
    name: "Banking App Icons",
    description: "Financial and payment related icons",
    assetCount: 28,
    memberCount: 2,
    lastUpdated: "1 day ago",
    color: "from-green-400 to-green-600",
    thumbnail: "💳"
  },
  {
    id: 3,
    name: "Travel Illustrations",
    description: "Beautiful travel and adventure graphics",
    assetCount: 32,
    memberCount: 4,
    lastUpdated: "3 days ago",
    color: "from-purple-400 to-purple-600",
    thumbnail: "✈️"
  },
  {
    id: 4,
    name: "Social Media Pack",
    description: "Icons and templates for social platforms",
    assetCount: 67,
    memberCount: 5,
    lastUpdated: "1 week ago",
    color: "from-pink-400 to-pink-600",
    thumbnail: "📱"
  },
  {
    id: 5,
    name: "Dashboard Components",
    description: "Analytics and data visualization assets",
    assetCount: 23,
    memberCount: 2,
    lastUpdated: "2 weeks ago",
    color: "from-orange-400 to-orange-600",
    thumbnail: "📊"
  },
  {
    id: 6,
    name: "Create New Project",
    description: "Start a fresh project",
    assetCount: 0,
    memberCount: 0,
    lastUpdated: "",
    color: "from-gray-100 to-gray-200",
    thumbnail: "+"
  }
];

// SSR-safe asset generation
const generateAssets = (type: string, baseValue: number, increment: number): Asset[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `${type} ${i + 1}`,
    preview: type === 'Icon' ? '🎨' : type === 'Illustration' ? '🖼️' : type === 'Spot' ? '⭐' : type === 'Image' ? '📸' : type === 'Animation' ? '🎬' : '🎲',
    downloads: baseValue + (i * increment),
    size: type === 'Icon' ? ['16px', '24px', '32px'][i % 3] : undefined,
  }));
};

// SSR-safe icon mapping function
const getIcon = (name: string) => {
  switch (name) {
    case 'Projects': return Folder;
    case 'Icons': return Image;
    case 'Illustrations': return Palette;
    case 'Spot Icons': return Sparkles;
    case 'Images': return Camera;
    case 'Animations': return Play;
    case '3D Models': return Box;
    default: return Folder;
  }
};

export default function AssetTabs({ onAssetClick, onCreateProject }: AssetTabsProps) {
  const [activeTab, setActiveTab] = useState('Projects');
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const assetTypes = [
    { name: 'Projects', assets: [] },
    { name: 'Icons', assets: generateAssets('Icon', 500, 23) },
    { name: 'Illustrations', assets: generateAssets('Illustration', 300, 15) },
    { name: 'Spot Icons', assets: generateAssets('Spot', 200, 12) },
    { name: 'Images', assets: generateAssets('Image', 800, 31) },
    { name: 'Animations', assets: generateAssets('Animation', 150, 8) },
    { name: '3D Models', assets: generateAssets('3D', 100, 5) },
  ];

  const handleAssetClick = (asset: Asset, type: string) => {
    if (onAssetClick) {
      onAssetClick(asset, type);
    }
  };

  const handleCreateProjectClick = () => {
    if (onCreateProject) {
      onCreateProject();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="tab-list grid grid-cols-7">
        {assetTypes.map((type) => {
          const Icon = getIcon(type.name);
          return (
            <button
              key={type.name}
              onClick={() => setActiveTab(type.name)}
              className={`tab-trigger flex items-center gap-2 px-3 py-2 ${
                activeTab === type.name ? 'active' : ''
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">{type.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Projects Tab */}
        {activeTab === 'Projects' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProjects.map((project) => (
              <div 
                key={project.id} 
                className="card group cursor-pointer"
                onClick={() => project.name === "Create New Project" ? handleCreateProjectClick() : undefined}
              >
                <div className="card-content">
                  <div className="space-y-4">
                    {/* Project Header */}
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 ${
                        project.name === "Create New Project" ? "border-2 border-dashed border-gray-300" : ""
                      }`}>
                        <span className="text-2xl filter drop-shadow-sm">{project.thumbnail}</span>
                      </div>
                      {project.lastUpdated && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {project.lastUpdated}
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm leading-tight">{project.name}</h4>
                      <p className="text-xs text-gray-500">{project.description}</p>
                    </div>

                    {/* Project Stats */}
                    {project.name !== "Create New Project" && (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="badge badge-secondary">
                            {project.assetCount} assets
                          </span>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Users className="h-3 w-3" />
                            {project.memberCount}
                          </div>
                        </div>
                        <ArrowRight className="h-3 w-3 text-gray-500 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Asset Tabs */}
        {assetTypes.slice(1).map((type) => (
          activeTab === type.name && (
            <div key={type.name} className="space-y-4">
              {/* Controls */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{type.name}</h3>
                <div className="flex items-center gap-2">
                  {type.name === 'Icons' && (
                    <div className="relative">
                      <button
                        onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                        className="btn btn-outline btn-sm"
                      >
                        All Sizes
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </button>
                      {sizeDropdownOpen && (
                        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setSelectedSize('all');
                                setSizeDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              All Sizes
                            </button>
                            <button
                              onClick={() => {
                                setSelectedSize('16');
                                setSizeDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              16px
                            </button>
                            <button
                              onClick={() => {
                                setSelectedSize('24');
                                setSizeDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              24px
                            </button>
                            <button
                              onClick={() => {
                                setSelectedSize('32');
                                setSizeDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              32px
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="relative">
                    <button
                      onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                      className="btn btn-outline btn-sm"
                    >
                      Popular
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </button>
                    {sortDropdownOpen && (
                      <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSortBy('popular');
                              setSortDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            Popular
                          </button>
                          <button
                            onClick={() => {
                              setSortBy('newest');
                              setSortDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            Newest
                          </button>
                          <button
                            onClick={() => {
                              setSortBy('downloads');
                              setSortDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            Downloads
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Asset Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {type.assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="card group cursor-pointer"
                    onClick={() => handleAssetClick(asset, type.name)}
                  >
                    <div className="p-4">
                      <div className="space-y-3">
                        {/* Asset Preview */}
                        <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                          <span className="text-3xl">{asset.preview}</span>
                        </div>
                        
                        {/* Asset Info */}
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm truncate">{asset.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {asset.downloads.toLocaleString()}
                            </div>
                            {asset.size && (
                              <span className="badge badge-secondary">
                                {asset.size}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
} 