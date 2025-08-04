// Supabase service for persistent generations
import { supabase } from './supabase'

export const generationsService = {
  // Create a new generation in the database
  async createGeneration(userId, productImageUrl, styleReference, variantCount, settings) {
    try {
      console.log('Creating persistent generation in database...')
      
      // Determine style reference details
      let styleReferenceId = null
      let styleReferenceUrl = null
      let customStyleFileUrl = null
      
      if (typeof styleReference === 'string') {
        // Library style reference (URL)
        styleReferenceUrl = styleReference
      } else if (styleReference instanceof File) {
        // Custom uploaded style - use File directly (skip storage for now due to RLS policies)
        console.log('Using custom style file directly...')
        styleReferenceUrl = `custom_file:${styleReference.name}`
        // Note: File object will be passed directly to OpenAI generation
      }
      
      // Upload product image to storage for persistence
      console.log('Uploading product image...')
      const productFile = await fetch(productImageUrl).then(r => r.blob())
      const productFileName = `product_${Date.now()}.jpg`
      
      const { data: productUploadData, error: productUploadError } = await supabase.storage
        .from('product-images')
        .upload(`${userId}/${productFileName}`, productFile)
      
      if (productUploadError) {
        throw new Error(`Failed to upload product image: ${productUploadError.message}`)
      }
      
      const { data: productUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(productUploadData.path)
      
      const persistentProductUrl = productUrlData.publicUrl
      
      // Use existing database function that we know exists
      console.log('Creating generation with existing function...')
      const { data, error } = await supabase.rpc('create_generation', {
        p_user_id: userId,
        p_product_image_url: persistentProductUrl,
        p_style_reference_id: styleReferenceId,
        p_style_reference_url: styleReferenceUrl,
        p_variant_count: variantCount
      })
      
      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create generation')
      }
      
      console.log('Generation created successfully:', data.generation_id)
      
      return {
        success: true,
        generationId: data.generation_id,
        remainingCredits: data.remaining_credits
      }
    } catch (error) {
      console.error('Error creating persistent generation:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Update generation progress (simplified for existing DB structure)
  async updateProgress(generationId, progress, currentStep) {
    try {
      console.log(`Progress update: ${generationId} - ${progress}% - ${currentStep}`)
      // For now, just log progress since the columns don't exist in the DB
      // This prevents errors while maintaining the interface
      return { success: true }
    } catch (error) {
      console.error('Error updating progress:', error)
      return { success: false }
    }
  },

  // Complete a generation
  async completeGeneration(generationId, generatedImages, styleAnalysis = null, productAnalysis = null) {
    try {
      console.log('Completing generation:', generationId)
      
      // Update with analyses if available
      if (styleAnalysis || productAnalysis) {
        const { error: analysisError } = await supabase
          .from('generations')
          .update({
            style_analysis: styleAnalysis,
            product_analysis: productAnalysis
          })
          .eq('id', generationId)
        
        if (analysisError) {
          console.warn('Failed to save analyses:', analysisError)
        }
      }
      
      // Complete the generation
      const { data, error } = await supabase.rpc('complete_generation', {
        p_generation_id: generationId,
        p_generated_images: generatedImages
      })
      
      if (error) {
        throw new Error(`Failed to complete generation: ${error.message}`)
      }
      
      console.log('Generation completed successfully')
      return { success: true }
    } catch (error) {
      console.error('Error completing generation:', error)
      return { success: false, error: error.message }
    }
  },

  // Fail a generation and refund credits
  async failGeneration(generationId, errorMessage) {
    try {
      console.log('Failing generation:', generationId, errorMessage)
      
      const { data, error } = await supabase.rpc('fail_generation', {
        p_generation_id: generationId,
        p_error_message: errorMessage
      })
      
      if (error) {
        throw new Error(`Failed to fail generation: ${error.message}`)
      }
      
      console.log('Generation failed and credits refunded')
      return { success: true, refunded: data.refunded }
    } catch (error) {
      console.error('Error failing generation:', error)
      return { success: false, error: error.message }
    }
  },

  // Get user's generation history
  async getGenerationHistory(userId, limit = 20, offset = 0) {
    try {
      // Use direct query - skip functions since they don't exist
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1)
      
      if (error) {
        throw new Error(`Failed to get generation history: ${error.message}`)
      }
      
      return {
        success: true,
        generations: data || []
      }
    } catch (error) {
      console.error('Error getting generation history:', error)
      return {
        success: false,
        error: error.message,
        generations: []
      }
    }
  },

  // Get active generation (for recovery after refresh)
  async getActiveGeneration(userId) {
    try {
      console.log('Getting active generation for user:', userId)
      
      // Query for processing generations in last hour
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'processing')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
      
      if (error) {
        console.log('Error querying active generations:', error)
        return {
          success: true,
          generation: null
        }
      }
      
      const generation = data && data.length > 0 ? data[0] : null
      console.log('Found active generation:', generation?.id || 'none')
      
      return {
        success: true,
        generation: generation
      }
    } catch (error) {
      console.error('Error getting active generation:', error)
      return {
        success: true, // Don't fail the app if this doesn't work
        error: error.message,
        generation: null
      }
    }
  },

  // Get generation by ID
  async getGeneration(generationId) {
    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('id', generationId)
        .single()
      
      if (error) {
        throw new Error(`Failed to get generation: ${error.message}`)
      }
      
      return {
        success: true,
        generation: data
      }
    } catch (error) {
      console.error('Error getting generation:', error)
      return {
        success: false,
        error: error.message,
        generation: null
      }
    }
  }
}

export default generationsService