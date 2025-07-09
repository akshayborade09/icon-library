'use client';

import React, { useState } from 'react';
import LeftNavigation from './LeftNavigation';
import TopNavigation from './TopNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function MainLayout({ children, activeTab, onTabChange }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Full height */}
      <LeftNavigation collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      {/* Main content area - Header + Content - No right margin/padding */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with tabs */}
        <TopNavigation 
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        
        {/* Page content - Extends to browser edge */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
} 