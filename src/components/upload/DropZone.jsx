import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image, AlertCircle, X } from 'lucide-react'

const DropZone = ({ 
  onFileAccepted, 
  onFileRejected,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp']
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  className = "",
  disabled = false
}) => {
  const [error, setError] = useState('')

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('')
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors.some(error => error.code === 'file-too-large')) {
        setError('File is too large. Maximum size is 10MB.')
      } else if (rejection.errors.some(error => error.code === 'file-invalid-type')) {
        setError('Invalid file type. Please upload PNG, JPG, JPEG, or WebP images.')
      } else {
        setError('File upload failed. Please try again.')
      }
      onFileRejected?.(rejectedFiles[0])
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      onFileAccepted(file)
    }
  }, [onFileAccepted, onFileRejected])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled
  })

  const clearError = () => setError('')

  return (
    <div className={`relative ${className}`}>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? isDragAccept 
              ? 'border-green-400 bg-green-50 dark:bg-green-950/20' 
              : 'border-red-400 bg-red-50 dark:bg-red-950/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`p-3 rounded-full ${
            isDragActive 
              ? isDragAccept 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            {isDragActive ? (
              isDragAccept ? (
                <Upload size={24} className="text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
              )
            ) : (
              <Image size={24} className="text-gray-600 dark:text-gray-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isDragActive 
                ? isDragAccept 
                  ? 'Drop your image here' 
                  : 'Invalid file type'
                : 'Upload your product image'
              }
            </h3>
            
            {!isDragActive && (
              <div className="space-y-1">
                <p className="text-gray-600 dark:text-gray-400">
                  Drag & drop an image here, or <span className="text-orange-500 font-medium">click to browse</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  PNG, JPG, JPEG, WebP up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
            <button
              onClick={clearError}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
            >
              <X size={14} className="text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DropZone