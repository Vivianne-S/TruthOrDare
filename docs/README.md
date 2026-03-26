# Truth Or Dare - Documentation

## Overview

Truth Or Dare is an Expo + React Native party game. Players set up avatars, choose a category, and take turns answering Truth or Dare questions. The app supports local play and multiplayer rooms backed by Supabase Realtime.

Purchases are handled through RevenueCat (`react-native-purchases`) for:

- Premium categories
- Premium question packs for free starter categories
- Pro entitlement (global unlock)

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, folder structure, key patterns |
| [NAVIGATION.md](./NAVIGATION.md) | Screens, route map, and navigation behavior |
| [GAME_FLOW.md](./GAME_FLOW.md) | Local/multiplayer game session rules |
| [GAME_OVER.md](./GAME_OVER.md) | Awards and game-over actions |
| [EXIT_MENU.md](./EXIT_MENU.md) | Exit menu behavior in local and multiplayer |
| [SHOP.md](./SHOP.md) | RevenueCat purchase flows and shop UX |
| [DATA.md](./DATA.md) | Supabase schema, runtime data, TypeScript types |
| [THEME.md](./THEME.md) | Design system tokens and styling rules |
| [HOOKS.md](./HOOKS.md) | Custom hooks and returned APIs |

---

## Quick Start

```bash
npm install
npx expo start
```

Required environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

RevenueCat variables (at least one valid key):

- `EXPO_PUBLIC_RC_TEST_API_KEY` (test store)
- or `EXPO_PUBLIC_RC_IOS_API_KEY` and `EXPO_PUBLIC_RC_ANDROID_API_KEY`

---

## User Flow Summary

1. **Splash** -> Logo screen (2s)
2. **How to Play** -> Tap to continue
3. **Game Mode Select** -> Choose Local / Join / Create
4. **Local path** -> Add Players -> Categories -> Game
5. **Multiplayer path** -> Create/Join -> Lobby -> Categories (host) -> Game
6. **Game Over** -> Awards and end-of-session actions

---

## Key Features

- Local and multiplayer game sessions
- Supabase-backed categories and questions
- RevenueCat purchases with entitlement-based access checks
- No-repeat question pools during a session
- Optional text-to-speech for question prompts
- Mid-game player management for local sessions
- Award calculation (Dare Devil, Truthful Angel, Best of Both Worlds)
