-- ============================================================
-- Multiplayer tables for Truth Or Dare
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Table: game_rooms
-- Stores room state: code, host, status, category, question pools
-- ============================================================
CREATE TABLE IF NOT EXISTS game_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  host_user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby', 'playing', 'game_over')),
  category_id TEXT,
  category_name TEXT,
  game_questions JSONB DEFAULT '[]',
  truth_pool JSONB DEFAULT '[]',
  dare_pool JSONB DEFAULT '[]',
  current_player_index INTEGER NOT NULL DEFAULT 0,
  player_stats JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by code (join flow)
CREATE INDEX IF NOT EXISTS idx_game_rooms_code ON game_rooms (code);

-- Index for host lookups
CREATE INDEX IF NOT EXISTS idx_game_rooms_host ON game_rooms (host_user_id);

-- ============================================================
-- Table: game_room_players
-- One row per player per room; each device adds themselves
-- ============================================================
CREATE TABLE IF NOT EXISTS game_room_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES game_rooms (id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  avatar_id INTEGER NOT NULL DEFAULT -1,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (room_id, user_id)
);

-- Index for fetching players by room
CREATE INDEX IF NOT EXISTS idx_game_room_players_room ON game_room_players (room_id);

-- Index for "my player" lookups
CREATE INDEX IF NOT EXISTS idx_game_room_players_user ON game_room_players (room_id, user_id);

-- ============================================================
-- Row Level Security (RLS)
-- Requires Supabase Anonymous Auth to be enabled
-- ============================================================

ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_room_players ENABLE ROW LEVEL SECURITY;

-- game_rooms: anyone can insert (host creates), anyone can read (by code)
CREATE POLICY "game_rooms_insert" ON game_rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "game_rooms_select" ON game_rooms
  FOR SELECT USING (true);

-- game_rooms: any authenticated user can update
-- Host starts game; current player submits truth/dare choice. App validates.
CREATE POLICY "game_rooms_update" ON game_rooms
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- game_room_players: anyone can insert (join room)
CREATE POLICY "game_room_players_insert" ON game_room_players
  FOR INSERT WITH CHECK (true);

-- game_room_players: anyone can read (see party list)
CREATE POLICY "game_room_players_select" ON game_room_players
  FOR SELECT USING (true);

-- game_room_players: users can only update their own row (name, avatar)
CREATE POLICY "game_room_players_update_own" ON game_room_players
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- Realtime
-- Enable Realtime for subscriptions (lobby + game sync)
-- Run these only once; skip if you get "already in publication" error
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE game_room_players;
