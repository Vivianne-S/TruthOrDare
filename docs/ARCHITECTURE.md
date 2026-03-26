# Architecture

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Expo** (v54) | React Native framework |
| **expo-router** | File-based routing |
| **React** 19 | UI library |
| **TypeScript** | Type safety |
| **Supabase** | Backend (categories, questions) |
| **react-native-purchases (RevenueCat)** | In-app purchases and entitlements |
| **AsyncStorage** | Local persistence for locale and legacy demo purchase state |
| **expo-speech** | Text-to-speech for questions |
| **expo-blur** | Blur effects on buttons |
| **@shopify/react-native-skia** | Canvas/neon effects on TRUTH/DARE buttons |
| **react-native-reanimated** | Animations |

---

## Folder Structure

```
TruthOrDare/
├── app/                        # Screens (file-based routing)
│   ├── _layout.tsx             # Root layout + providers + route stack
│   ├── index.tsx               # Splash
│   ├── how-to-play.tsx
│   ├── game-mode-select.tsx
│   ├── add-players.tsx
│   ├── categories.tsx
│   ├── shop.tsx
│   ├── game.tsx
│   ├── create-game.tsx
│   ├── join-game.tsx
│   ├── join/[code].tsx         # Deep-link redirect to join-game
│   └── game-lobby.tsx
├── components/
│   ├── game/                   # Game-specific components
│   │   ├── GameView.tsx
│   │   └── GameView.styles.ts
│   └── ui/                     # Shared UI components/modals
│       ├── AppButton.tsx
│       ├── ...                 # Category bubbles, modals, overlays, language switcher
│       └── GameOverScreen/
│           ├── index.tsx
│           └── styles.ts
├── context/
│   └── I18nContext.tsx
├── i18n/
│   ├── index.ts
│   └── translations/
│       ├── en.json
│       └── sv.json
├── constants/
│   ├── avatars.ts
│   ├── category-bubbles.ts
│   ├── demo-purchases.ts
│   ├── revenuecat.ts
│   ├── shop.ts
│   └── theme/
├── hooks/                      # Screen logic
│   ├── use-avatar-page-reset.ts
│   ├── use-categories.ts
│   ├── use-categories-lock-message.ts
│   ├── use-demo-purchases.ts
│   ├── use-revenuecat-purchases.ts
│   ├── use-game-session.ts
│   ├── use-multiplayer-game.ts
│   ├── use-player-setup.ts
│   ├── use-pulse-animation.ts
│   ├── use-question-speech.ts
│   └── use-shop-categories.ts
├── lib/                        # Client initializers
│   ├── supabase.ts
│   ├── revenuecat.ts
│   └── reload-app.ts
├── services/                   # Domain/data services
│   ├── categories.ts
│   ├── game-room.ts
│   ├── game-session.ts
│   ├── player-service.ts
│   └── premium-questions-access.ts
├── types/
│   ├── category.ts
│   ├── game.ts
│   └── player.ts
├── utils/
│   ├── shuffle.ts
│   ├── game-awards.ts
│   └── room-code-from-scan.ts
├── assets/
│   └── images/
└── docs/
```

---

## Key Patterns

### In-memory game state

`services/game-session.ts` holds players, current turn, category, and shuffled truth/dare pools. Questions are drawn from pools (no repeats until exhausted). Game ends when a pool is empty. No persistence across app restarts.

---

## Multiplayer (Supabase-synced rooms)

Multiplayer is built on **Supabase Realtime + two tables** (`game_rooms`, `game_room_players`). The app keeps the same `GameView` UI but swaps the session hook based on whether a `roomId` exists.

### High-level flow

- **Create room (host)**: `app/create-game.tsx` → `services/game-room.ts:createGameRoom`
- **Join room**: `app/join-game.tsx` → `services/game-room.ts:joinGameRoom`
- **Lobby**: `app/game-lobby.tsx` subscribes to room/player updates; host navigates to category selection
- **Start game**: `app/categories.tsx` loads questions and calls `startGameInRoom` (writes pools into `game_rooms`)
- **Play**: `app/game.tsx` uses `useMultiplayerGame(roomId)` which listens to realtime changes and exposes `isMyTurn`

### Room state model

The room stores everything needed to sync gameplay across devices:

- **Turn**: `current_player_index`
- **Current question**: `current_question` + `current_choice`
- **Pools**: `truth_pool`, `dare_pool` (arrays of question objects)
- **Stats**: `player_stats` for Game Over awards

### Host-only actions

Some actions are restricted at the UI layer:

- **Starting the game** (category selection) is driven by the host from the lobby.
- **Buying more questions when a category runs out** is host-only.
  - After a non-host presses **Next** on a low deck, non-hosts see `OutOfQuestionsHostOverlay` (waiting for the host); only the host sees `OutOfQuestionsModal`.
  - When the host unlocks more questions, the room pools are appended via `addQuestionsToRoomPools`, which automatically resumes the game for everyone via realtime updates.

### File-based routing

Expo Router uses the `app/` directory. Each file maps to a route:

- `app/index.tsx` → `/`
- `app/add-players.tsx` → `/add-players`
- `app/game.tsx` → `/game`
- etc.

### Hooks for screen logic

Screens delegate logic to hooks:

- `useGameSession` → game screen
- `useMultiplayerGame` → multiplayer game screen sync
- `usePlayerSetup` → add-players
- `useCategories` → categories
- `useRevenueCatPurchases` → shop + entitlement checks

### Services for data

- `categories.ts` → Supabase (categories, questions)
- `game-session.ts` → in-memory game state, shuffled pools
- `game-room.ts` → multiplayer room lifecycle and turn mutations
- `premium-questions-access.ts` → premium question access checks (demo keys + RevenueCat)
- `player-service.ts` → player list helpers

### Utils for shared logic

- `utils/shuffle.ts` → Fisher-Yates shuffle (used by game-session)
- `utils/game-awards.ts` → computeAwards for Game Over
