# Supabase migrations

## Kör migration

1. Öppna [Supabase Dashboard](https://supabase.com/dashboard) och välj ditt projekt
2. Gå till **SQL Editor**
3. Öppna `001_create_multiplayer_tables.sql` och kopiera innehållet
4. Klicka **Run**

## Krav

- **Anonymous Auth** måste vara aktiverat: Authentication → Providers → Anonymous Sign-In → Enable

## Tabeller

- **game_rooms** – rum, kod, status, kategori, frågepools
- **game_room_players** – spelare per rum (namn, avatar)

## Migration 003 (multiplayer game sync)

Kör `003_add_current_question_to_game_rooms.sql` för att lägga till `current_question` och `current_choice` i game_rooms. Krävs för att alla spelare ska se samma fråga och endast den vars tur det är ska kunna välja.

## Migration 004 (premium questions)

Kör `004_add_is_premium_to_questions.sql` för att lägga till `is_premium` i questions. Används för att markera vilka frågor i gratis kategorier (Chaos, Funny, Love & Relationships) som kan köpas till som paket (10 truths + 10 dares per kategori).

## Realtime

Om du får fel "relation already in publication" när du kör Realtime-raderna, är tabellerna redan aktiverade. Du kan hoppa över dessa rader.
