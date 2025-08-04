// Test Enhanced AI Generation Improvements
// This file tests the improved product accuracy and background integration

import { openai } from './src/lib/openai.js'

// Mock File objects for testing
function createMockFile(name, type = 'image/png') {
  const blob = new Blob(['fake image data'], { type })
  const file = new File([blob], name, { type, lastModified: Date.now() })
  return file
}

// Test improved dual-image analysis
async function testImprovedAnalysis() {
  console.log('🧪 Testing Improved Dual-Image Analysis')
  
  const productImage = createMockFile('test-product.png')
  const styleReference = 'https://example.com/style-reference.jpg'
  
  try {
    console.log('🔍 Running enhanced dual-image analysis...')
    
    const result = await openai.analyzeDualImagesForStyleTransfer(styleReference, productImage)
    
    if (result.success) {
      console.log('✅ Enhanced analysis successful!')
      console.log('Integration Strategy:', result.analysis.integration_strategy)
      console.log('Critical Elements:', result.analysis.critical_elements)
      
      // Check for improved analysis structure
      const hasProductAccuracy = result.analysis.generation_prompt?.includes('EXACTLY') || result.analysis.generation_prompt?.includes('preserve all branding')
      const hasSeamlessIntegration = result.analysis.generation_prompt?.includes('seamlessly') || result.analysis.generation_prompt?.includes('naturally placed')
      
      console.log('📊 Analysis Quality Check:')
      console.log('  - Product accuracy emphasis:', hasProductAccuracy ? '✅' : '❌')
      console.log('  - Seamless integration focus:', hasSeamlessIntegration ? '✅' : '❌')
      
    } else {
      console.log('❌ Enhanced analysis failed:', result.error)
    }
    
  } catch (error) {
    console.error('🚨 Analysis test failed:', error.message)
  }
}

// Test improved generation workflow
async function testImprovedGeneration() {
  console.log('🧪 Testing Improved Generation Workflow')
  
  const productImage = createMockFile('branded-product.png')
  const styleReference = 'https://example.com/background-environment.jpg'
  
  try {
    console.log('🎨 Running enhanced generation workflow...')
    
    const result = await openai.generateStyledProduct(productImage, styleReference, {
      variantCount: 1,
      quality: 'high'
    })
    
    if (result.success) {
      console.log('✅ Enhanced generation successful!')
      console.log(`Generated ${result.images.length} images with improved accuracy`)
      
      // Check if the generated image metadata includes our improvements
      const firstImage = result.images[0]
      console.log('📊 Generation Quality Check:')
      console.log('  - Has integration strategy:', !!firstImage.integration_strategy)
      console.log('  - Revised prompt includes accuracy:', firstImage.revised_prompt?.includes('preserve') || firstImage.revised_prompt?.includes('exact'))
      
    } else {
      console.log('❌ Enhanced generation failed:', result.error)
    }
    
  } catch (error) {
    console.error('🚨 Generation test failed:', error.message)
  }
}

// Test improved product analysis
async function testImprovedProductAnalysis() {
  console.log('🧪 Testing Enhanced Product Analysis')
  
  const productImage = createMockFile('detailed-product.png')
  
  try {
    console.log('🔍 Running enhanced product analysis...')
    
    const result = await openai.analyzeProductImage(productImage)
    
    if (result.success) {
      console.log('✅ Enhanced product analysis successful!')
      console.log('📊 Analysis includes:')
      console.log('  - Brand elements:', !!result.analysis.brand_elements)
      console.log('  - Materials:', !!result.analysis.materials)
      console.log('  - Text content:', !!result.analysis.text_content)
      console.log('  - Unique details:', !!result.analysis.unique_details)
      console.log('  - Dimensions:', !!result.analysis.dimensions)
      
    } else {
      console.log('❌ Enhanced product analysis failed:', result.error)
    }
    
  } catch (error) {
    console.error('🚨 Product analysis test failed:', error.message)
  }
}

// Run all improvement tests
console.log('🚀 Testing AI Generation Improvements')
console.log('====================================')

async function runAllTests() {
  await testImprovedProductAnalysis()
  console.log('\n')
  await testImprovedAnalysis() 
  console.log('\n')
  await testImprovedGeneration()
  console.log('\n✅ All improvement tests completed')
}

runAllTests()

export { testImprovedAnalysis, testImprovedGeneration, testImprovedProductAnalysis }