import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Initialize Supabase client (you'll need to add your credentials)
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_KEY' // Service role key for admin operations

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample style references data
const styleReferences = [
  // Electronics - Minimalist
  {
    name: 'Clean White Electronics Background',
    image_url: '/styles/electronics/minimalist-white-1.jpg',
    product_category: 'electronics',
    container_type: 'no_container',
    background_style: 'solid_white',
    mood_aesthetic: 'minimalist',
    tags: ['clean', 'professional', 'simple', 'modern']
  },
  {
    name: 'Minimal Grey Tech Setup',
    image_url: '/styles/electronics/minimalist-grey-1.jpg',
    product_category: 'electronics',
    container_type: 'no_container',
    background_style: 'solid_white',
    mood_aesthetic: 'minimalist',
    tags: ['tech', 'sleek', 'minimal', 'grey']
  },
  {
    name: 'Modern Electronic Lifestyle',
    image_url: '/styles/electronics/modern-lifestyle-1.jpg',
    product_category: 'electronics',
    container_type: 'no_container',
    background_style: 'lifestyle',
    mood_aesthetic: 'modern',
    tags: ['lifestyle', 'contemporary', 'home', 'usage']
  },

  // Fashion - Various styles
  {
    name: 'Luxury Fashion Display',
    image_url: '/styles/fashion/luxury-display-1.jpg',
    product_category: 'fashion',
    container_type: 'no_container',
    background_style: 'gradient',
    mood_aesthetic: 'luxury',
    tags: ['elegant', 'premium', 'sophisticated', 'high-end']
  },
  {
    name: 'Vintage Fashion Styling',
    image_url: '/styles/fashion/vintage-style-1.jpg',
    product_category: 'fashion',
    container_type: 'no_container',
    background_style: 'textured',
    mood_aesthetic: 'vintage',
    tags: ['retro', 'classic', 'timeless', 'nostalgic']
  },
  {
    name: 'Playful Fashion Photography',
    image_url: '/styles/fashion/playful-colors-1.jpg',
    product_category: 'fashion',
    container_type: 'no_container',
    background_style: 'gradient',
    mood_aesthetic: 'playful',
    tags: ['colorful', 'fun', 'vibrant', 'youthful']
  },

  // Beauty - Box packaging
  {
    name: 'Luxury Beauty Box Pink',
    image_url: '/styles/beauty/luxury-box-pink-1.jpg',
    product_category: 'beauty',
    container_type: 'box',
    background_style: 'gradient',
    mood_aesthetic: 'luxury',
    tags: ['pink', 'elegant', 'cosmetics', 'premium']
  },
  {
    name: 'Minimalist Beauty Packaging',
    image_url: '/styles/beauty/minimal-box-white-1.jpg',
    product_category: 'beauty',
    container_type: 'box',
    background_style: 'solid_white',
    mood_aesthetic: 'minimalist',
    tags: ['clean', 'simple', 'skincare', 'modern']
  },
  {
    name: 'Modern Beauty Lifestyle',
    image_url: '/styles/beauty/modern-lifestyle-1.jpg',
    product_category: 'beauty',
    container_type: 'bottle',
    background_style: 'natural',
    mood_aesthetic: 'modern',
    tags: ['natural', 'organic', 'lifestyle', 'wellness']
  },

  // Home Decor
  {
    name: 'Modern Home Styling',
    image_url: '/styles/home/modern-interior-1.jpg',
    product_category: 'home_decor',
    container_type: 'no_container',
    background_style: 'lifestyle',
    mood_aesthetic: 'modern',
    tags: ['interior', 'contemporary', 'home', 'decor']
  },
  {
    name: 'Minimalist Home Decor',
    image_url: '/styles/home/minimal-white-1.jpg',
    product_category: 'home_decor',
    container_type: 'no_container',
    background_style: 'solid_white',
    mood_aesthetic: 'minimalist',
    tags: ['clean', 'simple', 'scandinavian', 'white']
  },
  {
    name: 'Luxury Home Accessories',
    image_url: '/styles/home/luxury-gold-1.jpg',
    product_category: 'home_decor',
    container_type: 'no_container',
    background_style: 'gradient',
    mood_aesthetic: 'luxury',
    tags: ['gold', 'premium', 'elegant', 'sophisticated']
  },

  // Food - Lifestyle and playful
  {
    name: 'Playful Food Photography',
    image_url: '/styles/food/playful-colors-1.jpg',
    product_category: 'food',
    container_type: 'no_container',
    background_style: 'lifestyle',
    mood_aesthetic: 'playful',
    tags: ['colorful', 'fun', 'fresh', 'appetizing']
  },
  {
    name: 'Natural Food Styling',
    image_url: '/styles/food/natural-organic-1.jpg',
    product_category: 'food',
    container_type: 'no_container',
    background_style: 'natural',
    mood_aesthetic: 'modern',
    tags: ['organic', 'natural', 'healthy', 'fresh']
  },
  {
    name: 'Vintage Food Packaging',
    image_url: '/styles/food/vintage-package-1.jpg',
    product_category: 'food',
    container_type: 'box',
    background_style: 'textured',
    mood_aesthetic: 'vintage',
    tags: ['retro', 'artisan', 'craft', 'traditional']
  },

  // Additional variations for each category...
  {
    name: 'Tech Product Hero Shot',
    image_url: '/styles/electronics/hero-shot-1.jpg',
    product_category: 'electronics',
    container_type: 'no_container',
    background_style: 'gradient',
    mood_aesthetic: 'modern',
    tags: ['hero', 'dramatic', 'tech', 'showcase']
  },
  {
    name: 'Fashion Flat Lay Minimal',
    image_url: '/styles/fashion/flat-lay-minimal-1.jpg',
    product_category: 'fashion',
    container_type: 'no_container',
    background_style: 'solid_white',
    mood_aesthetic: 'minimalist',
    tags: ['flat-lay', 'minimal', 'editorial', 'clean']
  },
  {
    name: 'Beauty Product Natural Light',
    image_url: '/styles/beauty/natural-light-1.jpg',
    product_category: 'beauty',
    container_type: 'bottle',
    background_style: 'natural',
    mood_aesthetic: 'modern',
    tags: ['natural-light', 'soft', 'organic', 'wellness']
  },
  {
    name: 'Home Decor Cozy Setup',
    image_url: '/styles/home/cozy-lifestyle-1.jpg',
    product_category: 'home_decor',
    container_type: 'no_container',
    background_style: 'lifestyle',
    mood_aesthetic: 'vintage',
    tags: ['cozy', 'warm', 'comfort', 'lived-in']
  },
  {
    name: 'Artisan Food Presentation',
    image_url: '/styles/food/artisan-craft-1.jpg',
    product_category: 'food',
    container_type: 'bag',
    background_style: 'textured',
    mood_aesthetic: 'vintage',
    tags: ['artisan', 'craft', 'rustic', 'handmade']
  }
]

// Function to populate styles in database
async function populateStyles() {
  console.log('Starting style population...')
  
  try {
    // Insert all style references
    const { data, error } = await supabase
      .from('style_references')
      .insert(styleReferences)
      .select()

    if (error) {
      console.error('Error inserting styles:', error)
      return
    }

    console.log(`Successfully inserted ${data.length} style references`)
    
    // Log summary by category
    const summary = {}
    data.forEach(style => {
      const category = style.product_category
      if (!summary[category]) summary[category] = 0
      summary[category]++
    })
    
    console.log('Styles by category:')
    Object.entries(summary).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} styles`)
    })
    
  } catch (error) {
    console.error('Error populating styles:', error)
  }
}

// Function to generate more styles (for reaching 50-100 total)
function generateMoreStyles() {
  const additionalStyles = []
  const categories = ['electronics', 'fashion', 'beauty', 'home_decor', 'food']
  const containers = ['no_container', 'box', 'bottle', 'bag', 'tube']
  const backgrounds = ['solid_white', 'gradient', 'textured', 'lifestyle', 'natural']
  const moods = ['minimalist', 'luxury', 'playful', 'vintage', 'modern']
  
  // Generate more combinations
  for (let i = 1; i <= 30; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const container = containers[Math.floor(Math.random() * containers.length)]
    const background = backgrounds[Math.floor(Math.random() * backgrounds.length)]
    const mood = moods[Math.floor(Math.random() * moods.length)]
    
    additionalStyles.push({
      name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} ${category.replace('_', ' ')} Style ${i}`,
      image_url: `/styles/${category}/${mood}-${background}-${i}.jpg`,
      product_category: category,
      container_type: container,
      background_style: background,
      mood_aesthetic: mood,
      tags: [mood, category.replace('_', '-'), background.replace('_', '-'), 'generated']
    })
  }
  
  return additionalStyles
}

// Run the population
if (process.argv.includes('--populate')) {
  populateStyles()
} else if (process.argv.includes('--generate-more')) {
  const moreStyles = generateMoreStyles()
  console.log('Generated additional styles:', moreStyles.length)
  console.log('Sample:', JSON.stringify(moreStyles[0], null, 2))
} else {
  console.log('Usage:')
  console.log('  node populate-styles.js --populate     # Insert base styles')
  console.log('  node populate-styles.js --generate-more  # Generate more style combinations')
}

export { styleReferences, generateMoreStyles }