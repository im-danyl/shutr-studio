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
  // ADVANCED: Dual-image analysis for precise style transfer (like ChatGPT)
  analyzeDualImagesForStyleTransfer: async (styleSource, productImage) => {
    try {
      console.log('🔥 ADVANCED: Analyzing both images simultaneously for style transfer...')
      
      // Convert both images to proper format
      let styleImageUrl, productImageUrl;
      
      if (styleSource instanceof File) {
        styleImageUrl = await fileToBase64(styleSource)
      } else {
        styleImageUrl = styleSource
      }
      
      productImageUrl = await fileToBase64(productImage)
      
      const messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an expert in style transfer. I will show you two images:

IMAGE 1 (STYLE REFERENCE): The exact aesthetic, lighting, and composition I want to replicate
IMAGE 2 (PRODUCT): The product that needs to be styled

Your task: Analyze both images simultaneously and create the perfect prompt for generating a new image that applies the EXACT style from image 1 to the product from image 2.

Focus on transferring these elements precisely:
🎨 LIGHTING: Direction, intensity, softness, color temperature
🏠 BACKGROUND: Type, color, texture, depth, props
📐 COMPOSITION: Camera angle, framing, perspective  
🎭 MOOD: Atmosphere, aesthetic feeling
🎨 COLORS: Palette, saturation, tones
✨ MATERIALS: Surface textures, reflections, finishes

Return a detailed JSON response:
{
  "style_analysis": "Detailed description of the style reference",
  "product_analysis": "Key features of the product to preserve", 
  "transfer_strategy": "How to apply style to product specifically",
  "generation_prompt": "Perfect prompt for image generation",
  "key_elements": ["critical", "elements", "to", "preserve"]
}`
            },
            {
              type: 'image_url',
              image_url: { url: styleImageUrl }
            },
            {
              type: 'image_url',
              image_url: { url: productImageUrl }
            }
          ]
        }
      ]

      const response = await makeOpenAIRequest(messages, { max_tokens: 800 })
      let content = response.choices[0].message.content
      content = content.replace(/```json\n?/g, '').replace(/\n?```/g, '')
      const analysis = JSON.parse(content)
      
      console.log('✅ DUAL IMAGE ANALYSIS SUCCESSFUL!')
      console.log('Style Transfer Strategy:', analysis.transfer_strategy)
      
      return {
        success: true,
        analysis: analysis
      }
    } catch (error) {
      console.error('❌ Dual image analysis failed:', error)
      // Fallback to old method
      return openai.fallbackToSeparateAnalysis(styleSource, productImage)
    }
  },

  // Fallback: Original separate analysis method
  fallbackToSeparateAnalysis: async (styleSource, productImage) => {
    console.log('🔄 Falling back to separate analysis method...')
    
    const [styleResult, productResult] = await Promise.all([
      openai.analyzeStyleReference(styleSource),
      openai.analyzeProductImage(productImage)
    ])
    
    if (styleResult.success && productResult.success) {
      return {
        success: true,
        analysis: {
          style_analysis: styleResult.analysis,
          product_analysis: productResult.analysis,
          transfer_strategy: "Combine style and product analyses",
          generation_prompt: `Professional product photography combining ${JSON.stringify(styleResult.analysis)} with ${JSON.stringify(productResult.analysis)}`,
          key_elements: ['lighting', 'background', 'composition']
        }
      }
    }
    
    return { success: false, error: 'Both analysis methods failed' }
  },

  // Legacy: Analyze style reference - handles both URLs (library styles) and Files (custom uploads)  
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
        quality = 'high', // Use high quality with premium access
        styleDescription = '',
        productDescription = ''
      } = options

      console.log(`Starting OPTIMIZED STYLE TRANSFER generation: ${variantCount} variants`)
      console.log('Product file type:', productImageFile.type)
      console.log('Product file size:', productImageFile.size)
      console.log('Style reference:', styleReference)
      
      // 🔥 ADVANCED: Dual-image analysis for precise style transfer
      console.log('🚀 Using ADVANCED dual-image analysis (ChatGPT-style)...')
      const dualAnalysisResult = await openai.analyzeDualImagesForStyleTransfer(styleReference, productImageFile)
      
      if (!dualAnalysisResult.success) {
        throw new Error('Failed to analyze images for style transfer. Advanced analysis cannot proceed without understanding both images.')
      }

      // Step 3: Generate style transfer variations using ADVANCED analysis
      const images = []
      const analysis = dualAnalysisResult.analysis
      
      console.log('🎯 Style Transfer Strategy:', analysis.transfer_strategy)
      console.log('🎨 Generation Prompt:', analysis.generation_prompt)
      
      for (let i = 0; i < variantCount; i++) {
        console.log(`Generating style transfer variant ${i + 1}/${variantCount}`)
        
        // 🎯 Use ADVANCED prompt from dual-image analysis
        let styleTransferPrompt = analysis.generation_prompt
        
        // Add variation specifics if multiple variants
        if (i > 0) {
          styleTransferPrompt += ` Variation ${i + 1}: Show from a slightly different angle while maintaining the exact same style, lighting, and composition.`
        }
        
        // Ensure high quality output
        styleTransferPrompt += ` Professional commercial photography, sharp focus, high detail.`
        
        console.log(`🎨 Variant ${i + 1} ADVANCED prompt:`, styleTransferPrompt)
        
        // Generate with PREMIUM settings
        const imageSize = '1024x1024' // High quality size
        const gptImageResult = await openai.generateImageWithGPTImage1(styleTransferPrompt, imageSize, quality)
        
        if (gptImageResult.success) {
          images.push({
            url: gptImageResult.imageUrl,
            revised_prompt: gptImageResult.revisedPrompt,
            variant: i + 1,
            dualAnalysis: analysis,
            transfer_strategy: analysis.transfer_strategy
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
        styleAnalysis: analysis.style_analysis,
        productAnalysis: analysis.product_analysis
      }
    } catch (error) {
      console.error('Error in style transfer generation:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Generate image with GPT Image 1 model (primary)
  generateImageWithGPTImage1: async (prompt, size = '1024x1024', quality = 'low') => {
    try {
      console.log('Trying GPT Image 1 generation...')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout
      
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-image-1',  // Using GPT Image 1
          prompt,
          n: 1,
          size,
          quality: quality === 'low' ? 'medium' : 'high'  // GPT Image 1 uses different quality params
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('GPT Image 1 failed')
      }

      const result = await response.json()
      
      // GPT Image 1 returns b64_json instead of URL
      if (result.data?.[0]?.b64_json) {
        const imageUrl = `data:image/png;base64,${result.data[0].b64_json}`
        console.log('✅ GPT Image 1 generation successful!')
        return {
          success: true,
          imageUrl: imageUrl,
          revisedPrompt: result.data[0].revised_prompt || prompt
        }
      } else {
        throw new Error('Invalid GPT Image 1 response format')
      }
    } catch (error) {
      console.log('❌ GPT Image 1 failed, falling back to DALL-E 3:', error.message)
      // Fallback to DALL-E 3
      return openai.generateImageWithDALLE3(prompt, size, quality)
    }
  },

  // Generate DALL-E 3 image (fallback)  
  generateImageWithDALLE3: async (prompt, size = '1024x1024', quality = 'low') => {
    try {
      console.log('Using DALL-E 3 generation...')
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
      console.log('✅ DALL-E 3 generation successful!')
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

  // NEW: Product-in-Scene generation using GPT Image 1 with multiple image inputs
  generateProductInScene: async (productImageFile, sceneSource, options = {}) => {
    try {
      const {
        variantCount = 1,
        quality = 'high',
        maskImage = null
      } = options

      console.log(`Starting GPT Image 1 product-in-scene generation: ${variantCount} variants`)
      console.log('Product file:', productImageFile.name, productImageFile.type)
      
      // Handle scene source - can be File (upload) or URL (library)
      let sceneImageUrl;
      if (sceneSource instanceof File) {
        console.log('Scene file (upload):', sceneSource.name, sceneSource.type)
        // Validate file type
        if (!sceneSource.type.startsWith('image/')) {
          throw new Error('Scene file must be an image')
        }
        sceneImageUrl = await fileToBase64(sceneSource)
      } else if (typeof sceneSource === 'string') {
        console.log('Scene URL (library):', sceneSource)
        sceneImageUrl = sceneSource
      } else {
        throw new Error('Scene source must be a File object or URL string')
      }
      
      // Convert product image to base64 (always a File)
      // Validate product image file type
      if (!productImageFile.type.startsWith('image/')) {
        throw new Error('Product file must be an image')
      }
      const productBase64 = await fileToBase64(productImageFile)
      const maskBase64 = maskImage ? await fileToBase64(maskImage) : null

      const images = []
      
      for (let i = 0; i < variantCount; i++) {
        console.log(`Generating product-in-scene variant ${i + 1}/${variantCount}`)
        
        // Base prompt for product-in-scene composition
        // IMPORTANT: Image order matters - productBase64 first, sceneBase64 second to match prompt
        let prompt = "Place the product from the first image naturally into the scene from the second image. Make it appear realistic and consistent with the scene lighting, shadows, and materials."
        
        // Add variation specifics if multiple variants
        if (i > 0) {
          prompt += ` Variation ${i + 1}: Show from a slightly different perspective while maintaining realistic placement.`
        }
        
        prompt += " Professional commercial photography, photorealistic, high detail."
        
        console.log(`Product-in-scene prompt for variant ${i + 1}:`, prompt)
        
        // Call GPT Image 1 with multiple images - CORRECT ORDER: product first, scene second
        const result = await openai.generateWithMultipleImages(prompt, [productBase64, sceneImageUrl], maskBase64, quality)
        
        if (result.success) {
          images.push({
            url: result.imageUrl,
            revised_prompt: result.revisedPrompt,
            variant: i + 1,
            type: 'product_in_scene'
          })
          console.log(`Successfully generated product-in-scene variant ${i + 1}`)
        } else {
          console.error(`Failed to generate variant ${i + 1}:`, result.error)
          throw new Error(`Failed to generate variant ${i + 1}: ${result.error}`)
        }
      }

      console.log(`Product-in-scene generation complete: ${images.length} images generated`)
      
      return {
        success: true,
        images,
        totalGenerated: images.length,
        type: 'product_in_scene'
      }
    } catch (error) {
      console.error('Error in product-in-scene generation:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // GPT Image 1 with multiple images support (for product-in-scene)
  generateWithMultipleImages: async (prompt, imageBase64Array, maskBase64 = null, quality = 'high') => {
    try {
      console.log('Calling GPT Image 1 with multiple images...')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)
      
      const requestBody = {
        model: 'gpt-image-1',
        prompt,
        images: imageBase64Array,
        size: '1024x1024',
        quality: quality === 'low' ? 'medium' : 'high',
        response_format: 'b64_json',
        output_format: 'png'
      }
      
      // Add mask if provided
      if (maskBase64) {
        requestBody.mask = maskBase64
      }
      
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`GPT Image 1 multi-image API Error: ${error.error?.message || 'Unknown error'}`)
      }

      const result = await response.json()
      
      if (result.data?.[0]?.b64_json) {
        const imageUrl = `data:image/png;base64,${result.data[0].b64_json}`
        console.log('✅ GPT Image 1 multi-image generation successful!')
        return {
          success: true,
          imageUrl: imageUrl,
          revisedPrompt: result.data[0].revised_prompt || prompt
        }
      } else {
        throw new Error('Invalid GPT Image 1 multi-image response format')
      }
    } catch (error) {
      console.log('❌ GPT Image 1 multi-image failed, falling back to single image generation:', error.message)
      // Fallback to regular single image generation with combined prompt
      const fallbackPrompt = `${prompt} Create a professional product photography composition.`
      return openai.generateImageWithGPTImage1(fallbackPrompt, '1024x1024', quality)
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