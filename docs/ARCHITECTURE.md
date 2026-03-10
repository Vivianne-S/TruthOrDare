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
│   ├── add-players.tsx      # Player setup
│   ├── categories.tsx       # Category selection
│   ├── shop.tsx            # In-app purchases (demo)
│   └── game.tsx            # Main game screen
├── components/
│   └── ui/                 # Reusable UI components
│       ├── AppButton.tsx
│       ├── CategoryBubbleButton.tsx
│       ├── ExitConfirmModal.tsx
│       └── ExitMenuModal.tsx
├── constants/
│   ├── avatars.ts          # Avatar image sources
│   ├── category-bubbles.ts # Bubble layout slots
│   ├── shop.ts             # Shop prices
│   └── theme/              # Design tokens
│       ├── colors.ts
│       ├── primitives.ts
│       ├── spacing.ts
│       └── typography/
├── hooks/                   # Custom React hooks
│   ├── use-avatar-page-reset.ts
│   ├── use-categories.ts
│   ├── use-categories-lock-message.ts
│   ├── use-demo-purchases.ts
│   ├── use-game-session.ts
│   ├── use-player-setup.ts
│   ├── use-pulse-animation.ts
│   ├── use-question-speech.ts
│   └── use-shop-categories.ts
├── lib/
│   └── supabase.ts         # Supabase client
├── services/
│   ├── categories.ts       # Category/question fetching
│   ├── game-session.ts    # In-memory game state
│   └── player-service.ts  # Player CRUD helpers
├── types/
│   ├── category.ts
│   └── player.ts
├── assets/
│   └── images/
└── docs/
```

---

## Key Patterns

### In-memory game state

`services/game-session.ts` holds players, current turn, category, and questions in module-level variables. No persistence across app restarts.

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
- `game-session.ts` → in-memory game state
- `player-service.ts` → player list helpers
