-- ============================================================
-- Add is_premium to questions table
-- Free categories (Chaos, Funny, Love & Relationships) can have
-- some free questions (is_premium = false) and some purchasable
-- questions (is_premium = true).
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

ALTER TABLE questions
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;
