# Hooks Reference

## Overview

Custom hooks encapsulate screen logic and shared behavior.

---

## useGameSession

**File:** `hooks/use-game-session.ts`  
**Used by:** `app/game.tsx`

Manages game state from `game-session` service. Uses `drawNextQuestionByType` (no repeats); sets `isGameOver` when pool empty.

| Return | Type | Description |
|--------|------|-------------|
| players | Player[] | All players |
| currentPlayer | Player \| null | Current turn |
| hasPlayers | boolean | At least one player |
| nextPlayer | () => void | Advance turn |
| currentQuestion | Question \| null | Shown question |
| categoryName | string \| null | Category name |
| endAfterThisTurn | boolean | True when one pool is empty (Out of Questions after this turn) |
| isGameOver | boolean | Pools exhausted |
| awards | GameAwards | Dare Devil, Truthful Angel, Best of Both Worlds |
| restartGameSession | () => void | Play Again (re-shuffle) |
| showTruth | () => void | Draw next truth |
| showDare | () => void | Draw next dare |

---

## useMultiplayerGame

**File:** `hooks/use-multiplayer-game.ts`  
**Used by:** `app/game.tsx`

Multiplayer session hook backed by Supabase Realtime. Reads room state and players from `game_rooms` / `game_room_players`. Only the **current player** can choose Truth/Dare and advance the turn.

| Return | Type | Description |
|--------|------|-------------|
| players | Player[] | Players in join order |
| currentPlayer | Player \| null | Current turn (computed from `current_player_index`) |
| hasPlayers | boolean | At least one player |
| nextPlayer | () => Promise<void> | Advance turn (current player only) |
| currentQuestion | Question \| null | Current room question |
| categoryName | string \| null | Category name from room |
| categoryId | string \| null | Category id from room |
| isGameOver | boolean | Room status is `game_over` |
| endAfterThisTurn | boolean | True when one pool is empty after a question is drawn |
| isMyTurn | boolean | True when this device matches current player |
| isHost | boolean | True when this device matches `host_user_id` |
| loading | boolean | Initial room load in progress |
| showTruth | () => Promise<void> | Choose truth (current player only) |
| showDare | () => Promise<void> | Choose dare (current player only) |
| refreshAfterPremiumPurchase | (categoryId) => Promise<void> | Host-only: append newly unlocked questions to room pools |

Notes:
- `refreshAfterPremiumPurchase` is used to **sync “buy more questions”** in multiplayer by writing to `truth_pool` / `dare_pool` in `game_rooms`.

---

## usePlayerSetup

**File:** `hooks/use-player-setup.ts`  
**Used by:** `app/add-players.tsx`

Manages player list and avatar picker.

| Param | Type | Description |
|-------|------|-------------|
| initialPlayers | Player[] \| null | Optional pre-loaded players (add-more mode) |

| Return | Type | Description |
|--------|------|-------------|
| players | Player[] | Current list |
| addPlayer | () => void | Add empty player |
| updatePlayerName | (id, name) => void | Update name |
| removePlayer | (id) => void | Remove player |
| avatarPickerPlayerId | string \| null | Active picker |
| openAvatarPicker | (id) => void | Open picker |
| closeAvatarPicker | () => void | Close picker |
| selectAvatarForActivePlayer | (avatarId) => void | Select avatar |
| canStart | boolean | Valid to proceed |

---

## useCategories

**File:** `hooks/use-categories.ts`  
**Used by:** `app/categories.tsx`, `hooks/use-shop-categories.ts` (shop omits purchase args)

Fetches categories and caches questions per category.

| Param | Type | Description |
|-------|------|-------------|
| isCategoryUnlocked | (id) => boolean | Optional; default always false |
| isPremiumQuestionsUnlocked | (id) => boolean | Optional; default always false |

Pass the callbacks from the same `useDemoPurchases()` instance as the categories screen so dev reset and `refreshProStatus` stay aligned with `questionsByCategory`.

| Return | Type | Description |
|--------|------|-------------|
| categories | Category[] | All categories |
| loading | boolean | Fetch in progress |
| questionsByCategory | Record<string, Question[]> | Cached questions |
| handlePressCategory | (id) => void | Pre-load questions on select |

---

## useDemoPurchases

**File:** `hooks/use-demo-purchases.ts`  
**Used by:** `app/shop.tsx`, `app/categories.tsx`

Simulates in-app purchases with AsyncStorage.

| Return | Type | Description |
|--------|------|-------------|
| isPro | boolean | Pro purchased |
| isCategoryUnlocked | (id) => boolean | Category unlocked |
| unlockCategory | (id) => Promise | Purchase category |
| unlockPremium | () => Promise | Purchase Pro |
| resetPurchases | () => Promise | Reset (dev) |
| refreshProStatus | () => Promise | Reload from storage |
| loading | boolean | Operation in progress |

---

## useShopCategories

**File:** `hooks/use-shop-categories.ts`  
**Used by:** `app/shop.tsx`

Premium categories for the shop (filters `is_premium`).

---

## useQuestionSpeech

**File:** `hooks/use-question-speech.ts`  
**Used by:** `components/game/GameView.tsx`

Text-to-speech for questions via expo-speech.

| Param | Type | Description |
|-------|------|-------------|
| text | string \| null | Question text |
| enabled | boolean | TTS on/off |
| language | string | e.g. "en-US" |

| Return | Type | Description |
|--------|------|-------------|
| speak | () => void | Speak current text |

---

## usePulseAnimation

**File:** `hooks/use-pulse-animation.ts`  
**Used by:** `components/game/GameView.tsx`, `app/how-to-play.tsx`

Reanimated pulse animation.

| Param | Type | Description |
|-------|------|-------------|
| active | boolean | Whether to animate |
| options | { opacityRange, scaleRange } | Animation ranges |

| Return | AnimatedStyle | Apply to Animated.View |

---

## useAutoDeselectAfterDelay

**File:** `hooks/use-categories-lock-message.ts`  
**Used by:** `app/categories.tsx`

Auto-deselects a locked category after a delay.

---

## useResetWhen

**File:** `hooks/use-avatar-page-reset.ts`  
**Used by:** `app/add-players.tsx` (AvatarPickerModal)

Resets state when a condition becomes true (e.g. modal opens).
