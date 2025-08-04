// OpenAI GPT Image 1 Integration for Shutr Studio

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key')
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

// Helper function to make OpenAI API calls with timeout
const makeOpenAIRequest = async (messages, options = {}) => {
  const timeout = options.timeout || 30000 // 30 second timeout
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // GPT Image 1 model name
        messages,
        max_tokens: options.max_tokens || 500, // Reduced for faster responses
        temperature: options.temperature || 0.3, // Lower temperature for more consistent results
        ...options
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`)
    }

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timed out - please try again')
    }
    throw error
  }
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
  // Analyze style reference - handles both URLs (library styles) and Files (custom uploads)
  analyzeStyleReference: async (styleSource) => {
    try {
      let imageUrl;
      
      // Handle both File objects (custom uploads) and URLs (library styles)
      if (styleSource instanceof File) {
        console.log('Converting custom uploaded style to base64...')
        imageUrl = await fileToBase64(styleSource)
      } else {
        console.log('Using library style URL:', styleSource)
        imageUrl = styleSource
      }
      
      const messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this style reference and return JSON with these elements:
              {
                "lighting_style": "lighting type",
                "background_type": "background description", 
                "color_palette": ["main", "colors"],
                "composition_style": "composition style",
                "mood_aesthetic": "overall mood",
                "props_elements": ["visible", "props"],
                "key_visual_elements": "key characteristics"
              }
              Return only valid JSON.`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ]

      const response = await makeOpenAIRequest(messages, { max_tokens: 600 })
      let content = response.choices[0].message.content
      content = content.replace(/```json\n?/g, '').replace(/\n?```/g, '')
      const styleAnalysis = JSON.parse(content)
      
      console.log('Style analysis result:', styleAnalysis)
      
      return {
        success: true,
        analysis: styleAnalysis
      }
    } catch (error) {
      console.error('Error analyzing style reference:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

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
              text: `Analyze this product and return JSON:
              {
                "product_type": "product category",
                "key_features": ["main", "features", "to", "preserve"],
                "dominant_colors": ["colors"],
                "current_background": "background type"
              }
              Return only valid JSON.`
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

      const response = await makeOpenAIRequest(messages, { max_tokens: 500 })
      let content = response.choices[0].message.content
      content = content.replace(/```json\n?/g, '').replace(/\n?```/g, '')
      const analysis = JSON.parse(content)
      
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

  // Generate styled product images with proper style transfer
  generateStyledProduct: async (productImageFile, styleReference, options = {}) => {
    try {
      // Extract options with cost-optimized defaults
      const {
        variantCount = 1,
        aspectRatio = '1:1',
        quality = 'low', // Always use low quality to minimize costs
        styleDescription = '',
        productDescription = ''
      } = options

      console.log(`Starting OPTIMIZED STYLE TRANSFER generation: ${variantCount} variants`)
      console.log('Product file type:', productImageFile.type)
      console.log('Product file size:', productImageFile.size)
      console.log('Style reference:', styleReference)
      
      // OPTIMIZATION: Run both analyses in PARALLEL to save time
      console.log('Running style and product analysis in parallel...')
      const [styleAnalysisResult, productAnalysisResult] = await Promise.all([
        openai.analyzeStyleReference(styleReference),
        openai.analyzeProductImage(productImageFile)
      ])
      
      if (!styleAnalysisResult.success) {
        throw new Error('Failed to analyze style reference. Style transfer cannot proceed without understanding the target aesthetic.')
      }
      
      if (!productAnalysisResult.success) {
        console.warn('Product analysis failed, continuing with basic product description')
      }

      // Step 3: Generate style transfer variations
      const images = []
      const styleAnalysis = styleAnalysisResult.analysis
      const productAnalysis = productAnalysisResult.success ? productAnalysisResult.analysis : null
      
      console.log('Style Analysis:', styleAnalysis)
      console.log('Product Analysis:', productAnalysis)
      
      for (let i = 0; i < variantCount; i++) {
        console.log(`Generating style transfer variant ${i + 1}/${variantCount}`)
        
        // Create concise STYLE TRANSFER prompt
        const productDesc = productAnalysis ? 
          `${productAnalysis.product_type} with ${productAnalysis.key_features.join(', ')}` : 
          'the product'
        
        let styleTransferPrompt = `Professional product photography of ${productDesc}. `
        styleTransferPrompt += `Style: ${styleAnalysis.lighting_style} lighting, ${styleAnalysis.background_type} background, ${styleAnalysis.mood_aesthetic} mood. `
        
        if (styleAnalysis.color_palette?.length > 0) {
          styleTransferPrompt += `Colors: ${styleAnalysis.color_palette.join(', ')}. `
        }
        
        if (styleAnalysis.props_elements?.length > 0) {
          styleTransferPrompt += `Elements: ${styleAnalysis.props_elements.join(', ')}. `
        }
        
        styleTransferPrompt += `${styleAnalysis.key_visual_elements}. `
        
        if (i > 0) {
          styleTransferPrompt += `Variation ${i + 1}: different angle. `
        }
        
        styleTransferPrompt += `High-quality commercial photography, sharp focus.`
        
        console.log(`Variant ${i + 1} prompt:`, styleTransferPrompt)
        
        // Generate with optimized settings
        const imageSize = '1024x1024' // Cost-optimized
        const gptImageResult = await openai.generateImageWithGPTImage1(styleTransferPrompt, imageSize, quality)
        
        if (gptImageResult.success) {
          images.push({
            url: gptImageResult.imageUrl,
            revised_prompt: gptImageResult.revisedPrompt,
            variant: i + 1,
            styleAnalysis,
            productAnalysis
          })
          console.log(`Successfully generated style transfer variant ${i + 1}`)
        } else {
          console.error(`Failed to generate variant ${i + 1}:`, gptImageResult.error)
          throw new Error(`Failed to generate variant ${i + 1}: ${gptImageResult.error}`)
        }
      }

      console.log(`Style transfer complete: ${images.length} images generated`)
      
      return {
        success: true,
        images,
        totalGenerated: images.length,
        styleAnalysis: styleAnalysis,
        productAnalysis: productAnalysis
      }
    } catch (error) {
      console.error('Error in style transfer generation:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Generate DALL-E 3 image with timeout
  generateImageWithGPTImage1: async (prompt, size = '1024x1024', quality = 'low') => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout for image generation
      
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size,
          quality: quality === 'low' ? 'standard' : 'hd'
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`DALL-E 3 API Error: ${error.error?.message || 'Unknown error'}`)
      }

      const result = await response.json()
      return {
        success: true,
        imageUrl: result.data[0].url,
        revisedPrompt: result.data[0].revised_prompt || prompt
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('DALL-E 3 generation timed out')
        return {
          success: false,
          error: 'Image generation timed out - please try again'
        }
      }
      console.error('Error generating image with DALL-E 3:', error)
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