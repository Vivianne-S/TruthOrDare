#!/usr/bin/env node
/**
 * Updates question_text_sv in Supabase from questions_sv_import.csv.
 * Requires: EXPO_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY
 * or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.
 *
 * Run: node scripts/update-questions-sv.js
 */
const path = require('path');
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch {
  /* dotenv optional */
}
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
// Service role key bypasses RLS and is preferred for bulk updates.
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    "Missing EXPO_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env"
  );
  process.exit(1);
}

const supabase = createClient(url, key);

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      values.push(current.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
      current = '';
    } else {
      current += c;
    }
  }
  values.push(current.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
  return values;
}

function parseCSV(content) {
  const lines = content.split('\n').filter((l) => l.trim());
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? '';
    });
    rows.push(row);
  }
  return rows;
}

async function main() {
  const csvPath = path.join(__dirname, 'questions_sv_import.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);

  let updated = 0;
  let errors = 0;

  for (const row of rows) {
    const { data, error } = await supabase
      .from('questions')
      .update({ question_text_sv: row.question_text_sv })
      .eq('category_id', row.category_id)
      .eq('type', row.type)
      .eq('question_text', row.question_text)
      .select('id');

    if (error) {
      console.error(`Failed for ${row.question_text?.slice(0, 40)}...:`, error.message);
      errors++;
    } else if (data && data.length > 0) {
      updated++;
    } else {
      console.warn(`No match: ${row.question_text?.slice(0, 50)}...`);
    }
  }

  console.log(`Done: ${updated} updated, ${errors} errors.`);
}

main().catch(console.error);
