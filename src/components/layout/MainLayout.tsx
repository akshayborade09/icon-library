'use client';

import React, { useState, ReactNode } from 'react';
import LeftNavigation from './LeftNavigation';
import TopNavigation from './TopNavigation';
import PageHeader from './PageHeader';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  pageHeader?: {
    title: string;
    description: string;
    actions?: ReactNode;
  };
}

export default function MainLayout({ 
  children, 
  activeTab, 
  onTabChange,
  pageHeader 
}: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Full height */}
      <LeftNavigation collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      {/* Main content area - Header + Content - No right margin/padding */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with tabs */}
        <TopNavigation 
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        
        {/* Optional Page Header */}
        {pageHeader && (
          <PageHeader
            title={pageHeader.title}
            description={pageHeader.description}
            actions={pageHeader.actions}
          />
        )}
        
        {/* Page content - Extends to browser edge */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
} 