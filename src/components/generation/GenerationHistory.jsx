import React, { useState, useEffect } from 'react'
import { Clock, Download, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import generationsService from '../../lib/generations'

const GenerationHistory = ({ onSelectGeneration }) => {
  const [generations, setGenerations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) {
      loadGenerationHistory()
    }
  }, [user])

  const loadGenerationHistory = async () => {
    try {
      setLoading(true)
      const result = await generationsService.getGenerationHistory(user.id, 10)
      
      if (result.success) {
        setGenerations(result.generations)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />
      case 'processing':
        return <RefreshCw size={16} className="text-blue-500 animate-spin" />
      case 'failed':
        return <AlertCircle size={16} className="text-red-500" />
      default:
        return <Clock size={16} className="text-gray-400" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'processing':
        return 'Processing'
      case 'failed':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleDownloadAll = async (generation) => {
    if (!generation.generated_images || generation.generated_images.length === 0) return
    
    try {
      for (let i = 0; i < generation.generated_images.length; i++) {
        const imageUrl = generation.generated_images[i]
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `generation_${generation.id}_variant_${i + 1}.png`
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        window.URL.revokeObjectURL(url)
        
        // Small delay between downloads
        if (i < generation.generated_images.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw size={24} className="animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading generation history...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
        <p className="text-red-600">Failed to load generation history</p>
        <button 
          onClick={loadGenerationHistory}
          className="mt-2 px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (generations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Clock size={32} className="mx-auto mb-2" />
        <p>No generations yet</p>
        <p className="text-sm">Your generation history will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Generation History
        </h3>
        <button
          onClick={loadGenerationHistory}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {generations.map((generation) => (
          <div
            key={generation.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(generation.status)}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getStatusText(generation.status)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {generation.variant_count} variant{generation.variant_count !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm text-gray-500">
                    {generation.credits_consumed} credit{generation.credits_consumed !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-2">
                  {generation.product_image_url && (
                    <img
                      src={generation.product_image_url}
                      alt="Product"
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                  )}
                  {(generation.style_reference_url || generation.custom_style_file_url) && (
                    <img
                      src={generation.style_reference_url || generation.custom_style_file_url}
                      alt="Style Reference"
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(generation.created_at)}
                    </p>
                    {generation.error_message && (
                      <p className="text-sm text-red-600 truncate">
                        {generation.error_message}
                      </p>
                    )}
                  </div>
                </div>

                {generation.generated_images && generation.generated_images.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex -space-x-2">
                      {generation.generated_images.slice(0, 4).map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Generated ${index + 1}`}
                          className="w-8 h-8 rounded-lg object-cover border-2 border-white dark:border-gray-800"
                        />
                      ))}
                    </div>
                    {generation.generated_images.length > 4 && (
                      <span className="text-sm text-gray-500">
                        +{generation.generated_images.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                {generation.status === 'completed' && generation.generated_images && (
                  <>
                    <button
                      onClick={() => onSelectGeneration && onSelectGeneration(generation)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadAll(generation)}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                      title="Download All"
                    >
                      <Download size={16} />
                    </button>
                  </>
                )}
                {generation.status === 'processing' && (
                  <button
                    onClick={() => onSelectGeneration && onSelectGeneration(generation)}
                    className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                  >
                    Monitor
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {generations.length >= 10 && (
        <div className="text-center">
          <button
            onClick={() => loadGenerationHistory()}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default GenerationHistory