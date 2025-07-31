import React, { useState } from 'react'
import { Download, Share2, Heart, RotateCcw, Eye, Copy } from 'lucide-react'

const ResultsGrid = ({ 
  results = [], 
  onDownload, 
  onShare, 
  onRegenerate,
  loading = false,
  className = ""
}) => {
  const [favorites, setFavorites] = useState(new Set())
  const [selectedImage, setSelectedImage] = useState(null)

  const toggleFavorite = (resultId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(resultId)) {
      newFavorites.delete(resultId)
    } else {
      newFavorites.add(resultId)
    }
    setFavorites(newFavorites)
  }

  const handleImageClick = (result) => {
    setSelectedImage(result)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const handleDownload = async (result) => {
    if (onDownload) {
      await onDownload(result, `generated-${result.index + 1}.png`)
    }
  }

  const handleShare = (result) => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Generated Product Photo',
        text: 'Check out this AI-generated product photo!',
        url: result.url
      })
    } else if (onShare) {
      onShare(result)
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(result.url)
    }
  }

  if (results.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No results yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Generated images will appear here
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.map((result, index) => (
          <div
            key={result.id}
            className="group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
          >
            {/* Image */}
            <div className="relative aspect-square cursor-pointer" onClick={() => handleImageClick(result)}>
              <img
                src={result.url}
                alt={`Generated variant ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200">
                    <Eye size={20} className="text-gray-700" />
                  </button>
                </div>
              </div>
              
              {/* Favorite badge */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(result.id)
                }}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                  favorites.has(result.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                }`}
              >
                <Heart size={16} className={favorites.has(result.id) ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Variant {index + 1}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(result.createdAt).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(result)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  <Download size={14} />
                  Download
                </button>
                
                <button
                  onClick={() => handleShare(result)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      {results.length > 0 && (
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <button
            onClick={() => {
              results.forEach(result => handleDownload(result))
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <Download size={16} />
            Download All ({results.length})
          </button>
          
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Regenerate
            </button>
          )}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
            <img
              src={selectedImage.url}
              alt={`Generated variant ${selectedImage.index + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Modal Actions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-white dark:bg-gray-900 rounded-lg p-2 shadow-lg">
              <button
                onClick={() => handleDownload(selectedImage)}
                className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                <Download size={14} />
              </button>
              
              <button
                onClick={() => handleShare(selectedImage)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Share2 size={14} />
              </button>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedImage.url)
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Copy size={14} />
              </button>
            </div>
            
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsGrid