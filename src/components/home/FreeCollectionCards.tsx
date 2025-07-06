'use client';

import React from 'react';
import Link from 'next/link';

const collections = [
  {
    id: 1,
    name: 'Icons',
    emoji: '🎨',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 2,
    name: 'Illustrations',
    emoji: '🖼️',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    name: 'Spot Icons',
    emoji: '🎯',
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 4,
    name: 'Images',
    emoji: '📸',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 5,
    name: 'Animations',
    emoji: '🎬',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 6,
    name: '3D Models',
    emoji: '🎲',
    color: 'from-indigo-500 to-purple-500',
  },
];

export default function FreeCollectionCards() {
  return (
    <div className="w-full bg-gray-50/50">
      <div className="px-4 py-4">
        {/* Collections Grid - Single Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {collections.map((collection) => (
            <div key={collection.id} className="card">
              <Link href={`/collections/${collection.id}`} className="block p-4 h-full">
                <div className="flex items-center gap-3">
                  {/* Icon with gradient background */}
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${collection.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <span className="text-lg filter drop-shadow-sm">{collection.emoji}</span>
                  </div>
                  
                  {/* Collection Name */}
                  <h3 className="font-medium text-sm">{collection.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 