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
import ThemeToggle from '@/components/ui/ThemeToggle';

// Remove LeftNavigationProps and props
// interface LeftNavigationProps {
//   collapsed: boolean;
//   onToggle: () => void;
// }

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

export default function LeftNavigation() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard']); // Dashboard expanded by default

  // Auto-collapse/expand Dashboard subtabs based on sidebar state
  useEffect(() => {
    if (collapsed) {
      setExpandedItems(prev => prev.filter(item => item !== 'Dashboard'));
    } else {
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
    <div className={`relative transition-all duration-300 bg-content1 border-r border-divider h-full ${
      collapsed ? 'w-20' : 'w-72'
    }`}>
   

      <div className="flex flex-col h-full">
        {collapsed ? (
          <>
            {/* Collapsed Header - Hamburger Menu Only */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 min-h-20">
              <div className="flex justify-center">
                <button
                  onClick={() => setCollapsed((prev) => !prev)}
                  className="group p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Menu className="h-5 w-5 transition-transform duration-200" strokeWidth={2} />
                </button>
              </div>
            </div>
            
            {/* Collapsed Logo Section */}
            {/* <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl">
                  <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
              </div>
            </div> */}
          </>
        ) : (
          /* Expanded Header - Logo + Text + Hamburger */
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 min-h-20">
          <div className="flex items-center space-x-3">
            {/* <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
            </div> */}
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                  AssetHub
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Design System
                </p>
              </div>
              <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="group p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Menu className="h-5 w-5 transition-transform duration-200" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 p-4 flex flex-col">
          {/* {!collapsed && (
            <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 font-medium mt-2 text-xs">
              Platform
            </p>
          )} */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isParentActive(item);
              const isExpanded = expandedItems.includes(item.label);
              
              return (
                <div key={item.href}>
                  {/* Main navigation item */}
                  <div
                    className={`flex items-center pl-3 pr-3 py-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                      active
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    } ${collapsed ? 'justify-center' : 'space-x-3'}`}
                    onClick={() => {
                      if (item.label === 'Dashboard') {
                        // Navigate to Icons tab when Dashboard is clicked
                        router.push('/?tab=icons');
                        return;
                      }
                      
                      if (item.hasSubItems && !collapsed) {
                        // Only allow expanding sub-items when sidebar is not collapsed
                        toggleExpanded(item.label);
                      } else {
                        // When collapsed or no sub-items, just navigate
                        router.push(item.href);
                      }
                    }}
                  >
                    <Icon className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} strokeWidth={2} />
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
                    <div className="ml-2 mt-1">
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
                            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-3xl mb-0.5 transition-all duration-200 ${
                              isSubItemActive
                                ? 'bg-gray-100 dark:bg-primary-900/30 text-gray-900 dark:text-gray-200'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                          >
                            <subItem.icon className="h-4 w-4" strokeWidth={2} />
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

          {/* Theme Toggle */}
          {/* {!collapsed && (
            <div className="mt-6">
              <ThemeToggle collapsed={collapsed} />
            </div>
          )}
           */}
          {/* Account Section */}
          {!collapsed && (
            <>
              <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 font-medium mt-8 text-xs">
                Account
              </p>
              <Link href="/settings">
                <div className="flex items-center space-x-3 px-3 py-2 rounded-3xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                  <Settings className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                  <span className="font-medium text-sm">
                    Settings
                  </span>
                </div>
              </Link>
            </>
          )}
          
          {collapsed && (
            <div className="mt-8 space-y-3">
              {/* <div className="flex justify-center">
                <ThemeToggle collapsed={collapsed} />
              </div> */}
              <Link href="/settings">
                <div className="flex items-center justify-center px-2 py-2.5 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                  <Settings className="w-5 h-5" strokeWidth={2} />
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Footer - User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-300" strokeWidth={2} />
            </div>
            {!collapsed && (
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  John Doe
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
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