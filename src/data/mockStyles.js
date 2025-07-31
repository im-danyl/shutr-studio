// Centralized mock data for style references
// This ensures consistency across StyleLibrary and Generate pages

export const mockStyleReferences = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    title: 'Modern Minimalist',
    category: 'Lifestyle',
    container: 'Indoor',
    background: 'Solid',
    mood: 'Minimalist',
    aspectRatio: '1:1',
    tags: ['clean', 'simple', 'modern']
  },
  {
    id: '2', 
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
    title: 'Studio Product Shot',
    category: 'Product',
    container: 'Studio',
    background: 'Gradient',
    mood: 'Studio',
    aspectRatio: '1:1',
    tags: ['professional', 'clean', 'commercial']
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=600&fit=crop',
    title: 'Natural Light Beauty',
    category: 'Beauty',
    container: 'Indoor',
    background: 'Natural',
    mood: 'Natural',
    aspectRatio: '3:4',
    tags: ['natural', 'soft', 'organic']
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    title: 'Fashion Forward',
    category: 'Fashion',
    container: 'Indoor',
    background: 'Textured',
    mood: 'Dramatic',
    aspectRatio: '1:1',
    tags: ['bold', 'fashion', 'dynamic']
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
    title: 'Food Styling',
    category: 'Food',
    container: 'Kitchen',
    background: 'Natural',
    mood: 'Natural',
    aspectRatio: '1:1',
    tags: ['appetizing', 'fresh', 'culinary']
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    title: 'Artistic Product',
    category: 'Product',
    container: 'Creative',
    background: 'Artistic',
    mood: 'Artistic',
    aspectRatio: '1:1',
    tags: ['creative', 'unique', 'artistic']
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    title: 'Luxury Watches',
    category: 'Luxury',
    container: 'Studio',
    background: 'Gradient',
    mood: 'Dramatic',
    aspectRatio: '1:1',
    tags: ['luxury', 'premium', 'elegant']
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    title: 'Tech Minimal',
    category: 'Technology',
    container: 'Studio',
    background: 'Solid',
    mood: 'Minimalist',
    aspectRatio: '1:1',
    tags: ['tech', 'sleek', 'modern']
  },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
    title: 'Lifestyle Portrait', 
    category: 'Lifestyle',
    container: 'Outdoor',
    background: 'Natural',
    mood: 'Natural',
    aspectRatio: '3:4',
    tags: ['lifestyle', 'candid', 'authentic']
  },
  {
    id: '10',
    url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    title: 'Vintage Aesthetic',
    category: 'Vintage',
    container: 'Indoor',
    background: 'Textured',
    mood: 'Vintage',
    aspectRatio: '1:1',
    tags: ['retro', 'nostalgic', 'timeless']
  },
  {
    id: '11',
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    title: 'Cosmetics Beauty',
    category: 'Beauty',
    container: 'Studio',
    background: 'Gradient',
    mood: 'Studio',
    aspectRatio: '1:1',
    tags: ['beauty', 'cosmetics', 'glamour']
  },
  {
    id: '12',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    title: 'Sneaker Culture',
    category: 'Fashion',
    container: 'Creative',
    background: 'Artistic',
    mood: 'Dramatic',
    aspectRatio: '1:1',
    tags: ['streetwear', 'urban', 'culture']
  }
]

// Filter options (centralized)
export const filterOptions = {
  categories: ['All', 'Lifestyle', 'Product', 'Food', 'Fashion', 'Beauty', 'Technology', 'Luxury', 'Vintage'],
  containers: ['All', 'Studio', 'Indoor', 'Outdoor', 'Kitchen', 'Creative'],
  backgrounds: ['All', 'Solid', 'Gradient', 'Natural', 'Textured', 'Artistic'],
  moods: ['All', 'Minimalist', 'Dramatic', 'Natural', 'Studio', 'Artistic', 'Vintage'],
  aspectRatios: ['All', '1:1', '3:4', '4:3', '9:16', '16:9']
}

// Utility function to filter styles
export const filterStyles = (styles, filters) => {
  return styles.filter((style) => {
    const matchesCategory = !filters.category || filters.category === 'All' || style.category === filters.category
    const matchesContainer = !filters.container || filters.container === 'All' || style.container === filters.container
    const matchesBackground = !filters.background || filters.background === 'All' || style.background === filters.background
    const matchesMood = !filters.mood || filters.mood === 'All' || style.mood === filters.mood
    const matchesAspectRatio = !filters.aspectRatio || filters.aspectRatio === 'All' || style.aspectRatio === filters.aspectRatio
    const matchesSearch = !filters.search || 
      style.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      style.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
    
    return matchesCategory && matchesContainer && matchesBackground && matchesMood && matchesAspectRatio && matchesSearch
  })
}

export default mockStyleReferences