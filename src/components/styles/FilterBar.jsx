import React from 'react'
import { Search, X, Filter } from 'lucide-react'
import { filterOptions } from '../../data/mockStyles'

// Simple Select component
const Select = ({ value, onValueChange, placeholder, options }) => (
  <select 
    value={value || ''} 
    onChange={(e) => onValueChange(e.target.value)}
    className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
  >
    <option value="">{placeholder}</option>
    {options.map(option => (
      <option key={option} value={option === 'All' ? '' : option}>
        {option}
      </option>
    ))}
  </select>
)

/**
 * FilterBar component for filtering style references
 * @param {Object} filters - Current filter state object
 * @param {Function} onFiltersChange - Callback when filters change
 * @param {boolean} showSearch - Whether to show search input
 * @param {boolean} showAdvanced - Whether to show advanced filter options
 * @param {boolean} compact - Whether to use compact layout
 * @param {string} className - Additional CSS classes
 */
const FilterBar = ({ 
  filters = {}, 
  onFiltersChange, 
  showSearch = true,
  showAdvanced = true,
  compact = false,
  className = ""
}) => {
  const updateFilter = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? null : value
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.values(filters).some(value => value && value !== 'All')

  if (compact) {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search styles..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full h-10 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
            {filters.search && (
              <button
                onClick={() => updateFilter('search', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Quick filters */}
        <Select
          value={filters.category}
          onValueChange={(value) => updateFilter('category', value)}
          placeholder="Category"
          options={filterOptions.categories}
        />
        
        <Select
          value={filters.mood}
          onValueChange={(value) => updateFilter('mood', value)}
          placeholder="Mood"
          options={filterOptions.moods}
        />

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="h-10 px-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      {showSearch && (
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search styles by name or tags..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full h-12 pl-11 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Filter size={16} />
          <span>Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="min-w-[140px]">
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilter('category', value)}
              placeholder="Category"
              options={filterOptions.categories}
            />
          </div>
          
          <div className="min-w-[120px]">
            <Select
              value={filters.mood}
              onValueChange={(value) => updateFilter('mood', value)}
              placeholder="Mood"
              options={filterOptions.moods}
            />
          </div>

          {showAdvanced && (
            <>
              <div className="min-w-[120px]">
                <Select
                  value={filters.container}
                  onValueChange={(value) => updateFilter('container', value)}
                  placeholder="Container"
                  options={filterOptions.containers}
                />
              </div>
              
              <div className="min-w-[130px]">
                <Select
                  value={filters.background}
                  onValueChange={(value) => updateFilter('background', value)}
                  placeholder="Background"
                  options={filterOptions.backgrounds}
                />
              </div>
              
              <div className="min-w-[130px]">
                <Select
                  value={filters.aspectRatio}
                  onValueChange={(value) => updateFilter('aspectRatio', value)}
                  placeholder="Aspect Ratio"
                  options={filterOptions.aspectRatios}
                />
              </div>
            </>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="h-10 px-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <X size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || value === 'All') return null
            
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm rounded-full border border-orange-200 dark:border-orange-800"
              >
                <span className="capitalize">{key}:</span>
                <span className="font-medium">{value}</span>
                <button
                  onClick={() => updateFilter(key, '')}
                  className="ml-1 hover:bg-orange-200 dark:hover:bg-orange-800/50 rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FilterBar