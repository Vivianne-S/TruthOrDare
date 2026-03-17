-- ============================================================
-- Add current_question and current_choice for multiplayer game sync
-- Run in Supabase SQL Editor
-- ============================================================

-- Add columns for syncing current turn state across devices
ALTER TABLE game_rooms ADD COLUMN current_question JSONB DEFAULT NULL;
ALTER TABLE game_rooms ADD COLUMN current_choice TEXT DEFAULT NULL;
