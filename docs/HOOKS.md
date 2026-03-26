# Hooks Reference

## Overview

Custom hooks hold most screen-level state and side effects.

---

## useGameSession

**File:** `hooks/use-game-session.ts`  
**Used by:** `app/game.tsx` (local mode)

Local in-memory game session hook using `services/game-session.ts`.

| Return | Type | Description |
|--------|------|-------------|
| players | Player[] | All players |
| currentPlayer | Player \| null | Current turn |
| hasPlayers | boolean | At least one player |
| nextPlayer | () => void | Advance turn |
| currentQuestion | Question \| null | Current card |
| categoryName | string \| null | Selected category name |
| categoryId | string \| null | Selected category id |
| endAfterThisTurn | boolean | Low-deck state for Out-of-Questions flow |
| isGameOver | boolean | Session ended |
| awards | GameAwards | Computed awards |
| restartGameSession | () => void | Play Again (re-shuffle) |
| showTruth | () => void | Draw truth |
| showDare | () => void | Draw dare |
| refreshAfterPremiumPurchase | (categoryId) => Promise<void> | Appends newly unlocked questions |
| truthsLeft / daresLeft | number | Remaining pool sizes |
| continueWithRemainingPool | () => void | Continue after partial-deck warning |
| forceEndGame | () => void | End local game immediately |

---

## useMultiplayerGame

**File:** `hooks/use-multiplayer-game.ts`  
**Used by:** `app/game.tsx` (multiplayer mode)

Supabase-backed multiplayer session hook.

| Return | Type | Description |
|--------|------|-------------|
| players | Player[] | Room players in join order |
| currentPlayer | Player \| null | Active turn |
| hasPlayers | boolean | At least one player |
| nextPlayer | () => Promise<void> | Advance turn (current player only) |
| currentQuestion | Question \| null | Room question |
| categoryName / categoryId | string \| null | Room category |
| isGameOver | boolean | `game_rooms.status === "game_over"` |
| endAfterThisTurn | boolean | Oops/end state derived from pools and question state |
| awards | GameAwards | Computed from room `player_stats` |
| isHost | boolean | Current user is room host |
| deckOopsPending | boolean | Host should open Out-of-Questions modal |
| hostInExitMenu | boolean | Host is in exit menu state |
| guestHostOverlayVisible | boolean | Guest waiting overlay state |
| notifyHostAway | (away) => Promise<void> | Host sync for exit-menu state |
| isMyTurn | boolean | Current user turn check |
| loading | boolean | Initial room load |
| showTruth / showDare | () => Promise<void> | Turn actions |
| restartGameSession | () => void | No-op placeholder for shared screen props |
| refreshAfterPremiumPurchase | (categoryId) => Promise<void> | Host appends unlocked questions to room pools |
| truthsLeft / daresLeft | number | Remaining pool sizes |

---

## usePlayerSetup

**File:** `hooks/use-player-setup.ts`  
**Used by:** `app/add-players.tsx`

Manages add/remove/edit player state and avatar picker state.

---

## useCategories

**File:** `hooks/use-categories.ts`  
**Used by:** `app/categories.tsx`, `hooks/use-shop-categories.ts`

Fetches categories and caches per-category question fetches.

| Param | Type | Description |
|-------|------|-------------|
| isCategoryUnlocked | (id) => boolean | Optional unlock callback |
| isPremiumQuestionsUnlocked | (id) => boolean | Optional premium-question callback |

| Return | Type | Description |
|--------|------|-------------|
| categories | Category[] | Loaded categories |
| loading | boolean | Category fetch in progress |
| openCategoryId | string \| null | Currently expanded category |
| questionsByCategory | Record<string, { questions: Question[]; includePremium: boolean }> | Cached question payloads |
| questionsLoadingByCategory | Record<string, boolean> | Per-category loading map |
| handlePressCategory | (id) => Promise<void> | Select + optionally prefetch questions |
| getIncludePremium | (id) => boolean | Current includePremium rule for category |

Use callbacks from the same purchase hook instance used on the screen (currently `useRevenueCatPurchases`) so cache behavior stays consistent with entitlement refreshes.

---

## useRevenueCatPurchases

**File:** `hooks/use-revenuecat-purchases.ts`  
**Used by:** `app/shop.tsx`, `app/categories.tsx`

Production purchase state and purchase actions via RevenueCat.

| Return | Type | Description |
|--------|------|-------------|
| isPro | boolean | Pro entitlement active |
| loading | boolean | Initial status loading |
| isCategoryUnlocked | (id) => boolean | Category entitlement check |
| isPremiumQuestionsUnlocked | (id) => boolean | Premium-question entitlement check |
| refreshProStatus | () => Promise<void> | Refresh customer info + offerings |
| unlockPremium | () => Promise<boolean> | Buy Pro package |
| unlockCategory | (id) => Promise<boolean> | Buy category package |
| unlockPremiumQuestionsForCategory | (id) => Promise<boolean> | Buy premium-question package |
| resetPurchases | () => Promise<void> | Testing helper: logs in with a fresh test app user id |

---

## useDemoPurchases (legacy/testing)

**File:** `hooks/use-demo-purchases.ts`

AsyncStorage-based simulated purchases retained for development/testing flows. The current app screens use `useRevenueCatPurchases` for live purchase behavior.

---

## useShopCategories

**File:** `hooks/use-shop-categories.ts`  
**Used by:** `app/shop.tsx`

Builds shop-ready category lists:

- premium categories
- free categories with premium question packs

---

## useQuestionSpeech

**File:** `hooks/use-question-speech.ts`  
**Used by:** `components/game/GameView.tsx`

Text-to-speech helper around `expo-speech`.

---

## usePulseAnimation

**File:** `hooks/use-pulse-animation.ts`  
**Used by:** `components/game/GameView.tsx`, `app/how-to-play.tsx`

Reusable pulse animation style hook (`react-native-reanimated`).

---

## useAutoDeselectAfterDelay

**File:** `hooks/use-categories-lock-message.ts`  
**Used by:** `app/categories.tsx`

Auto-deselect helper for temporary lock message UX.

---

## useResetWhen

**File:** `hooks/use-avatar-page-reset.ts`  
**Used by:** avatar picker flow

Resets local state when a condition flips true.
