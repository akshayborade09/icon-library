import React, { createContext, useContext } from 'react';

interface Asset {
  id: number;
  name: string;
  preview: string;
  downloads: number;
  size?: string;
}

interface AssetContextType {
  handleAssetClick: (asset: Asset, type: string) => void;
  handleCreateProject: () => void;
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
  value: AssetContextType;
}> = ({ children, value }) => {
  return (
    <AssetContext.Provider value={value}>
      {children}
    </AssetContext.Provider>
  );
}; 