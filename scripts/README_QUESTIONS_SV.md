# Importera svenska översättningar till Supabase

Filen `questions_sv_import.csv` innehåller alla frågor med svenska översättningar i kolumnen `question_text_sv`.

## Så importerar du till Supabase

### Alternativ 1: Supabase SQL Editor (rekommenderat)

1. Öppna Supabase Dashboard → SQL Editor
2. Kör följande SQL för att skapa en temporär tabell och uppdatera:

```sql
-- Skapa temporär tabell från CSV-data (klistra in raderna från CSV)
-- Eller använd Supabase "Import CSV" om tillgängligt för att ladda upp till en temp-tabell

-- Uppdatera question_text_sv baserat på matchning
UPDATE questions q
SET question_text_sv = t.question_text_sv
FROM (
  -- Klistra in CSV-data här som VALUES
  -- Format: (category_id, type, question_text, question_text_sv)
) AS t(category_id, type, question_text, question_text_sv)
WHERE q.category_id = t.category_id 
  AND q.type = t.type 
  AND q.question_text = t.question_text;
```

### Alternativ 2: Manuell uppdatering i Table Editor

1. Öppna Supabase → Table Editor → questions
2. För varje rad: klistra in svenska översättningen i kolumnen `question_text_sv`
3. Använd CSV-filen som referens (sök på question_text för att hitta rätt rad)

### Alternativ 3: Node.js-script (för bulk-uppdatering)

Kör scriptet som läser CSV och uppdaterar via Supabase API:

```bash
cd scripts
node update-questions-sv.js
```

(Scriptet kräver att du har `EXPO_PUBLIC_SUPABASE_URL` och `EXPO_PUBLIC_SUPABASE_ANON_KEY` i .env)

## CSV-format

| Kolumn | Beskrivning |
|--------|-------------|
| category_id | UUID för kategorin |
| type | "truth" eller "dare" |
| question_text | Engelska frågetexten (för matchning) |
| question_text_sv | Svenska översättningen |
