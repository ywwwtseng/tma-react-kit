import React from 'react';
import { useTMAStore } from './TMAStateContext';
import { get } from '../utils';

export interface TMAI18nContextState {
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const TMAI18nContext = React.createContext<TMAI18nContextState | undefined>(undefined);

export type Locale = Record<string, Record<string, string>>;

export type Locales = Record<string, Locale>;

export interface TMAI18nProviderProps extends React.PropsWithChildren {
  locales?: Locales;
}

export function TMAI18nProvider({ locales, children }: TMAI18nProviderProps) {
  const me = useTMAStore((store) => store.state.me) as { language_code: string };

  const t = React.useCallback((key: string, params?: Record<string, string | number>) => {
    if (!locales) return key;
    const locale = locales?.[me?.language_code?.toLowerCase()?.slice(0, 2)] || locales?.['en'];
    if (!locale || typeof key !== 'string') return key;
    const template = get(locale, key, key);
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_: string, key: string) => String(params[key]) || '');
  }, [me]);

  const value = React.useMemo(() => ({
    t,
  }), [t]);

  return (
    <TMAI18nContext.Provider value={value}>
      {children}
    </TMAI18nContext.Provider>
  );
}

export function useTMAI18n(): TMAI18nContextState {
  const context = React.use(TMAI18nContext);

  if (!context) {
    throw new Error('useTMA must be used within a TMAI18nProvider');
  }

  return context;
}
