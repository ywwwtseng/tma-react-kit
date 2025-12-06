import {
  useMemo,
  useCallback,
  createContext,
  use,
  type PropsWithChildren,
} from 'react';
import { Request } from '@ywwwtseng/request';
import { useTMASDK } from './TMASDKContext';

export interface TMAClientContextState {
  query: (
    path: string,
    params?: Record<string, string | number | boolean>
  ) => Promise<unknown>;
  mutate: <TPayload>(action: string, payload: TPayload) => Promise<unknown>;
}

export const TMAClientContext = createContext<
  TMAClientContextState | undefined
>(undefined);

export function TMAClientProvider({ children }: PropsWithChildren) {
  const url = `${location.origin}/api`;
  const { initDataRaw } = useTMASDK();

  const request = useMemo(
    () =>
      new Request({
        transformRequest(headers) {
          headers.set('Authorization', `tma ${initDataRaw}`);
          return headers;
        },
      }),
    [initDataRaw]
  );

  const query = useCallback(
    (path: string, params?: Record<string, string | number | boolean>) => {
      return request.post(url, { type: 'query', path, params: params ?? {} });
    },
    [request]
  );

  const mutate = useCallback(
    (action: string, payload: unknown) => {
      if (payload instanceof FormData) {
        payload.append('mutation:type', 'mutate');
        payload.append('mutation:action', action);
        return request.post(url, payload);
      }

      return request.post(url, { type: 'mutate', action, payload });
    },
    [request]
  );

  const value = useMemo(
    () => ({
      query,
      mutate,
    }),
    [query, mutate]
  );

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
