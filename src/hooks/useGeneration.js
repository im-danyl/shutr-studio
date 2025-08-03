import { useState, useCallback } from 'react'
import { openai } from '../lib/openai'
import useAuthStore from '../store/authStore'
import useCreditStore from '../store/creditStore'

const useGeneration = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [generationId, setGenerationId] = useState(null)

  const { user } = useAuthStore()
  const { consumeCredits, refundCredits, checkCreditsAvailable } = useCreditStore()

  // Generate styled product images
  const generateImages = useCallback(async (options = {}) => {
    const {
      productImage,
      styleReference,
      variantCount = 1,
      aspectRatio = '1:1', // Always square for lowest cost
      quality = 'standard', // Always standard for lowest cost (~$0.02 vs HD ~$0.07)
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

    const newGenerationId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    setLoading(true)
    setProgress(0)
    setError(null)
    setResults([])
    setGenerationId(newGenerationId)
    setCurrentStep('Preparing generation...')

    try {
      // Step 1: Consume credits
      setCurrentStep('Consuming credits...')
      setProgress(10)
      
      await consumeCredits(user.id, variantCount, newGenerationId)
      
      // Step 2: Prepare images and prompts
      setCurrentStep('Analyzing images...')
      setProgress(20)
      
      // Simulate analysis time
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Step 3: Generate images
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
      
      setProgress(80)
      setCurrentStep('Processing results...')
      
      if (!generationResult.success) {
        throw new Error(generationResult.error || 'Generation failed')
      }
      
      // Step 4: Process and store results
      setProgress(90)
      
      const processedResults = generationResult.images.map((image, index) => ({
        id: `${newGenerationId}_${index}`,
        url: image.url,
        revisedPrompt: image.revised_prompt,
        index,
        generationId: newGenerationId,
        createdAt: new Date().toISOString()
      }))
      
      setResults(processedResults)
      setProgress(100)
      setCurrentStep('Complete!')
      
      // Simulate final processing
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        success: true,
        results: processedResults,
        generationId: newGenerationId,
        totalGenerated: processedResults.length,
        creditsUsed: variantCount
      }
      
    } catch (error) {
      console.error('Generation failed:', error)
      setError(error.message || 'Generation failed')
      
      // Attempt to refund credits on failure
      try {
        if (user && newGenerationId) {
          await refundCredits(user.id, variantCount, newGenerationId)
        }
      } catch (refundError) {
        console.error('Failed to refund credits:', refundError)
      }
      
      throw error
      
    } finally {
      setLoading(false)
      setCurrentStep('')
    }
  }, [user, consumeCredits, refundCredits, checkCreditsAvailable])

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
    
    // Actions
    generateImages,
    regenerate,
    cancelGeneration,
    clearResults,
    downloadResult,
    downloadAll,
    
    // Computed
    hasResults: results.length > 0,
    hasError: !!error,
    canCancel: loading && !!generationId,
    resultCount: results.length
  }
}

export default useGeneration