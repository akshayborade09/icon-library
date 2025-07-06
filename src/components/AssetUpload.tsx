'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface AssetFile {
  id: string;
  file: File;
  preview?: string;
  metadata: {
    name: string;
    size: number;
    type: string;
    lastModified: Date;
    dimensions?: { width: number; height: number };
  };
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface AssetUploadProps {
  onUpload?: (files: AssetFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string[];
  className?: string;
}

const ACCEPTED_FORMATS = {
  'image/svg+xml': ['.svg'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
  'application/json': ['.json'], // For Lottie files
  'model/gltf+json': ['.gltf'],
  'model/gltf-binary': ['.glb'],
  'application/octet-stream': ['.glb', '.obj', '.fbx'], // 3D formats
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function AssetUpload({
  onUpload,
  maxFiles = 10,
  maxSize = MAX_FILE_SIZE,
  accept = Object.keys(ACCEPTED_FORMATS),
  className = '',
}: AssetUploadProps) {
  const [files, setFiles] = useState<AssetFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File too large. Maximum size is ${(maxSize / (1024 * 1024)).toFixed(1)}MB`;
    }

    // Check file type
    const isValidType = accept.some(acceptedType => 
      file.type === acceptedType || 
      ACCEPTED_FORMATS[acceptedType as keyof typeof ACCEPTED_FORMATS]?.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      )
    );

    if (!isValidType) {
      return 'Invalid file type. Accepted formats: SVG, PNG, JPG, WebP, JSON (Lottie), GLTF, GLB, OBJ, FBX';
    }

    return null;
  }, [accept, maxSize]);

  const extractMetadata = useCallback((file: File): Promise<AssetFile['metadata']> => {
    return new Promise((resolve) => {
      const metadata: AssetFile['metadata'] = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
      };

      // Extract dimensions for images
      if (file.type.startsWith('image/')) {
        const img = new Image();
        const url = URL.createObjectURL(file);
        
        img.onload = () => {
          metadata.dimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
          URL.revokeObjectURL(url);
          resolve(metadata);
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(metadata);
        };

        img.src = url;
      } else {
        resolve(metadata);
      }
    });
  }, []);

  const createPreview = useCallback((file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: AssetFile[] = [];

    for (const file of acceptedFiles) {
      const validationError = validateFile(file);
      
      if (validationError) {
        const errorFile: AssetFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          metadata: {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified),
          },
          status: 'error',
          error: validationError,
        };
        newFiles.push(errorFile);
        continue;
      }

      try {
        const metadata = await extractMetadata(file);
        const preview = createPreview(file);

        const assetFile: AssetFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview,
          metadata,
          status: 'pending',
        };

        newFiles.push(assetFile);
      } catch (processingError) {
        console.error('Error processing file:', processingError);
        const errorFile: AssetFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          metadata: {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified),
          },
          status: 'error',
          error: 'Failed to process file',
        };
        newFiles.push(errorFile);
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
  }, [files.length, maxFiles, validateFile, extractMetadata, createPreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxFiles,
    maxSize,
    multiple: true,
  });

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const updated = prev.filter(file => file.id !== id);
      // Clean up preview URLs
      prev.forEach(file => {
        if (file.preview && file.id === id) {
          URL.revokeObjectURL(file.preview);
        }
      });
      return updated;
    });
  }, []);

  const uploadFiles = useCallback(async () => {
    const pendingFiles = files.filter(file => file.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Update all pending files to uploading status
      setFiles(prev => prev.map(file => 
        file.status === 'pending' 
          ? { ...file, status: 'uploading' as const }
          : file
      ));

      // Create FormData for upload
      const formData = new FormData();
      pendingFiles.forEach((assetFile, index) => {
        formData.append(`files`, assetFile.file);
        formData.append(`metadata_${index}`, JSON.stringify(assetFile.metadata));
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      await response.json();

      // Update files with success status
      setFiles(prev => prev.map(file => 
        file.status === 'uploading' 
          ? { ...file, status: 'success' as const }
          : file
      ));

      // Call onUpload callback if provided
      if (onUpload) {
        onUpload(files);
      }

    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      // Update files with error status
      setFiles(prev => prev.map(file => 
        file.status === 'uploading' 
          ? { ...file, status: 'error' as const, error: 'Upload failed' }
          : file
      ));
    } finally {
      setIsUploading(false);
    }
  }, [files, onUpload]);

  const clearAll = useCallback(() => {
    // Clean up preview URLs
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  }, [files]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to select files
            </p>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            <p>Supported formats: SVG, PNG, JPG, WebP, JSON (Lottie), GLTF, GLB, OBJ, FBX</p>
            <p>Maximum file size: {formatFileSize(maxSize)} • Maximum files: {maxFiles}</p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Selected Files ({files.length})
            </h3>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear All
            </button>
          </div>

          <div className="grid gap-4">
            {files.map((assetFile) => (
              <div
                key={assetFile.id}
                className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                {/* Preview */}
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                  {assetFile.preview ? (
                    <img
                      src={assetFile.preview}
                      alt={assetFile.metadata.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {assetFile.metadata.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(assetFile.metadata.size)} • {assetFile.metadata.type}
                    {assetFile.metadata.dimensions && (
                      <span> • {assetFile.metadata.dimensions.width}×{assetFile.metadata.dimensions.height}</span>
                    )}
                  </p>
                  {assetFile.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {assetFile.error}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {assetFile.status === 'pending' && (
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  )}
                  {assetFile.status === 'uploading' && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {assetFile.status === 'success' && (
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  )}
                  {assetFile.status === 'error' && (
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  )}
                  
                  <button
                    onClick={() => removeFile(assetFile.id)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex justify-center">
            <button
              onClick={uploadFiles}
              disabled={isUploading || files.filter(f => f.status === 'pending').length === 0}
              className={`
                px-6 py-3 rounded-lg font-medium text-white transition-colors
                ${isUploading || files.filter(f => f.status === 'pending').length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }
              `}
            >
              {isUploading ? 'Uploading...' : `Upload ${files.filter(f => f.status === 'pending').length} Files`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 