-- Debug credit transaction constraints

-- 1. Check the current structure and constraints of credit_transactions table
SELECT 
    c.conname as constraint_name,
    c.contype as constraint_type,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE t.relname = 'credit_transactions' 
AND n.nspname = 'public';

-- 2. Check what transaction types are currently allowed
SELECT DISTINCT transaction_type 
FROM credit_transactions 
ORDER BY transaction_type;

-- 3. Look at the table structure
\d+ credit_transactions;

-- 4. Check recent failed transactions (if any exist)
SELECT * FROM credit_transactions 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Check the refund_credits function to see what transaction type it's trying to use
SELECT pg_get_functiondef(oid)
FROM pg_proc 
WHERE proname = 'refund_credits';

-- 6. Fix: If the constraint only allows specific transaction types, we may need to add 'refund' type
-- First check what types are currently allowed:
SELECT 
    pg_get_constraintdef(oid) as constraint_def
FROM pg_constraint 
WHERE conname LIKE '%transaction_type%' 
AND conrelid = 'credit_transactions'::regclass;

-- 7. If needed, modify the constraint to include 'refund' type
-- (Run this only if the constraint needs to be updated)
/*
ALTER TABLE credit_transactions 
DROP CONSTRAINT IF EXISTS credit_transactions_transaction_type_check;

ALTER TABLE credit_transactions 
ADD CONSTRAINT credit_transactions_transaction_type_check 
CHECK (transaction_type IN ('purchase', 'refund', 'bonus', 'initial'));
*/