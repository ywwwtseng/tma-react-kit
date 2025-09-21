import {
  useCallback,
  useMemo,
  createContext,
  use,
  type PropsWithChildren,
} from 'react';
import { get } from '@ywwwtseng/ywjs';
import { useStore } from '../hooks/useStore';

export interface TMAI18nContextState {
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const TMAI18nContext = createContext<TMAI18nContextState | undefined>(
  undefined
);

export type Locale = Record<string, Record<string, string>>;

export type Locales = Record<string, Locale>;

export interface TMAI18nProviderProps extends PropsWithChildren {
  locales?: Locales;
}

export function TMAI18nProvider({ locales, children }: TMAI18nProviderProps) {
  const me = useStore<{ language_code: string }>('me');

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      if (!locales) return key;
      const locale =
        locales?.[me?.language_code?.toLowerCase()?.slice(0, 2)] ||
        locales[localStorage.getItem('language_code') || 'en'];
      if (!locale || typeof key !== 'string') return key;
      const template = get(locale, key, key);
      if (!params) return template;
      return template.replace(
        /\{(\w+)\}/g,
        (_: string, key: string) => String(params[key]) || ''
      );
    },
    [me]
  );

  const value = useMemo(
    () => ({
      t,
    }),
    [t]
  );

  return (
    <TMAI18nContext.Provider value={value}>{children}</TMAI18nContext.Provider>
  );
}

export function useTMAI18n(): TMAI18nContextState {
  const context = use(TMAI18nContext);

  if (!context) {
    throw new Error('useTMA must be used within a TMAI18nProvider');
  }

  return context;
}
