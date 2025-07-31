import React, { useState } from 'react'
import { Check, Eye, Heart } from 'lucide-react'

const StyleCard = ({ 
  style, 
  isSelected = false, 
  onSelect, 
  onPreview,
  showDetails = true,
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Remove forced aspect ratios to allow natural image proportions

  return (
    <div 
      className={`group relative overflow-hidden transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'ring-2 ring-orange-500' 
          : 'hover:opacity-90'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(style)}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={style.url}
          alt={style.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-auto object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse min-h-[200px]" />
        )}
        
        {/* Minimal selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
            <Check size={12} className="text-white" />
          </div>
        )}
        
        {/* Minimal hover overlay - only show title on hover */}
        {isHovered && showDetails && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-white font-medium text-xs">{style.title}</h3>
          </div>
        )}
      </div>
      
      {/* Card details (for larger sizes) */}
      {size === 'large' && showDetails && (
        <div className="p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">{style.title}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {style.tags.slice(0, 3).map(tag => (
              <span 
                key={tag}
                className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div>
              <span className="font-medium">Container:</span> {style.container}
            </div>
            <div>
              <span className="font-medium">Background:</span> {style.background}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const StyleGrid = ({ 
  styles = [], 
  selectedStyleId = null, 
  onStyleSelect, 
  onStylePreview,
  loading = false,
  emptyMessage = "No styles found matching your filters.",
  size = 'medium',
  showDetails = true,
  className = ""
}) => {
  if (loading) {
    return (
      <div className={`grid gap-1 ${
        size === 'small' ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8' :
        size === 'medium' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      } ${className}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-800 animate-pulse" style={{ minHeight: '200px' }} />
        ))}
      </div>
    )
  }

  if (styles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Styles Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className={`grid gap-1 ${
      size === 'small' ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8' :
      size === 'medium' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' :
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    } ${className}`} style={{ gridAutoRows: 'min-content' }}>
      {styles.map((style) => (
        <StyleCard
          key={style.id}
          style={style}
          isSelected={selectedStyleId === style.id}
          onSelect={onStyleSelect}
          onPreview={onStylePreview}
          size={size}
          showDetails={showDetails}
        />
      ))}
    </div>
  )
}

export default StyleGrid