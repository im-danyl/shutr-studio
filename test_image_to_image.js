// Test direct image-to-image style transfer capabilities
// NOTE: Set VITE_OPENAI_API_KEY environment variable before running

const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  console.error('❌ VITE_OPENAI_API_KEY environment variable is required')
  process.exit(1)
}

async function testImageToImage() {
  console.log('Testing direct image-to-image style transfer capabilities...')
  
  try {
    const response = await fetch('https://api.openai.com/v1/images/variations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // Mock base64
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json'
      })
    })
    
    if (response.ok) {
      console.log('✅ Image-to-image variations API accessible')
    } else {
      console.log('⚠️ Image variations may not be available:', response.status)
    }
  } catch (error) {
    console.error('❌ Image-to-image test failed:', error.message)
  }
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testImageToImage()
}

export { testImageToImage }