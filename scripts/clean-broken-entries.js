import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function cleanBrokenEntries() {
  console.log('🧹 CLEANING: Remove broken database entries with non-existent files\n')
  
  // Get all entries
  const { data: allEntries, error } = await supabase
    .from('style_references')
    .select('*')
    .order('created_at')
  
  if (error) {
    console.error('❌ Error fetching entries:', error)
    return
  }
  
  console.log(`📊 Current: ${allEntries.length} total entries`)
  
  // Identify broken entries (old mock entries with non-existent file paths)
  const brokenEntries = allEntries.filter(entry => 
    entry.image_url.startsWith('/styles/') // These are the old broken paths
  )
  
  const workingEntries = allEntries.filter(entry => 
    !entry.image_url.startsWith('/styles/') // These should be the test images
  )
  
  console.log(`❌ Found ${brokenEntries.length} broken entries (old mock data):`)
  brokenEntries.forEach(entry => {
    console.log(`   - "${entry.name}" → ${entry.image_url}`)
  })
  
  console.log(`\n✅ Found ${workingEntries.length} working entries (test images):`)
  workingEntries.forEach(entry => {
    console.log(`   - "${entry.name}" → ${entry.image_url}`)
  })
  
  // Delete broken entries
  if (brokenEntries.length > 0) {
    console.log(`\n🗑️  Deleting ${brokenEntries.length} broken entries...`)
    
    for (const entry of brokenEntries) {
      const { error: deleteError } = await supabase
        .from('style_references')
        .delete()
        .eq('id', entry.id)
      
      if (deleteError) {
        console.error(`❌ Failed to delete "${entry.name}":`, deleteError.message)
      } else {
        console.log(`✅ Deleted: "${entry.name}"`)
      }
    }
  }
  
  // Verify final state
  const { data: finalEntries } = await supabase
    .from('style_references')
    .select('*')
    .order('created_at')
  
  console.log(`\n🎉 FINAL STATE: ${finalEntries.length} entries remaining`)
  finalEntries.forEach((entry, index) => {
    console.log(`   ${index + 1}. "${entry.name}" (${entry.product_category}) → ${entry.image_url}`)
  })
}

cleanBrokenEntries()