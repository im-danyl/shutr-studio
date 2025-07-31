import React, { useState } from 'react'
import { Download, CheckCircle, AlertCircle, Loader } from 'lucide-react'

const DownloadButton = ({ 
  imageUrl, 
  filename, 
  className = "",
  variant = "primary", // "primary", "secondary", "icon"
  size = "md", // "sm", "md", "lg"
  onDownloadStart,
  onDownloadComplete,
  onDownloadError
}) => {
  const [downloading, setDownloading] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState(null) // "success", "error"

  const handleDownload = async () => {
    if (downloading) return

    try {
      setDownloading(true)
      setDownloadStatus(null)
      onDownloadStart?.()

      // Fetch the image
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`)
      }

      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `image-${Date.now()}.png`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      
      setDownloadStatus("success")
      onDownloadComplete?.({ url: imageUrl, filename })
      
      // Clear success status after delay
      setTimeout(() => setDownloadStatus(null), 2000)
      
    } catch (error) {
      console.error('Download failed:', error)
      setDownloadStatus("error")
      onDownloadError?.(error)
      
      // Clear error status after delay
      setTimeout(() => setDownloadStatus(null), 3000)
    } finally {
      setDownloading(false)
    }
  }

  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    
    // Size classes
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    }
    
    // Variant classes
    const variantClasses = {
      primary: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 disabled:bg-orange-300",
      secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700",
      icon: "p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
    }
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`
  }

  const getIcon = () => {
    if (downloading) {
      return <Loader size={variant === "icon" ? 18 : 16} className="animate-spin" />
    }
    
    if (downloadStatus === "success") {
      return <CheckCircle size={variant === "icon" ? 18 : 16} className="text-green-500" />
    }
    
    if (downloadStatus === "error") {
      return <AlertCircle size={variant === "icon" ? 18 : 16} className="text-red-500" />
    }
    
    return <Download size={variant === "icon" ? 18 : 16} />
  }

  const getButtonText = () => {
    if (variant === "icon") return null
    
    if (downloading) return "Downloading..."
    if (downloadStatus === "success") return "Downloaded!"
    if (downloadStatus === "error") return "Failed"
    return "Download"
  }

  const isDisabled = downloading || !imageUrl

  return (
    <button
      onClick={handleDownload}
      disabled={isDisabled}
      className={getButtonClasses()}
      title={variant === "icon" ? "Download image" : undefined}
    >
      {getIcon()}
      {getButtonText() && (
        <span className={variant === "icon" ? "sr-only" : "ml-2"}>
          {getButtonText()}
        </span>
      )}
    </button>
  )
}

export default DownloadButton