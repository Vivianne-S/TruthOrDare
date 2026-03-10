# Truth Or Dare – Documentation

## Overview

Truth Or Dare is a React Native (Expo) party game app. Players add their names and avatars, choose a category, and take turns answering Truth or Dare questions. The app supports free and premium categories, with in-app purchases simulated via a demo store.

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, folder structure, dependencies |
| [NAVIGATION.md](./NAVIGATION.md) | Screens, routing, and flow between screens |
| [GAME_FLOW.md](./GAME_FLOW.md) | Game session, shuffled pools, player turns, game end |
| [GAME_OVER.md](./GAME_OVER.md) | Game Over screen, awards, Play Again |
| [EXIT_MENU.md](./EXIT_MENU.md) | Exit menu modal and all button flows |
| [SHOP.md](./SHOP.md) | Shop, demo purchases, premium categories |
| [DATA.md](./DATA.md) | Data layer, Supabase, types |
| [THEME.md](./THEME.md) | Design system, colors, typography |
| [HOOKS.md](./HOOKS.md) | Custom hooks reference |

---

## Quick Start

```bash
npm install
npx expo start
```

Requires environment variables for Supabase:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## User Flow Summary

1. **Splash** → Logo for 2 seconds
2. **How to Play** → Rules and tap to continue
3. **Add Players** → Add names, pick avatars, add more players
4. **Categories** → Choose category (free or premium)
5. **Game** → Play Truth or Dare, next player, end round options
6. **Game Over** → When question pools are empty: awards, Play Again, New Game, Exit

---

## Key Features

- **Player setup**: Add players with names and avatars.
- **Category selection**: Free and premium categories from Supabase.
- **Truth or Dare**: Shuffled question pools per session; no repeats until pools exhausted.
- **Game end**: Finite question list; Game Over screen when pools empty.
- **Awards**: Dare Devil, Truthful Angel, Challenge Master (computed automatically).
- **Play Again**: Same category, new shuffle, same players.
- **Text-to-speech**: Optional speech for questions.
- **Add more players**: Add players mid-game.
- **End round options**: Back to categories, add players, or exit app.
