import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({ 
  title, 
  description, 
  actions,
  className = '' 
}: PageHeaderProps) {
  return (
    <div className={`bg-content1 border-b border-gray-200 px-6 py-3 min-h-20 ${className}`}>
      <div className="mx-auto">
        <div className="flex items-center justify-between">
          {/* Title and description */}
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            <p className="text-default-600 text-sm">{description}</p>
          </div>
          
          {/* Action buttons */}
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 