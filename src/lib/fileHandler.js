// File validation and handling utilities

// Supported file types
export const SUPPORTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp']
}

// File size limits
export const FILE_SIZE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  RECOMMENDED_SIZE: 5 * 1024 * 1024 // 5MB
}

// Image dimension limits
export const IMAGE_DIMENSION_LIMITS = {
  MIN_WIDTH: 256,
  MIN_HEIGHT: 256,
  MAX_WIDTH: 4096,
  MAX_HEIGHT: 4096,
  RECOMMENDED_WIDTH: 1024,
  RECOMMENDED_HEIGHT: 1024
}

/**
 * Validates if a file is a supported image type
 */
export const validateFileType = (file) => {
  const supportedTypes = Object.keys(SUPPORTED_IMAGE_TYPES)
  return supportedTypes.includes(file.type)
}

/**
 * Validates file size
 */
export const validateFileSize = (file, maxSize = FILE_SIZE_LIMITS.MAX_SIZE) => {
  return file.size <= maxSize
}

/**
 * Validates image dimensions
 */
export const validateImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      
      const { width, height } = img
      const isValidSize = 
        width >= IMAGE_DIMENSION_LIMITS.MIN_WIDTH &&
        height >= IMAGE_DIMENSION_LIMITS.MIN_HEIGHT &&
        width <= IMAGE_DIMENSION_LIMITS.MAX_WIDTH &&
        height <= IMAGE_DIMENSION_LIMITS.MAX_HEIGHT
      
      resolve({
        valid: isValidSize,
        dimensions: { width, height },
        aspectRatio: width / height
      })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}

/**
 * Comprehensive file validation
 */
export const validateFile = async (file) => {
  const errors = []
  const warnings = []
  
  // Check file type
  if (!validateFileType(file)) {
    errors.push('Unsupported file type. Please use JPG, PNG, or WebP.')
  }
  
  // Check file size
  if (!validateFileSize(file)) {
    errors.push(`File too large. Maximum size is ${formatFileSize(FILE_SIZE_LIMITS.MAX_SIZE)}.`)
  } else if (file.size > FILE_SIZE_LIMITS.RECOMMENDED_SIZE) {
    warnings.push(`Large file size (${formatFileSize(file.size)}). Consider optimizing for faster processing.`)
  }
  
  // Check image dimensions (only if other validations pass)
  if (errors.length === 0) {
    try {
      const dimensionResult = await validateImageDimensions(file)
      
      if (!dimensionResult.valid) {
        errors.push(`Invalid image dimensions (${dimensionResult.dimensions.width}x${dimensionResult.dimensions.height}). Must be between ${IMAGE_DIMENSION_LIMITS.MIN_WIDTH}x${IMAGE_DIMENSION_LIMITS.MIN_HEIGHT} and ${IMAGE_DIMENSION_LIMITS.MAX_WIDTH}x${IMAGE_DIMENSION_LIMITS.MAX_HEIGHT}.`)
      }
      
      // Check aspect ratio warnings
      const { aspectRatio } = dimensionResult
      if (aspectRatio < 0.5 || aspectRatio > 2) {
        warnings.push('Extreme aspect ratio detected. Square or near-square images work best.')
      }
      
      return {
        valid: errors.length === 0,
        errors,
        warnings,
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type,
          dimensions: dimensionResult.dimensions,
          aspectRatio: dimensionResult.aspectRatio
        }
      }
    } catch (error) {
      errors.push('Failed to process image. Please try a different file.')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type
    }
  }
}

/**
 * Formats file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Resizes image to fit within specified dimensions while maintaining aspect ratio
 */
export const resizeImage = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.9) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      // Set canvas dimensions
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create new file with same name but potentially different size
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          } else {
            reject(new Error('Failed to resize image'))
          }
        },
        file.type,
        quality
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image for resizing'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Converts file to base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Creates a preview URL for a file
 */
export const createPreviewUrl = (file) => {
  return URL.createObjectURL(file)
}

/**
 * Revokes a preview URL to free memory
 */
export const revokePreviewUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Extracts dominant colors from an image
 */
export const extractImageColors = (file, sampleSize = 5) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Use small canvas for color extraction
      canvas.width = sampleSize
      canvas.height = sampleSize
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize)
      
      const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize)
      const data = imageData.data
      const colors = []
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]
        
        if (a > 128) { // Only non-transparent pixels
          colors.push(`rgb(${r}, ${g}, ${b})`)
        }
      }
      
      resolve(colors)
    }
    
    img.onerror = () => reject(new Error('Failed to extract colors'))
    img.src = URL.createObjectURL(file)
  })
}