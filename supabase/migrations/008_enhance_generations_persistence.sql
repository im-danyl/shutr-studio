-- Enhance generations table for better persistence and history

-- Add additional fields for better tracking
ALTER TABLE generations 
ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_step TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS generation_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS style_analysis JSONB,
ADD COLUMN IF NOT EXISTS product_analysis JSONB,
ADD COLUMN IF NOT EXISTS custom_style_file_url TEXT; -- For custom uploaded styles

-- Add index for better performance on active generations
CREATE INDEX IF NOT EXISTS idx_generations_active ON generations(user_id, status) WHERE status = 'processing';

-- Function to update generation progress
CREATE OR REPLACE FUNCTION update_generation_progress(
  p_generation_id UUID,
  p_progress_percentage INTEGER,
  p_current_step TEXT
)
RETURNS JSONB AS $$
BEGIN
  UPDATE generations 
  SET 
    progress_percentage = p_progress_percentage,
    current_step = p_current_step
  WHERE id = p_generation_id;
  
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's generation history
CREATE OR REPLACE FUNCTION get_user_generations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'product_image_url', product_image_url,
      'style_reference_url', style_reference_url,
      'custom_style_file_url', custom_style_file_url,
      'variant_count', variant_count,
      'credits_consumed', credits_consumed,
      'status', status,
      'progress_percentage', progress_percentage,
      'current_step', current_step,
      'generated_images', generated_images,
      'generation_settings', generation_settings,
      'error_message', error_message,
      'created_at', created_at,
      'completed_at', completed_at
    ) ORDER BY created_at DESC
  ) INTO result
  FROM generations 
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get active generation for user (for recovery)
CREATE OR REPLACE FUNCTION get_active_generation(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'id', id,
    'product_image_url', product_image_url,
    'style_reference_url', style_reference_url,
    'custom_style_file_url', custom_style_file_url,
    'variant_count', variant_count,
    'credits_consumed', credits_consumed,
    'status', status,
    'progress_percentage', progress_percentage,
    'current_step', current_step,
    'generated_images', generated_images,
    'generation_settings', generation_settings,
    'style_analysis', style_analysis,
    'product_analysis', product_analysis,
    'created_at', created_at
  ) INTO result
  FROM generations 
  WHERE user_id = p_user_id 
    AND status = 'processing'
    AND created_at > NOW() - INTERVAL '1 hour' -- Only recent generations
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced create_generation function with settings
CREATE OR REPLACE FUNCTION create_generation_with_settings(
  p_user_id UUID,
  p_product_image_url TEXT,
  p_style_reference_id UUID,
  p_style_reference_url TEXT,
  p_custom_style_file_url TEXT,
  p_variant_count INTEGER,
  p_generation_settings JSONB
)
RETURNS JSONB AS $$
DECLARE
  generation_id UUID;
  credit_result JSONB;
BEGIN
  -- First, try to consume credits
  SELECT consume_credits(p_user_id, p_variant_count, gen_random_uuid()::TEXT) INTO credit_result;
  
  IF NOT (credit_result->>'success')::BOOLEAN THEN
    RETURN credit_result;
  END IF;
  
  -- Create the generation record
  INSERT INTO generations (
    user_id,
    product_image_url,
    style_reference_id,
    style_reference_url,
    custom_style_file_url,
    variant_count,
    credits_consumed,
    generation_settings,
    status,
    current_step
  ) VALUES (
    p_user_id,
    p_product_image_url,
    p_style_reference_id,
    p_style_reference_url,
    p_custom_style_file_url,
    p_variant_count,
    p_variant_count,
    p_generation_settings,
    'processing',
    'Starting generation...'
  ) RETURNING id INTO generation_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'generation_id', generation_id,
    'remaining_credits', credit_result->'remaining_credits'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;