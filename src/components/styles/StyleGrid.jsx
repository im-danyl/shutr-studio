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
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-between p-4 transition-all duration-300 backdrop-blur-sm">
            {/* Top section - Category and mood badges */}
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                <span className="bg-white/25 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium border border-white/20">
                  {style.category}
                </span>
              </div>
              {style.mood && (
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                  {style.mood}
                </span>
              )}
            </div>
            
            {/* Center section - Select button */}
            <div className="flex justify-center items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect?.(style)
                }}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-xl ${
                  isSelected 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-2 border-orange-300 shadow-orange-500/50' 
                    : 'bg-white/20 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/30 hover:border-white/50'
                }`}
              >
                {isSelected ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Selected</span>
                  </div>
                ) : 'Select Style'}
              </button>
            </div>
            
            {/* Bottom section - Main details */}
            <div className="space-y-3">
              {/* Title */}
              <h3 className="text-white font-bold text-xl leading-tight drop-shadow-lg">
                {style.title}
              </h3>
              
              {/* Tags */}
              {style.tags && style.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {style.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag}
                      className="bg-white/20 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Container and Background info */}
              <div className="grid grid-cols-2 gap-3 text-xs text-white/95">
                <div className="bg-white/15 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20">
                  <div className="font-semibold text-white/80 mb-1">Container</div>
                  <div className="font-medium">{style.container}</div>
                </div>
                <div className="bg-white/15 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20">
                  <div className="font-semibold text-white/80 mb-1">Background</div>
                  <div className="font-medium">{style.background}</div>
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