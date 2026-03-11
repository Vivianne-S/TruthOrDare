# Game Flow

## Overview

The game screen shows the current player, TRUTH and DARE buttons, and a question card. Players take turns; each turn they choose Truth or Dare to reveal a question from a **shuffled pool**. Questions are drawn without repeats; when the player picks from an empty pool, the game ends and the **Game Over** screen appears.

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

## Adding Players Mid-Game

1. Door icon → Exit menu → **Add more players**.
2. Navigate to `/add-players?addMore=true`.
3. `usePlayerSetup(getGamePlayers())` pre-loads current players.
4. User adds players, taps **Back to game**.
5. `setGamePlayers(players)` → `router.replace("/game")`.
6. Turn index and stats reset; pools unchanged.
