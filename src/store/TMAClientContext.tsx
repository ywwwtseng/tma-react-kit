import { useMemo, useCallback, createContext, use, type PropsWithChildren } from 'react';
import { Request } from '@ywwwtseng/request';
import { useTMASDK } from './TMASDKContext';

export interface TMAClientContextState {
  query: (path: string | string[]) => Promise<unknown>;
  mutate: <TPayload,>(action: string, payload: TPayload) => Promise<unknown>;
}

export const TMAClientContext = createContext<TMAClientContextState | undefined>(undefined);

export interface TMAClientProviderProps extends PropsWithChildren {
  url: string;
}

export function TMAClientProvider({ url, children }: TMAClientProviderProps) {
  const { initDataRaw } = useTMASDK();

  const request = useMemo(() => new Request({
    transformRequest(headers) {
      headers.set('Authorization', `tma ${initDataRaw}`);
      return headers;
    },
  }), [url, initDataRaw]);

  const query = useCallback((path: string | string[]) => {
    path = Array.isArray(path) ? path : [path];
    return request.post(url, { type: 'query', path });
  }, [request]);

  const mutate = useCallback((action: string, payload: unknown) => {
    return request.post(url, { type: 'mutate', action, payload });
  }, [request]);

  const value = useMemo(() => ({
    query,
    mutate,
  }), [query, mutate]);

  return (
    <TMAClientContext.Provider value={value}>
      {children}
    </TMAClientContext.Provider>
  );
}

export function useTMAClient(): TMAClientContextState {
  const context = use(TMAClientContext);

  if (!context) {
    throw new Error('useTMA must be used within a TMAClientProvider');
  }

  return context;
}
