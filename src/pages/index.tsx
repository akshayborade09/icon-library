import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AssetTabs from '@/components/home/AssetTabs';

interface Asset {
  id: number;
  name: string;
  preview: string;
  downloads: number;
  size?: string;
}

function HomePage() {
  return (
    <>
      {/* Asset Tabs - In Wrapper */}
      <div className="max-w-[1680px] mx-auto px-6 py-8">
        <AssetTabs />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <MainLayout>
      <HomePage />
    </MainLayout>
  );
}
