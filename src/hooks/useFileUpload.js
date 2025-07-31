import { useState, useCallback } from 'react'
import { validateFile, createPreviewUrl, revokePreviewUrl } from '../lib/fileHandler'

const useFileUpload = (options = {}) => {
  const {
    onFileAccepted,
    onFileRejected,
    autoValidate = true,
    maxFiles = 1
  } = options

  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [warnings, setWarnings] = useState([])

  // Handle file selection
  const handleFileSelect = useCallback(async (selectedFiles) => {
    const fileArray = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles]
    
    if (files.length + fileArray.length > maxFiles) {
      setErrors([`Maximum ${maxFiles} file${maxFiles !== 1 ? 's' : ''} allowed`])
      return
    }

    setLoading(true)
    setErrors([])
    setWarnings([])

    try {
      const processedFiles = []
      const newPreviews = []
      const allErrors = []
      const allWarnings = []

      for (const file of fileArray) {
        if (autoValidate) {
          const validation = await validateFile(file)
          
          if (!validation.valid) {
            allErrors.push(...validation.errors)
            onFileRejected?.(file, validation.errors)
            continue
          }
          
          if (validation.warnings.length > 0) {
            allWarnings.push(...validation.warnings)
          }
        }

        const previewUrl = createPreviewUrl(file)
        processedFiles.push(file)
        newPreviews.push({
          file,
          url: previewUrl,
          id: `${file.name}-${Date.now()}-${Math.random()}`
        })

        onFileAccepted?.(file)
      }

      if (allErrors.length > 0) {
        setErrors(allErrors)
      } else {
        setFiles(prev => [...prev, ...processedFiles])
        setPreviews(prev => [...prev, ...newPreviews])
      }

      if (allWarnings.length > 0) {
        setWarnings(allWarnings)
      }

    } catch (error) {
      setErrors(['Failed to process files. Please try again.'])
    } finally {
      setLoading(false)
    }
  }, [files.length, maxFiles, autoValidate, onFileAccepted, onFileRejected])

  // Remove file
  const removeFile = useCallback((fileIndex) => {
    const preview = previews[fileIndex]
    if (preview) {
      revokePreviewUrl(preview.url)
    }

    setFiles(prev => prev.filter((_, index) => index !== fileIndex))
    setPreviews(prev => prev.filter((_, index) => index !== fileIndex))
    setErrors([])
    setWarnings([])
  }, [previews])

  // Clear all files
  const clearFiles = useCallback(() => {
    previews.forEach(preview => revokePreviewUrl(preview.url))
    setFiles([])
    setPreviews([])
    setErrors([])
    setWarnings([])
  }, [previews])

  // Replace file
  const replaceFile = useCallback(async (fileIndex, newFile) => {
    const oldPreview = previews[fileIndex]
    if (oldPreview) {
      revokePreviewUrl(oldPreview.url)
    }

    setLoading(true)
    setErrors([])
    setWarnings([])

    try {
      if (autoValidate) {
        const validation = await validateFile(newFile)
        
        if (!validation.valid) {
          setErrors(validation.errors)
          onFileRejected?.(newFile, validation.errors)
          setLoading(false)
          return
        }
        
        if (validation.warnings.length > 0) {
          setWarnings(validation.warnings)
        }
      }

      const previewUrl = createPreviewUrl(newFile)
      
      setFiles(prev => {
        const newFiles = [...prev]
        newFiles[fileIndex] = newFile
        return newFiles
      })
      
      setPreviews(prev => {
        const newPreviews = [...prev]
        newPreviews[fileIndex] = {
          file: newFile,
          url: previewUrl,
          id: `${newFile.name}-${Date.now()}-${Math.random()}`
        }
        return newPreviews
      })

      onFileAccepted?.(newFile)

    } catch (error) {
      setErrors(['Failed to process replacement file. Please try again.'])
    } finally {
      setLoading(false)
    }
  }, [previews, autoValidate, onFileAccepted, onFileRejected])

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  // Clear warnings
  const clearWarnings = useCallback(() => {
    setWarnings([])
  }, [])

  // Get file at index
  const getFile = useCallback((index) => {
    return files[index] || null
  }, [files])

  // Get preview at index
  const getPreview = useCallback((index) => {
    return previews[index] || null
  }, [previews])

  // Cleanup function for component unmount
  const cleanup = useCallback(() => {
    previews.forEach(preview => revokePreviewUrl(preview.url))
  }, [previews])

  return {
    // State
    files,
    previews,
    loading,
    errors,
    warnings,
    
    // Actions
    handleFileSelect,
    removeFile,
    clearFiles,
    replaceFile,
    clearErrors,
    clearWarnings,
    cleanup,
    
    // Getters
    getFile,
    getPreview,
    
    // Computed
    hasFiles: files.length > 0,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
    canAddMore: files.length < maxFiles,
    fileCount: files.length
  }
}

export default useFileUpload