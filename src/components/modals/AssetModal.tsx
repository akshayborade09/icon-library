'use client';

import React, { useState } from 'react';
import { Download, Copy, MessageCircle, FolderPlus, History, Tag, Link, X, Plus, Send } from 'lucide-react';

interface Asset {
  id: number;
  name: string;
  preview: string;
  downloads: number;
  size?: string;
}

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  assetType: string;
}

export default function AssetModal({ isOpen, onClose, asset, assetType }: AssetModalProps) {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [newComment, setNewComment] = useState('');
  const [assetTags] = useState(['icon', 'ui', 'interface']);
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  if (!asset || !isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-7xl">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">{asset.name}</h2>
              <span className="badge badge-primary">
                {assetType}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {asset.downloads.toLocaleString()} downloads
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Preview */}
            <div className="space-y-6">
              <div className="card">
                <div className="card-content">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm relative overflow-hidden">
                    <span className="text-8xl relative z-10" style={{ color: selectedColor }}>
                      {asset.preview}
                    </span>
                  </div>
                  
                  {/* Color Picker */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Customize Color</h4>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-3">
                        {['#000000', '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'].map((color) => (
                          <button
                            key={color}
                            className={`w-10 h-10 rounded-xl border-2 shadow-sm hover:scale-105 transition-all duration-200 ${
                              selectedColor === color ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                          />
                        ))}
                      </div>
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="input w-full h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div className="card">
                <div className="card-content">
                  <h3 className="flex items-center gap-3 text-lg font-semibold mb-4">
                    <Download className="w-5 h-5 text-blue-600" />
                    Download Options
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <button className="btn btn-primary btn-lg">
                        <Download className="w-4 h-4" />
                        Download SVG
                      </button>
                      <button className="btn btn-outline btn-lg">
                        <Copy className="w-4 h-4" />
                        Copy SVG
                      </button>
                      <button className="btn btn-outline btn-lg">
                        PNG (24px)
                      </button>
                      <button className="btn btn-outline btn-lg">
                        PDF Vector
                      </button>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <button className="btn btn-outline w-full btn-lg">
                        <Link className="w-4 h-4" />
                        Copy Asset Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="tab-list grid grid-cols-4">
                {['details', 'projects', 'versions', 'comments'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tab-trigger capitalize ${activeTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'details' && (
                <div className="card">
                  <div className="card-content">
                    <h3 className="flex items-center gap-3 text-lg font-semibold mb-4">
                      <Tag className="w-5 h-5 text-blue-600" />
                      Tags & Metadata
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {assetTags.map((tag) => (
                          <span key={tag} className="badge badge-secondary flex items-center gap-2">
                            {tag}
                            <button className="hover:text-red-500 transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <input
                          placeholder="Add new tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          className="input flex-1"
                        />
                        <button className="btn btn-primary">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="text-gray-500">File Size</label>
                          <div className="font-medium">2.4 KB</div>
                        </div>
                        <div>
                          <label className="text-gray-500">Format</label>
                          <div className="font-medium">SVG Vector</div>
                        </div>
                        <div>
                          <label className="text-gray-500">Created</label>
                          <div className="font-medium">2 days ago</div>
                        </div>
                        <div>
                          <label className="text-gray-500">License</label>
                          <div className="font-medium">Free for commercial use</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="card">
                  <div className="card-content">
                    <h3 className="flex items-center gap-3 text-lg font-semibold mb-4">
                      <FolderPlus className="w-5 h-5 text-blue-600" />
                      Add to Projects
                    </h3>
                    <p className="text-gray-500">Project management functionality would go here.</p>
                  </div>
                </div>
              )}

              {activeTab === 'versions' && (
                <div className="card">
                  <div className="card-content">
                    <h3 className="flex items-center gap-3 text-lg font-semibold mb-4">
                      <History className="w-5 h-5 text-blue-600" />
                      Version History
                    </h3>
                    <p className="text-gray-500">Version history would be displayed here.</p>
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="card">
                  <div className="card-content">
                    <h3 className="flex items-center gap-3 text-lg font-semibold mb-4">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      Comments
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <textarea
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="textarea flex-1"
                          rows={3}
                        />
                        <button className="btn btn-primary">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-500 text-sm">Comments and collaboration features would go here.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 