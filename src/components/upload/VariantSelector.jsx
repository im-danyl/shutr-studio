import React from 'react'
import { Coins } from 'lucide-react'

const VariantSelector = ({ 
  value = 1, 
  onChange, 
  min = 1, 
  max = 4, 
  disabled = false,
  showCostPreview = true,
  className = ""
}) => {
  const variants = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  
  const handleSelect = (count) => {
    if (!disabled) {
      onChange(count)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Number of Variants
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Choose how many variations you'd like to generate
          </p>
        </div>
        
        {showCostPreview && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/20 rounded-full border border-orange-200 dark:border-orange-800">
            <Coins size={14} className="text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              {value} credit{value !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Variant Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {variants.map((count) => (
          <button
            key={count}
            onClick={() => handleSelect(count)}
            disabled={disabled}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200 text-center
              ${value === count
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Selection Indicator */}
            {value === count && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
            
            {/* Content */}
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${
                value === count 
                  ? 'text-orange-600 dark:text-orange-400' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {count}
              </div>
              
              <div className={`text-sm ${
                value === count 
                  ? 'text-orange-600 dark:text-orange-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {count === 1 ? 'variant' : 'variants'}
              </div>
              
              {showCostPreview && (
                <div className={`text-xs flex items-center justify-center gap-1 ${
                  value === count 
                    ? 'text-orange-500 dark:text-orange-400' 
                    : 'text-gray-500 dark:text-gray-500'
                }`}>
                  <Coins size={10} />
                  <span>{count} credit{count !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Info Message */}
      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-0.5 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">How variants work:</p>
            <p>Each variant is a unique AI interpretation of your product in the selected style. More variants give you more options to choose from.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VariantSelector