# Game Flow

## Overview

The game screen shows the current player, TRUTH and DARE buttons, and a question card. Players take turns; each turn they choose Truth or Dare to reveal a random question.

---

## Game Session State

**File:** `services/game-session.ts`

| Data | Description |
|------|-------------|
| `gamePlayers` | List of players |
| `currentPlayerIndex` | Index of current turn |
| `selectedCategoryId` | Active category ID |
| `selectedCategoryName` | Category display name |
| `gameQuestions` | Questions for the category |

### Key Functions

- `setGamePlayers(players)` – Set players, reset turn to 0
- `getCurrentPlayer()` – Current player
- `moveToNextPlayer()` – Advance turn (wraps around)
- `setGameCategory(id, name, questions)` – Set category and questions
- `getRandomQuestionByType("truth" \| "dare")` – Random question

---

## Hook: useGameSession

**File:** `hooks/use-game-session.ts`

Exposes:

| Property | Type | Description |
|----------|------|-------------|
| `currentPlayer` | `Player \| null` | Current turn |
| `hasPlayers` | `boolean` | At least one player |
| `nextPlayer` | `() => void` | Advance to next player |
| `currentQuestion` | `Question \| null` | Shown question |
| `categoryName` | `string \| null` | Category name |
| `showTruth` | `() => void` | Pick random Truth question |
| `showDare` | `() => void` | Pick random Dare question |

---

## Turn Flow

1. Screen shows current player and avatar.
2. Player taps **TRUTH** or **DARE**.
3. Random question appears (from `gameQuestions`).
4. Optional: tap speaker icon for TTS.
5. Player taps **Next player** to advance.
6. Repeat from step 1.

---

## Starting a Game

1. **Add players** (`add-players.tsx`): `setGamePlayers(players)` → navigate to categories.
2. **Categories** (`categories.tsx`): Fetch questions → `setGameCategory(...)` → navigate to game.
3. **Game** (`game.tsx`): Uses `useGameSession()` to read state.

---

## Adding Players Mid-Game

1. Door icon → Exit menu → **Add more players**.
2. Navigate to `/add-players?addMore=true`.
3. `usePlayerSetup(getGamePlayers())` pre-loads current players.
4. User adds players, taps **Back to game**.
5. `setGamePlayers(players)` → `router.replace("/game")`.
6. Turn index resets to 0.
