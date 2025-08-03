import React from 'react'
import { Search, X, Filter } from 'lucide-react'

// Custom Dropdown Component with modern styling
const Select = ({ value, onValueChange, placeholder, options }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)
  
  React.useEffect(() => {
    setSelectedValue(value)
  }, [value])
  
  const handleSelect = (optionValue) => {
    const newValue = optionValue === 'All' ? '' : optionValue
    setSelectedValue(newValue)
    onValueChange(newValue)
    setIsOpen(false)
  }
  
  const displayValue = selectedValue || placeholder
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-4 pr-10 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-1 focus:ring-gray-700 focus:border-gray-700 dark:focus:ring-gray-300 dark:focus:border-gray-300 outline-none transition-all duration-300 ease-out hover:border-gray-400 dark:hover:border-gray-400 cursor-pointer shadow-sm text-left flex items-center justify-between transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <span className={selectedValue ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
          {displayValue}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent animate-in fade-in-0 zoom-in-95 duration-200 ease-out">
            <div className="py-1">
              <div
                onClick={() => handleSelect('')}
                className={`px-3 py-2 text-sm cursor-pointer transition-all duration-200 ease-out hover:bg-gray-50 dark:hover:bg-gray-700 transform hover:translate-x-1 ${
                  !selectedValue ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {placeholder}
              </div>
              
              {options.filter(option => option !== 'All').map(option => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2 text-sm cursor-pointer transition-all duration-200 ease-out hover:bg-gray-50 dark:hover:bg-gray-700 transform hover:translate-x-1 ${
                    selectedValue === option ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="capitalize">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

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
  filterOptions = {
    categories: ['All'],
    containers: ['All'],
    backgrounds: ['All'],
    moods: ['All'],
    aspectRatios: ['All', '1:1', '3:4', '4:3', '9:16', '16:9']
  },
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
              className="w-full h-11 pl-11 pr-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-1 focus:ring-gray-700 focus:border-gray-700 dark:focus:ring-gray-300 dark:focus:border-gray-300 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-400 shadow-sm"
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
            className="h-11 px-5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 flex items-center gap-2.5 shadow-sm"
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
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search styles by name or tags..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full h-12 pl-12 pr-14 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-gray-700 focus:border-gray-700 dark:focus:ring-gray-300 dark:focus:border-gray-300 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-400 shadow-sm font-medium"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200">
          <Filter size={18} className="text-gray-600 dark:text-gray-400" />
          <span>Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="min-w-[150px]">
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilter('category', value)}
              placeholder="Category"
              options={filterOptions.categories}
            />
          </div>
          
          <div className="min-w-[130px]">
            <Select
              value={filters.mood}
              onValueChange={(value) => updateFilter('mood', value)}
              placeholder="Mood"
              options={filterOptions.moods}
            />
          </div>

          {showAdvanced && (
            <>
              <div className="min-w-[140px]">
                <Select
                  value={filters.container}
                  onValueChange={(value) => updateFilter('container', value)}
                  placeholder="Container"
                  options={filterOptions.containers}
                />
              </div>
              
              <div className="min-w-[140px]">
                <Select
                  value={filters.background}
                  onValueChange={(value) => updateFilter('background', value)}
                  placeholder="Background"
                  options={filterOptions.backgrounds}
                />
              </div>
              
              <div className="min-w-[150px]">
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
            className="h-11 px-5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 flex items-center gap-2.5 shadow-sm"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-full border border-gray-200 dark:border-gray-700 font-medium shadow-sm"
              >
                <span className="capitalize">{key}:</span>
                <span className="font-medium">{value}</span>
                <button
                  onClick={() => updateFilter(key, '')}
                  className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 transition-colors"
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