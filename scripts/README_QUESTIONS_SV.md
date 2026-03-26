# Import Swedish Translations to Supabase

`questions_sv_import.csv` contains all translated Swedish question texts in `question_text_sv`.

## Import options

### Option 1: Supabase SQL Editor (recommended)

1. Open Supabase Dashboard -> SQL Editor.
2. Run SQL that stages CSV data and updates `questions.question_text_sv`.

```sql
-- Create or load a temporary table from CSV rows.
-- Then update question_text_sv by matching category/type/question_text.
UPDATE questions q
SET question_text_sv = t.question_text_sv
FROM (
  -- Paste CSV rows here as VALUES
  -- Format: (category_id, type, question_text, question_text_sv)
) AS t(category_id, type, question_text, question_text_sv)
WHERE q.category_id = t.category_id
  AND q.type = t.type
  AND q.question_text = t.question_text;
```

### Option 2: Manual update in Table Editor

1. Open Supabase -> Table Editor -> `questions`.
2. Paste Swedish text into `question_text_sv` row-by-row.
3. Use CSV `question_text` values to find matching rows.

### Option 3: Node.js bulk script

Run the included script:

```bash
cd scripts
node update-questions-sv.js
```

Required env vars in `.env`:

- `EXPO_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (recommended for bulk updates), or
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` (fallback if your policies allow updates)

## CSV format

| Column | Description |
|--------|-------------|
| category_id | Category UUID |
| type | `truth` or `dare` |
| question_text | English source text (matching key) |
| question_text_sv | Swedish translation |
