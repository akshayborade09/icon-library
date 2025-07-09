'use client';

import React from 'react';
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
  Menu,
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

  const isActive = (href: string) => {
    return router.pathname === href;
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
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                      active
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${collapsed ? 'justify-center' : 'space-x-3'}`}
                  >
                    <Icon className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
                    {!collapsed && (
                      <span className="font-medium text-sm">
                        {item.label}
                      </span>
                    )}
                  </div>
                </Link>
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