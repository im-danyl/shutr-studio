-- Add credits system to user_profiles and create credit transactions

-- Add credits column to user_profiles
ALTER TABLE user_profiles ADD COLUMN credits INTEGER DEFAULT 2;

-- Create credit_transactions table
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- positive for additions, negative for usage
  variant_count INTEGER, -- number of variations generated (for generation_usage type)
  transaction_type TEXT CHECK (transaction_type IN ('signup_bonus', 'generation_usage')) NOT NULL,
  reference_id TEXT, -- generation_id or other reference
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for credit_transactions
CREATE POLICY "Users can view own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(transaction_type);

-- Update the new user function to give 2 free credits
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    2 -- 2 free credits for new users
  );
  
  -- Record the signup bonus transaction
  INSERT INTO credit_transactions (user_id, amount, transaction_type)
  VALUES (NEW.id, 2, 'signup_bonus');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to consume credits atomically
CREATE OR REPLACE FUNCTION consume_credits(p_user_id UUID, p_variant_count INTEGER, p_generation_id TEXT)
RETURNS JSONB AS $$
DECLARE
  current_credits INTEGER;
  result JSONB;
BEGIN
  -- Lock the user's row and get current credits
  SELECT credits INTO current_credits
  FROM user_profiles 
  WHERE id = p_user_id
  FOR UPDATE;
  
  -- Check if user has enough credits
  IF current_credits < p_variant_count THEN
    RETURN jsonb_build_object('success', false, 'error', 'insufficient_credits');
  END IF;
  
  -- Deduct credits
  UPDATE user_profiles 
  SET credits = credits - p_variant_count
  WHERE id = p_user_id;
  
  -- Record the transaction
  INSERT INTO credit_transactions (user_id, amount, variant_count, transaction_type, reference_id)
  VALUES (p_user_id, -p_variant_count, p_variant_count, 'generation_usage', p_generation_id);
  
  RETURN jsonb_build_object('success', true, 'remaining_credits', current_credits - p_variant_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to refund credits (in case of generation failure)
CREATE OR REPLACE FUNCTION refund_credits(p_user_id UUID, p_amount INTEGER, p_generation_id TEXT)
RETURNS JSONB AS $$
BEGIN
  -- Add credits back
  UPDATE user_profiles 
  SET credits = credits + p_amount
  WHERE id = p_user_id;
  
  -- Record the refund transaction
  INSERT INTO credit_transactions (user_id, amount, transaction_type, reference_id)
  VALUES (p_user_id, p_amount, 'refund', p_generation_id);
  
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;