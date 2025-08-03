// OpenAI GPT Image 1 Integration for Shutr Studio

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key')
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

// Helper function to make OpenAI API calls
const makeOpenAIRequest = async (messages, options = {}) => {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o', // GPT Image 1 model name
      messages,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      ...options
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`)
  }

  return response.json()
}

// Convert image file to base64 data URL
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const openai = {
  // Analyze product image to understand what we're working with
  analyzeProductImage: async (imageFile) => {
    try {
      const imageDataUrl = await fileToBase64(imageFile)
      
      const messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this product image and return a JSON object with the following information:
              {
                "product_type": "category of the product (electronics, fashion, home_decor, beauty, food)",
                "key_features": ["list", "of", "important", "product", "features", "to", "preserve"],
                "dominant_colors": ["primary", "colors", "in", "image"],
                "current_background": "description of current background",
                "suggestions": "brief suggestions for styling this product"
              }
              
              Only return valid JSON, no other text.`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl
              }
            }
          ]
        }
      ]

      const response = await makeOpenAIRequest(messages, { maxTokens: 500 })
      const analysis = JSON.parse(response.choices[0].message.content)
      
      return {
        success: true,
        analysis
      }
    } catch (error) {
      console.error('Error analyzing product image:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Generate styled product images based on reference style (main function used by hooks)
  generateStyledProduct: async (productImageFile, styleReferenceUrl, options = {}) => {
    try {
      // Extract options with cost-optimized defaults
      const {
        variantCount = 1,
        aspectRatio = '1:1',
        quality = 'standard', // Always use standard quality to minimize costs (~$0.02 vs $0.07+ for HD)
        styleDescription = '',
        productDescription = ''
      } = options

      console.log(`Starting generation: ${variantCount} variants`)
      
      // Step 1: Analyze the product image to understand what we're working with
      const analysisResult = await openai.analyzeProductImage(productImageFile)
      if (!analysisResult.success) {
        console.warn('Product analysis failed, continuing without analysis')
      }

      // Step 2: Generate variations using DALL-E 3
      const images = []
      
      for (let i = 0; i < variantCount; i++) {
        console.log(`Generating variant ${i + 1}/${variantCount}`)
        
        // Create detailed prompt for DALL-E 3
        let basePrompt = `Professional product photography of a high-quality product. `
        
        // Add product context if available
        if (analysisResult.success) {
          const analysis = analysisResult.analysis
          basePrompt += `The product is a ${analysis.product_type} with key features: ${analysis.key_features.join(', ')}. `
        }
        
        // Add custom descriptions if provided
        if (productDescription) {
          basePrompt += `Product details: ${productDescription}. `
        }
        
        if (styleDescription) {
          basePrompt += `Style direction: ${styleDescription}. `
        }
        
        // Add variation-specific instructions
        if (i > 0) {
          basePrompt += `Variation ${i + 1}: Show from a slightly different angle or with adjusted lighting composition. `
        }
        
        // Add quality and technical requirements
        basePrompt += `High-quality commercial photography, professional lighting, sharp focus on product, clean composition, suitable for e-commerce use.`
        
        // Map aspect ratio to GPT Image 1 size (optimized for low cost)
        let imageSize = '1024x1024' // Default square - cheapest option (~$0.02)
        if (aspectRatio === '16:9' || aspectRatio === 'landscape') {
          imageSize = '1024x1024' // Force square to minimize cost instead of 1792x1024
        } else if (aspectRatio === '9:16' || aspectRatio === 'portrait') {
          imageSize = '1024x1024' // Force square to minimize cost instead of 1024x1792
        }
        
        // Note: Using 1024x1024 for all ratios to keep costs at ~$0.02 per image
        // Users can crop/adjust aspect ratio after download if needed
        
        // Generate image with GPT Image 1
        const gptImageResult = await openai.generateImageWithGPTImage1(basePrompt, imageSize, quality)
        
        if (gptImageResult.success) {
          images.push({
            url: gptImageResult.imageUrl,
            revised_prompt: gptImageResult.revisedPrompt,
            variant: i + 1
          })
          console.log(`Successfully generated variant ${i + 1}`)
        } else {
          console.error(`Failed to generate variant ${i + 1}:`, gptImageResult.error)
          throw new Error(`Failed to generate variant ${i + 1}: ${gptImageResult.error}`)
        }
      }

      console.log(`Generation complete: ${images.length} images generated`)
      
      return {
        success: true,
        images,
        totalGenerated: images.length,
        analysis: analysisResult.success ? analysisResult.analysis : null
      }
    } catch (error) {
      console.error('Error generating styled product:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Generate GPT Image 1 image (OpenAI's latest image generation model)
  // Default to smallest size and standard quality to minimize costs
  generateImageWithGPTImage1: async (prompt, size = '1024x1024', quality = 'standard') => {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt,
          n: 1,
          size,
          quality
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`GPT Image 1 API Error: ${error.error?.message || 'Unknown error'}`)
      }

      const result = await response.json()
      return {
        success: true,
        imageUrl: result.data[0].url,
        revisedPrompt: result.data[0].revised_prompt || result.data[0].prompt
      }
    } catch (error) {
      console.error('Error generating image with GPT Image 1:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Combined workflow: analyze product, generate prompt, create image with GPT Image 1
  generateProductVariations: async (productImageFile, styleReferenceUrl, variantCount = 1) => {
    try {
      // Step 1: Analyze the product image
      const analysisResult = await openai.analyzeProductImage(productImageFile)
      if (!analysisResult.success) {
        throw new Error('Failed to analyze product image')
      }

      // Step 2: Generate variations using GPT Image 1
      const variations = []
      
      for (let i = 0; i < variantCount; i++) {
        const basePrompt = `Professional product photography of a ${analysisResult.analysis.product_type} with the following key features: ${analysisResult.analysis.key_features.join(', ')}. 

Style it to match the aesthetic of the reference image with ${analysisResult.analysis.current_background} background transformed to match the reference style. 

Maintain the exact product shape and features while applying the reference's lighting, composition, and mood. 

${i > 0 ? `Variation ${i + 1}: Show from a slightly different angle or with adjusted lighting.` : ''}

High-quality, commercial photography, professional lighting, sharp focus on product.`

        const gptImageResult = await openai.generateImageWithGPTImage1(basePrompt)
        
        if (gptImageResult.success) {
          variations.push({
            variant: i + 1,
            imageUrl: gptImageResult.imageUrl,
            prompt: gptImageResult.revisedPrompt
          })
        } else {
          console.error(`Failed to generate variation ${i + 1}:`, gptImageResult.error)
        }
      }

      return {
        success: true,
        analysis: analysisResult.analysis,
        variations,
        totalGenerated: variations.length
      }
    } catch (error) {
      console.error('Error in complete generation workflow:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export default openai