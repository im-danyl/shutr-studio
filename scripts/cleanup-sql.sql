-- Clean up Session 5 test images and replace with production-quality style references
-- Run this in Supabase SQL Editor to upgrade the style library

-- First, let's see what we currently have
SELECT name, product_category, image_url, created_at 
FROM style_references 
ORDER BY created_at;

-- Delete the 11 test images from Session 5
DELETE FROM style_references 
WHERE name LIKE 'Test %';

-- Verify cleanup
SELECT COUNT(*) as remaining_count FROM style_references;

-- Insert new working style references with real Unsplash images
INSERT INTO style_references (name, product_category, container_type, background_style, mood_aesthetic, image_url, tags, is_active) VALUES
('Clean White Electronics', 'electronics', 'no_container', 'solid_white', 'minimalist', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', '["clean", "white", "minimalist", "technology"]', true),
('Luxury Beauty Product', 'beauty', 'bottle', 'gradient', 'luxury', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=center', '["luxury", "beauty", "elegant", "premium"]', true),
('Modern Fashion Display', 'fashion', 'no_container', 'textured', 'modern', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center', '["fashion", "modern", "clothing", "style"]', true),
('Cozy Home Decor', 'home_decor', 'no_container', 'natural', 'modern', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center', '["home", "decor", "cozy", "interior"]', true),
('Fresh Food Styling', 'food', 'no_container', 'natural', 'playful', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop&crop=center', '["food", "fresh", "organic", "healthy"]', true),
('Premium Electronics Black', 'electronics', 'box', 'gradient', 'luxury', 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop&crop=center', '["electronics", "premium", "technology", "sleek"]', true),
('Vintage Beauty Bottle', 'beauty', 'bottle', 'textured', 'vintage', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center', '["vintage", "beauty", "classic", "retro"]', true),
('Minimalist Home Item', 'home_decor', 'no_container', 'solid_white', 'minimalist', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=400&fit=crop&crop=center', '["minimalist", "home", "clean", "simple"]', true),
('Professional Watch', 'electronics', 'no_container', 'gradient', 'luxury', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center', '["watch", "luxury", "professional", "timepiece"]', true),
('Artisan Food Product', 'food', 'bottle', 'natural', 'vintage', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center', '["artisan", "food", "craft", "authentic"]', true),
('Elegant Fashion Accessory', 'fashion', 'box', 'textured', 'luxury', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop&crop=center', '["fashion", "accessory", "elegant", "luxury"]', true),
('Natural Beauty Serum', 'beauty', 'bottle', 'natural', 'minimalist', 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop&crop=center', '["natural", "beauty", "serum", "organic"]', true);

-- Final verification
SELECT name, product_category, image_url 
FROM style_references 
ORDER BY product_category, name;