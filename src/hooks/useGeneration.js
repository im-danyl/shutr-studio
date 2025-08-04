import { useState, useCallback, useEffect } from 'react'
import { openai } from '../lib/openai'
import useAuthStore from '../store/authStore'
import useCreditStore from '../store/creditStore'
import generationsService from '../lib/generations'

const useGeneration = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [generationId, setGenerationId] = useState(null)
  const [isRecovering, setIsRecovering] = useState(false)

  const { user } = useAuthStore()
  const { fetchCredits, checkCreditsAvailable } = useCreditStore()

  // Check for active generation on mount (recovery)
  useEffect(() => {
    if (user && !loading && !generationId) {
      checkForActiveGeneration()
    }
  }, [user])

  const checkForActiveGeneration = async () => {
    try {
      setIsRecovering(true)
      const result = await generationsService.getActiveGeneration(user.id)
      
      if (result.success && result.generation) {
        const gen = result.generation
        console.log('Found active generation, recovering:', gen.id)
        
        setGenerationId(gen.id)
        setProgress(50) // Estimate 50% progress for processing generations
        setCurrentStep('Resuming generation...')
        
        if (gen.status === 'processing') {
          setLoading(true)
          // Continue monitoring this generation
          monitorGeneration(gen.id)
        } else if (gen.status === 'completed' && gen.generated_images) {
          // Show completed results
          const processedResults = gen.generated_images.map((imageUrl, index) => ({
            id: `${gen.id}_${index}`,
            url: imageUrl,
            index,
            generationId: gen.id,
            createdAt: gen.created_at
          }))
          setResults(processedResults)
          setProgress(100)
          setCurrentStep('Completed')
        }
      }
    } catch (error) {
      console.error('Error checking for active generation:', error)
    } finally {
      setIsRecovering(false)
    }
  }

  const monitorGeneration = async (genId) => {
    // Poll generation status
    const pollInterval = setInterval(async () => {
      try {
        const result = await generationsService.getGeneration(genId)
        if (result.success && result.generation) {
          const gen = result.generation
          
          // Since we don't have progress columns, estimate progress
          setProgress(75)
          setCurrentStep('Checking generation status...')
          
          if (gen.status === 'completed') {
            clearInterval(pollInterval)
            if (gen.generated_images) {
              const processedResults = gen.generated_images.map((imageUrl, index) => ({
                id: `${gen.id}_${index}`,
                url: imageUrl,
                index,
                generationId: gen.id,
                createdAt: gen.created_at
              }))
              setResults(processedResults)
            }
            setProgress(100)
            setCurrentStep('Completed')
            setLoading(false)
          } else if (gen.status === 'failed') {
            clearInterval(pollInterval)
            setError(gen.error_message || 'Generation failed')
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('Error monitoring generation:', error)
      }
    }, 3000) // Poll every 3 seconds

    // Clear interval after 10 minutes
    setTimeout(() => clearInterval(pollInterval), 600000)
  }

  // Generate styled product images with persistence
  const generateImages = useCallback(async (options = {}) => {
    const {
      productImage,
      styleReference,
      variantCount = 1,
      aspectRatio = '1:1',
      quality = 'low',
      styleDescription = '',
      productDescription = ''
    } = options

    if (!user) {
      throw new Error('User must be authenticated')
    }

    if (!productImage) {
      throw new Error('Product image is required')
    }

    // Check credits
    if (!checkCreditsAvailable(variantCount)) {
      throw new Error('Insufficient credits')
    }

    setLoading(true)
    setProgress(0)
    setError(null)
    setResults([])
    setCurrentStep('Creating persistent generation...')

    let persistentGenerationId = null

    try {
      // Step 1: Create persistent generation in database
      setProgress(5)
      const createResult = await generationsService.createGeneration(
        user.id,
        URL.createObjectURL(productImage), // Convert File to URL for upload
        styleReference,
        variantCount,
        { aspectRatio, quality, styleDescription, productDescription }
      )

      if (!createResult.success) {
        throw new Error(createResult.error || 'Failed to create generation')
      }

      persistentGenerationId = createResult.generationId
      setGenerationId(persistentGenerationId)
      
      // Update progress in database
      await generationsService.updateProgress(persistentGenerationId, 10, 'Analyzing images...')
      setCurrentStep('Analyzing style and product images...')
      setProgress(10)
      
      // Step 2: Generate images
      await generationsService.updateProgress(persistentGenerationId, 30, `Generating ${variantCount} variants...`)
      setCurrentStep(`Generating ${variantCount} variant${variantCount !== 1 ? 's' : ''}...`)
      setProgress(30)
      
      const generationResult = await openai.generateStyledProduct(
        productImage,
        styleReference,
        {
          variantCount,
          aspectRatio,
          quality,
          styleDescription,
          productDescription
        }
      )
      
      if (!generationResult.success) {
        throw new Error(generationResult.error || 'Generation failed')
      }
      
      // Step 3: Complete generation in database
      await generationsService.updateProgress(persistentGenerationId, 90, 'Saving results...')
      setCurrentStep('Saving results...')
      setProgress(90)
      
      const imageUrls = generationResult.images.map(img => img.url)
      
      const completeResult = await generationsService.completeGeneration(
        persistentGenerationId,
        imageUrls,
        generationResult.styleAnalysis,
        generationResult.productAnalysis
      )
      
      if (!completeResult.success) {
        console.error('Failed to complete generation in database:', completeResult.error)
      }
      
      // Step 4: Process results for UI
      const processedResults = generationResult.images.map((image, index) => ({
        id: `${persistentGenerationId}_${index}`,
        url: image.url,
        revisedPrompt: image.revised_prompt,
        index,
        generationId: persistentGenerationId,
        createdAt: new Date().toISOString()
      }))
      
      setResults(processedResults)
      setProgress(100)
      setCurrentStep('Complete!')
      
      // Update final status
      await generationsService.updateProgress(persistentGenerationId, 100, 'Complete!')
      
      // Refresh credits to show updated balance
      await fetchCredits(user.id)
      
      return {
        success: true,
        results: processedResults,
        generationId: persistentGenerationId,
        totalGenerated: processedResults.length,
        creditsUsed: variantCount
      }
      
    } catch (error) {
      console.error('Generation failed:', error)
      setError(error.message || 'Generation failed')
      
      // Fail generation in database and refund credits
      if (persistentGenerationId) {
        try {
          await generationsService.failGeneration(persistentGenerationId, error.message)
          await fetchCredits(user.id) // Refresh credits after refund
        } catch (failError) {
          console.error('Failed to fail generation in database:', failError)
        }
      }
      
      throw error
      
    } finally {
      setLoading(false)
    }
  }, [user, checkCreditsAvailable, fetchCredits])

  // Regenerate with same parameters
  const regenerate = useCallback(async (previousOptions) => {
    return generateImages(previousOptions)
  }, [generateImages])

  // Cancel generation (if possible)
  const cancelGeneration = useCallback(() => {
    if (loading && generationId && user) {
      // In a real implementation, you'd cancel the API request
      // and refund credits
      setLoading(false)
      setProgress(0)
      setCurrentStep('')
      setError('Generation cancelled')
    }
  }, [loading, generationId, user])

  // Clear results
  const clearResults = useCallback(() => {
    setResults([])
    setError(null)
    setProgress(0)
    setCurrentStep('')
    setGenerationId(null)
  }, [])

  // Download result
  const downloadResult = useCallback(async (result, filename) => {
    try {
      const response = await fetch(result.url)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `generated-${result.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      console.error('Download failed:', error)
      return { success: false, error: error.message }
    }
  }, [])

  // Download all results as zip (mock implementation)
  const downloadAll = useCallback(async (filename = 'generated-images.zip') => {
    // In a real implementation, you'd create a zip file
    // For now, download each image individually
    const downloadPromises = results.map((result, index) => 
      downloadResult(result, `generated-${index + 1}.png`)
    )
    
    try {
      await Promise.all(downloadPromises)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [results, downloadResult])

  return {
    // State
    loading,
    progress,
    currentStep,
    results,
    error,
    generationId,
    isRecovering,
    
    // Actions
    generateImages,
    regenerate,
    cancelGeneration,
    clearResults,
    downloadResult,
    downloadAll,
    checkForActiveGeneration,
    
    // Computed
    hasResults: results.length > 0,
    hasError: !!error,
    canCancel: loading && !!generationId,
    resultCount: results.length
  }
}

export default useGeneration