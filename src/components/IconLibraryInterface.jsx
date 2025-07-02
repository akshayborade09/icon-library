import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Copy, X, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import olaiconsLogo from '../assets/images/olaicons-logo.png';

const IconLibraryInterface = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [size, setSize] = useState('24');
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 bg-gray-100 text-white border-b border-gray-200 z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <img 
                src={olaiconsLogo} 
                alt="Olaicons" 
                className="h-10 w-auto cursor-pointer transition-all duration-300 filter brightness-110 hover:brightness-125"
              />
            </div>
            
            {/* Search */}
            <motion.div 
              className="flex-1 max-w-xl ml-10 mr-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-400 transition-colors duration-200" size={18} />
                <motion.input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search icons"
                  className="w-full pl-12 pr-16 py-3 bg-gray-200/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                />
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div 
              className="flex items-center gap-4"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {/* Size selector */}
              <div className="flex items-center bg-gray-200 backdrop-blur-sm rounded-xl p-1.5 gap-1">
                {['24', '20', '16'].map((sizeOption) => (
                  <motion.button
                    key={sizeOption}
                    onClick={() => setSize(sizeOption)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      size === sizeOption 
                        ? 'text-white shadow-lg' 
                        : 'text-gray-900 hover:text-gray/900 hover:bg-white/40'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {size === sizeOption && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg"
                        layoutId="activeSize"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{sizeOption}px</span>
                  </motion.button>
                ))}
              </div>

              {/* Color picker */}
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="color"
                  value={iconColor}
                  onChange={(e) => setIconColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer opacity-0 absolute inset-0 z-10"
                />
                <motion.div 
                  className="w-8 h-8 rounded-lg cursor-pointer shadow-lg ring-2 ring-gray-600 group-hover:ring-gray-400 transition-all duration-200"
                  style={{ backgroundColor: iconColor }}
                  animate={{ backgroundColor: iconColor }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Color code */}
              <motion.div 
                className="bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-mono shadow-lg border border-gray-700"
                whileHover={{ scale: 1.05 }}
                animate={{ backgroundColor: iconColor + '20' }}
                transition={{ duration: 0.2 }}
              >
                {iconColor.toUpperCase()}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredIcons.map((icon, index) => (
              <motion.div
                key={icon.id}
                variants={itemVariants}
                onClick={() => handleIconClick(icon)}
                className="group cursor-pointer"
                custom={index}
              >
                <motion.div 
                  className="relative bg-white shadow-sm border border-gray-200 p-6 transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-4">
                    <motion.div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: iconColor + '15' }}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: iconColor }}
                        animate={{ backgroundColor: iconColor }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  </div>
                  <motion.span 
                    className="block text-sm text-gray-700 text-center font-medium leading-tight group-hover:text-gray-900 transition-colors duration-200"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {icon.name}
                  </motion.span>

                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.main>

      {/* Modal */}
      {selectedIcon && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedIcon(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-2xl font-bold text-gray-900 capitalize">{selectedIcon.name}</h3>
              <button
                onClick={() => setSelectedIcon(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-8">
                {/* Icon Preview */}
                <div className="flex justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 shadow-inner">
                    <div 
                      className="w-16 h-16 rounded-xl"
                      style={{ backgroundColor: iconColor }}
                    />
                  </div>
                </div>

                {/* CDN Link */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">CDN Link</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={getCurrentIconVariant()?.cdnUrl || ''}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      onClick={() => handleCopyToClipboard(getCurrentIconVariant()?.cdnUrl || '', 'cdn')}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 shadow-sm"
                    >
                      {copySuccess === 'cdn' ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Download Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Download Options</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => handleDownloadAllPNG(getCurrentIconVariant())}
                      className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-sm font-semibold shadow-sm border border-green-200"
                    >
                      PNG
                    </button>

                    <div className="relative" ref={svgDropdownRef}>
                      <button
                        onClick={() => setShowSvgDropdown(!showSvgDropdown)}
                        className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm border border-blue-200"
                      >
                        SVG
                        <div>
                          <ChevronDown size={14} />
                        </div>
                      </button>
                      
                      {showSvgDropdown && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 text-white rounded-xl shadow-2xl z-20 py-2 border border-gray-800">
                          {[
                            { action: 'download', label: 'Download SVG' },
                            { action: 'copy-url', label: 'Copy URL' },
                            { action: 'copy-code', label: 'Copy SVG Code' }
                          ].map((item, index) => (
                            <button
                              key={item.action}
                              onClick={() => handleSvgAction(item.action)}
                              className="w-full px-4 py-3 text-sm text-white hover:bg-gray-800 text-left transition-colors duration-200"
                            >
                              {item.label}
                            </button>
                          ))}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopyToClipboard('PDF code here', 'pdf')}
                      className="px-6 py-4 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-xl hover:from-purple-100 hover:to-violet-100 transition-all duration-200 text-sm font-semibold shadow-sm border border-purple-200"
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
      <AnimatePresence>
        {showToast && (
          <motion.div 
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div 
              className="bg-gray-900/95 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Check size={16} className="text-green-400" />
              </motion.div>
              <span className="text-sm font-medium">{toastMessage}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IconLibraryInterface;