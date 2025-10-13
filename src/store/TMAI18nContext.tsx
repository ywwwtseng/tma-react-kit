import {
  useCallback,
  useMemo,
  createContext,
  use,
  type PropsWithChildren,
} from 'react';
import { get, getLocale, translate } from '@ywwwtseng/ywjs';
import { useStoreState } from '../hooks/useStoreState';

export interface TMAI18nContextState {
  t: (key: string, params?: Record<string, string | number>) => string;
  language_code: string;
}

export const TMAI18nContext = createContext<TMAI18nContextState | undefined>(
  undefined
);

export type Locale = Record<string, Record<string, string>>;

export type Locales = Record<string, Locale>;

export interface TMAI18nProviderProps extends PropsWithChildren {
  locales?: Locales;
  callback?: string;
}

export function TMAI18nProvider({
  locales,
  callback = 'en',
  children,
}: TMAI18nProviderProps) {
  const me = useStoreState<{ language_code: string }>('me');
  const language_code = useMemo(() => {
    return (
      me?.language_code || localStorage.getItem('language_code') || callback
    );
  }, [me, callback]);

  const locale = useMemo(() => {
    return getLocale(locales, language_code, locales[callback]);
  }, [language_code, callback]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      if (!locales) return key;

      return translate(locale, key, params);
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      language_code,
      t,
    }),
    [locale, t]
  );

  return (
    <TMAI18nContext.Provider value={value}>{children}</TMAI18nContext.Provider>
  );
}

export function useTMAI18n(): TMAI18nContextState {
  const context = use(TMAI18nContext);

  if (!context) {
    throw new Error('useTMAI18n must be used within a TMAI18nProvider');
  }

  return context;
}
