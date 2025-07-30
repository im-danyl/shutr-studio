import React, { useState } from 'react'
import { Search, Filter } from 'lucide-react'

// Mock data for style references
const mockStyles = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    title: 'Modern Minimalist',
    category: 'Electronics',
    mood: 'Minimalist',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
    title: 'Studio Product Shot',
    category: 'Electronics',
    mood: 'Studio',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=600&fit=crop',
    title: 'Natural Light Beauty',
    category: 'Beauty',
    mood: 'Natural',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    title: 'Fashion Forward',
    category: 'Fashion',
    mood: 'Dramatic',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
    title: 'Food Styling',
    category: 'Food',
    mood: 'Natural',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    title: 'Artistic Product',
    category: 'Electronics',
    mood: 'Artistic',
  },
].concat(Array.from({ length: 6 }, (_, i) => ({
  id: `${i + 7}`,
  url: `https://images.unsplash.com/photo-${1586495777744 + i}?w=400&h=400&fit=crop`,
  title: `Style Reference ${i + 7}`,
  category: 'Electronics',
  mood: 'Minimalist',
})));

// Utility function for className merging
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Select components (simplified for this page)
const Select = ({ children, value, onValueChange, placeholder }) => {
  return (
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      style={{
        width: '100%',
        height: '40px',
        padding: '0 16px',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        color: 'var(--text-primary)',
        fontSize: '14px'
      }}
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  );
};

const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

// Card component
const Card = ({ children, className, ...props }) => (
  <div 
    className={cn("card", className)}
    {...props}
  >
    {children}
  </div>
);

const StyleLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedContainer, setSelectedContainer] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  const categories = ['Electronics', 'Fashion', 'Beauty', 'Food', 'Home Decor'];
  const containers = ['No Container', 'Box', 'Bottle', 'Bag', 'Tube'];
  const backgrounds = ['Solid White', 'Gradient', 'Textured', 'Lifestyle', 'Natural'];
  const moods = ['Minimalist', 'Luxury', 'Playful', 'Vintage', 'Modern', 'Dramatic', 'Studio', 'Natural', 'Artistic'];

  const filteredStyles = mockStyles.filter((style) => {
    const matchesCategory = !selectedCategory || style.category === selectedCategory;
    const matchesMood = !selectedMood || style.mood === selectedMood;
    return matchesCategory && matchesMood;
  });

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedContainer('');
    setSelectedBackground('');
    setSelectedMood('');
  };

  const hasActiveFilters = selectedCategory || selectedContainer || selectedBackground || selectedMood;

  return (
    <div className="main-container">
      <div className="content-container">
        {/* Header */}
        <div className="mb-8">
          <h2 style={{ marginBottom: '8px' }}>
            Style Library
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Browse our curated collection of style references
          </p>
        </div>

        {/* Filters */}
        <Card style={{ padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 className="h3-card" style={{ margin: 0 }}>Filter Styles</h3>
            {hasActiveFilters && (
              <button 
                className="button variant-outline size-sm" 
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
          
          <style>{`
            .filters-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 16px;
            }
            @media (min-width: 768px) {
              .filters-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            @media (min-width: 1024px) {
              .filters-grid {
                grid-template-columns: repeat(4, 1fr);
              }
            }
          `}</style>
          
          <div className="filters-grid">
            <div>
              <label className="form-label" style={{ marginBottom: '8px' }}>Product Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory} placeholder="All Categories">
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="form-label" style={{ marginBottom: '8px' }}>Container Type</label>
              <Select value={selectedContainer} onValueChange={setSelectedContainer} placeholder="All Containers">
                {containers.map(container => (
                  <SelectItem key={container} value={container}>{container}</SelectItem>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="form-label" style={{ marginBottom: '8px' }}>Background</label>
              <Select value={selectedBackground} onValueChange={setSelectedBackground} placeholder="All Backgrounds">
                {backgrounds.map(background => (
                  <SelectItem key={background} value={background}>{background}</SelectItem>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="form-label" style={{ marginBottom: '8px' }}>Mood</label>
              <Select value={selectedMood} onValueChange={setSelectedMood} placeholder="All Moods">
                {moods.map(mood => (
                  <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Showing {filteredStyles.length} of {mockStyles.length} styles
          </p>
        </div>

        {/* Style Grid */}
        <style>{`
          .styles-grid {
            column-count: 2;
            column-gap: 16px;
          }
          @media (min-width: 768px) {
            .styles-grid {
              column-count: 3;
            }
          }
          @media (min-width: 1024px) {
            .styles-grid {
              column-count: 4;
            }
          }
          .style-card {
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
            margin-bottom: 16px;
            display: inline-block;
            width: 100%;
          }
          .style-card:hover {
            transform: translateY(-4px);
          }
          .style-image {
            width: 100%;
            height: auto;
            display: block;
            border-radius: var(--radius-lg);
          }
          .style-info-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.6);
            color: #FFFFFF;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 16px;
            opacity: 0;
            transition: opacity 0.3s ease;
            border-radius: var(--radius-lg);
          }
          .style-card:hover .style-info-overlay {
            opacity: 1;
          }
        `}</style>

        <div className="styles-grid">
          {filteredStyles.map((style) => (
            <Card 
              key={style.id} 
              className="style-card"
            >
              <img src={style.url} alt={style.title} className="style-image" />
              <div className="style-info-overlay">
                <h3 className="h3-card" style={{ color: '#FFFFFF' }}>{style.title}</h3>
                <p className="caption" style={{ color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                  {style.category} • {style.mood}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {filteredStyles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
              No styles match your current filters.
            </p>
          </div>
        )}

        {/* Load More */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <button className="button variant-outline">
            Load More Styles
          </button>
        </div>
      </div>
    </div>
  )
}

export default StyleLibrary