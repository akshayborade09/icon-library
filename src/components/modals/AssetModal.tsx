'use client';

import React, { useState } from 'react';
import { X, Download, Copy, Palette } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  thumbnail: string;
  size: string;
  category: 'icon' | 'illustration' | 'image' | 'animation';
  downloads: number;
}

interface AssetModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
}

const colorTokens = [
  { name: 'Primary', value: '#3B82F6' },
  { name: 'Secondary', value: '#6B7280' },
  { name: 'Success', value: '#10B981' },
  { name: 'Warning', value: '#F59E0B' },
  { name: 'Error', value: '#EF4444' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
];

const codeExamples = {
  react: `import { ShoppingCart } from 'lucide-react';

function MyComponent() {
  return (
    <ShoppingCart className="w-6 h-6 text-blue-600" />
  );
}`,
  web: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17A2 2 0 0115 19H9A2 2 0 017 17V13M17 13H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  vue: `<template>
  <ShoppingCartIcon class="w-6 h-6 text-blue-600" />
</template>

<script>
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    ShoppingCartIcon
  }
}
</script>`,
  flutter: `import 'package:flutter/material.dart';

Icon(
  Icons.shopping_cart,
  size: 24.0,
  color: Colors.blue,
)`,
  swift: `import SwiftUI

Image(systemName: "cart")
  .font(.system(size: 24))
  .foregroundColor(.blue)`
};

export default function AssetModal({ asset, isOpen, onClose }: AssetModalProps) {
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [customColor, setCustomColor] = useState('#3B82F6');
  const [activeCodeTab, setActiveCodeTab] = useState('react');

  const downloadOptions = [
    { label: 'SVG Download', action: () => console.log('Download SVG') },
    { label: 'SVG Copy', action: () => console.log('Copy SVG') },
    { label: 'PNG Copy', action: () => console.log('Copy PNG') },
    { label: 'PNG Download', action: () => console.log('Download PNG') },
    { label: 'iOS PNG (1x, 2x, 3x)', action: () => console.log('Download iOS PNG') },
    { label: 'PDF Download', action: () => console.log('Download PDF') },
  ];

  const codeList = ['react', 'web', 'vue', 'flutter', 'swift'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{asset.name}</h2>
            <p className="text-sm text-gray-500">{asset.size}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex">
          {/* Left side - Asset Preview */}
          <div className="flex-1 p-6">
            <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center mb-6" style={{ minHeight: '100px' }}>
              <img 
                src={asset.thumbnail} 
                alt={asset.name}
                className="max-w-full max-h-full object-contain"
                style={{ color: selectedColor }}
              />
            </div>
            
            {/* Downloads count */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Download className="h-4 w-4" />
              <span>{asset.downloads} downloads</span>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="w-80 border-l border-gray-200 p-6 space-y-6">
            {/* Color Options */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Apply Color
              </h3>
              
              {/* Predefined Colors */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {colorTokens.map((token) => (
                  <button
                    key={token.name}
                    onClick={() => setSelectedColor(token.value)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      selectedColor === token.value ? 'border-blue-500 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: token.value }}
                    title={token.name}
                  />
                ))}
              </div>
              
              {/* Custom Color */}
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setSelectedColor(e.target.value);
                  }}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setSelectedColor(e.target.value);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            {/* Download Options */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Download Options</h3>
              <div className="space-y-2">
                {downloadOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={option.action}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Tabs - Only for icons */}
            {asset.category === 'icon' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Code</h3>
                
                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-3 bg-gray-100 rounded-lg p-1">
                  {codeList.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveCodeTab(tab)}
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                        activeCodeTab === tab
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                
                {/* Code Content */}
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                    <code>{codeExamples[activeCodeTab as keyof typeof codeExamples]}</code>
                  </pre>
                  <button
                    onClick={() => navigator.clipboard.writeText(codeExamples[activeCodeTab as keyof typeof codeExamples])}
                    className="absolute top-2 right-2 p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                    title="Copy code"
                  >
                    <Copy className="h-3 w-3 text-gray-300" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 