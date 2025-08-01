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
      className={`group relative overflow-hidden transition-all duration-200 cursor-pointer mb-4 break-inside-avoid ${
        isSelected 
          ? 'ring-2 ring-orange-500 rounded-lg shadow-lg' 
          : 'hover:opacity-90'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={style.url}
          alt={style.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-auto object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse min-h-[200px] rounded-lg" />
        )}
        
        {/* Minimal selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
            <Check size={12} className="text-white" />
          </div>
        )}
        
        {/* Beautiful hover overlay with all details inside image */}
        {isHovered && showDetails && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 flex flex-col justify-between p-4 transition-all duration-300">
            {/* Top section - Category badge */}
            <div className="flex justify-between items-start">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                {style.category}
              </span>
              {style.mood && (
                <span className="bg-orange-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                  {style.mood}
                </span>
              )}
            </div>
            
            {/* Center section - Select button */}
            <div className="flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect?.(style)
                }}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  isSelected 
                    ? 'bg-orange-500 text-white border border-orange-500' 
                    : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                }`}
              >
                {isSelected ? '✓ Selected' : 'Select Style'}
              </button>
            </div>
            
            {/* Bottom section - Main details */}
            <div className="space-y-3">
              {/* Title */}
              <h3 className="text-white font-semibold text-lg leading-tight">
                {style.title}
              </h3>
              
              {/* Tags */}
              {style.tags && style.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {style.tags.slice(0, 4).map(tag => (
                    <span 
                      key={tag}
                      className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Container and Background info */}
              <div className="grid grid-cols-2 gap-2 text-xs text-white/90">
                <div className="bg-white/10 backdrop-blur-sm rounded px-2 py-1">
                  <div className="font-medium opacity-75">Container</div>
                  <div>{style.container}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded px-2 py-1">
                  <div className="font-medium opacity-75">Background</div>
                  <div>{style.background}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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
    <div className={`columns-3 gap-4 ${className}`} style={{ columnFill: 'balance' }}>
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