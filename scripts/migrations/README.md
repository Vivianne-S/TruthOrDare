# Supabase Migrations

## How to run

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and choose your project.
2. Go to **SQL Editor**.
3. Open each migration file in order and run it.

## Requirement

- **Anonymous Auth** must be enabled: Authentication -> Providers -> Anonymous Sign-In -> Enable

## Migration order

### 001_create_multiplayer_tables.sql

Creates:

- `game_rooms`
- `game_room_players`
- indexes, RLS policies, and realtime publication entries

### 003_add_current_question_to_game_rooms.sql

Adds:

- `current_question` (`jsonb`)
- `current_choice` (`text`)

Used for synchronized active-card state in multiplayer.

### 004_add_is_premium_to_questions.sql

Adds:

- `questions.is_premium` (`boolean`)

Used to separate free vs purchasable premium question rows in starter categories.

### 005_add_acknowledged_partial_deck.sql

Adds:

- `game_rooms.acknowledged_partial_deck` (`boolean`)

Used when host continues play after one pool empties.

### 006_add_deck_oops_pending.sql

Adds:

- `game_rooms.deck_oops_pending` (`boolean`)

Used to signal that host should open the Out-of-Questions modal.

### 007_add_host_in_exit_menu.sql

Adds:

- `game_rooms.host_in_exit_menu` (`boolean`)

Used to show guests a "host is in menu" overlay.

### 008_add_host_exit_restart.sql

Adds:

- `game_rooms.host_exit_restart` (`boolean`)

Used so guests can reload cleanly when host exits the game.

## Realtime note

If you get `relation already in publication`, those realtime entries are already configured and can be skipped.
