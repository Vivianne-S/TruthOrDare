/**
 * i18n setup for Truth or Dare.
 * Uses expo-localization for device locale and i18n-js for translations.
 * Supported: en (English), sv (Swedish).
 */
import { I18n } from 'i18n-js';

import en from './translations/en.json';
import sv from './translations/sv.json';

const i18n = new I18n({ en, sv });

// Default to English; user can switch via LanguageSwitcher (persisted in AsyncStorage)
i18n.locale = 'en';
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export type Locale = 'en' | 'sv';

export function setLocale(newLocale: Locale) {
  i18n.locale = newLocale;
}

export function getLocale(): Locale {
  return (i18n.locale as Locale) ?? 'en';
}

export function t(key: string, options?: Record<string, string | number>) {
  return i18n.t(key, options);
}

export { i18n };

/** Maps normalized category names from DB to translation keys */
const CATEGORY_NAME_TO_KEY: Record<string, string> = {
  'love and relationships': 'categories.loveAndRelationships',
  funny: 'categories.funny',
  chaos: 'categories.chaos',
};

export function translateCategoryName(
  name: string,
  translate: (key: string) => string,
): string {
  const normalized = name.toLowerCase().trim();
  const key = CATEGORY_NAME_TO_KEY[normalized];
  return key ? translate(key) : name;
}
