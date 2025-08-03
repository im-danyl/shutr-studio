import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useStyleReferences = () => {
  const [styles, setStyles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterOptions, setFilterOptions] = useState({
    categories: ['All'],
    containers: ['All'],
    backgrounds: ['All'],
    moods: ['All'],
    aspectRatios: ['All', '1:1', '3:4', '4:3', '9:16', '16:9']
  })

  const fetchStyles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('style_references')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (fetchError) {
        throw fetchError
      }
      
      // Transform database format to component format
      const transformedStyles = data.map(style => {
        // Get proper image URL for Supabase storage
        const imageUrl = style.image_url.startsWith('http') 
          ? style.image_url 
          : supabase.storage.from('style-references').getPublicUrl(style.image_url).data.publicUrl
        
        return {
          id: style.id.toString(),
          url: imageUrl,
          title: style.name,
          category: capitalizeFirst(style.product_category),
          container: capitalizeFirst(style.container_type),
          background: capitalizeFirst(style.background_style),
          mood: capitalizeFirst(style.mood_aesthetic),
          aspectRatio: '1:1', // Default for now
          tags: style.tags ? (typeof style.tags === 'string' ? JSON.parse(style.tags) : style.tags) : []
        }
      })
      
      setStyles(transformedStyles)
      
      // Generate dynamic filter options from the actual data
      const categories = ['All', ...new Set(transformedStyles.map(s => s.category))]
      const containers = ['All', ...new Set(transformedStyles.map(s => s.container))]
      const backgrounds = ['All', ...new Set(transformedStyles.map(s => s.background))]
      const moods = ['All', ...new Set(transformedStyles.map(s => s.mood))]
      
      setFilterOptions({
        categories,
        containers,
        backgrounds,
        moods,
        aspectRatios: ['All', '1:1', '3:4', '4:3', '9:16', '16:9']
      })
    } catch (err) {
      setError(err.message)
      console.error('Error fetching styles:', err)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to capitalize first letter
  const capitalizeFirst = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ')
  }

  // Filter styles function
  const filterStyles = (styleList, filters) => {
    return styleList.filter((style) => {
      const matchesCategory = !filters.category || filters.category === 'All' || style.category === filters.category
      const matchesContainer = !filters.container || filters.container === 'All' || style.container === filters.container
      const matchesBackground = !filters.background || filters.background === 'All' || style.background === filters.background
      const matchesMood = !filters.mood || filters.mood === 'All' || style.mood === filters.mood
      const matchesSearch = !filters.search || 
        style.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        style.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      
      return matchesCategory && matchesContainer && matchesBackground && matchesMood && matchesSearch
    })
  }

  useEffect(() => {
    fetchStyles()
  }, [])

  return {
    styles,
    loading,
    error,
    filterOptions,
    fetchStyles,
    filterStyles
  }
}