-- Create generations table for tracking AI image generation

CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  product_image_url TEXT NOT NULL,
  style_reference_id UUID, -- Will reference style_references table
  style_reference_url TEXT NOT NULL, -- Backup URL reference
  variant_count INTEGER CHECK (variant_count BETWEEN 1 AND 4) NOT NULL,
  credits_consumed INTEGER NOT NULL,
  status TEXT CHECK (status IN ('processing', 'completed', 'failed')) DEFAULT 'processing',
  generated_images JSONB, -- Array of generated image URLs
  error_message TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Create policies for generations
CREATE POLICY "Users can view own generations" ON generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own generations" ON generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update generations" ON generations
  FOR UPDATE USING (true); -- Allow system updates for status changes

-- Create indexes
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);

-- Function to create a new generation
CREATE OR REPLACE FUNCTION create_generation(
  p_user_id UUID,
  p_product_image_url TEXT,
  p_style_reference_id UUID,
  p_style_reference_url TEXT,
  p_variant_count INTEGER
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
    variant_count,
    credits_consumed,
    status
  ) VALUES (
    p_user_id,
    p_product_image_url,
    p_style_reference_id,
    p_style_reference_url,
    p_variant_count,
    p_variant_count,
    'processing'
  ) RETURNING id INTO generation_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'generation_id', generation_id,
    'remaining_credits', credit_result->'remaining_credits'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete a generation
CREATE OR REPLACE FUNCTION complete_generation(
  p_generation_id UUID,
  p_generated_images JSONB
)
RETURNS JSONB AS $$
BEGIN
  UPDATE generations 
  SET 
    status = 'completed',
    generated_images = p_generated_images,
    completed_at = NOW()
  WHERE id = p_generation_id;
  
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to fail a generation and refund credits
CREATE OR REPLACE FUNCTION fail_generation(
  p_generation_id UUID,
  p_error_message TEXT
)
RETURNS JSONB AS $$
DECLARE
  gen_record RECORD;
  refund_result JSONB;
BEGIN
  -- Get generation details
  SELECT user_id, credits_consumed INTO gen_record
  FROM generations 
  WHERE id = p_generation_id;
  
  -- Update generation status
  UPDATE generations 
  SET 
    status = 'failed',
    error_message = p_error_message,
    completed_at = NOW()
  WHERE id = p_generation_id;
  
  -- Refund credits
  SELECT refund_credits(gen_record.user_id, gen_record.credits_consumed, p_generation_id::TEXT) INTO refund_result;
  
  RETURN jsonb_build_object('success', true, 'refunded', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;