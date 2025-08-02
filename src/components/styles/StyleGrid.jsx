import React, { useState } from 'react'
import { Check, Eye, Heart } from 'lucide-react'

/**
 * StyleCard component for displaying individual style references
 * @param {Object} style - Style object with id, title, url, category, etc.
 * @param {boolean} isSelected - Whether this style is currently selected
 * @param {Function} onSelect - Callback when style is selected
 * @param {Function} onPreview - Callback when style is previewed
 * @param {boolean} showDetails - Whether to show style details overlay
 * @param {string} size - Size variant: 'small', 'medium', 'large'
 */
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
      className={`group relative overflow-hidden transition-all duration-300 ease-out cursor-pointer mb-4 break-inside-avoid ${
        isSelected 
          ? 'ring-2 ring-cyan-400 rounded-xl shadow-lg shadow-cyan-400/20' 
          : 'hover:opacity-90'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(style)}
    >
      {/* Image */}
      <div className="relative rounded-xl overflow-hidden">
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
        
        {/* Selection indicator - top left when selected */}
        {isSelected && (
          <div className="absolute top-3 left-3 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-75 duration-300 ease-out">
            <Check size={14} className="text-white animate-in zoom-in-50 duration-200 delay-100" />
          </div>
        )}
        
        {/* Simple hover overlay with clean design */}
        {isHovered && showDetails && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-3 transition-all duration-300">
            {/* Top section - Select button (top right) */}
            <div className="flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect?.(style)
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg' 
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                {isSelected ? '✓ Selected' : 'Select'}
              </button>
            </div>
            
            {/* Bottom section - Essential details only */}
            <div className="space-y-2">
              {/* Title */}
              <h3 className="text-white font-semibold text-lg leading-tight">
                {style.title}
              </h3>
              
              {/* Essential info in simple format */}
              <div className="flex flex-wrap gap-2 text-sm text-white/90">
                <span>1:1</span>
                <span>•</span>
                <span>{style.container}</span>
                <span>•</span>
                <span>{style.mood}</span>
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