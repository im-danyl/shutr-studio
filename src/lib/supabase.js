import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper functions for common operations
export const auth = {
  // Sign up with email and password
  signUp: async (email, password, options = {}) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: options.metadata || {}
      }
    })
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/generate`
      }
    })
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut()
  },

  // Get current session
  getSession: async () => {
    return await supabase.auth.getSession()
  },

  // Get current user
  getUser: async () => {
    return await supabase.auth.getUser()
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions
export const db = {
  // Get user profile
  getUserProfile: async (userId) => {
    return await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    return await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
  },

  // Get user's credit balance
  getUserCredits: async (userId) => {
    return await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', userId)
      .single()
  },

  // Get credit transactions
  getCreditTransactions: async (userId, limit = 10) => {
    return await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
  },

  // Consume credits (using RPC function)
  consumeCredits: async (userId, variantCount, generationId) => {
    return await supabase.rpc('consume_credits', {
      p_user_id: userId,
      p_variant_count: variantCount,
      p_generation_id: generationId
    })
  },

  // Get style references with filtering
  getStyleReferences: async (filters = {}, limit = 50, offset = 0) => {
    return await supabase.rpc('get_filtered_styles', {
      p_category: filters.category || null,
      p_container: filters.container || null,
      p_background: filters.background || null,
      p_mood: filters.mood || null,
      p_limit: limit,
      p_offset: offset
    })
  },

  // Get single style reference
  getStyleReference: async (styleId) => {
    return await supabase
      .from('style_references')
      .select('*')
      .eq('id', styleId)
      .single()
  },

  // Create generation
  createGeneration: async (userId, productImageUrl, styleReferenceId, styleReferenceUrl, variantCount) => {
    return await supabase.rpc('create_generation', {
      p_user_id: userId,
      p_product_image_url: productImageUrl,
      p_style_reference_id: styleReferenceId,
      p_style_reference_url: styleReferenceUrl,
      p_variant_count: variantCount
    })
  },

  // Get user's generations
  getUserGenerations: async (userId, limit = 10) => {
    return await supabase
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
  },

  // Get single generation
  getGeneration: async (generationId) => {
    return await supabase
      .from('generations')
      .select('*')
      .eq('id', generationId)
      .single()
  },

  // Complete generation
  completeGeneration: async (generationId, generatedImages) => {
    return await supabase.rpc('complete_generation', {
      p_generation_id: generationId,
      p_generated_images: generatedImages
    })
  },

  // Fail generation
  failGeneration: async (generationId, errorMessage) => {
    return await supabase.rpc('fail_generation', {
      p_generation_id: generationId,
      p_error_message: errorMessage
    })
  }
}

// Storage helper functions
export const storage = {
  // Upload file to storage
  uploadFile: async (bucket, path, file, options = {}) => {
    return await supabase.storage
      .from(bucket)
      .upload(path, file, options)
  },

  // Get public URL for file
  getPublicUrl: (bucket, path) => {
    return supabase.storage
      .from(bucket)
      .getPublicUrl(path)
  },

  // Download file
  downloadFile: async (bucket, path) => {
    return await supabase.storage
      .from(bucket)
      .download(path)
  },

  // Delete file
  deleteFile: async (bucket, path) => {
    return await supabase.storage
      .from(bucket)
      .remove([path])
  },

  // Upload product image for user
  uploadProductImage: async (userId, file, originalName) => {
    // Generate unique filename using database function
    const { data: uniqueName } = await supabase.rpc('generate_unique_filename', {
      p_user_id: userId,
      p_original_name: originalName,
      p_prefix: 'product_'
    })

    if (!uniqueName) {
      throw new Error('Failed to generate unique filename')
    }

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(uniqueName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(uniqueName)

    return { path: uniqueName, url: publicUrl }
  },

  // Upload generated images (service role only)
  uploadGeneratedImage: async (userId, imageBlob, generationId, index) => {
    const filename = `${userId}/generation_${generationId}_${index}.png`
    
    const { data, error } = await supabase.storage
      .from('generated-images')
      .upload(filename, imageBlob, {
        cacheControl: '86400',
        upsert: true
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(filename)

    return { path: filename, url: publicUrl }
  },

  // Upload style reference (admin only)
  uploadStyleReference: async (file, styleName) => {
    const fileExt = file.name.split('.').pop()
    const filename = `${styleName.toLowerCase().replace(/\s+/g, '_')}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('style-references')
      .upload(filename, file, {
        cacheControl: '31536000', // 1 year
        upsert: true
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('style-references')
      .getPublicUrl(filename)

    return { path: filename, url: publicUrl }
  },

  // Delete user's product image
  deleteProductImage: async (userId, filename) => {
    return await supabase.storage
      .from('product-images')
      .remove([`${userId}/${filename}`])
  },

  // Get user's uploaded images
  getUserImages: async (userId, limit = 10) => {
    return await supabase.storage
      .from('product-images')
      .list(userId, {
        limit,
        sortBy: { column: 'created_at', order: 'desc' }
      })
  }
}