# Architecture

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Expo** (v54) | React Native framework |
| **expo-router** | File-based routing |
| **React** 19 | UI library |
| **TypeScript** | Type safety |
| **Supabase** | Backend (categories, questions) |
| **AsyncStorage** | Local storage (demo purchases) |
| **expo-speech** | Text-to-speech for questions |
| **expo-blur** | Blur effects on buttons |
| **@shopify/react-native-skia** | Canvas/neon effects on TRUTH/DARE buttons |
| **react-native-reanimated** | Animations |

---

## Folder Structure

```
TruthOrDare/
├── app/                    # Screens (file-based routing)
│   ├── _layout.tsx         # Root layout, Stack navigator
│   ├── index.tsx           # Splash screen
│   ├── how-to-play.tsx     # Rules screen
│   ├── add-players.tsx     # Player setup
│   ├── categories.tsx     # Category selection
│   ├── shop.tsx            # In-app purchases (demo)
│   ├── game.tsx            # Game orchestrator (local + multiplayer)
│   ├── game-mode-select.tsx # Choose Local / Join / Create
│   ├── create-game.tsx     # Multiplayer: create room (host)
│   ├── join-game.tsx       # Multiplayer: join room
│   └── game-lobby.tsx      # Multiplayer: lobby + start flow
├── components/
│   ├── game/               # Game-specific components
│   │   ├── GameView.tsx    # Main game UI (avatar, TRUTH/DARE, question)
│   │   └── GameView.styles.ts
│   └── ui/                 # Reusable UI components
│       ├── AppButton.tsx
│       ├── CategoryBubbleButton.tsx
│       ├── ExitConfirmModal.tsx
│       ├── ExitMenuModal.tsx
│       ├── OutOfQuestionsModal.tsx
│       ├── OutOfQuestionsHostOverlay.tsx
│       └── GameOverScreen/
│           ├── index.tsx   # Game Over screen
│           └── styles.ts
├── constants/
│   ├── avatars.ts          # Avatar image sources
│   ├── category-bubbles.ts # Bubble layout slots
│   ├── shop.ts             # Shop prices
│   └── theme/              # Design tokens
│       ├── colors.ts
│       ├── primitives.ts
│       ├── spacing.ts
│       └── typography/
├── hooks/                  # Custom React hooks
│   ├── use-avatar-page-reset.ts
│   ├── use-categories.ts
│   ├── use-categories-lock-message.ts
│   ├── use-demo-purchases.ts
│   ├── use-game-session.ts
│   ├── use-multiplayer-game.ts
│   ├── use-player-setup.ts
│   ├── use-pulse-animation.ts
│   ├── use-question-speech.ts
│   └── use-shop-categories.ts
├── lib/
│   └── supabase.ts         # Supabase client
├── services/
│   ├── categories.ts       # Category/question fetching
│   ├── game-room.ts        # Multiplayer room + realtime sync (Supabase)
│   ├── game-session.ts     # In-memory game state, shuffled pools
│   └── player-service.ts   # Player CRUD helpers
├── types/
│   ├── category.ts
│   ├── game.ts             # GameAwards, PlayerStats
│   └── player.ts
├── utils/
│   ├── shuffle.ts          # Fisher-Yates shuffle
│   └── game-awards.ts      # computeAwards for Game Over
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
- `usePlayerSetup` → add-players
- `useCategories` → categories
- `useDemoPurchases` → shop, categories

### Services for data

- `categories.ts` → Supabase (categories, questions)
- `game-session.ts` → in-memory game state, shuffled pools
- `player-service.ts` → player list helpers

### Utils for shared logic

- `utils/shuffle.ts` → Fisher-Yates shuffle (used by game-session)
- `utils/game-awards.ts` → computeAwards for Game Over
