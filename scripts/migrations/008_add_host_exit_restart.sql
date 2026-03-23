-- Set when host ends session via Exit game so guests can reload the app in sync.
ALTER TABLE game_rooms ADD COLUMN IF NOT EXISTS host_exit_restart boolean NOT NULL DEFAULT false;
