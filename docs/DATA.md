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
| created_at | timestamp | Ordering |

---

## Services

### categories.ts

- **`getCategories()`** – Fetches all categories ordered by `sort_order`
- **`getQuestionsByCategory(categoryId)`** – Fetches questions for a category

### game-session.ts

In-memory state (not persisted):

- Players, current turn index, category, questions
- See [GAME_FLOW.md](./GAME_FLOW.md)

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

---

## Local Storage (AsyncStorage)

**Demo purchases only** (`hooks/use-demo-purchases.ts`):

- Pro purchase status
- Unlocked category IDs

Keys are internal to the hook; no direct schema documented here.
