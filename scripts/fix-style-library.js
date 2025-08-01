import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixStyleLibrary() {
  try {
    console.log('🔍 Checking current style references...')
    
    // Get all current style references
    const { data: styles, error } = await supabase
      .from('style_references')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('❌ Error fetching styles:', error)
      return
    }
    
    console.log(`📊 Found ${styles.length} style references`)
    
    // Remove all old entries with broken paths or test data
    const invalidStyles = styles.filter(style => 
      style.image_url.startsWith('/styles/') || // Old mock paths
      style.image_url.includes('Test_image_') || // Test images
      style.name.startsWith('Test ') ||
      style.name.includes('Mock')
    )
    
    console.log(`\n🧹 Found ${invalidStyles.length} invalid entries to remove:`)
    invalidStyles.forEach((style, index) => {
      console.log(`  ${index + 1}. ${style.name} - ${style.image_url}`)
    })
    
    // Delete all invalid entries
    let deletedCount = 0
    for (const style of invalidStyles) {
      const { error: deleteError } = await supabase
        .from('style_references')
        .delete()
        .eq('id', style.id)
      
      if (deleteError) {
        console.error(`❌ Error deleting "${style.name}":`, deleteError.message)
      } else {
        deletedCount++
      }
    }
    
    console.log(`\n✅ Deleted ${deletedCount} invalid entries`)
    
    // Now add some real style references with working URLs
    const newStyles = [
      {
        name: 'Clean White Electronics',
        product_category: 'electronics',
        container_type: 'no_container',
        background_style: 'solid_white',
        mood_aesthetic: 'minimalist',
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
        tags: JSON.stringify(['clean', 'white', 'minimalist', 'technology'])
      },
      {
        name: 'Luxury Beauty Product',
        product_category: 'beauty',
        container_type: 'bottle',
        background_style: 'gradient',
        mood_aesthetic: 'luxury',
        image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=center',
        tags: JSON.stringify(['luxury', 'beauty', 'elegant', 'premium'])
      },
      {
        name: 'Modern Fashion Display',
        product_category: 'fashion',
        container_type: 'no_container',
        background_style: 'textured',
        mood_aesthetic: 'modern',
        image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
        tags: JSON.stringify(['fashion', 'modern', 'clothing', 'style'])
      },
      {
        name: 'Cozy Home Decor',
        product_category: 'home_decor',
        container_type: 'no_container',
        background_style: 'natural',
        mood_aesthetic: 'modern',
        image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
        tags: JSON.stringify(['home', 'decor', 'cozy', 'interior'])
      },
      {
        name: 'Fresh Food Styling',
        product_category: 'food',
        container_type: 'no_container',
        background_style: 'natural',
        mood_aesthetic: 'playful',
        image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop&crop=center',
        tags: JSON.stringify(['food', 'fresh', 'organic', 'healthy'])
      },
      {
        name: 'Premium Electronics',
        product_category: 'electronics',
        container_type: 'box',
        background_style: 'gradient',
        mood_aesthetic: 'luxury',
        image_url: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop&crop=center',
        tags: JSON.stringify(['electronics', 'premium', 'technology', 'sleek'])
      },
      {
        name: 'Vintage Beauty Bottle',
        product_category: 'beauty',
        container_type: 'bottle',
        background_style: 'textured',
        mood_aesthetic: 'vintage',
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
        tags: JSON.stringify(['vintage', 'beauty', 'classic', 'retro'])
      },
      {
        name: 'Minimalist Home Item',
        product_category: 'home_decor',
        container_type: 'no_container',
        background_style: 'solid_white',
        mood_aesthetic: 'minimalist',
        image_url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=400&fit=crop&crop=center',
        tags: JSON.stringify(['minimalist', 'home', 'clean', 'simple'])
      }
    ]
    
    console.log(`\n📦 Adding ${newStyles.length} new style references...`)
    
    const { data: insertedStyles, error: insertError } = await supabase
      .from('style_references')
      .insert(newStyles)
      .select()
    
    if (insertError) {
      console.error('❌ Error inserting new styles:', insertError)
      return
    }
    
    console.log(`✅ Successfully added ${insertedStyles.length} new style references!`)
    
    // Show final state
    const { data: finalStyles } = await supabase
      .from('style_references')
      .select('*')
      .order('created_at', { ascending: true })
    
    console.log(`\n🎉 Style library now has ${finalStyles.length} working references:`)
    finalStyles.forEach((style, index) => {
      console.log(`  ${index + 1}. ${style.name} (${style.product_category})`)
    })
    
  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

// Run the fix
fixStyleLibrary()