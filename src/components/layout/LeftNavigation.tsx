'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  FolderOpen,
  BookOpen,
  Gift,
  Settings,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  Image,
  Palette,
  Camera,
  Play,
  Box,
} from 'lucide-react';

interface LeftNavigationProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: Home,
    hasSubItems: true,
    subItems: [
      { label: 'Icons', href: '/?tab=icons', icon: Image },
      { label: 'Illustrations', href: '/?tab=illustrations', icon: Palette },
      { label: 'Images', href: '/?tab=images', icon: Camera },
      { label: 'Animations', href: '/?tab=animations', icon: Play },
      { label: '3D Models', href: '/?tab=3d%20models', icon: Box },
    ]
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: FolderOpen,
  },
  {
    label: 'Library',
    href: '/library',
    icon: BookOpen,
  },
  {
    label: 'Free Assets',
    href: '/free-assets',
    icon: Gift,
  },
];

export default function LeftNavigation({ collapsed, onToggle }: LeftNavigationProps) {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard']); // Dashboard expanded by default

  // Auto-collapse/expand Dashboard subtabs based on sidebar state
  useEffect(() => {
    if (collapsed) {
      // When sidebar collapses, remove Dashboard from expanded items
      setExpandedItems(prev => prev.filter(item => item !== 'Dashboard'));
    } else {
      // When sidebar expands, add Dashboard back to expanded items
      setExpandedItems(prev => 
        prev.includes('Dashboard') ? prev : [...prev, 'Dashboard']
      );
    }
  }, [collapsed]);

  const isActive = (href: string) => {
    if (href.includes('?tab=')) {
      const [basePath, tabQuery] = href.split('?tab=');
      return router.pathname === basePath && router.query.tab === tabQuery;
    }
    return router.pathname === href;
  };

  const isParentActive = (item: any) => {
    if (item.hasSubItems && item.subItems) {
      // Check if any sub-item is active OR if this is Dashboard and we're on homepage
      const subItemActive = item.subItems.some((subItem: any) => isActive(subItem.href));
      const dashboardOnHomepage = item.label === 'Dashboard' && router.pathname === '/';
      return subItemActive || dashboardOnHomepage || router.pathname === item.href;
    }
    return router.pathname === item.href;
  };

  const toggleExpanded = (label: string) => {
    if (collapsed) return; // Don't allow expand/collapse when sidebar is collapsed
    
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleSubItemClick = (subItem: any) => {
    const [basePath, tabQuery] = subItem.href.split('?tab=');
    router.push({
      pathname: basePath,
      query: { ...router.query, tab: tabQuery }
    });
  };

  return (
    <div className={`relative transition-all duration-300 bg-white border-r border-gray-200 shadow-lg h-full ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
   

      <div className="flex flex-col h-full">
        {collapsed ? (
          <>
            {/* Collapsed Header - Hamburger Menu Only */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-center">
                <button
                  onClick={onToggle}
                  className="group p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Menu className="h-5 w-5 transition-transform duration-200 group-hover:rotate-180" />
                </button>
              </div>
            </div>
            
            {/* Collapsed Logo Section */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Expanded Header - Logo + Text + Hamburger */
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900 text-lg">
                  AssetHub
                </h2>
                <p className="text-gray-500 text-sm">
                  Design System
                </p>
              </div>
              <button
                onClick={onToggle}
                className="group p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Menu className="h-5 w-5 transition-transform duration-200 group-hover:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 p-4">
          {!collapsed && (
            <p className="text-gray-500 uppercase tracking-wide mb-4 font-semibold text-xs">
              Platform
            </p>
          )}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isParentActive(item);
              const isExpanded = expandedItems.includes(item.label);
              
              return (
                <div key={item.href}>
                  {/* Main navigation item */}
                  <div
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                      active
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${collapsed ? 'justify-center' : 'space-x-3'}`}
                    onClick={() => {
                      if (item.label === 'Dashboard') {
                        // Navigate to Icons tab when Dashboard is clicked
                        router.push('/?tab=icons');
                        return;
                      }
                      
                      if (item.hasSubItems) {
                        toggleExpanded(item.label);
                      } else {
                        router.push(item.href);
                      }
                    }}
                  >
                    <Icon className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
                    {!collapsed && (
                      <>
                        <span className="font-medium text-sm flex-1">
                          {item.label}
                        </span>
                        {/* Only show chevron for items that are not Dashboard */}
                        {item.hasSubItems && item.label !== 'Dashboard' && (
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`} 
                          />
                        )}
                      </>
                    )}
                  </div>

                  {/* Sub Items */}
                  {expandedItems.includes(item.label) && item.subItems && (
                    <div className="ml-2 space-y-1 mt-1">
                      {item.subItems.map((subItem) => {
                        // Extract tab name from href (e.g., 'icons' from '/?tab=icons')
                        const subTabName = subItem.href.split('tab=')[1];
                        const currentTab = router.query.tab as string;
                        
                        const isSubItemActive = router.asPath === subItem.href || 
                          (router.pathname === '/' && currentTab === subTabName) ||
                          // Default to Icons sub-tab when on homepage with no tab or with icons tab
                          (router.pathname === '/' && (currentTab === 'icons' || !currentTab) && subTabName === 'icons');
                        
                        return (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              isSubItemActive
                                ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <subItem.icon className="h-4 w-4" />
                            {!collapsed && <span>{subItem.label}</span>}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Account Section */}
          {!collapsed && (
            <>
              <p className="text-gray-500 uppercase tracking-wide mb-4 font-semibold mt-8 text-xs">
                Account
              </p>
              <Link href="/settings">
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm">
                    Settings
                  </span>
                </div>
              </Link>
            </>
          )}
          
          {collapsed && (
            <div className="mt-8">
              <Link href="/settings">
                <div className="flex items-center justify-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  <Settings className="w-5 h-5" />
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Footer - User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-gray-200">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            {!collapsed && (
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">
                  John Doe
                </p>
                <p className="text-gray-500 text-xs">
                  john@example.com
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 