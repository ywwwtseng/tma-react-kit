import React from 'react';
import { Request } from 'request';
import { useTMASDK } from './TMASDKContext';

export interface TMAClientContextState {
  request: Request;
}

export const TMAClientContext = React.createContext<TMAClientContextState | undefined>(undefined);

export interface TMAClientProviderProps extends React.PropsWithChildren {
  url: string;
}

export function TMAClientProvider({ url, children }: TMAClientProviderProps) {
  const { initDataRaw } = useTMASDK();

  const request = React.useMemo(() => new Request({
    baseUrl: url,
    transformRequest(headers) {
      headers.set('Authorization', `tma ${initDataRaw}`);
      return headers;
    },
  }), [url, initDataRaw]);

  const value = React.useMemo(() => ({
    request,
  }), [request]);

  return (
    <TMAClientContext.Provider value={value}>
      {children}
    </TMAClientContext.Provider>
  );
}

export function useTMAClient(): TMAClientContextState {
  const context = React.use(TMAClientContext);

  if (!context) {
    throw new Error('useTMA must be used within a TMAClientProvider');
  }

  return context;
}
