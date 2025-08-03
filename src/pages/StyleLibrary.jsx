import React, { useState, useMemo } from 'react'
import { useStyleReferences } from '../hooks/useStyleReferences'
import FilterBar from '../components/styles/FilterBar'
import StyleGrid from '../components/styles/StyleGrid'

const StyleLibrary = () => {
  const [filters, setFilters] = useState({})
  const [selectedStyleId, setSelectedStyleId] = useState(null)
  const { styles, loading, error, filterOptions, fetchStyles, filterStyles } = useStyleReferences()

  // Filter styles based on current filters
  const filteredStyles = useMemo(() => {
    return filterStyles(styles, filters)
  }, [styles, filters, filterStyles])

  const handleStyleSelect = (style) => {
    setSelectedStyleId(selectedStyleId === style.id ? null : style.id)
  }

  const handleStylePreview = (style) => {
    // Open preview modal or navigate to preview
  }

  return (
    <div className="main-container">
      <div className="content-container">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Style Library
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Browse our curated collection of professional styling references for your AI generations
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8">
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            filterOptions={filterOptions}
            showSearch={true}
            showAdvanced={true}
            compact={false}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin h-10 w-10 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-white rounded-full mx-auto mb-6"></div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading style library...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-lg text-red-600 dark:text-red-400 mb-6 font-medium">Error loading styles: {error}</p>
            <button 
              onClick={fetchStyles}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 font-medium shadow-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success State */}
        {!loading && !error && (
          <>
            {/* Results Count */}
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredStyles.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{styles.length}</span> styles
                {Object.keys(filters).length > 0 && (
                  <span className="text-gray-500 dark:text-gray-400"> • {Object.keys(filters).length} filter{Object.keys(filters).length !== 1 ? 's' : ''} applied</span>
                )}
              </p>
            </div>

            {/* Style Grid */}
            <StyleGrid
              styles={filteredStyles}
              selectedStyleId={selectedStyleId}
              onStyleSelect={handleStyleSelect}
              onStylePreview={handleStylePreview}
              size="large"
              showDetails={true}
              emptyMessage="No styles match your current filters. Try adjusting your search criteria."
            />
          </>
        )}

        {/* Load More (Future Feature) */}
        {filteredStyles.length > 0 && filteredStyles.length % 12 === 0 && (
          <div className="text-center mt-12">
            <button 
              className="button variant-outline"
              disabled
            >
              Load More Styles
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              More styles coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StyleLibrary