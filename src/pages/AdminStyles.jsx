import React, { useState, useEffect } from 'react'
import { Settings, Upload, Eye, EyeOff, Trash2, Edit, Plus, Search, Filter } from 'lucide-react'
import StyleUploader from '../components/styles/StyleUploader'
import { supabase } from '../lib/supabase'
import useAuthStore from '../store/authStore'

const AdminStyles = () => {
  const [activeTab, setActiveTab] = useState('upload') // 'upload', 'manage'
  const [styles, setStyles] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    container: '',
    background: '',
    mood: '',
    search: ''
  })
  const [editingStyle, setEditingStyle] = useState(null)
  const { user } = useAuthStore()

  // Check if user has admin access (for demo, we'll allow any authenticated user)
  const isAdmin = user ? true : false

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchStyles()
    }
  }, [activeTab, filters])

  const fetchStyles = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('style_references')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.category) {
        query = query.eq('product_category', filters.category)
      }
      if (filters.container) {
        query = query.eq('container_type', filters.container)
      }
      if (filters.background) {
        query = query.eq('background_style', filters.background)
      }
      if (filters.mood) {
        query = query.eq('mood_aesthetic', filters.mood)
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,tags.cs.["${filters.search}"]`)
      }

      const { data, error } = await query

      if (error) throw error
      setStyles(data || [])
    } catch (error) {
      console.error('Error fetching styles:', error)
      alert('Failed to fetch styles')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = (results) => {
    console.log('Upload completed:', results)
    // Refresh the manage tab if it's active
    if (activeTab === 'manage') {
      fetchStyles()
    }
  }

  const toggleStyleActive = async (styleId, currentActive) => {
    try {
      const { error } = await supabase
        .from('style_references')
        .update({ is_active: !currentActive })
        .eq('id', styleId)

      if (error) throw error
      
      setStyles(prev => prev.map(style => 
        style.id === styleId ? { ...style, is_active: !currentActive } : style
      ))
    } catch (error) {
      console.error('Error toggling style:', error)
      alert('Failed to update style')
    }
  }

  const deleteStyle = async (styleId) => {
    if (!confirm('Are you sure you want to delete this style reference?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('style_references')
        .delete()
        .eq('id', styleId)

      if (error) throw error
      
      setStyles(prev => prev.filter(style => style.id !== styleId))
      alert('Style deleted successfully')
    } catch (error) {
      console.error('Error deleting style:', error)
      alert('Failed to delete style')
    }
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      container: '',
      background: '',
      mood: '',
      search: ''
    })
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Settings size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Access Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need admin privileges to access the style management interface.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Style Library Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload and manage style references for the AI generation system
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Upload size={16} className="inline mr-2" />
                Upload Styles
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'manage'
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Settings size={16} className="inline mr-2" />
                Manage Styles ({styles.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' && (
          <StyleUploader 
            onUploadComplete={handleUploadComplete}
            className="mb-8"
          />
        )}

        {activeTab === 'manage' && (
          <div>
            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={20} className="text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Search
                  </label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Search styles..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="beauty">Beauty</option>
                    <option value="home_decor">Home Decor</option>
                    <option value="food">Food</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Container
                  </label>
                  <select
                    value={filters.container}
                    onChange={(e) => setFilters(prev => ({ ...prev, container: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">All Containers</option>
                    <option value="no_container">No Container</option>
                    <option value="box">Box</option>
                    <option value="bottle">Bottle</option>
                    <option value="bag">Bag</option>
                    <option value="tube">Tube</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Background
                  </label>
                  <select
                    value={filters.background}
                    onChange={(e) => setFilters(prev => ({ ...prev, background: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">All Backgrounds</option>
                    <option value="solid_white">Solid White</option>
                    <option value="gradient">Gradient</option>
                    <option value="textured">Textured</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="natural">Natural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mood
                  </label>
                  <select
                    value={filters.mood}
                    onChange={(e) => setFilters(prev => ({ ...prev, mood: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">All Moods</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="luxury">Luxury</option>
                    <option value="playful">Playful</option>
                    <option value="vintage">Vintage</option>
                    <option value="modern">Modern</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Styles Grid */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Style References {loading ? '(Loading...)' : `(${styles.length})`}
                </h3>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading styles...</p>
                </div>
              ) : styles.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No styles found matching your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                  {styles.map(style => (
                    <div key={style.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      {/* Image */}
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
                        <img
                          src={style.image_url}
                          alt={style.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'
                          }}
                        />
                        
                        {/* Status Badge */}
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                          style.is_active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {style.is_active ? 'Active' : 'Inactive'}
                        </div>

                        {/* Actions */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() => toggleStyleActive(style.id, style.is_active)}
                            className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow"
                            title={style.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {style.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            onClick={() => deleteStyle(style.id)}
                            className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 truncate">
                          {style.name}
                        </h4>
                        
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <div>Category: <span className="capitalize">{style.product_category.replace('_', ' ')}</span></div>
                          <div>Container: <span className="capitalize">{style.container_type.replace('_', ' ')}</span></div>
                          <div>Background: <span className="capitalize">{style.background_style.replace('_', ' ')}</span></div>
                          <div>Mood: <span className="capitalize">{style.mood_aesthetic}</span></div>
                        </div>

                        {/* Tags */}
                        {style.tags && Array.isArray(style.tags) && style.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {style.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                            {style.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                                +{style.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                          Used {style.usage_count || 0} times
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminStyles