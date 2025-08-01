import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugStorage() {
  console.log('🔍 DEBUGGING: Storage Bucket → Database → Frontend Flow\n')
  
  try {
    // STEP 1: Check what's in the storage bucket
    console.log('📦 STEP 1: Checking style-references storage bucket...')
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('style-references')
      .list('', { limit: 50 })
    
    if (storageError) {
      console.error('❌ Storage Error:', storageError)
    } else {
      console.log(`✅ Found ${storageFiles.length} files in storage:`)
      storageFiles.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file.name} (${file.metadata?.size || 'unknown'} bytes)`)
      })
    }
    
    console.log('\n' + '='.repeat(60) + '\n')
    
    // STEP 2: Check what's in the database
    console.log('🗄️  STEP 2: Checking style_references database table...')
    const { data: dbEntries, error: dbError } = await supabase
      .from('style_references')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (dbError) {
      console.error('❌ Database Error:', dbError)
    } else {
      console.log(`✅ Found ${dbEntries.length} database entries:`)
      dbEntries.forEach((entry, index) => {
        console.log(`  ${index + 1}. "${entry.name}" (${entry.product_category})`)
        console.log(`     Image URL: ${entry.image_url}`)
        console.log(`     Created: ${entry.created_at}`)
        console.log('')
      })
    }
    
    console.log('\n' + '='.repeat(60) + '\n')
    
    // STEP 3: Test if image URLs are accessible
    console.log('🌐 STEP 3: Testing image URL accessibility...')
    
    if (dbEntries && dbEntries.length > 0) {
      // Try to get public URL for first few entries
      for (let i = 0; i < Math.min(3, dbEntries.length); i++) {
        const entry = dbEntries[i]
        console.log(`\n📋 Testing entry ${i + 1}: "${entry.name}"`)
        console.log(`   Database URL: ${entry.image_url}`)
        
        // Check if it's a storage file reference
        if (entry.image_url && !entry.image_url.startsWith('http')) {
          // Try to get public URL
          const { data: publicUrl } = supabase.storage
            .from('style-references')
            .getPublicUrl(entry.image_url)
          
          console.log(`   Public URL: ${publicUrl.publicUrl}`)
          
          // Test if file exists in storage
          const { data: downloadData, error: downloadError } = await supabase.storage
            .from('style-references')
            .download(entry.image_url)
          
          if (downloadError) {
            console.log(`   ❌ File not accessible: ${downloadError.message}`)
          } else {
            console.log(`   ✅ File exists and downloadable (${downloadData.size} bytes)`)
          }
        }
      }
    }
    
    console.log('\n' + '='.repeat(60) + '\n')
    
    // STEP 4: Test the database query used by frontend
    console.log('🔍 STEP 4: Testing frontend database query...')
    
    // This should match what the frontend uses
    const { data: filteredStyles, error: queryError } = await supabase.rpc('get_filtered_styles', {
      p_category: null,
      p_container: null,
      p_background: null,
      p_mood: null,
      p_limit: 50,
      p_offset: 0
    })
    
    if (queryError) {
      console.error('❌ Frontend Query Error:', queryError)
      console.log('   Trying direct table query instead...')
      
      const { data: directQuery, error: directError } = await supabase
        .from('style_references')
        .select('*')
        .eq('is_active', true)
        .limit(50)
      
      if (directError) {
        console.error('❌ Direct Query Error:', directError)
      } else {
        console.log(`✅ Direct query returned ${directQuery.length} results`)
      }
    } else {
      console.log(`✅ Frontend query returned ${filteredStyles.length} results`)
    }
    
  } catch (error) {
    console.error('❌ Script Error:', error)
  }
}

// Run the debug
debugStorage()