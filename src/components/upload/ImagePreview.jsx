import React from 'react'
import { X, RotateCcw, Download, Eye } from 'lucide-react'

const ImagePreview = ({ 
  src, 
  alt = "Preview", 
  onRemove,
  onReplace,
  fileName,
  fileSize,
  className = "",
  showControls = true,
  aspectRatio = "auto"
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto object-cover transition-transform duration-200 group-hover:scale-105 ${
            aspectRatio === "square" ? "aspect-square" : 
            aspectRatio === "portrait" ? "aspect-[3/4]" :
            aspectRatio === "landscape" ? "aspect-[4/3]" : ""
          }`}
        />
        
        {/* Overlay Controls */}
        {showControls && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
              <button
                onClick={() => window.open(src, '_blank')}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200 hover:scale-110"
                title="View full size"
              >
                <Eye size={16} className="text-gray-700" />
              </button>
              
              {onReplace && (
                <button
                  onClick={onReplace}
                  className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200 hover:scale-110"
                  title="Replace image"
                >
                  <RotateCcw size={16} className="text-gray-700" />
                </button>
              )}
              
              {onRemove && (
                <button
                  onClick={onRemove}
                  className="p-2 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200 hover:scale-110"
                  title="Remove image"
                >
                  <X size={16} className="text-white" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* File Info */}
      {(fileName || fileSize) && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              {fileName && (
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {fileName}
                </p>
              )}
              {fileSize && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {typeof fileSize === 'number' ? formatFileSize(fileSize) : fileSize}
                </p>
              )}
            </div>
            
            {showControls && (
              <div className="flex items-center gap-1 ml-3">
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = src
                    link.download = fileName || 'image'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Download"
                >
                  <Download size={14} />
                </button>
                
                {onRemove && (
                  <button
                    onClick={onRemove}
                    className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImagePreview