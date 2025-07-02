import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Copy, X, Check, ChevronDown } from 'lucide-react';

const IconLibraryInterface = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [size, setSize] = useState('all');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [iconColor, setIconColor] = useState('#000000');
  const [tooltipFilters, setTooltipFilters] = useState({
    filled: 'off',
    size: '24'
  });
  const [showSvgDropdown, setShowSvgDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const svgDropdownRef = useRef(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedIcon) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIcon]);

  // Close SVG dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (svgDropdownRef.current && !svgDropdownRef.current.contains(event.target)) {
        setShowSvgDropdown(false);
      }
    };
    if (showSvgDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSvgDropdown]);

  // Mock data
  const mockIcons = useMemo(() => {
    const icons = [];
    const iconNames = ['home', 'user', 'settings', 'heart', 'star', 'bell', 'mail', 'phone', 'camera', 'search', 'menu', 'arrow', 'plus', 'minus', 'check', 'close', 'edit', 'delete', 'share', 'download'];
    const fillStates = ['on', 'off'];
    const sizes = ['16', '20', '24'];

    for (let i = 0; i < 100; i++) {
      const name = iconNames[Math.floor(Math.random() * iconNames.length)];
      const fillState = fillStates[Math.floor(Math.random() * fillStates.length)];
      const iconSize = sizes[Math.floor(Math.random() * sizes.length)];
      
      icons.push({
        id: name + '-' + i,
        name: name,
        filled: fillState,
        size: iconSize,
        cdnUrl: `https://cdn.yourcompany.com/icons/${name}_${fillState === 'on' ? 'filled' : 'outline'}_${iconSize}px.svg`,
      });
    }
    return icons;
  }, []);

  // Filter logic
  const filteredIcons = useMemo(() => {
    return mockIcons.filter(icon => {
      const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSize = size === 'all' || icon.size === size;
      return matchesSearch && matchesSize;
    });
  }, [mockIcons, searchTerm, size]);

  const handleCopyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadPNG = (icon, scale) => {
    const fillValue = icon.filled === 'on' ? 'filled' : 'outline';
    const fileName = `${icon.name}_${fillValue}_${icon.size}px`;
    
    const link = document.createElement('a');
    link.href = `https://cdn.yourcompany.com/icons/${fileName}.svg?format=png&scale=${scale}x`;
    link.download = `${fileName}_${scale}x.png`;
    link.click();
  };

  const handleDownloadAllPNG = (icon) => {
    [1, 2, 3].forEach((scale, index) => {
      setTimeout(() => handleDownloadPNG(icon, scale), index * 100);
    });
  };

  const handleIconClick = (icon) => {
    setSelectedIcon(icon);
    setTooltipFilters({
      filled: icon.filled,
      size: icon.size
    });
    setShowSvgDropdown(false);
  };

  const getCurrentIconVariant = () => {
    if (!selectedIcon) return null;
    
    const fillValue = tooltipFilters.filled === 'on' ? 'filled' : 'outline';
    const fileName = `${selectedIcon.name}_${fillValue}_${tooltipFilters.size}px`;
    
    return {
      ...selectedIcon,
      id: fileName,
      filled: tooltipFilters.filled,
      size: tooltipFilters.size,
      cdnUrl: `https://cdn.yourcompany.com/icons/${fileName}.svg`
    };
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSvgAction = (action) => {
    const currentIcon = getCurrentIconVariant();
    switch(action) {
      case 'download':
        if (currentIcon?.cdnUrl) {
          const link = document.createElement('a');
          link.href = currentIcon.cdnUrl;
          link.download = `${currentIcon.name}.svg`;
          link.click();
          showToastMessage('Icon Downloaded');
        }
        break;
      case 'copy-url':
        if (currentIcon?.cdnUrl) {
          handleCopyToClipboard(currentIcon.cdnUrl, 'svg-url');
          showToastMessage('Icon URL Copied');
        }
        break;
      case 'copy-code':
        handleCopyToClipboard('<svg>...</svg>', 'svg-code');
        showToastMessage('SVG Code Copied');
        break;
    }
    setShowSvgDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-800 text-white px-6 py-3 w-full">
        <div className="max-w-[1196px] mx-auto flex items-center justify-between">
          
          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">⌘K</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Size selector */}
            <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setSize('16')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  size === '16' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                16px
              </button>
              <button
                onClick={() => setSize('20')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  size === '20' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                20px
              </button>
              <button
                onClick={() => setSize('24')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  size === '24' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                24px
              </button>
            </div>

            {/* Color picker */}
            <div className="relative">
              <input
                type="color"
                value={iconColor}
                onChange={(e) => setIconColor(e.target.value)}
                className="w-6 h-6 rounded border border-gray-600 cursor-pointer opacity-0 absolute inset-0"
              />
              <div 
                className="w-6 h-6 rounded border border-gray-600 cursor-pointer"
                style={{ backgroundColor: iconColor }}
              ></div>
            </div>

            {/* Color code */}
            <div className="bg-black text-white px-3 py-1 rounded text-sm font-mono">
              {iconColor.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full bg-gray-50">
        <div className="max-w-[1196px] mx-auto p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-8">
            {filteredIcons.map((icon) => (
              <div
                key={icon.id}
                onClick={() => handleIconClick(icon)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-16 h-16 flex items-center justify-center mb-3 hover:bg-gray-100 rounded-lg transition-colors">
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: iconColor }}
                  ></div>
                </div>
                <span className="text-sm text-gray-700 text-center leading-tight">
                  {icon.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedIcon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{selectedIcon.name}</h3>
              <button
                onClick={() => setSelectedIcon(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Icon Preview */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="w-12 h-12 bg-gray-400 rounded"></div>
                </div>
              </div>

              {/* CDN Link */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">CDN Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={getCurrentIconVariant()?.cdnUrl || ''}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={() => handleCopyToClipboard(getCurrentIconVariant()?.cdnUrl || '', 'cdn')}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copySuccess === 'cdn' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Download Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Download</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleDownloadAllPNG(getCurrentIconVariant())}
                    className="px-3 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    PNG
                  </button>

                  <div className="relative" ref={svgDropdownRef}>
                    <button
                      onClick={() => setShowSvgDropdown(!showSvgDropdown)}
                      className="w-full px-3 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                      SVG
                      <ChevronDown size={14} />
                    </button>
                    {showSvgDropdown && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 text-white rounded-lg shadow-lg z-10 py-2">
                        <button
                          onClick={() => handleSvgAction('download')}
                          className="w-full px-3 py-2 text-sm text-white hover:bg-gray-800 text-left"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleSvgAction('copy-url')}
                          className="w-full px-3 py-2 text-sm text-white hover:bg-gray-800 text-left"
                        >
                          Copy URL
                        </button>
                        <button
                          onClick={() => handleSvgAction('copy-code')}
                          className="w-full px-3 py-2 text-sm text-white hover:bg-gray-800 text-left"
                        >
                          Copy SVG Code
                        </button>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopyToClipboard('PDF code here', 'pdf')}
                    className="px-3 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                  >
                    {copySuccess === 'pdf' ? 'Copied!' : 'PDF'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Check size={16} className="text-green-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconLibraryInterface;