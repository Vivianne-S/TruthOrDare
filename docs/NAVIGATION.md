# Navigation

## Routes

| Route | File | Description |
|-------|------|--------------|
| `/` | `app/index.tsx` | Splash screen |
| `/how-to-play` | `app/how-to-play.tsx` | Game rules |
| `/add-players` | `app/add-players.tsx` | Add players and avatars |
| `/categories` | `app/categories.tsx` | Choose category |
| `/shop` | `app/shop.tsx` | Demo purchases |
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
add-players
    │ "Select category" (or "Back to game" in add-more mode)
    ▼
categories ◄──────────────────┐
    │                         │ "Back" from header
    │ "Start Game"            │
    ▼                         │
game ◄────────────────────────┤ "Play Again" (Game Over)
    │                         │ "Back to categories"
    ├─ "Add more players" ───► add-players?addMore=true
    │       │                         │ "Back to game"
    │       └────────────────────────┘
    │
    ├─ Pools exhausted ──► Game Over screen
    │       ├─ "Play Again" ──► stay on game (new shuffle)
    │       ├─ "New Game" ──► add-players?newGame=true
    │       └─ "Exit" ──► index
    │
    └─ "Exit Game" ──► ExitConfirmModal ──► Yes ──► index
```

---

## Navigation Methods

- **`router.replace(path)`** – Replace current screen (no back stack)
- **`router.push(path)`** – Push new screen (can go back)
- **`router.back()`** – Go back one screen

### Usage

- Splash → How-to-play: `replace` (no return)
- Add-players → Categories: `replace`
- Categories → Game: `replace`
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
| `/add-players` | `newGame=true` | Pre-load current players (from Game Over), show "Select category" |

Example: `router.push("/add-players?addMore=true")`  
Example: `router.replace("/add-players?newGame=true")` (from Game Over)
