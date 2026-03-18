# Data Layer

## Supabase

**File:** `lib/supabase.ts`

**Environment variables:**

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## Tables

### categories

| Column | Type | Description |
|--------|------|-------------|
| id | string | UUID |
| name | string | Display name |
| icon | string \| null | Icon identifier |
| is_premium | boolean | Locked behind IAP |
| sort_order | number \| null | Display order |

### questions

| Column | Type | Description |
|--------|------|-------------|
| category_id | string | FK to categories |
| type | string | "truth" or "dare" |
| question_text | string | Question content |
| question_text_sv | string \| null | Swedish version (optional) |
| created_at | timestamp | Ordering |

---

### game_rooms (multiplayer)

Room-level game state for multiplayer.

| Column | Type | Description |
|--------|------|-------------|
| id | string | UUID |
| code | string | 6-char join code |
| host_user_id | string | Supabase user id of host |
| status | string | "lobby" \| "playing" \| "game_over" |
| category_id | string \| null | Selected category |
| category_name | string \| null | Selected category name |
| game_questions | json | Full question list used in this room |
| truth_pool | json | Remaining truth questions (queue) |
| dare_pool | json | Remaining dare questions (queue) |
| current_player_index | number | Turn pointer into players list |
| current_question | json \| null | Current drawn question (object) |
| current_choice | string \| null | "truth" \| "dare" |
| player_stats | json | Per-player counts (truthCount/dareCount) |
| created_at | timestamp | Created timestamp |

Notes:
- Some columns (e.g. `current_question`, `current_choice`) may be added after initial migration. The TypeScript type is the source of truth for runtime usage: `services/game-room.ts:GameRoom`.

### game_room_players (multiplayer)

Players connected to a room.

| Column | Type | Description |
|--------|------|-------------|
| id | string | UUID (used as Player.id in multiplayer) |
| room_id | string | FK to game_rooms |
| user_id | string | Supabase user id for this device |
| name | string | Display name |
| avatar_id | number | Avatar index |
| joined_at | timestamp | Join timestamp |

---

## Services

### categories.ts

- **`getCategories()`** – Fetches all categories ordered by `sort_order`
- **`getQuestionsByCategory(categoryId)`** – Fetches questions for a category

### game-session.ts

In-memory state (not persisted):

- Players, current turn index, category
- Shuffled truth/dare pools (draw without repeats)
- Player stats (truthCount, dareCount) for awards
- See [GAME_FLOW.md](./GAME_FLOW.md), [GAME_OVER.md](./GAME_OVER.md)

---

## Types

### Player (`types/player.ts`)

```ts
type Player = {
  id: string;
  name: string;
  avatarId: number;  // Index into AVATARS
};
```

- `UNSELECTED_AVATAR = -1`
- `MIN_PLAYERS = 2`

### Category (`types/category.ts`)

```ts
type Category = {
  id: string;
  name: string;
  icon: string | null;
  is_premium: boolean;
  sort_order?: number | null;
};
```

### Question (`types/category.ts`)

```ts
type Question = {
  type: string;       // "truth" | "dare"
  question_text: string;
};
```

### CategoryBubble

Extended category for UI with `slot` and `isLocked`.

### Game types (`types/game.ts`)

```ts
type PlayerStats = {
  truthCount: number;
  dareCount: number;
};

type GameAwards = {
  mostDaring: Player | null;   // Dare Devil
  truthfulAngel: Player | null; // Truthful Angel
  superstar: Player | null;     // Best of Both Worlds
};
```

---

## Local Storage (AsyncStorage)

**Demo purchases only** (`hooks/use-demo-purchases.ts`):

- Pro purchase status
- Unlocked category IDs

Keys are internal to the hook; no direct schema documented here.

---

## Multiplayer services

### game-room.ts

Supabase-backed multiplayer room API + game mutations:

- **Room lifecycle**
  - `createGameRoom(hostName, hostAvatarId)`
  - `joinGameRoom(code, playerName, avatarId)`
  - `getRoomById(roomId)`
  - `getRoomPlayers(roomId)`
  - `subscribeToRoom(roomId, onRoom, onPlayers)`
- **Start**
  - `startGameInRoom(roomId, categoryId, categoryName, questions)`
- **Gameplay mutations**
  - `chooseTruthOrDareInRoom(roomId, "truth" | "dare")`
  - `nextPlayerInRoom(roomId)`
  - `endGameInRoom(roomId)`
- **Host-only “buy more questions” sync**
  - `addQuestionsToRoomPools(roomId, questions)` appends newly unlocked questions to `truth_pool`/`dare_pool` so everyone resumes via realtime.
