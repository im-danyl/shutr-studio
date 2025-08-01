import React, { useState } from 'react'
import { Upload, X, Check, AlertCircle, Image, Tag, Palette, Package, Background } from 'lucide-react'
import { storage } from '../../lib/supabase'
import { supabase } from '../../lib/supabase'
import useAuthStore from '../../store/authStore'

const StyleUploader = ({ onUploadComplete, className = "" }) => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [styleData, setStyleData] = useState({})
  const { user } = useAuthStore()

  // Form options
  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'home_decor', label: 'Home Decor' },
    { value: 'food', label: 'Food' }
  ]

  const containers = [
    { value: 'no_container', label: 'No Container' },
    { value: 'box', label: 'Box' },
    { value: 'bottle', label: 'Bottle' },
    { value: 'bag', label: 'Bag' },
    { value: 'tube', label: 'Tube' }
  ]

  const backgrounds = [
    { value: 'solid_white', label: 'Solid White' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'textured', label: 'Textured' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'natural', label: 'Natural' }
  ]

  const moods = [
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'playful', label: 'Playful' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'modern', label: 'Modern' }
  ]

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length !== selectedFiles.length) {
      alert('Please select only image files')
      return
    }

    const newFiles = imageFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      name: file.name.split('.')[0].replace(/[-_]/g, ' ')
    }))

    setFiles(prev => [...prev, ...newFiles])
    
    // Initialize style data for each file
    const newStyleData = {}
    newFiles.forEach(fileObj => {
      newStyleData[fileObj.id] = {
        name: fileObj.name,
        product_category: 'electronics',
        container_type: 'no_container',
        background_style: 'solid_white',
        mood_aesthetic: 'minimalist',
        tags: []
      }
    })
    setStyleData(prev => ({ ...prev, ...newStyleData }))
  }

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
    setStyleData(prev => {
      const newData = { ...prev }
      delete newData[fileId]
      return newData
    })
    
    // Clean up preview URL
    const file = files.find(f => f.id === fileId)
    if (file) {
      URL.revokeObjectURL(file.preview)
    }
  }

  const updateStyleData = (fileId, field, value) => {
    setStyleData(prev => ({
      ...prev,
      [fileId]: {
        ...prev[fileId],
        [field]: value
      }
    }))
  }

  const updateTags = (fileId, tagString) => {
    const tags = tagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    updateStyleData(fileId, 'tags', tags)
  }

  const uploadFiles = async () => {
    if (!user) {
      alert('You must be logged in to upload styles')
      return
    }

    if (files.length === 0) {
      alert('Please select at least one file')
      return
    }

    setUploading(true)
    const results = []

    try {
      for (const fileObj of files) {
        const data = styleData[fileObj.id]
        
        setUploadProgress(prev => ({ ...prev, [fileObj.id]: 10 }))

        // Upload file to storage
        const { path, url } = await storage.uploadStyleReference(fileObj.file, data.name)
        
        setUploadProgress(prev => ({ ...prev, [fileObj.id]: 50 }))

        // Create database entry
        const { data: styleRef, error } = await supabase
          .from('style_references')
          .insert([{
            name: data.name,
            image_url: url,
            product_category: data.product_category,
            container_type: data.container_type,
            background_style: data.background_style,
            mood_aesthetic: data.mood_aesthetic,
            tags: JSON.stringify(data.tags),
            is_active: true
          }])
          .select()
          .single()

        if (error) throw error

        setUploadProgress(prev => ({ ...prev, [fileObj.id]: 100 }))
        results.push({ success: true, styleRef, path, url })
      }

      // Clean up
      files.forEach(fileObj => URL.revokeObjectURL(fileObj.preview))
      setFiles([])
      setStyleData({})
      setUploadProgress({})

      if (onUploadComplete) {
        onUploadComplete(results)
      }

      alert(`Successfully uploaded ${results.length} style reference${results.length !== 1 ? 's' : ''}!`)

    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Upload failed: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Upload Style References
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Add new style references to the library. Images will be uploaded to storage and saved to the database.
          </p>
        </div>

        {/* File Upload Area */}
        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-orange-400 dark:hover:border-orange-500 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Choose style reference images
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select multiple images to upload. Supported formats: JPG, PNG, WebP
              </p>
            </label>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Style References ({files.length})
            </h3>
            
            <div className="space-y-6">
              {files.map(fileObj => (
                <div key={fileObj.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex gap-4">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      <img
                        src={fileObj.preview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                    </div>

                    {/* Form Fields */}
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Style Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Tag size={16} className="inline mr-1" />
                          Style Name
                        </label>
                        <input
                          type="text"
                          value={styleData[fileObj.id]?.name || ''}
                          onChange={(e) => updateStyleData(fileObj.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Enter style name"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Package size={16} className="inline mr-1" />
                          Category
                        </label>
                        <select
                          value={styleData[fileObj.id]?.product_category || 'electronics'}
                          onChange={(e) => updateStyleData(fileObj.id, 'product_category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Container Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Package size={16} className="inline mr-1" />
                          Container
                        </label>
                        <select
                          value={styleData[fileObj.id]?.container_type || 'no_container'}
                          onChange={(e) => updateStyleData(fileObj.id, 'container_type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          {containers.map(cont => (
                            <option key={cont.value} value={cont.value}>{cont.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Background Style */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Background size={16} className="inline mr-1" />
                          Background
                        </label>
                        <select
                          value={styleData[fileObj.id]?.background_style || 'solid_white'}
                          onChange={(e) => updateStyleData(fileObj.id, 'background_style', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          {backgrounds.map(bg => (
                            <option key={bg.value} value={bg.value}>{bg.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Mood */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Palette size={16} className="inline mr-1" />
                          Mood
                        </label>
                        <select
                          value={styleData[fileObj.id]?.mood_aesthetic || 'minimalist'}
                          onChange={(e) => updateStyleData(fileObj.id, 'mood_aesthetic', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          {moods.map(mood => (
                            <option key={mood.value} value={mood.value}>{mood.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={styleData[fileObj.id]?.tags?.join(', ') || ''}
                          onChange={(e) => updateTags(fileObj.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="e.g. clean, professional, modern"
                        />
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => removeFile(fileObj.id)}
                        disabled={uploading}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove file"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress[fileObj.id] && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[fileObj.id]}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {uploadProgress[fileObj.id]}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={uploadFiles}
                disabled={uploading || files.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload {files.length} Style{files.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StyleUploader