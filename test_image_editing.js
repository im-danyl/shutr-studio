// Test image editing for style transfer
// NOTE: Set VITE_OPENAI_API_KEY environment variable before running

const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  console.error('❌ VITE_OPENAI_API_KEY environment variable is required')
  process.exit(1)
}

async function testImageEditing() {
  console.log('Testing image editing capabilities for style transfer...')
  
  try {
    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: 'Apply elegant style to product',
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // Mock base64
        response_format: 'b64_json'
      })
    })
    
    if (response.ok) {
      console.log('✅ Image editing API accessible')
    } else {
      console.log('⚠️ Image editing may not be available:', response.status)
    }
  } catch (error) {
    console.error('❌ Image editing test failed:', error.message)
  }
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testImageEditing()
}

export { testImageEditing }