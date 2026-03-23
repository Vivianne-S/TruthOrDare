-- Sync host pause/exit menu so non-host clients can show "Host is in the menu" overlay.
ALTER TABLE game_rooms
  ADD COLUMN IF NOT EXISTS host_in_exit_menu boolean NOT NULL DEFAULT false;
