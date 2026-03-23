-- Non-host presses "Next" when Oops would open locally; host sees OutOfQuestions modal.
ALTER TABLE game_rooms
  ADD COLUMN IF NOT EXISTS deck_oops_pending boolean NOT NULL DEFAULT false;
