'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Upload, FileImage, Users, Trash2, Check, Tag, ChevronDown, ChevronRight, ArrowLeft, Plus } from 'lucide-react';
import { Button, Input, Textarea, Select, SelectItem } from '@heroui/react';
import Toast from './ui/toast';
import { useAsset } from '@/contexts/AssetContext';

interface UploadAsset {
  id: string;
  file: File;
  name: string;
  size: string;
  thumbnail: string;
  progress: number;
  isSelected: boolean;
  category?: 'icon' | 'illustration' | 'image' | '3d';
  aspectRatio: '1x1' | '3x4' | '4x3';
}

interface InvitedMember {
  id: string;
  email: string;
  thumbnail: string;
  permission: 'view' | 'edit';
}

interface AssetUploadProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'upload' | 'create-project'; // New prop to determine the flow
}

const AssetUpload: React.FC<AssetUploadProps> = ({ isOpen, onClose, mode = 'upload' }) => {
  const { addUploadedAssets } = useAsset();
  
  // Flow management - different for create project vs direct upload
  const [currentStep, setCurrentStep] = useState<'create-project' | 'upload' | 'progress' | 'tag-assets'>(() => {
    return mode === 'create-project' ? 'create-project' : 'upload';
  });
  
  const [isUploadMoreMode, setIsUploadMoreMode] = useState(false);
  const [assets, setAssets] = useState<UploadAsset[]>([]);
  const [newAssets, setNewAssets] = useState<UploadAsset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showTaggingBar, setShowTaggingBar] = useState(false);
  const [categorizedAssets, setCategorizedAssets] = useState<{
    icon: UploadAsset[];
    illustration: UploadAsset[];
    image: UploadAsset[];
    '3d': UploadAsset[];
  }>({
    icon: [],
    illustration: [],
    image: [],
    '3d': []
  });
  const [collapsedCategories, setCollapsedCategories] = useState<{
    icon: boolean;
    illustration: boolean;
    image: boolean;
    '3d': boolean;
  }>({
    icon: true,
    illustration: true,
    image: true,
    '3d': true
  });
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([]);
  const [editingAssets, setEditingAssets] = useState<{ [assetId: string]: string }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset all states when modal is closed
  const resetModalState = useCallback(() => {
    setCurrentStep(mode === 'create-project' ? 'create-project' : 'upload');
    setIsUploadMoreMode(false);
    setAssets([]);
    setNewAssets([]);
    setSelectedAssets([]);
    setShowTaggingBar(false);
    setCategorizedAssets({
      icon: [],
      illustration: [],
      image: [],
      '3d': []
    });
    setCollapsedCategories({
      icon: true,
      illustration: true,
      image: true,
      '3d': true
    });
    setProjectName('');
    setProjectDescription('');
    setInviteEmail('');
    setInvitedMembers([]);
    setEditingAssets({});
    setShowToast(false);
    setToastMessage('');
  }, [mode]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetModalState();
    }
  }, [isOpen, resetModalState]);

  const generateThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const getAspectRatio = (file: File): Promise<'1x1' | '3x4' | '4x3'> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        if (Math.abs(ratio - 1) < 0.1) resolve('1x1');
        else if (ratio > 1.2) resolve('4x3');
        else resolve('3x4');
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    const newUploadAssets: UploadAsset[] = [];
    
    for (const file of Array.from(files)) {
      const thumbnail = await generateThumbnail(file);
      const aspectRatio = await getAspectRatio(file);
      
      newUploadAssets.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name.split('.')[0],
        size: `${(file.size / 1024).toFixed(1)} KB`,
        thumbnail,
        progress: 0,
        isSelected: false,
        aspectRatio
      });
    }

    if (isUploadMoreMode) {
      setNewAssets(newUploadAssets);
    } else {
      setAssets(newUploadAssets);
    }
    setCurrentStep('progress');

    // Simulate upload progress
    newUploadAssets.forEach((asset, index) => {
      const interval = setInterval(() => {
        if (isUploadMoreMode) {
          setNewAssets(prev => prev.map(a => 
            a.id === asset.id 
              ? { ...a, progress: Math.min(a.progress + Math.random() * 20, 100) }
              : a
          ));
        } else {
          setAssets(prev => prev.map(a => 
            a.id === asset.id 
              ? { ...a, progress: Math.min(a.progress + Math.random() * 20, 100) }
              : a
          ));
        }
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        if (isUploadMoreMode) {
          setNewAssets(prev => prev.map(a => 
            a.id === asset.id ? { ...a, progress: 100 } : a
          ));
        } else {
          setAssets(prev => prev.map(a => 
            a.id === asset.id ? { ...a, progress: 100 } : a
          ));
        }
        if (index === newUploadAssets.length - 1) {
          setTimeout(() => {
            if (isUploadMoreMode) {
              // Add new assets to existing ones and return to tag assets step
              setAssets(prev => [...prev, ...newUploadAssets]);
              setNewAssets([]);
              setIsUploadMoreMode(false);
              setCurrentStep('tag-assets');
            } else {
              // After uploading, ALWAYS go to tag-assets step regardless of mode
              setCurrentStep('tag-assets');
            }
          }, 500);
        }
      }, 2000 + index * 500);
    });
  }, [isUploadMoreMode, mode]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleContinueFromProject = () => {
    if (projectName.trim()) {
      setCurrentStep('upload');
    }
  };

  const handleBackToCreateProject = () => {
    setCurrentStep('create-project');
  };

  const handleBackToUpload = () => {
    // Check if assets have been uploaded
    const hasUploadedAssets = assets.length > 0 || Object.values(categorizedAssets).some(cat => cat.length > 0);
    
    // If in create-project mode and assets have been uploaded, go back to create-project step
    if (mode === 'create-project' && hasUploadedAssets) {
      setCurrentStep('create-project');
    } else if (mode === 'create-project' && !hasUploadedAssets) {
      // If in create-project mode and no assets uploaded yet, go back to project details  
      setCurrentStep('create-project');
    } else {
      // If in regular upload mode, go to upload step
    setCurrentStep('upload');
    }
  };

  const handleBackToTagAssets = () => {
    setCurrentStep('tag-assets');
  };

  const handleUploadMore = () => {
    setIsUploadMoreMode(true);
    setCurrentStep('upload');
  };

  const handleBackFromUploadMore = () => {
    setIsUploadMoreMode(false);
    setNewAssets([]);
    setCurrentStep('tag-assets');
  };

  const toggleAssetSelection = (assetId: string) => {
    const isSelected = selectedAssets.includes(assetId);
    if (isSelected) {
      setSelectedAssets(prev => prev.filter(id => id !== assetId));
    } else {
      setSelectedAssets(prev => [...prev, assetId]);
    }
    
    // Show/hide tagging bar based on selection
    const newSelection = isSelected 
      ? selectedAssets.filter(id => id !== assetId)
      : [...selectedAssets, assetId];
    setShowTaggingBar(newSelection.length > 0);
  };

  const handleCategoryTag = (category: 'icon' | 'illustration' | 'image' | '3d') => {
    // Find selected assets from both uncategorized and categorized lists
    const selectedFromUncategorized = assets.filter(asset => selectedAssets.includes(asset.id));
    const selectedFromCategorized: UploadAsset[] = [];
    
    // Find selected assets from all categories
    Object.keys(categorizedAssets).forEach(cat => {
      const categoryKey = cat as keyof typeof categorizedAssets;
      categorizedAssets[categoryKey].forEach(asset => {
        if (selectedAssets.includes(asset.id)) {
          selectedFromCategorized.push(asset);
        }
      });
    });

    const allSelectedAssets = [...selectedFromUncategorized, ...selectedFromCategorized];
    
    // Remove selected assets from their current locations
    setAssets(prev => prev.filter(asset => !selectedAssets.includes(asset.id)));
    
    // Remove selected assets from all categories
    setCategorizedAssets(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(cat => {
        const categoryKey = cat as keyof typeof updated;
        updated[categoryKey] = updated[categoryKey].filter(asset => !selectedAssets.includes(asset.id));
      });
      return updated;
    });

    // Add all selected assets to the new category
    setCategorizedAssets(prev => ({
      ...prev,
      [category]: [...prev[category], ...allSelectedAssets.map(asset => ({ ...asset, category }))]
    }));

    setSelectedAssets([]);
    setShowTaggingBar(false);
    
    // No auto-progression needed since save-project step is removed
  };

  const areAllAssetsTagged = () => {
    return assets.length === 0; // All assets have been moved to categories
  };

  const handleContinueFromTagging = () => {
    if (mode === 'upload') {
      // In upload mode, save the tagged assets and close the modal
      handleSaveAssets();
    } else {
      // In create-project mode, save the project directly and close the modal
      handleSaveProject();
    }
  };

  const handleSaveAssets = () => {
    // Convert uploaded assets to the format expected by the main app
    const allUploadedAssets: any[] = [];
    
    // Add categorized assets
    Object.entries(categorizedAssets).forEach(([category, categoryAssets]) => {
      categoryAssets.forEach(asset => {
        allUploadedAssets.push({
          id: asset.id,
          name: asset.name,
          preview: asset.thumbnail,
          downloads: 0, // New uploads start with 0 downloads
          category: category as 'icon' | 'illustration' | 'image' | '3d',
          size: asset.size
        });
      });
    });
    
    // Add uncategorized assets (mark as 'icon' by default)
    assets.forEach(asset => {
      allUploadedAssets.push({
        id: asset.id,
        name: asset.name,
        preview: asset.thumbnail,
        downloads: 0,
        category: 'icon' as const, // Default category for uncategorized
        size: asset.size
      });
    });
    
    // Add to main app context
    if (allUploadedAssets.length > 0) {
      addUploadedAssets(allUploadedAssets);
    }
    
    // Close the modal immediately - success toast will show from context
    onClose();
  };

  const handleAssetNameEdit = (assetId: string, newName: string, isInCategory?: string) => {
    if (isInCategory) {
      setCategorizedAssets(prev => ({
        ...prev,
        [isInCategory]: prev[isInCategory as keyof typeof prev].map(asset =>
          asset.id === assetId ? { ...asset, name: newName } : asset
        )
      }));
    } else {
      setAssets(prev => prev.map(asset =>
        asset.id === assetId ? { ...asset, name: newName } : asset
      ));
    }
  };

  const handleAssetNameEditStart = (assetId: string, currentName: string) => {
    setEditingAssets(prev => ({
      ...prev,
      [assetId]: currentName
    }));
  };

  const handleAssetNameSave = (assetId: string) => {
    setEditingAssets(prev => {
      const { [assetId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleAssetNameDiscard = (assetId: string, isInCategory?: string) => {
    const originalName = editingAssets[assetId];
    if (originalName) {
      handleAssetNameEdit(assetId, originalName, isInCategory);
      setEditingAssets(prev => {
        const { [assetId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleAssetNameKeyDown = (e: React.KeyboardEvent, assetId: string, isInCategory?: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAssetNameSave(assetId);
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleAssetNameDiscard(assetId, isInCategory);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleDeleteAsset = (assetId: string, isInCategory?: string) => {
    if (isInCategory) {
      setCategorizedAssets(prev => ({
        ...prev,
        [isInCategory]: prev[isInCategory as keyof typeof prev].filter(asset => asset.id !== assetId)
      }));
    } else {
      setAssets(prev => prev.filter(asset => asset.id !== assetId));
    }
  };

  const toggleCategoryCollapse = (category: keyof typeof collapsedCategories) => {
    const wasExpanded = !collapsedCategories[category];
    const willBeCollapsed = wasExpanded;
    
    // If collapsing the category, deselect any selected assets in that category
    if (willBeCollapsed) {
      const categoryAssetIds = categorizedAssets[category].map(asset => asset.id);
      const selectedInThisCategory = selectedAssets.filter(id => categoryAssetIds.includes(id));
      
      if (selectedInThisCategory.length > 0) {
        const newSelection = selectedAssets.filter(id => !categoryAssetIds.includes(id));
        setSelectedAssets(newSelection);
        setShowTaggingBar(newSelection.length > 0);
      }
    }
    
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleInviteMember = () => {
    if (inviteEmail) {
      const newMember: InvitedMember = {
        id: Math.random().toString(36).substr(2, 9),
        email: inviteEmail,
        thumbnail: `https://api.dicebear.com/7.x/avataaars/svg?seed=${inviteEmail}`,
        permission: 'view'
      };
      setInvitedMembers(prev => [...prev, newMember]);
      setInviteEmail('');
    }
  };

  const handlePermissionChange = (memberId: string, permission: 'view' | 'edit') => {
    setInvitedMembers(prev => prev.map(member =>
      member.id === memberId ? { ...member, permission } : member
    ));
  };

  const handleSaveProject = () => {
    // Save project logic
    console.log('Saving project:', {
      name: projectName,
      description: projectDescription,
      members: invitedMembers,
      categorizedAssets,
      uncategorizedAssets: assets
    });
    
    // Close the modal immediately
      onClose();
    
    // Navigate to projects page and show success toast
    window.location.href = '/projects';
    // Note: Toast will be shown on projects page - "Project created successfully"
  };

  if (!isOpen) return null;

  const currentAssets = isUploadMoreMode ? newAssets : assets;

  const getStepTitle = () => {
    switch (currentStep) {
      case 'create-project': return 'Create Project';
      case 'upload': return isUploadMoreMode ? 'Upload More Assets' : 'Upload Assets';
      case 'progress': return isUploadMoreMode ? 'Uploading Additional Assets' : 'Uploading Assets';
      case 'tag-assets': return 'Tag Assets';
      default: return 'Upload Asset';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      {/* Right Side Overlay - 1/3 screen width with proper positioning context */}
      <div className="w-1/3 h-full bg-white dark:bg-gray-950 shadow-xl flex flex-col relative overflow-hidden border-l border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            {/* Back buttons for each step */}
            {isUploadMoreMode && (
              <Button
                onClick={handleBackFromUploadMore}
                variant="light"
                isIconOnly
                size="sm"
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={2} />
              </Button>
            )}
            {!isUploadMoreMode && currentStep === 'upload' && mode === 'create-project' && (
              <Button
                onClick={handleBackToCreateProject}
                variant="light"
                isIconOnly
                size="sm"
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={2} />
              </Button>
            )}
            {currentStep === 'tag-assets' && (
              <Button
                onClick={handleBackToUpload}
                variant="light"
                isIconOnly
                size="sm"
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={2} />
              </Button>
            )}

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {getStepTitle()}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {currentStep === 'tag-assets' && !isUploadMoreMode && (
              <Button
                onClick={handleUploadMore}
                color="primary"
                size="sm"
                startContent={<Plus className="h-4 w-4" strokeWidth={2} />}
                className="font-medium"
              >
                Upload More
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="light"
              isIconOnly
              size="sm"
              className="p-2"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </Button>
          </div>
        </div>

        {/* Main Content Area - Flex layout with fixed bottom */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Content */}
          <div className={`flex-1 overflow-y-auto ${showTaggingBar ? 'pb-16' : ''} ${(currentStep === 'tag-assets' && showTaggingBar) ? 'pb-20' : ''}`}>
            <div className="p-6">
              
              {/* Step 1: Create Project */}
              {currentStep === 'create-project' && (
                <div className="space-y-6">
                  <Input
                    label="Project Name"
                    placeholder="Enter project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    isRequired
                    variant="bordered"
                    labelPlacement="outside"
                    classNames={{
                      label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                      input: "text-gray-900 dark:text-gray-100",
                      inputWrapper: "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }}
                  />

                  <Textarea
                    label="Project Description"
                    placeholder="Enter some information of this project"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    variant="bordered"
                    labelPlacement="outside"
                    minRows={4}
                    classNames={{
                      label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                      input: "text-gray-900 dark:text-gray-100",
                      inputWrapper: "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Invite Members
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Email comma separated"
                        variant="bordered"
                        className="flex-1"
                        classNames={{
                          input: "text-gray-900 dark:text-gray-100",
                          inputWrapper: "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }}
                      />
                      <Button
                        onClick={handleInviteMember}
                        color="primary"
                        variant="solid"
                        className="font-medium"
                      >
                        Invite
                      </Button>
                    </div>
                  </div>

                  {/* Invited Members List */}
                  {invitedMembers.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Invited Members</h4>
                      {invitedMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                          <img
                            src={member.thumbnail}
                            alt={member.email}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                          />
                          <span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">{member.email}</span>
                          <Select
                            selectedKeys={[member.permission]}
                            onSelectionChange={(keys) => {
                              const selectedKey = Array.from(keys)[0] as string;
                              handlePermissionChange(member.id, selectedKey as 'view' | 'edit');
                            }}
                            size="sm"
                            variant="bordered"
                            className="w-32"
                            classNames={{
                              trigger: "border-gray-300 dark:border-gray-600",
                              value: "text-gray-900 dark:text-gray-100"
                            }}
                          >
                            <SelectItem key="view">Can View</SelectItem>
                            <SelectItem key="edit">Can Edit</SelectItem>
                          </Select>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Assets Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Upload Assets
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 bg-gray-50/50 dark:bg-gray-800/20 hover:bg-gray-100/50 dark:hover:bg-gray-800/40"
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" strokeWidth={1.5} />
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">Drag & Drop files here</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Acceptable formats: PNG, JPG, SVG, PDF</p>
                      <Button
                        onClick={handleFileSelect}
                        color="primary"
                        variant="solid"
                        size="md"
                        className="font-medium"
                      >
                        Choose Files
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.svg"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Upload Assets */}
              {currentStep === 'upload' && (
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-16 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 bg-gray-50/50 dark:bg-gray-800/20 hover:bg-gray-100/50 dark:hover:bg-gray-800/40"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Upload className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Drag & Drop files here</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 text-base">Acceptable formats: PNG, JPG, SVG, PDF</p>
                  <Button
                    onClick={handleFileSelect}
                    color="primary"
                    variant="solid"
                    size="lg"
                    className="font-medium"
                  >
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.svg"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </div>
              )}

              {/* Step 3: Progress */}
              {currentStep === 'progress' && (
                <div className="space-y-4">
                  {currentAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center space-x-4 p-4 border border-default-200 dark:border-default-100 rounded-xl bg-default-50 dark:bg-default-100/20 transition-all duration-200">
                      <div className={`w-16 h-16 bg-default-100 dark:bg-default-200/50 rounded-xl overflow-hidden ${
                        asset.aspectRatio === '1x1' ? 'aspect-square' :
                        asset.aspectRatio === '3x4' ? 'aspect-[3/4]' : 'aspect-[4/3]'
                      }`}>
                        <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{asset.name}</h4>
                        <p className="text-sm text-default-500">{asset.size}</p>
                        <div className="w-full bg-default-200 dark:bg-default-300/30 rounded-full h-2 mt-2 overflow-hidden">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${asset.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-default-500 mt-1 font-medium">{Math.round(asset.progress)}%</p>
                      </div>
                      <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        className="text-default-400 hover:text-danger-500"
                        size="sm"
                      >
                        <X className="h-4 w-4" strokeWidth={2} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}



              {/* Step 4: Tag Assets */}
              {currentStep === 'tag-assets' && (
                <div className="space-y-4">
                  {/* Project Summary - Only show when in create-project mode */}
                  {mode === 'create-project' && (
                  <div className="p-4 bg-default-50 dark:bg-default-100/20 rounded-xl border border-default-200 dark:border-default-100">
                    <h3 className="font-semibold text-foreground">{projectName}</h3>
                    {projectDescription && (
                      <p className="text-sm text-default-600 dark:text-default-500 mt-1">{projectDescription}</p>
                    )}
                    {invitedMembers.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Users className="h-4 w-4 text-default-500" strokeWidth={2} />
                        <span className="text-sm text-default-500">{invitedMembers.length} member{invitedMembers.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                  )}

                  {/* Summary */}
                  {/* <div className="p-3 bg-gray-50 rounded-lg mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{assets.length + Object.values(categorizedAssets).flat().length}</span> assets uploaded
                      {Object.entries(categorizedAssets).map(([category, categoryAssets]) => 
                        categoryAssets.length > 0 && (
                          <span key={category} className="ml-1">
                            • <span className="font-medium">{categoryAssets.length}</span> tagged under {category}
                          </span>
                        )
                      )}
                      {assets.length > 0 && (
                        <span className="ml-1">
                          • <span className="font-medium">{assets.length}</span> untagged
                        </span>
                      )}
                    </p>
                  </div> */}

                  {/* Tagged Assets - Collapsed Sections */}
                  {(Object.keys(categorizedAssets) as Array<keyof typeof categorizedAssets>).map((category) => (
                    categorizedAssets[category].length > 0 && (
                      <div key={category} className="border border-default-200 dark:border-default-100 rounded-xl mb-4 overflow-hidden">
                        <button
                          onClick={() => toggleCategoryCollapse(category)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-default-50 dark:hover:bg-default-100/20 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            {collapsedCategories[category] ? 
                              <ChevronRight className="h-4 w-4 text-default-500" strokeWidth={2} /> : 
                              <ChevronDown className="h-4 w-4 text-default-500" strokeWidth={2} />
                            }
                            <span className="font-medium capitalize text-foreground">{category}</span>
                            <span className="text-sm text-default-500">({categorizedAssets[category].length} asset{categorizedAssets[category].length > 1 ? 's' : ''})</span>
                          </div>
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        </button>
                        
                        {!collapsedCategories[category] && (
                          <div className="border-t border-default-100 dark:border-default-200/50 p-4 pt-2 space-y-2 bg-default-25 dark:bg-default-50/10">
                            {categorizedAssets[category]
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((asset) => (
                                <div key={asset.id} className="flex items-center space-x-4 p-3 bg-background dark:bg-default-100/20 rounded-xl w-full border border-default-100 dark:border-default-200/30 hover:border-default-300 dark:hover:border-default-200/50 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={selectedAssets.includes(asset.id)}
                                  onChange={() => toggleAssetSelection(asset.id)}
                                  className="h-4 w-4 text-primary-600 rounded border-default-300 dark:border-default-400 focus:ring-primary-500 focus:ring-2"
                                />
                                <div className={`w-12 h-12 bg-default-100 dark:bg-default-200/50 rounded-xl overflow-hidden ${
                                  asset.aspectRatio === '1x1' ? 'aspect-square' :
                                  asset.aspectRatio === '3x4' ? 'aspect-[3/4]' : 'aspect-[4/3]'
                                }`}>
                                  <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-foreground">{asset.name}</h4>
                                  <p className="text-sm text-default-500">{asset.size}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  ))}

                  {/* Untagged Assets */}
                  {assets.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-foreground">Untagged Assets</h4>
                      <div className="space-y-2">
                        {assets
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((asset) => (
                                                    <div key={asset.id} className="flex items-center space-x-4 p-4 border border-default-200 dark:border-default-100 rounded-xl w-full bg-default-50 dark:bg-default-100/20 hover:border-default-300 dark:hover:border-default-200/50 transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedAssets.includes(asset.id)}
                            onChange={() => toggleAssetSelection(asset.id)}
                            className="h-4 w-4 text-primary-600 rounded border-default-300 dark:border-default-400 focus:ring-primary-500 focus:ring-2"
                          />
                          <div className={`w-16 h-16 bg-default-100 dark:bg-default-200/50 rounded-xl overflow-hidden ${
                            asset.aspectRatio === '1x1' ? 'aspect-square' :
                            asset.aspectRatio === '3x4' ? 'aspect-[3/4]' : 'aspect-[4/3]'
                          }`}>
                            <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                              <h4 className="font-medium text-foreground">{asset.name}</h4>
                            <p className="text-sm text-default-500">{asset.size}</p>
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  )}
                </div>
              )}


            </div>
          </div>

          {/* Fixed Bottom Section - Action buttons for each step */}
          {currentStep !== 'progress' && (
          <div className="flex-shrink-0 p-6 bg-background dark:bg-default-50/50 border-t border-default-200 dark:border-default-100">
            {currentStep === 'create-project' && (
              <Button 
                onClick={() => {
                  const hasUploadedAssets = assets.length > 0 || Object.values(categorizedAssets).some(cat => cat.length > 0);
                  if (hasUploadedAssets) {
                    // If assets already uploaded, go directly to tag-assets
                    setCurrentStep('tag-assets');
                  } else {
                    // First time, continue to upload
                    handleContinueFromProject();
                  }
                }}
                isDisabled={!projectName.trim()}
                color="primary"
                className="w-full font-medium"
                size="lg"
              >
                {(() => {
                  const hasUploadedAssets = assets.length > 0 || Object.values(categorizedAssets).some(cat => cat.length > 0);
                  return hasUploadedAssets ? 'Next' : 'Continue';
                })()}
              </Button>
            )}
            
            {/* No button for upload step - automatically proceeds after upload completion */}

            {currentStep === 'tag-assets' && (
              <Button 
                onClick={handleContinueFromTagging}
                color="primary"
                className="w-full font-medium"
                size="lg"
              >
                Finish
              </Button>
            )}


          </div>
          )}

          {/* Floating Tagging Bar - Only show in tag-assets step */}
          {showTaggingBar && currentStep === 'tag-assets' && (
            <div className="absolute left-0 right-0 bg-background dark:bg-default-100/80 backdrop-blur-md border-t border-default-200 dark:border-default-100 p-4 flex-shrink-0 mx-4 mb-10 rounded-xl bottom-20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Tag {selectedAssets.length} asset{selectedAssets.length > 1 ? 's' : ''} as:
                </span>
                <div className="flex space-x-2">
                  {(['icon', 'illustration', 'image', '3d'] as const).map((category) => (
                    <Button
                      key={category}
                      onClick={() => handleCategoryTag(category)}
                      color="primary"
                      size="sm"
                      className="capitalize font-medium"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}


        </div>
      </div>

      {/* Toast Notification */}
      <Toast 
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
    </div>
  );
};

export default AssetUpload; 