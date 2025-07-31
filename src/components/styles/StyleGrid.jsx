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

  const sizeClasses = {
    small: 'aspect-square',
    medium: 'aspect-square',
    large: style.aspectRatio === '3:4' ? 'aspect-[3/4]' : style.aspectRatio === '4/3' ? 'aspect-[4/3]' : 'aspect-square'
  }

  return (
    <div 
      className={`group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'ring-2 ring-orange-500 shadow-lg transform scale-[0.98]' 
          : 'hover:shadow-lg hover:transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(style)}
    >
      {/* Image */}
      <div className={`relative ${sizeClasses[size]} overflow-hidden`}>
        <img
          src={style.url}
          alt={style.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-black transition-opacity duration-200 ${
          isHovered || isSelected ? 'bg-opacity-40' : 'bg-opacity-0'
        }`} />
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
        )}
        
        {/* Preview button */}
        {isHovered && onPreview && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPreview(style)
            }}
            className="absolute top-3 left-3 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all duration-200 hover:scale-110"
          >
            <Eye size={14} className="text-gray-700" />
          </button>
        )}
        
        {/* Favorite button */}
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Handle favorite logic here
            }}
            className="absolute top-3 left-12 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all duration-200 hover:scale-110"
          >
            <Heart size={14} className="text-gray-700" />
          </button>
        )}
        
        {/* Title overlay */}
        {(isHovered || isSelected) && showDetails && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/70 to-transparent">
            <h3 className="text-white font-medium text-sm mb-1">{style.title}</h3>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-gray-300 bg-white/20 px-2 py-0.5 rounded-full">
                {style.category}
              </span>
              <span className="text-xs text-gray-300 bg-white/20 px-2 py-0.5 rounded-full">
                {style.mood}
              </span>
            </div>
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
      <div className={`grid gap-4 ${
        size === 'small' ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8' :
        size === 'medium' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      } ${className}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
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
    <div className={`grid gap-4 ${
      size === 'small' ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8' :
      size === 'medium' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' :
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    } ${className}`}>
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