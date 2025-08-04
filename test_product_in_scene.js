// Test Product-in-Scene GPT Image 1 Implementation
// This file tests the new product-in-scene generation feature

import { openai } from './src/lib/openai.js'

// Mock File objects for testing with proper File inheritance
function createMockFile(name, type = 'image/png') {
  // Create a proper File-like object that passes instanceof checks
  const blob = new Blob(['fake image data'], { type })
  const file = new File([blob], name, { type, lastModified: Date.now() })
  return file
}

// Test the new product-in-scene generation
async function testProductInScene() {
  console.log('🧪 Testing Product-in-Scene Generation with GPT Image 1')
  
  const productImage = createMockFile('test-product.png')
  const sceneSource = createMockFile('test-scene.jpg', 'image/jpeg') // Test File upload
  const sceneLibraryUrl = 'https://example.com/library-scene.jpg' // Test library reference
  
  try {
    console.log('📸 Starting product-in-scene generation (File upload)...')
    
    const result1 = await openai.generateProductInScene(productImage, sceneSource, {
      variantCount: 1,
      quality: 'high'
    })
    
    console.log('📸 Testing library reference scene...')
    
    const result2 = await openai.generateProductInScene(productImage, sceneLibraryUrl, {
      variantCount: 1,
      quality: 'high'  
    })
    
    // Test results
    if (result1.success) {
      console.log('✅ File upload scene test successful!')
      console.log(`Generated ${result1.images.length} images`)
    } else {
      console.log('❌ File upload scene test failed:', result1.error)
    }
    
    if (result2.success) {
      console.log('✅ Library reference scene test successful!')
      console.log(`Generated ${result2.images.length} images`)
    } else {
      console.log('❌ Library reference scene test failed:', result2.error)
    }
    
  } catch (error) {
    console.error('🚨 Test failed with error:', error.message)
  }
}

// Test the multi-image API call directly
async function testMultiImageAPI() {
  console.log('🧪 Testing Multi-Image API Call')
  
  try {
    // Mock base64 images (just test strings)
    const mockSceneBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
    const mockProductBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA'
    
    const result = await openai.generateWithMultipleImages(
      'Place the product from the first image into the second image realistically.',
      [mockSceneBase64, mockProductBase64],
      null,
      'high'
    )
    
    if (result.success) {
      console.log('✅ Multi-image API call successful!')
      console.log('Has image URL:', !!result.imageUrl)
      console.log('Has revised prompt:', !!result.revisedPrompt)
    } else {
      console.log('❌ Multi-image API call failed:', result.error)
    }
    
  } catch (error) {
    console.error('🚨 Multi-image test failed:', error.message)
  }
}

// Run tests
console.log('🚀 Starting Product-in-Scene Tests')
console.log('================================')

testMultiImageAPI().then(() => {
  console.log('\n')
  return testProductInScene()
}).then(() => {
  console.log('\n✅ All tests completed')
})

export { testProductInScene, testMultiImageAPI }