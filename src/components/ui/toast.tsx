'use client';

import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'info':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-green-600 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5" />;
      case 'error':
        return <X className="h-5 w-5" />;
      case 'info':
        return <Check className="h-5 w-5" />;
      default:
        return <Check className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out transform animate-in slide-in-from-right-full">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${getTypeStyles()}`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast; 