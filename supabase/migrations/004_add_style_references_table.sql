-- Create style_references table for database-driven style management

CREATE TABLE style_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  product_category TEXT CHECK (product_category IN ('electronics', 'fashion', 'home_decor', 'beauty', 'food')),
  container_type TEXT CHECK (container_type IN ('no_container', 'box', 'bottle', 'bag', 'tube')),
  background_style TEXT CHECK (background_style IN ('solid_white', 'gradient', 'textured', 'lifestyle', 'natural')),
  mood_aesthetic TEXT CHECK (mood_aesthetic IN ('minimalist', 'luxury', 'playful', 'vintage', 'modern')),
  tags JSONB DEFAULT '[]'::jsonb,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (read-only for all authenticated users)
ALTER TABLE style_references ENABLE ROW LEVEL SECURITY;

-- Create policies for style_references
CREATE POLICY "Anyone can view active styles" ON style_references
  FOR SELECT USING (is_active = true);

-- Only allow admin inserts/updates (will be handled via service role)
CREATE POLICY "Service role can manage styles" ON style_references
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for efficient filtering
CREATE INDEX idx_style_references_category ON style_references(product_category);
CREATE INDEX idx_style_references_container ON style_references(container_type);
CREATE INDEX idx_style_references_background ON style_references(background_style);
CREATE INDEX idx_style_references_mood ON style_references(mood_aesthetic);
CREATE INDEX idx_style_references_active ON style_references(is_active);
CREATE INDEX idx_style_references_usage ON style_references(usage_count DESC);

-- Add updated_at trigger
CREATE TRIGGER update_style_references_updated_at
  BEFORE UPDATE ON style_references
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to increment usage count when a style is used
CREATE OR REPLACE FUNCTION increment_style_usage(p_style_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE style_references 
  SET usage_count = usage_count + 1
  WHERE id = p_style_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get filtered styles
CREATE OR REPLACE FUNCTION get_filtered_styles(
  p_category TEXT DEFAULT NULL,
  p_container TEXT DEFAULT NULL,
  p_background TEXT DEFAULT NULL,
  p_mood TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  product_category TEXT,
  container_type TEXT,
  background_style TEXT,
  mood_aesthetic TEXT,
  tags JSONB,
  usage_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sr.id,
    sr.name,
    sr.image_url,
    sr.thumbnail_url,
    sr.product_category,
    sr.container_type,
    sr.background_style,
    sr.mood_aesthetic,
    sr.tags,
    sr.usage_count
  FROM style_references sr
  WHERE sr.is_active = true
    AND (p_category IS NULL OR sr.product_category = p_category)
    AND (p_container IS NULL OR sr.container_type = p_container)
    AND (p_background IS NULL OR sr.background_style = p_background)
    AND (p_mood IS NULL OR sr.mood_aesthetic = p_mood)
  ORDER BY sr.usage_count DESC, sr.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample style references for development
INSERT INTO style_references (name, image_url, product_category, container_type, background_style, mood_aesthetic, tags) VALUES
('Minimalist White Electronics', '/styles/minimalist-white-1.jpg', 'electronics', 'no_container', 'solid_white', 'minimalist', '["clean", "professional"]'),
('Luxury Box Packaging', '/styles/luxury-box-1.jpg', 'beauty', 'box', 'gradient', 'luxury', '["elegant", "premium"]'),
('Playful Food Styling', '/styles/playful-food-1.jpg', 'food', 'no_container', 'lifestyle', 'playful', '["colorful", "fun"]'),
('Vintage Fashion Display', '/styles/vintage-fashion-1.jpg', 'fashion', 'no_container', 'textured', 'vintage', '["retro", "classic"]'),
('Modern Home Decor', '/styles/modern-home-1.jpg', 'home_decor', 'no_container', 'natural', 'modern', '["contemporary", "stylish"]');

-- Update generations table to properly reference style_references
ALTER TABLE generations 
ADD CONSTRAINT fk_generations_style_reference 
FOREIGN KEY (style_reference_id) REFERENCES style_references(id);