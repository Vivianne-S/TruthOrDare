-- Host tapped "Continue game" after one pool hit zero; hide that warning until both pools are empty.
ALTER TABLE game_rooms
  ADD COLUMN IF NOT EXISTS acknowledged_partial_deck BOOLEAN NOT NULL DEFAULT false;
