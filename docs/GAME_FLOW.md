# Game Flow

## Overview

The game screen shows the current player, TRUTH and DARE buttons, and a question card. Players take turns; each turn they choose Truth or Dare to reveal a question from a **shuffled pool**. Questions are drawn without repeats; when the player picks from an empty pool, the game ends and the **Game Over** screen appears.

Multiplayer uses the same UI, but the game state (turn, pools, current question) is synchronized via Supabase room tables.

---

## Shuffled Question Pools

**File:** `services/game-session.ts`

Each game session gets a fresh shuffle of truths and dares:

- **truthPool** – Shuffled truth questions (draw from front)
- **darePool** – Shuffled dare questions (draw from front)
- **gameQuestions** – Original list (kept for Play Again)

**Utils:** `utils/shuffle.ts` – Fisher-Yates shuffle

---

## Game Session State

| Data | Description |
|------|-------------|
| gamePlayers | List of players |
| currentPlayerIndex | Index of current turn |
| selectedCategoryId / selectedCategoryName | Active category |
| gameQuestions | Original questions (for restart) |
| truthPool / darePool | Shuffled, draw from front |
| playerStats | Per-player truth/dare counts (for awards) |

---

## Key Functions (game-session.ts)

| Function | Description |
|----------|-------------|
| setGamePlayers(players) | Set players, reset turn and stats |
| setGameCategory(id, name, questions) | Split by type, shuffle, store pools |
| drawNextQuestionByType(type) | Pop from pool; returns null if empty |
| recordQuestionForPlayer(playerId, type) | Increment stats for awards |
| getPlayerStats() | Stats for Game Over |
| restartGame() | Re-shuffle pools, reset turn and stats |

---

## Hook: useGameSession

**File:** `hooks/use-game-session.ts`

| Property | Type | Description |
|----------|------|-------------|
| currentPlayer | Player \| null | Current turn |
| hasPlayers | boolean | At least one player |
| nextPlayer | () => void | Advance turn |
| currentQuestion | Question \| null | Shown question |
| categoryName | string \| null | Category name |
| isGameOver | boolean | Pools exhausted |
| awards | GameAwards | Dare Devil, Truthful Angel, Best of Both Worlds |
| restartGameSession | () => void | Play Again |
| showTruth | () => void | Draw next truth |
| showDare | () => void | Draw next dare |

---

## Turn Flow

1. Screen shows current player and avatar.
2. Player taps **TRUTH** or **DARE**.
3. `drawNextQuestionByType` pops from pool.
4. If pool empty → `isGameOver = true`, compute awards, show Game Over.
5. Else → show question, record stats, optional TTS.
6. Player taps **Next player** to advance.
7. Repeat from step 1.

---

## Game Over

When `drawNextQuestionByType` returns `null` (pool empty):

- `isGameOver` set to true
- Awards computed via `utils/game-awards.ts`
- Game screen renders `GameOverScreen` instead of `GameView`

See [GAME_OVER.md](./GAME_OVER.md).

---

## Starting a Game

1. **Add players** (`add-players.tsx`): `setGamePlayers(players)` → navigate to categories.
2. **Categories** (`categories.tsx`): Fetch questions → `setGameCategory(...)` → shuffle and store pools → navigate to game.
3. **Game** (`game.tsx`): Uses `useGameSession()` to read state.

---

## Multiplayer Flow (Supabase rooms)

### Lobby → Start

1. **Host creates room** (`create-game.tsx`) → `createGameRoom`.
2. **Players join** (`join-game.tsx`) → `joinGameRoom`.
3. **Lobby** (`game-lobby.tsx`) subscribes to `game_rooms` + `game_room_players`.
4. **Host selects category** (`categories.tsx?roomId=...`) and calls `startGameInRoom`, which writes:
   - `game_questions`, `truth_pool`, `dare_pool`, `current_player_index = 0`
   - `status = "playing"`
5. Lobby sees `status="playing"` and navigates everyone to `/game?roomId=...`.

### Turn rules

- Only the **current player** (`current_player_index`) can:
  - choose TRUTH/DARE (`chooseTruthOrDareInRoom`)
  - advance turn (`nextPlayerInRoom`)
- Everyone else is read-only and sees realtime updates.

### Out of questions + “Buy more”

When one pool is empty **after a question is drawn**, `endAfterThisTurn` becomes true:

- **Host** sees `OutOfQuestionsModal` and can:
  - **Buy more** → `/shop?fromOutOfQuestions=true&categoryId=...&roomId=...`
  - **Finish** → ends room (`status="game_over"`)
- **Non-host players** see `OutOfQuestionsHostOverlay` (“Host is in the menu…”).

After the host unlocks extra questions, `useMultiplayerGame.refreshAfterPremiumPurchase` appends newly unlocked questions into the room pools via `addQuestionsToRoomPools`, and the game resumes for everyone automatically through realtime updates.

---

## Adding Players Mid-Game

1. Door icon → Exit menu → **Add more players**.
2. Local game: `/add-players?addMore=true&localGame=1` (multiplayer: `addMore=true` only).
3. `usePlayerSetup(getGamePlayers())` pre-loads current players.
4. User adds players, taps **Back to game**.
5. **Local:** `setGamePlayersAfterEditInGame(players)` reshuffles truth/dare pools from `gameQuestions` and sets a pending flag; `router.replace("/game")`.
6. `useGameSession` consumes the flag on **focus** and syncs React state (same `Game` instance often stays mounted under the stack).
