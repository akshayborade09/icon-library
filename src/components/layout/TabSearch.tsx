'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface TabSearchProps {
  activeTab: string;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  selectedSize?: string;
  onSizeChange?: (size: string) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}

export default function TabSearch({ 
  activeTab, 
  onSearch,
  searchQuery: externalSearchQuery = '',
  selectedSize = 'all',
  onSizeChange,
  sortBy = 'popular',
  onSortChange
}: TabSearchProps) {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Sync with external search query
  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 transition-all duration-200 group-hover:text-primary-500 group-focus-within:text-primary-500" strokeWidth={2} />
            <input
              type="search"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </form>
        </div>

        {/* Filters and Sort - Only show for Icons */}
        {activeTab === 'Icons' && (
          <div className="flex items-center gap-3">
            {/* Size Filter */}
            <div className="relative">
              <button
                onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200"
              >
                Size: {selectedSize === 'all' ? 'All' : selectedSize}
                <ChevronDown className="h-4 w-4" strokeWidth={2} />
              </button>
              
              {sizeDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 min-w-[120px] backdrop-blur-sm">
                  {['all', '16px', '24px', '32px'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        onSizeChange?.(size);
                        setSizeDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 first:rounded-t-xl last:rounded-b-xl transition-colors duration-200"
                    >
                      {size === 'all' ? 'All Sizes' : size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200"
              >
                Sort: {sortBy === 'popular' ? 'Popular' : sortBy === 'newest' ? 'Newest' : 'Downloads'}
                <ChevronDown className="h-4 w-4" strokeWidth={2} />
              </button>
              
              {sortDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 min-w-[120px] backdrop-blur-sm">
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
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 first:rounded-t-xl last:rounded-b-xl transition-colors duration-200"
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
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200"
              >
                Sort: {sortBy === 'popular' ? 'Popular' : sortBy === 'newest' ? 'Newest' : 'Downloads'}
                <ChevronDown className="h-4 w-4" strokeWidth={2} />
              </button>
              
              {sortDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 min-w-[120px] backdrop-blur-sm">
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
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 first:rounded-t-xl last:rounded-b-xl transition-colors duration-200"
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
  );
} 