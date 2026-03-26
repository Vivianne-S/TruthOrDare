# Navigation

## Routes

| Route | File | Description |
|-------|------|--------------|
| `/` | `app/index.tsx` | Splash screen |
| `/how-to-play` | `app/how-to-play.tsx` | Game rules |
| `/game-mode-select` | `app/game-mode-select.tsx` | Choose Local / Join / Create |
| `/add-players` | `app/add-players.tsx` | Add players and avatars |
| `/create-game` | `app/create-game.tsx` | Multiplayer: host creates a room |
| `/join-game` | `app/join-game.tsx` | Multiplayer: join by room code |
| `/join/[code]` | `app/join/[code].tsx` | Deep-link join route (invite links) |
| `/game-lobby` | `app/game-lobby.tsx` | Multiplayer lobby |
| `/categories` | `app/categories.tsx` | Choose category |
| `/shop` | `app/shop.tsx` | RevenueCat purchases |
| `/game` | `app/game.tsx` | Main game |

---

## Flow Diagram

```
index (splash)
    │ 2 sec auto
    ▼
how-to-play
    │ tap anywhere
    ▼
game-mode-select
    ├─ Local ───────────────► add-players ─► categories ─► game
    │                                          │               │
    │                                          │               ├─ "Add more players" (local)
    │                                          │               │    └─► add-players?addMore=true&localGame=1
    │                                          │               └─ Pools exhausted ─► Game Over
    │                                          │                                   ├─ Play Again (local only)
    │                                          │                                   ├─ New Game (local only)
    │                                          │                                   └─ Exit
    │
    ├─ Join ────────────────► join-game ─► game-lobby ─► game
    │
    ├─ Deep link ───────────► join/[code] ─► join-game (prefilled code)
    │
    └─ Create ──────────────► create-game ─► game-lobby ─► categories (host) ─► game
```

---

## Navigation Methods

- **`router.replace(path)`** – Replace current screen (no back stack)
- **`router.push(path)`** – Push new screen (can go back)
- **`router.back()`** – Go back one screen

### Usage

- Splash → How-to-play: `replace` (no return)
- How-to-play → Game mode select: `replace`
- Local add-players → Categories: `replace`
- Categories → Game: `replace` (local and multiplayer)
- Game → Add-players (add more): `push` (so user can go back)
- Add-players (add more) → Game: `replace`
- Categories → Shop: `push` (back returns to categories)
- Game Over → New Game: `replace` to add-players?newGame=true (edit players, then select category)
- Game Over → Exit: `replace` to index
- Exit Game → Index: `replace`

---

## Query Parameters

| Route | Param | Purpose |
|-------|-------|---------|
| `/add-players` | `addMore=true` | Pre-load current players, show "Back to game" |
| `/add-players` | `localGame=1` | With `addMore`: local only — reshuffle pools + UI sync on return to `/game` |
| `/add-players` | `newGame=true` | Pre-load current players (from Game Over), show "Select category" |
| `/categories` | `roomId=<uuid>` | Multiplayer: host selects category for the room |
| `/game` | `roomId=<uuid>` | Multiplayer: game screen uses room state |
| `/game-lobby` | `roomId=<uuid>` | Multiplayer: subscribe to room + players |
| `/game-lobby` | `isHost=true\|false` | Multiplayer: lobby host controls start |
| `/join-game` | `code=<ABC123>` | Prefill room code (used by deep-link redirect) |
| `/shop` | `fromOutOfQuestions=true` | Opened from “Buy more” flow |
| `/shop` | `categoryId=<id>` | Highlight the category’s extra questions package |
| `/shop` | `roomId=<uuid>` | Multiplayer: return to the same room after purchase |

Example: `router.push("/add-players?addMore=true")`  
Example: `router.replace("/add-players?newGame=true")` (from Game Over)
