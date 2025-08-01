import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function cleanStyleLibrary() {
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
    
    console.log(`📊 Found ${styles.length} style references:`)
    styles.forEach((style, index) => {
      console.log(`  ${index + 1}. ${style.name} (${style.product_category}) - ${style.image_url}`)
    })
    
    // Identify test/mock data to remove
    const testStyles = styles.filter(style => 
      style.name.startsWith('Test ') || 
      style.name.includes('Mock') ||
      style.image_url.includes('via.placeholder.com') ||
      style.image_url.includes('picsum.photos') ||
      style.image_url.includes('unsplash.com')
    )
    
    if (testStyles.length === 0) {
      console.log('✅ No test/mock data found to clean up!')
      return
    }
    
    console.log(`\n🧹 Found ${testStyles.length} test/mock entries to remove:`)
    testStyles.forEach((style, index) => {
      console.log(`  ${index + 1}. ${style.name} (${style.product_category})`)
    })
    
    // Remove test data one by one to handle RLS
    console.log('\n🗑️  Attempting to remove test entries...')
    let deletedCount = 0
    
    for (const style of testStyles) {
      const { error: deleteError } = await supabase
        .from('style_references')
        .delete()
        .eq('id', style.id)
      
      if (deleteError) {
        console.error(`❌ Error deleting "${style.name}":`, deleteError.message)
      } else {
        console.log(`✅ Deleted: ${style.name}`)
        deletedCount++
      }
    }
    
    if (deletedCount > 0) {
      console.log(`\n🎉 Successfully removed ${deletedCount}/${testStyles.length} test entries!`)
    } else {
      console.log(`\n⚠️  Could not delete test entries. This might be due to RLS policies.`)
      console.log(`   You may need to delete them manually in the Supabase dashboard.`)
    }
    
    // Show remaining entries
    const { data: remainingStyles } = await supabase
      .from('style_references')
      .select('*')
      .order('created_at', { ascending: true })
    
    console.log(`\n📊 Remaining ${remainingStyles.length} style references:`)
    remainingStyles.forEach((style, index) => {
      console.log(`  ${index + 1}. ${style.name} (${style.product_category})`)
    })
    
  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

// Run the cleanup
cleanStyleLibrary()