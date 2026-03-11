# Game Over Screen

## Overview

The Game Over screen appears when all questions in a pool are exhausted (player picks Truth or Dare and that pool is empty). It shows awards and action buttons.

**Component:** `components/ui/GameOverScreen/`

---

## Layout

- **Title:** "GAME OVER" (neon style)
- **Player avatars:** Up to 3, with neon outlines
- **Awards section:**
  - Dare Devil: [player with max dareCount]
  - Truthful Angel: [player with max truthCount]
  - Best of Both Worlds: [player with most combined truths+dares among those who did both; empty if no one mixed]
- **Buttons:**
  - **Play Again** – Same category, new shuffle, same players
  - **New Game** – Navigate to add-players (edit players, then select category)
  - **Exit** – Navigate to home

---

## Awards Logic

**File:** `utils/game-awards.ts`

| Award | Rule |
|-------|------|
| Dare Devil | Player with highest dareCount |
| Truthful Angel | Player with highest truthCount |
| Best of Both Worlds | Only players who did both truths AND dares; highest total among those. Empty if no one mixed. |

Ties: first player with max count wins.

---

## Play Again Flow

1. User taps **Play Again**.
2. `restartGameSession()` called (from `useGameSession`).
3. `restartGame()` in game-session: re-shuffles truth/dare pools from `gameQuestions`, resets `currentPlayerIndex` and `playerStats`.
4. Hook sets `isGameOver = false`, resets local state.
5. Game screen re-renders `GameView` (normal game UI).

---

## New Game / Exit

- **New Game:** `router.replace("/add-players?newGame=true")` – edit players, then select category
- **Exit:** `router.replace("/")`

---

## File Structure

```
components/ui/GameOverScreen/
  index.tsx   # Main component
  styles.ts   # StyleSheet
```
