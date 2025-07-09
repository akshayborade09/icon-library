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
  tags: `Related Tags:
• Shopping
• E-commerce  
• Cart
• Store
• Purchase
• Retail`,
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
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [customColor, setCustomColor] = useState('#000000');
  const [activeTab, setActiveTab] = useState('tags');

  const downloadOptions = [
    { label: 'svg', format: 'svg' },
    { label: 'png', format: 'png' },
    { label: 'jpg', format: 'jpg' },
    { label: 'png ↓', format: 'png-download' },
    { label: 'ico png', format: 'ico' },
    { label: 'pdf ↓', format: 'pdf' },
  ];

  const tabs = [
    { key: 'tags', label: 'Tags' },
    { key: 'react', label: 'React' },
    { key: 'web', label: 'Web' },
    { key: 'vue', label: 'Vue' },
    { key: 'flutter', label: 'Flutter' },
    { key: 'swift', label: 'Swift' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Main Vertical Flex */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* 1st Section - Icon Info + Color (Horizontal Flex) */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          {/* Left: Icon + Info */}
          <div className="flex items-center gap-4">
            {/* Icon Thumbnail 64x64 */}
            <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
              <img 
                src={asset.thumbnail} 
                alt={asset.name}
                className="w-10 h-10 object-contain"
                style={{ filter: selectedColor !== '#000000' ? `hue-rotate(${selectedColor})` : 'none' }}
              />
            </div>
            
            {/* Icon Name and Size */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{asset.name}</h2>
              <p className="text-sm text-gray-500">{asset.size}</p>
            </div>
          </div>

          {/* Right: Apply Color */}
          <div className="flex flex-col items-end gap-3 mr-12">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Color:</span>
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                placeholder="#000"
              />
            </div>
            
            {/* Color Picker */}
            <div className="flex gap-1">
              {colorTokens.slice(0, 6).map((token) => (
                <button
                  key={token.name}
                  onClick={() => setSelectedColor(token.value)}
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    selectedColor === token.value ? 'border-blue-500 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: token.value }}
                  title={token.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2nd Section - Download Options (Horizontal Flex) */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            {downloadOptions.map((option, index) => (
              <button
                key={index}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-300"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3rd Section - Tags (Horizontal Flex) */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  activeTab === tab.key 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Details */}
        <div className="px-6 py-4 max-h-60 overflow-y-auto">
          {activeTab === 'tags' ? (
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {codeExamples.tags}
            </div>
          ) : (
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                <code>{codeExamples[activeTab as keyof typeof codeExamples]}</code>
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(codeExamples[activeTab as keyof typeof codeExamples])}
                className="absolute top-2 right-2 p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                title="Copy code"
              >
                <Copy className="h-3 w-3 text-gray-300" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 