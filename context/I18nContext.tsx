/**
 * I18n context for accessing translations and locale in React components.
 * Locale is persisted in AsyncStorage (default: English).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { i18n, setLocale as setI18nLocale } from '@/i18n';
import type { Locale } from '@/i18n';

const LOCALE_STORAGE_KEY = '@truthordare/locale';

type I18nContextValue = {
  t: (key: string, options?: Record<string, string | number>) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    AsyncStorage.getItem(LOCALE_STORAGE_KEY).then((saved) => {
      if (saved === 'en' || saved === 'sv') {
        setI18nLocale(saved);
        setLocaleState(saved);
      }
    });
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setI18nLocale(newLocale);
    setLocaleState(newLocale);
    AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback(
    (key: string, options?: Record<string, string | number>) => {
      i18n.locale = locale;
      return i18n.t(key, options);
    },
    [locale],
  );

  const value = useMemo(
    () => ({ t, locale, setLocale }),
    [t, locale, setLocale],
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
