import React, { useState, useMemo } from 'react'
import { useStyleReferences } from '../hooks/useStyleReferences'
import FilterBar from '../components/styles/FilterBar'
import StyleGrid from '../components/styles/StyleGrid'

const StyleLibrary = () => {
  const [filters, setFilters] = useState({})
  const [selectedStyleId, setSelectedStyleId] = useState(null)
  const { styles, loading, error, fetchStyles, filterStyles } = useStyleReferences()

  // Filter styles based on current filters
  const filteredStyles = useMemo(() => {
    return filterStyles(styles, filters)
  }, [styles, filters, filterStyles])

  const handleStyleSelect = (style) => {
    setSelectedStyleId(selectedStyleId === style.id ? null : style.id)
  }

  const handleStylePreview = (style) => {
    // Open preview modal or navigate to preview
    console.log('Preview style:', style)
  }

  return (
    <div className="main-container">
      <div className="content-container">
        {/* Header */}
        <div className="mb-8">
          <h2 style={{ marginBottom: '8px' }}>
            Style Library
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Browse our curated collection of professional styling references for your AI generations
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8">
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            showSearch={true}
            showAdvanced={true}
            compact={false}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading style library...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error loading styles: {error}</p>
            <button 
              onClick={fetchStyles}
              className="button variant-outline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success State */}
        {!loading && !error && (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Showing {filteredStyles.length} of {styles.length} styles
                {Object.keys(filters).length > 0 && (
                  <span> • {Object.keys(filters).length} filter{Object.keys(filters).length !== 1 ? 's' : ''} applied</span>
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