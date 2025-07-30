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

  // Generate styled product images based on reference style
  generateStyledProduct: async (productImageFile, styleReferenceUrl, variantCount = 1, productAnalysis = null) => {
    try {
      const productImageDataUrl = await fileToBase64(productImageFile)
      
      // Create variations by modifying the prompt slightly for each variant
      const variants = []
      
      for (let i = 0; i < variantCount; i++) {
        const variantPrompt = `You are an expert product photographer and AI image generator. 

Generate a professionally styled product photograph that:

1. PRESERVES the exact product from the uploaded image - same shape, features, and proportions
2. APPLIES the aesthetic style, mood, and composition from the reference style image
3. Maintains product clarity and commercial photography quality
4. Uses appropriate lighting, shadows, and depth of field
5. ${i > 0 ? `Creates variation ${i + 1} with slight compositional differences (different angle, lighting, or arrangement)` : 'Uses the primary composition style'}

${productAnalysis ? `Product context: ${JSON.stringify(productAnalysis)}` : ''}

Important: The product itself must remain unchanged - only change the styling, background, lighting, and composition to match the reference aesthetic.

Generate a high-quality product photograph that would be suitable for e-commerce or marketing use.`

        const messages = [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: variantPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: productImageDataUrl,
                  detail: 'high'
                }
              },
              {
                type: 'image_url',
                image_url: {
                  url: styleReferenceUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ]

        // Note: GPT-4 Vision can analyze and describe images but cannot generate new images
        // For actual image generation, we would need to use DALL-E 3 API
        // This is a placeholder for the generation logic
        const response = await makeOpenAIRequest(messages, { maxTokens: 1000 })
        
        // For now, we'll simulate image generation
        // In production, this would call DALL-E 3 API with the generated prompt
        variants.push({
          variant: i + 1,
          prompt: response.choices[0].message.content,
          imageUrl: null // Would contain the generated image URL from DALL-E 3
        })
      }

      return {
        success: true,
        variants,
        totalGenerated: variantCount
      }
    } catch (error) {
      console.error('Error generating styled product:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Generate DALL-E 3 image (separate API call)
  generateImageWithDallE: async (prompt, size = '1024x1024', quality = 'standard') => {
    try {
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
          quality
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`DALL-E API Error: ${error.error?.message || 'Unknown error'}`)
      }

      const result = await response.json()
      return {
        success: true,
        imageUrl: result.data[0].url,
        revisedPrompt: result.data[0].revised_prompt
      }
    } catch (error) {
      console.error('Error generating image with DALL-E:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Combined workflow: analyze product, generate prompt, create image with DALL-E
  generateProductVariations: async (productImageFile, styleReferenceUrl, variantCount = 1) => {
    try {
      // Step 1: Analyze the product image
      const analysisResult = await openai.analyzeProductImage(productImageFile)
      if (!analysisResult.success) {
        throw new Error('Failed to analyze product image')
      }

      // Step 2: Generate variations using DALL-E 3
      const variations = []
      
      for (let i = 0; i < variantCount; i++) {
        const basePrompt = `Professional product photography of a ${analysisResult.analysis.product_type} with the following key features: ${analysisResult.analysis.key_features.join(', ')}. 

Style it to match the aesthetic of the reference image with ${analysisResult.analysis.current_background} background transformed to match the reference style. 

Maintain the exact product shape and features while applying the reference's lighting, composition, and mood. 

${i > 0 ? `Variation ${i + 1}: Show from a slightly different angle or with adjusted lighting.` : ''}

High-quality, commercial photography, professional lighting, sharp focus on product.`

        const dalleResult = await openai.generateImageWithDallE(basePrompt)
        
        if (dalleResult.success) {
          variations.push({
            variant: i + 1,
            imageUrl: dalleResult.imageUrl,
            prompt: dalleResult.revisedPrompt
          })
        } else {
          console.error(`Failed to generate variation ${i + 1}:`, dalleResult.error)
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