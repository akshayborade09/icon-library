import React, { createContext, useContext, useState } from 'react';

interface Asset {
  id: number;
  name: string;
  preview: string;
  downloads: number;
  size?: string;
}

interface UploadedAsset {
  id: string;
  name: string;
  preview: string;
  downloads: number;
  category: 'icon' | 'illustration' | 'image' | '3d';
  size?: string;
}

interface AssetContextType {
  handleAssetClick: (asset: Asset, type: string) => void;
  handleCreateProject: () => void;
  uploadedAssets: UploadedAsset[];
  addUploadedAssets: (assets: UploadedAsset[]) => void;
  showSuccessToast: boolean;
  setShowSuccessToast: (show: boolean) => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const useAsset = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAsset must be used within an AssetProvider');
  }
  return context;
};

export const AssetProvider: React.FC<{ 
  children: React.ReactNode;
  handleAssetClick: (asset: Asset, type: string) => void;
  handleCreateProject: () => void;
}> = ({ children, handleAssetClick, handleCreateProject }) => {
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const addUploadedAssets = (assets: UploadedAsset[]) => {
    setUploadedAssets(prev => [...prev, ...assets]);
    setShowSuccessToast(true);
    // Auto-hide toast after 3 seconds
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const contextValue: AssetContextType = {
    handleAssetClick,
    handleCreateProject,
    uploadedAssets,
    addUploadedAssets,
    showSuccessToast,
    setShowSuccessToast
  };

  return (
    <AssetContext.Provider value={contextValue}>
      {children}
    </AssetContext.Provider>
  );
}; 